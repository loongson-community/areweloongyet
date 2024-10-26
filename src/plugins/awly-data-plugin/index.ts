import { opendir, readFile } from 'fs/promises'
import path from 'path'

import { glob } from 'glob'
import yaml from 'yaml'
import type { LoadContext, Plugin } from '@docusaurus/types'

import {
  CodeQuality,
  EntityKind,
  IAuthor,
  IPortingEffort,
  IProject,
  IProjectCategory,
  LoadedContent,
  SupportStatus,
} from '../../types'

export type PluginOptions = {
  sourcePath: string
}

type CategoryMetadata = {
  name: string
}

type InputAuthor = {
  name: string
  kind: string
  url: string
  githubUsername: string
  giteeUsername: string
}

type InputProject = {
  name: string
  homepageURL: string
  repoURL: string

  portingEfforts: InputPortingEffort[]
}

type InputPortingEffort = {
  authors: string[]

  desc: string
  link: string

  supportStatus: string
  releasedSinceVersion: string
  goodSinceVersion: string
  quality: string
}

const authorsFilename = 'porters.yml'
const categoryIndexFilename = 'index.yml'

async function readUTF8YAML<T>(path: string): Promise<T> {
  const content = await readFile(path, 'utf-8')
  return yaml.parse(content) as T
}

async function getCategoryMetadata(
  categoryDirPath: string,
): Promise<CategoryMetadata> {
  const indexPath = path.join(categoryDirPath, categoryIndexFilename)
  return readUTF8YAML(indexPath)
}

function parseEntityKind(x: string): EntityKind {
  switch (x) {
    case 'Community':
      return EntityKind.Community
    case 'Corporate':
      return EntityKind.Corporate
    case 'Loongson':
      return EntityKind.Loongson
    default:
      return EntityKind.Community
  }
}

function parseSupportStatus(x: string): SupportStatus {
  switch (x) {
    case 'Unknown':
      return SupportStatus.Unknown
    case 'Rejected':
      return SupportStatus.Rejected
    case 'CommercialOnly':
      return SupportStatus.CommercialOnly
    case 'Stalled':
      return SupportStatus.Stalled
    case 'UpForGrabs':
      return SupportStatus.UpForGrabs
    case 'WIP':
      return SupportStatus.WIP
    case 'UnderReview':
      return SupportStatus.UnderReview
    case 'WaitingRelease':
      return SupportStatus.WaitingRelease
    case 'Released':
      return SupportStatus.Released
    default:
      return SupportStatus.Unknown
  }
}

function parseCodeQuality(x: string): CodeQuality {
  switch (x) {
    case 'NoCode':
      return CodeQuality.NoCode
    case 'OnPar':
      return CodeQuality.OnPar
    case 'NeedsCleanup':
      return CodeQuality.NeedsCleanup
    case 'NeedsRework':
      return CodeQuality.NeedsRework
    default:
      return CodeQuality.NoCode
  }
}

function parsePortingEffort(x: InputPortingEffort): IPortingEffort {
  return {
    authors: x.authors,
    desc: x.desc,
    link: x.link,
    supportStatus: parseSupportStatus(x.supportStatus),
    releasedSinceVersion: x.releasedSinceVersion,
    goodSinceVersion: x.goodSinceVersion,
    quality: parseCodeQuality(x.quality),
  }
}

async function readAuthors(path: string): Promise<Map<string, IAuthor>> {
  const content: any = await readUTF8YAML(path)

  const result = new Map<string, IAuthor>()
  for (const [k, vv] of Object.entries(content)) {
    const v = vv as InputAuthor
    result.set(k, {
      name: v.name,
      kind: parseEntityKind(v.kind),
      url: v.url,
      githubUsername: v.githubUsername,
      giteeUsername: v.giteeUsername,
    })
  }

  return result
}

async function readProjectDef(p: string): Promise<IProject> {
  const x: InputProject = await readUTF8YAML(p)
  return {
    code: path.basename(p, '.yml'),
    name: x.name,
    homepageURL: x.homepageURL,
    repoURL: x.repoURL,
    portingEfforts: x.portingEfforts.map(parsePortingEffort),
  }
}

async function readCategories(sourcePath: string): Promise<IProjectCategory[]> {
  const categories: { code: string; name: string; projects: IProject[] }[] = []
  const srcDir = await opendir(sourcePath)
  for await (const dirent of srcDir) {
    if (!dirent.isDirectory()) continue

    const categoryDirPath = path.join(srcDir.path, dirent.name)

    // parse category metadata
    const categoryMetadata = await getCategoryMetadata(categoryDirPath)

    // parse projects in categories
    const projectDefFilenames = await glob('*.yml', {
      cwd: categoryDirPath,
      ignore: [categoryIndexFilename],
    })
    const projectDefPaths = projectDefFilenames.map((x) =>
      path.join(categoryDirPath, x),
    )
    const projectDefs = await Promise.all(projectDefPaths.map(readProjectDef))
    categories.push({
      code: dirent.name,
      name: categoryMetadata.name,
      projects: projectDefs,
    })
  }

  // sort the categories lexicographically according to code (directory name)
  return categories
    .sort((a, b) => (a.code < b.code ? -1 : 0))
    .map((x) => {
      return { name: x.name, projects: x.projects }
    })
}

export default async function awlyDataPlugin(
  ctx: LoadContext,
  options: PluginOptions,
): Promise<Plugin<LoadedContent>> {
  return {
    name: 'awly-data-plugin',
    async loadContent() {
      const [authors, categories] = await Promise.all([
        readAuthors(path.join(options.sourcePath, authorsFilename)),
        readCategories(options.sourcePath),
      ])

      return {
        authors: authors,
        categories: categories,
      }
    },
    async contentLoaded({ content, actions }) {
      const { addRoute, createData, setGlobalData } = actions

      // for homepage
      setGlobalData(content.categories)

      // generate pages for authors
      for (const [code, a] of content.authors.entries()) {
        const dataPath = await createData(
          `porter.${code}.json`,
          JSON.stringify(a),
        )
        addRoute({
          path: `/porter/${code}`,
          component: '@site/src/components/AuthorPage',
          modules: {
            data: dataPath,
          },
          exact: true,
        })
      }

      // generate pages for individual projects
      for (const cat of content.categories) {
        for (const proj of cat.projects) {
          const dataPath = await createData(
            `project.${proj.code}.json`,
            JSON.stringify(proj),
          )
          addRoute({
            path: `/project/${proj.code}`,
            component: '@site/src/components/ProjectPage',
            modules: {
              data: dataPath,
            },
            exact: true,
          })
        }
      }
    },
    getPathsToWatch() {
      return [path.join(options.sourcePath, '**/*.yml')]
    },
  }
}
