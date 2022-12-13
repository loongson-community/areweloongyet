"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const glob_promise_1 = __importDefault(require("glob-promise"));
const yaml_1 = __importDefault(require("yaml"));
const types_1 = require("../../types");
const authorsFilename = 'porters.yml';
const categoryIndexFilename = 'index.yml';
async function readUTF8YAML(path) {
    const content = await (0, promises_1.readFile)(path, 'utf-8');
    return yaml_1.default.parse(content);
}
async function getCategoryMetadata(categoryDirPath) {
    const indexPath = path_1.default.join(categoryDirPath, categoryIndexFilename);
    return readUTF8YAML(indexPath);
}
function parseEntityKind(x) {
    switch (x) {
        case 'Community': return types_1.EntityKind.Community;
        case 'Corporate': return types_1.EntityKind.Corporate;
        case 'Loongson': return types_1.EntityKind.Loongson;
        default: return types_1.EntityKind.Community;
    }
}
function parseSupportStatus(x) {
    switch (x) {
        case 'Unknown': return types_1.SupportStatus.Unknown;
        case 'Rejected': return types_1.SupportStatus.Rejected;
        case 'CommercialOnly': return types_1.SupportStatus.CommercialOnly;
        case 'Stalled': return types_1.SupportStatus.Stalled;
        case 'UpForGrabs': return types_1.SupportStatus.UpForGrabs;
        case 'WIP': return types_1.SupportStatus.WIP;
        case 'UnderReview': return types_1.SupportStatus.UnderReview;
        case 'WaitingRelease': return types_1.SupportStatus.WaitingRelease;
        case 'Released': return types_1.SupportStatus.Released;
        default: return types_1.SupportStatus.Unknown;
    }
}
function parseCodeQuality(x) {
    switch (x) {
        case 'NoCode': return types_1.CodeQuality.NoCode;
        case 'OnPar': return types_1.CodeQuality.OnPar;
        case 'NeedsCleanup': return types_1.CodeQuality.NeedsCleanup;
        case 'NeedsRework': return types_1.CodeQuality.NeedsRework;
        default: return types_1.CodeQuality.NoCode;
    }
}
function parsePortingEffort(x) {
    return {
        authors: x.authors,
        desc: x.desc,
        link: x.link,
        supportStatus: parseSupportStatus(x.supportStatus),
        releasedSinceVersion: x.releasedSinceVersion,
        goodSinceVersion: x.goodSinceVersion,
        quality: parseCodeQuality(x.quality),
    };
}
async function readAuthors(path) {
    const content = await readUTF8YAML(path);
    const result = new Map();
    for (const [k, vv] of Object.entries(content)) {
        const v = vv;
        result.set(k, {
            name: v.name,
            kind: parseEntityKind(v.kind),
            url: v.url,
            githubUsername: v.githubUsername,
            giteeUsername: v.giteeUsername,
        });
    }
    return result;
}
async function readProjectDef(p) {
    const x = await readUTF8YAML(p);
    return {
        code: path_1.default.basename(p, '.yml'),
        name: x.name,
        homepageURL: x.homepageURL,
        repoURL: x.repoURL,
        portingEfforts: x.portingEfforts.map(parsePortingEffort),
    };
}
async function readCategories(sourcePath) {
    const categories = [];
    const srcDir = await (0, promises_1.opendir)(sourcePath);
    for await (const dirent of srcDir) {
        if (!dirent.isDirectory())
            continue;
        const categoryDirPath = path_1.default.join(srcDir.path, dirent.name);
        // parse category metadata
        const categoryMetadata = await getCategoryMetadata(categoryDirPath);
        // parse projects in categories
        const projectDefFilenames = await glob_promise_1.default.promise('*.yml', {
            cwd: categoryDirPath,
            ignore: [categoryIndexFilename],
        });
        const projectDefPaths = projectDefFilenames.map((x) => path_1.default.join(categoryDirPath, x));
        const projectDefs = await Promise.all(projectDefPaths.map(readProjectDef));
        categories.push({
            code: dirent.name,
            name: categoryMetadata.name,
            projects: projectDefs,
        });
    }
    // sort the categories lexicographically according to code (directory name)
    return categories
        .sort((a, b) => a.code < b.code ? -1 : 0)
        .map((x) => { return { name: x.name, projects: x.projects }; });
}
async function awlyDataPlugin(ctx, options) {
    return {
        name: 'awly-data-plugin',
        async loadContent() {
            const [authors, categories] = await Promise.all([
                readAuthors(path_1.default.join(options.sourcePath, authorsFilename)),
                readCategories(options.sourcePath),
            ]);
            return {
                authors: authors,
                categories: categories,
            };
        },
        async contentLoaded({ content, actions }) {
            const { addRoute, createData, setGlobalData } = actions;
            // for homepage
            setGlobalData(content.categories);
            // generate pages for authors
            for (const [code, a] of content.authors.entries()) {
                const dataPath = await createData(`porter.${code}.json`, JSON.stringify(a));
                addRoute({
                    path: `/porter/${code}`,
                    component: '@site/src/components/AuthorPage',
                    modules: {
                        data: dataPath,
                    },
                    exact: true,
                });
            }
            // generate pages for individual projects
            for (const cat of content.categories) {
                for (const proj of cat.projects) {
                    const dataPath = await createData(`project.${proj.code}.json`, JSON.stringify(proj));
                    addRoute({
                        path: `/project/${proj.code}`,
                        component: '@site/src/components/ProjectPage',
                        modules: {
                            data: dataPath,
                        },
                        exact: true,
                    });
                }
            }
        },
        getPathsToWatch() {
            return [
                path_1.default.join(options.sourcePath, '**/*.yml'),
            ];
        },
    };
}
exports.default = awlyDataPlugin;
