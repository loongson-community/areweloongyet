import { spawn } from 'child_process'
import path from 'path'

import { glob } from 'glob'

import type { LoadContext, Plugin } from '@docusaurus/types'

export type PluginOptions = {
  genAsmdbDataPath: string
  loongarchOpcodesPath: string
}

type LoadedContent = string

function runGenerationScript(asmdbHelperPath: string, inputPaths: string[]): Promise<LoadedContent> {
  return new Promise((resolve, reject) => {
    const subp = spawn(asmdbHelperPath, inputPaths)
    let stdout = ''
    let stderr = ''
    subp.stdout.on('data', (data) => stdout += data)
    subp.stderr.on('data', (data) => stderr += data)
    subp.on('close', (code) => {
      if (code == 0) {
        resolve(stdout)
        return
      }

      console.error('gen-asmdb-data failed with', code)
      console.error('stderr:', stderr)
      reject('gen-asmdb-data failed')
    })
    subp.on('error', (err) => {
      console.error('failed to spawn gen-asmdb-data:', err)
      reject('failed to spawn gen-asmdb-data')
    })
  })
}

export default async function awlyAsmdbPlugin(
  ctx: LoadContext,
  options: PluginOptions,
): Promise<Plugin<LoadedContent>> {
  return {
    name: 'awly-asmdb-plugin',
    async loadContent() {
      const opcodeFiles = await glob('*.txt', { cwd: options.loongarchOpcodesPath })
      const inputPaths = opcodeFiles.map((x) => path.join(options.loongarchOpcodesPath, x))
      return await runGenerationScript(options.genAsmdbDataPath, inputPaths)
    },
    async contentLoaded({ content, actions }) {
      const dataPath = await actions.createData('asmdb.json', content)
      actions.addRoute({
        path: `/asmdb`,
        component: '@site/src/components/AsmDB',
        modules: {
          data: dataPath,
        },
        routes: [
          {
            path: '/asmdb',
            component: '@site/src/components/AsmDB',
            exact: true,
          },
          {
            path: '/asmdb/encodingSpaceOverview',
            component: '@site/src/components/AsmDB',
            exact: true,
          },
          {
            path: '/asmdb/insnExplainer',
            component: '@site/src/components/AsmDB',
            exact: true,
          },
          {
            path: '/asmdb/insnList',
            component: '@site/src/components/AsmDB',
            exact: true,
          },
          {
            path: '/asmdb/vldiHelper',
            component: '@site/src/components/AsmDB',
            exact: true,
          },
        ],
      })
    },
    getPathsToWatch() {
      return [
        options.genAsmdbDataPath,
        path.join(options.loongarchOpcodesPath, '*.txt'),
      ]
    },
  }
}
