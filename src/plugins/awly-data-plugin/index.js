"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("fs/promises");
var path_1 = __importDefault(require("path"));
var glob_promise_1 = __importDefault(require("glob-promise"));
var yaml_1 = __importDefault(require("yaml"));
var types_1 = require("../../types");
var authorsFilename = 'porters.yml';
var categoryIndexFilename = 'index.yml';
function readUTF8YAML(path) {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readFile)(path, 'utf-8')];
                case 1:
                    content = _a.sent();
                    return [2 /*return*/, yaml_1.default.parse(content)];
            }
        });
    });
}
function getCategoryMetadata(categoryDirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var indexPath;
        return __generator(this, function (_a) {
            indexPath = path_1.default.join(categoryDirPath, categoryIndexFilename);
            return [2 /*return*/, readUTF8YAML(indexPath)];
        });
    });
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
function readAuthors(path) {
    return __awaiter(this, void 0, void 0, function () {
        var content, result, _i, _a, _b, k, vv, v;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, readUTF8YAML(path)];
                case 1:
                    content = _c.sent();
                    result = new Map();
                    for (_i = 0, _a = Object.entries(content); _i < _a.length; _i++) {
                        _b = _a[_i], k = _b[0], vv = _b[1];
                        v = vv;
                        result.set(k, {
                            name: v.name,
                            kind: parseEntityKind(v.kind),
                            url: v.url,
                            githubUsername: v.githubUsername,
                            giteeUsername: v.giteeUsername,
                        });
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function readProjectDef(path) {
    return __awaiter(this, void 0, void 0, function () {
        var x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readUTF8YAML(path)];
                case 1:
                    x = _a.sent();
                    return [2 /*return*/, {
                            name: x.name,
                            homepageURL: x.homepageURL,
                            repoURL: x.repoURL,
                            portingEfforts: x.portingEfforts.map(parsePortingEffort),
                        }];
            }
        });
    });
}
function readCategories(sourcePath) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var categories, srcDir, _loop_1, _d, srcDir_1, srcDir_1_1, e_1_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    categories = [];
                    return [4 /*yield*/, (0, promises_1.opendir)(sourcePath)];
                case 1:
                    srcDir = _e.sent();
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 8, 9, 14]);
                    _loop_1 = function () {
                        var dirent, categoryDirPath, categoryMetadata, projectDefFilenames, projectDefPaths, projectDefs;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    _c = srcDir_1_1.value;
                                    _d = false;
                                    _f.label = 1;
                                case 1:
                                    _f.trys.push([1, , 5, 6]);
                                    dirent = _c;
                                    if (!dirent.isDirectory())
                                        return [2 /*return*/, "continue"];
                                    categoryDirPath = path_1.default.join(srcDir.path, dirent.name);
                                    return [4 /*yield*/, getCategoryMetadata(categoryDirPath)
                                        // parse projects in categories
                                    ];
                                case 2:
                                    categoryMetadata = _f.sent();
                                    return [4 /*yield*/, glob_promise_1.default.promise('*.yml', {
                                            cwd: categoryDirPath,
                                            ignore: [categoryIndexFilename],
                                        })];
                                case 3:
                                    projectDefFilenames = _f.sent();
                                    projectDefPaths = projectDefFilenames.map(function (x) { return path_1.default.join(categoryDirPath, x); });
                                    return [4 /*yield*/, Promise.all(projectDefPaths.map(readProjectDef))];
                                case 4:
                                    projectDefs = _f.sent();
                                    categories.push({
                                        code: dirent.name,
                                        name: categoryMetadata.name,
                                        projects: projectDefs,
                                    });
                                    return [3 /*break*/, 6];
                                case 5:
                                    _d = true;
                                    return [7 /*endfinally*/];
                                case 6: return [2 /*return*/];
                            }
                        });
                    };
                    _d = true, srcDir_1 = __asyncValues(srcDir);
                    _e.label = 3;
                case 3: return [4 /*yield*/, srcDir_1.next()];
                case 4:
                    if (!(srcDir_1_1 = _e.sent(), _a = srcDir_1_1.done, !_a)) return [3 /*break*/, 7];
                    return [5 /*yield**/, _loop_1()];
                case 5:
                    _e.sent();
                    _e.label = 6;
                case 6: return [3 /*break*/, 3];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _e.trys.push([9, , 12, 13]);
                    if (!(!_d && !_a && (_b = srcDir_1.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _b.call(srcDir_1)];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: 
                // sort the categories lexicographically according to code (directory name)
                return [2 /*return*/, categories
                        .sort(function (a, b) { return a.code < b.code ? -1 : 0; })
                        .map(function (x) { return { name: x.name, projects: x.projects }; })];
            }
        });
    });
}
function awlyDataPlugin(ctx, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, {
                    name: 'awly-data-plugin',
                    loadContent: function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, authors, categories;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, Promise.all([
                                            readAuthors(path_1.default.join(options.sourcePath, authorsFilename)),
                                            readCategories(options.sourcePath),
                                        ])];
                                    case 1:
                                        _a = _b.sent(), authors = _a[0], categories = _a[1];
                                        return [2 /*return*/, {
                                                authors: authors,
                                                categories: categories,
                                            }];
                                }
                            });
                        });
                    },
                    contentLoaded: function (_a) {
                        var content = _a.content, actions = _a.actions;
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_b) {
                                // for homepage
                                actions.setGlobalData(content);
                                return [2 /*return*/];
                            });
                        });
                    },
                    getPathsToWatch: function () {
                        return [
                            path_1.default.join(options.sourcePath, '**/*.yml'),
                        ];
                    },
                }];
        });
    });
}
exports.default = awlyDataPlugin;
