"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var child_process_1 = require("child_process");
var js_yaml_1 = __importDefault(require("js-yaml"));
var fs_1 = __importDefault(require("fs"));
var lodash_1 = __importDefault(require("lodash"));
var hasha_1 = __importDefault(require("hasha"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var base_1 = __importDefault(require("./common/base"));
var logger_1 = __importDefault(require("./common/logger"));
var jwt_token_1 = require("./common/jwt-token");
var request_1 = require("./common/request");
// import i18n from './common/i18n';
var Host = 's.devsapp.cn';
var CONTENT_TYPE_MAP = {
    html: 'text/html; charset=UTF-8',
    htm: 'text/html; charset=UTF-8',
    text: 'text/plain; charset=UTF-8',
    txt: 'text/plain; charset=UTF-8',
    xml: 'text/xml; charset=UTF-8',
    rss: 'application/rss+xml; charset=UTF-8',
    atom: 'application/atom+xml; charset=UTF-8',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    ico: 'image/x-icon',
    png: 'image/png',
    svg: 'image/svg+xml; charset=UTF-8',
    xhtml: 'application/xhtml+xml; charset=UTF-8',
    json: 'application/json; charset=UTF-8',
    yaml: 'application/x-yaml; charset=UTF-8',
    map: 'application/json; charset=UTF-8',
    pdf: 'application/pdf; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css; charset=UTF-8',
    md: 'text/markdown; charset=UTF-8',
    wasm: 'application/wasm',
    zip: 'application/x-zip',
    mp3: 'audio/mpeg',
    ogg: 'video/ogg',
    mp4: 'video/mp4',
};
var MAX_FILE_SIZE = 10485760;
var CACHE_RULE_REGEXP = new RegExp('[\\-._a-f\\d][a-f\\d]{8}.(js|css|woff|woff2|jpg|jpeg|png|svg)$');
var CACHED_PATHS = ['/_nuxt/', '/_snowpack/', '/51cache/'];
var CACHED_FILE_NAME_MIN_LEN = 19;
/**
 * 验证文件是否能被浏览器端缓存
 * @param absoluteFilePath 文件的绝对路径，需要以'/'开头，路径中包含文件名
 * @return  可以被缓存标识
 */
function isLegalCacheFile(absoluteFilePath) {
    var fileName = path_1.default.posix.basename(absoluteFilePath);
    if (CACHED_PATHS.find(function (whitePath) { return absoluteFilePath.indexOf(whitePath) >= 0; })) {
        return true;
    }
    if (fileName.length >= CACHED_FILE_NAME_MIN_LEN) {
        return CACHE_RULE_REGEXP.test(fileName);
    }
    return false;
}
function getFileObjectKey(filePath, sourceFolder) {
    var fileObjectKey;
    if (process.platform === 'win32') {
        var tmpFilePath = filePath.replace(/\\/g, '/');
        fileObjectKey = tmpFilePath.replace(sourceFolder + '/', '');
    }
    else {
        fileObjectKey = filePath.replace(sourceFolder + '/', '');
    }
    return fileObjectKey;
}
function formatBytes(bytes, decimals) {
    if (decimals === void 0) { decimals = 2; }
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var dm = decimals < 0 ? 0 : decimals;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
var ComponentDemo = /** @class */ (function (_super) {
    __extends(ComponentDemo, _super);
    function ComponentDemo(props) {
        var _this = _super.call(this, props) || this;
        _this.ignoreFiles = [];
        var signorePath = path_1.default.join(process.cwd(), '.signore');
        if (fs_1.default.existsSync(signorePath)) {
            var signoreContent = fs_1.default.readFileSync(signorePath, 'utf-8');
            _this.ignoreFiles = signoreContent.split('\n');
        }
        return _this;
    }
    ComponentDemo.prototype.setEnv = function (credentials) {
        process.env.accessKey = credentials.AccessKeyID;
        process.env.accessSecret = credentials.AccessKeySecret;
    };
    // private trim(str) {
    //   return str.replace(/(^\s*)|(\s*$)/g, "");
    // }
    // private replaceFun(str, obj) {
    //   const reg = /\{\{(.*?)\}\}/g;
    //   let arr = str.match(reg);
    //   if (arr) {
    //     for (let i = 0; i < arr.length; i++) {
    //       let keyContent = arr[i].replace(/{{|}}/g, '');
    //       let realKey = this.trim(keyContent.split('|')[0]);
    //       if (obj[realKey]) {
    //         str = str.replace(arr[i], obj[realKey]);
    //       }
    //     }
    //   }
    //   return str;
    // }
    ComponentDemo.prototype.travel = function (dir, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                fs_1.default.readdir(dir, function (err, files) {
                    if (err) {
                        logger_1.default.error(err);
                    }
                    else {
                        files.forEach(function (file) {
                            var pathname = path_1.default.join(dir, file);
                            fs_1.default.stat(pathname, function (err, stats) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!err) return [3 /*break*/, 1];
                                            logger_1.default.error(err);
                                            return [3 /*break*/, 5];
                                        case 1:
                                            if (!stats.isDirectory()) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.travel(pathname, callback)];
                                        case 2:
                                            _a.sent();
                                            return [3 /*break*/, 5];
                                        case 3: return [4 /*yield*/, callback(pathname)];
                                        case 4:
                                            _a.sent();
                                            _a.label = 5;
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); });
                        });
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ComponentDemo.prototype.travelAsync = function (dir, filesArr) {
        var _this = this;
        if (filesArr === void 0) { filesArr = []; }
        var folders = fs_1.default.readdirSync(dir);
        folders.forEach(function (file) {
            if (!_this.ignoreFiles.includes(file)) {
                var pathname = path_1.default.join(dir, file);
                if (fs_1.default.statSync(pathname).isDirectory()) {
                    return _this.travelAsync(pathname, filesArr);
                }
                else {
                    filesArr.push(pathname);
                }
            }
        });
        return filesArr;
    };
    ComponentDemo.prototype.uploadFile = function (filePath, payload, sourceFolder) {
        return __awaiter(this, void 0, void 0, function () {
            var _shortName, contentType, uploadUrl, fileState, uploadSkip, remoteEtag, localEtag, headers, cachedFile, hint, res, stream, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _shortName = payload.fileName;
                        if (!payload.fileName) {
                            _shortName = getFileObjectKey(filePath, sourceFolder);
                            payload.fileName = _shortName;
                        }
                        // ignore the hidden file that start with '.'
                        if (path_1.default.posix.basename(filePath).startsWith('.')) {
                            logger_1.default.fatal(_shortName.padEnd(71) + " Ignored");
                            return [2 /*return*/];
                        }
                        contentType = CONTENT_TYPE_MAP[path_1.default.extname(filePath).substr(1)] || 'text/plain; charset=UTF-8';
                        uploadUrl = jwt_token_1.getUploadUrl(payload);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 14]);
                        fileState = fs_1.default.statSync(filePath);
                        if (fileState.size == 0) {
                            // empty file
                            logger_1.default.fatal(_shortName.padEnd(60) + " " + formatBytes(fileState.size).padStart(10) + " Skipped   Empty file");
                            return [2 /*return*/];
                        }
                        if (!(fileState.size <= MAX_FILE_SIZE)) return [3 /*break*/, 11];
                        uploadSkip = false;
                        if (!!(process.env.forceUpload === 'true')) return [3 /*break*/, 5];
                        if (!(payload.remoteFiles && payload.remoteFiles[_shortName])) return [3 /*break*/, 5];
                        remoteEtag = payload.remoteFiles[_shortName];
                        localEtag = void 0;
                        if (!(payload.uploadFiles && payload.uploadFiles[_shortName])) return [3 /*break*/, 2];
                        localEtag = payload.uploadFiles[_shortName].etag;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, hasha_1.default.fromFile(filePath, { algorithm: 'md5' })];
                    case 3:
                        localEtag = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (localEtag && remoteEtag === localEtag.toUpperCase()) {
                            uploadSkip = true;
                        }
                        _a.label = 5;
                    case 5:
                        if (!!uploadSkip) return [3 /*break*/, 9];
                        headers = {
                            Host: Host,
                            'Content-Type': contentType,
                            Authorization: "bear " + jwt_token_1.getJwtoken(payload),
                        };
                        cachedFile = isLegalCacheFile('/' + payload.fileName);
                        if (cachedFile) {
                            headers['Cache-Control'] = 'public, max-age=31536000';
                        }
                        hint = cachedFile ? 'Cached ' : '';
                        if (fileState.size >= 2097152) {
                            // file size more than 2 MB
                            hint = hint + 'Optimize file size';
                        }
                        res = void 0;
                        if (!(process.env.dryRun === 'true')) return [3 /*break*/, 6];
                        res = { status: 200 };
                        return [3 /*break*/, 8];
                    case 6:
                        stream = fs_1.default.createReadStream(filePath);
                        return [4 /*yield*/, node_fetch_1.default(uploadUrl, {
                                method: 'POST',
                                body: stream,
                                timeout: 25000,
                                headers: headers,
                            })];
                    case 7:
                        res = _a.sent();
                        _a.label = 8;
                    case 8:
                        if (res.status === 200) {
                            console.log(_shortName.padEnd(60) + " " + formatBytes(fileState.size).padStart(10) + " Succeeded " + hint);
                        }
                        else {
                            // 文件上传失败
                            logger_1.default.fatal(_shortName.padEnd(60) + " " + formatBytes(fileState.size).padStart(10) + " Failed");
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        // 文件没有任何修改
                        console.log(_shortName.padEnd(60) + " " + formatBytes(fileState.size).padStart(10) + " Skipped   No local change");
                        _a.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        // 文件大于10M
                        logger_1.default.fatal(_shortName.padEnd(60) + " " + formatBytes(fileState.size).padStart(10) + " Failed    Over 10M ");
                        _a.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        e_1 = _a.sent();
                        // 文件上传过程的任何错误
                        logger_1.default.fatal(_shortName.padEnd(71) + " Failed    " + e_1.message);
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * update project metadata and upload the files
     */
    ComponentDemo.prototype.updateProjectInfo = function (_a) {
        var apps = _a.apps, project = _a.project, domain = _a.domain, favicon = _a.favicon, defaultApp = _a.defaultApp;
        return __awaiter(this, void 0, void 0, function () {
            var copyApps, updatePayload, updateResult;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        copyApps = lodash_1.default.cloneDeepWith(apps);
                        apps.forEach(function (app) {
                            app.sourceCode && delete app.sourceCode;
                            app.releaseCode && delete app.releaseCode;
                        });
                        updatePayload = {
                            domain: domain,
                            project: project,
                            projectInfo: {
                                id: project,
                                domain: domain,
                                favicon: favicon,
                                defaultApp: defaultApp,
                                apps: apps,
                            },
                        };
                        // upload the files first
                        return [4 /*yield*/, this.checkAndUploadFiles({
                                apps: copyApps,
                                domain: domain,
                            })];
                    case 1:
                        // upload the files first
                        _b.sent();
                        if (!(process.env.dryRun === 'true')) return [3 /*break*/, 2];
                        updateResult = { success: true };
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, request_1.updateProject(updatePayload)];
                    case 3:
                        updateResult = _b.sent();
                        _b.label = 4;
                    case 4:
                        if (updateResult.success) {
                            logger_1.default.info("Succeed to update project metadata");
                            //todo delete the stale files
                        }
                        else {
                            logger_1.default.error("Failed to update project metadata");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ComponentDemo.prototype.exeBuildWebStaticCmd = function (_path, appName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (fs_1.default.existsSync(path_1.default.join(_path, 'package.json'))) {
                            var buildCmd = child_process_1.spawn('npm', ['run', 'build'], {
                                shell: true,
                                cwd: _path,
                                stdio: 'inherit',
                            });
                            buildCmd.on('close', function (code) {
                                logger_1.default.success("\u3010" + appName + "\u3011 execute build successfully");
                                resolve({ code: code });
                            });
                        }
                        else {
                            resolve({});
                        }
                    })];
            });
        });
    };
    ComponentDemo.prototype.checkAndUploadFiles = function (_a) {
        var apps = _a.apps, domain = _a.domain;
        return __awaiter(this, void 0, void 0, function () {
            var allAppFunction;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        allAppFunction = [];
                        apps.forEach(function (item, i) {
                            var promiseFunction = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var appName_1, sourceCode_1, releaseCode_1, statisFilesName, staicsFilesPath_1, files, promiseArr_1, files, staticsFile, uploadFiles_1, totalFilesSize, remoteObjects, remoteFiles_1, promiseArr_2, e_2;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 12, , 13]);
                                            appName_1 = item.name;
                                            sourceCode_1 = item.sourceCode;
                                            releaseCode_1 = item.releaseCode;
                                            if (!fs_1.default.existsSync(sourceCode_1)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this.exeBuildWebStaticCmd(sourceCode_1, appName_1)];
                                        case 1:
                                            _a.sent();
                                            statisFilesName = ['build', 'dist', 'release'];
                                            staicsFilesPath_1 = '';
                                            statisFilesName.forEach(function (fileName) {
                                                var staticReleasePath = path_1.default.join(sourceCode_1, fileName);
                                                if (fs_1.default.existsSync(staticReleasePath)) {
                                                    staicsFilesPath_1 = staticReleasePath;
                                                }
                                            });
                                            if (!fs_1.default.existsSync(staicsFilesPath_1)) return [3 /*break*/, 3];
                                            files = this.travelAsync(staicsFilesPath_1);
                                            promiseArr_1 = [];
                                            files.forEach(function (fileName) {
                                                promiseArr_1.push(new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, this.uploadFile(fileName, { domain: domain, appName: appName_1 }, staicsFilesPath_1)];
                                                            case 1:
                                                                _a.sent();
                                                                resolve('');
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }));
                                            });
                                            return [4 /*yield*/, Promise.all(promiseArr_1)];
                                        case 2:
                                            _a.sent();
                                            logger_1.default.info("-----\u3010" + appName_1 + "\u3011 upload completed ----- \n\n");
                                            resolve(i);
                                            _a.label = 3;
                                        case 3: return [3 /*break*/, 11];
                                        case 4:
                                            if (!fs_1.default.existsSync(releaseCode_1)) return [3 /*break*/, 10];
                                            // 如果有直接指定静态文件直接进行上传
                                            logger_1.default.info("Begin to upload the files for app: " + appName_1);
                                            files = this.travelAsync(releaseCode_1);
                                            if (!(files.length <= 10000)) return [3 /*break*/, 8];
                                            staticsFile = path_1.default.normalize(releaseCode_1 + "/_files");
                                            return [4 /*yield*/, Promise.all(files
                                                    .filter(function (filePath) {
                                                    return !path_1.default.posix.basename(filePath).startsWith('.');
                                                })
                                                    .map(function (filePath) {
                                                    var fileState = fs_1.default.statSync(filePath);
                                                    return hasha_1.default.fromFile(filePath, { algorithm: 'md5' }).then(function (fileHash) {
                                                        return [getFileObjectKey(filePath, releaseCode_1), fileHash, fileState.size];
                                                    });
                                                }))];
                                        case 5:
                                            uploadFiles_1 = (_a.sent()).reduce(function (map, arr) {
                                                var fileSize = arr[2];
                                                if (fileSize > 0 && fileSize <= MAX_FILE_SIZE) {
                                                    map[arr[0]] = { etag: arr[1], size: arr[2], key: arr[0] };
                                                }
                                                return map;
                                            }, {});
                                            totalFilesSize = Object.values(uploadFiles_1).reduce(function (total, obj) {
                                                return total + obj.size;
                                            }, 0);
                                            fs_1.default.writeFileSync(staticsFile, JSON.stringify({ domain: domain, app: appName_1, totalFilesSize: totalFilesSize, objectMetadataList: Object.values(uploadFiles_1) }));
                                            if (!files.includes(staticsFile)) {
                                                files.push(staticsFile);
                                            }
                                            return [4 /*yield*/, request_1.listAppFiles(domain, appName_1)];
                                        case 6:
                                            remoteObjects = _a.sent();
                                            remoteFiles_1 = remoteObjects.objectMetadataList.reduce(function (map, obj) {
                                                map[obj.key] = obj.etag;
                                                return map;
                                            }, {});
                                            promiseArr_2 = [];
                                            files.forEach(function (fileName) {
                                                promiseArr_2.push(new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, this.uploadFile(fileName, { domain: domain, appName: appName_1, remoteFiles: remoteFiles_1, uploadFiles: uploadFiles_1 }, releaseCode_1)];
                                                            case 1:
                                                                _a.sent();
                                                                resolve('');
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }));
                                            });
                                            return [4 /*yield*/, Promise.all(promiseArr_2)];
                                        case 7:
                                            _a.sent();
                                            logger_1.default.info("Succeed to upload the files for app: " + appName_1);
                                            return [3 /*break*/, 9];
                                        case 8:
                                            logger_1.default.error("Failed to upload files for " + appName_1 + ": the files number " + files.length + " more than 10000");
                                            _a.label = 9;
                                        case 9:
                                            resolve(i);
                                            return [3 /*break*/, 11];
                                        case 10:
                                            resolve(i);
                                            _a.label = 11;
                                        case 11: return [3 /*break*/, 13];
                                        case 12:
                                            e_2 = _a.sent();
                                            reject(e_2);
                                            return [3 /*break*/, 13];
                                        case 13: return [2 /*return*/];
                                    }
                                });
                            }); });
                            allAppFunction.push(promiseFunction);
                        });
                        return [4 /*yield*/, Promise.all(allAppFunction)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    ComponentDemo.prototype.deploy = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, domain, apps, defaultApp, favicon, credentials, verifyResult, projectInfo, result, project_1, result_domain, successInfo, e_3;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        process.env.dryRun = (inputs.args.indexOf('--dry-run') >= 0).toString();
                        process.env.forceUpload = (inputs.args.indexOf('--force-upload') >= 0).toString();
                        _a = inputs.props, domain = _a.domain, apps = _a.apps, defaultApp = _a.defaultApp, favicon = _a.favicon;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 10, , 11]);
                        credentials = inputs.credentials;
                        this.setEnv(credentials);
                        return [4 /*yield*/, request_1.verifyProject(domain)];
                    case 2:
                        verifyResult = _b.sent();
                        if (!!verifyResult.success) return [3 /*break*/, 3];
                        // domain owned by other developer
                        throw Error(verifyResult.msg);
                    case 3:
                        if (!(verifyResult.data && verifyResult.data.project)) return [3 /*break*/, 5];
                        projectInfo = verifyResult.data.project;
                        return [4 /*yield*/, this.updateProjectInfo({
                                apps: apps,
                                project: projectInfo.id,
                                domain: domain,
                                favicon: favicon,
                                defaultApp: defaultApp,
                            })];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 5: return [4 /*yield*/, request_1.createProject(domain)];
                    case 6:
                        result = _b.sent();
                        if (!result.success) return [3 /*break*/, 8];
                        logger_1.default.info("Succeed to create the project");
                        project_1 = result.data.id;
                        return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.updateProjectInfo({
                                                        apps: apps,
                                                        project: project_1,
                                                        domain: domain,
                                                        favicon: favicon,
                                                        defaultApp: defaultApp,
                                                    })];
                                                case 1:
                                                    _a.sent();
                                                    resolve('');
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, 4000);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 8: throw Error(result.msg);
                    case 9:
                        result_domain = "https://" + domain;
                        successInfo = ["\u90E8\u7F72\u6210\u529F! \u8BBF\u95EE\u57DF\u540D: " + result_domain, '部署信息：', js_yaml_1.default.dump(inputs.props)].join('\n');
                        _super.prototype.__report.call(this, {
                            name: 'domain',
                            content: {
                                domain: result_domain,
                                weight: 3,
                            },
                        });
                        if (process.env.dryRun === 'true') {
                            logger_1.default.fatal('Running on dry run mode, no any change to upload!');
                        }
                        return [2 /*return*/, successInfo];
                    case 10:
                        e_3 = _b.sent();
                        throw new Error(e_3.message);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return ComponentDemo;
}(base_1.default));
exports.default = ComponentDemo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLCtDQUFzQztBQUN0QyxvREFBMkI7QUFDM0IsMENBQW9CO0FBQ3BCLGtEQUF1QjtBQUN2QixnREFBMEI7QUFDMUIsMERBQW1DO0FBQ25DLHVEQUEwQztBQUMxQywyREFBcUM7QUFDckMsZ0RBQThEO0FBRTlELDRDQUE2RjtBQUM3RixvQ0FBb0M7QUFFcEMsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDO0FBQzVCLElBQU0sZ0JBQWdCLEdBQUc7SUFDdkIsSUFBSSxFQUFFLDBCQUEwQjtJQUNoQyxHQUFHLEVBQUUsMEJBQTBCO0lBQy9CLElBQUksRUFBRSwyQkFBMkI7SUFDakMsR0FBRyxFQUFFLDJCQUEyQjtJQUNoQyxHQUFHLEVBQUUseUJBQXlCO0lBQzlCLEdBQUcsRUFBRSxvQ0FBb0M7SUFDekMsSUFBSSxFQUFFLHFDQUFxQztJQUMzQyxHQUFHLEVBQUUsV0FBVztJQUNoQixHQUFHLEVBQUUsWUFBWTtJQUNqQixJQUFJLEVBQUUsWUFBWTtJQUNsQixHQUFHLEVBQUUsY0FBYztJQUNuQixHQUFHLEVBQUUsV0FBVztJQUNoQixHQUFHLEVBQUUsOEJBQThCO0lBQ25DLEtBQUssRUFBRSxzQ0FBc0M7SUFDN0MsSUFBSSxFQUFFLGlDQUFpQztJQUN2QyxJQUFJLEVBQUUsbUNBQW1DO0lBQ3pDLEdBQUcsRUFBRSxpQ0FBaUM7SUFDdEMsR0FBRyxFQUFFLGdDQUFnQztJQUNyQyxFQUFFLEVBQUUsdUNBQXVDO0lBQzNDLEdBQUcsRUFBRSx5QkFBeUI7SUFDOUIsRUFBRSxFQUFFLDhCQUE4QjtJQUNsQyxJQUFJLEVBQUUsa0JBQWtCO0lBQ3hCLEdBQUcsRUFBRSxtQkFBbUI7SUFDeEIsR0FBRyxFQUFFLFlBQVk7SUFDakIsR0FBRyxFQUFFLFdBQVc7SUFDaEIsR0FBRyxFQUFFLFdBQVc7Q0FDakIsQ0FBQztBQUNGLElBQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQztBQUMvQixJQUFNLGlCQUFpQixHQUFHLElBQUksTUFBTSxDQUFDLGdFQUFnRSxDQUFDLENBQUM7QUFDdkcsSUFBTSxZQUFZLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzdELElBQU0sd0JBQXdCLEdBQUcsRUFBRSxDQUFDO0FBRXBDOzs7O0dBSUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLGdCQUF3QjtJQUNoRCxJQUFJLFFBQVEsR0FBRyxjQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3JELElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFDLFNBQVMsSUFBSyxPQUFBLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQXhDLENBQXdDLENBQUMsRUFBRTtRQUM5RSxPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLHdCQUF3QixFQUFFO1FBQy9DLE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3pDO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxRQUFnQixFQUFFLFlBQW9CO0lBQzlELElBQUksYUFBcUIsQ0FBQztJQUMxQixJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO1FBQ2hDLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLGFBQWEsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDN0Q7U0FBTTtRQUNMLGFBQWEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDMUQ7SUFDRCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsS0FBYSxFQUFFLFFBQVk7SUFBWix5QkFBQSxFQUFBLFlBQVk7SUFDOUMsSUFBSSxLQUFLLEtBQUssQ0FBQztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQ2xDLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNmLElBQU0sRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQ3ZDLElBQU0sS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4RSxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELE9BQU8sVUFBVSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQ7SUFBMkMsaUNBQWE7SUFHdEQsdUJBQVksS0FBSztRQUFqQixZQUNFLGtCQUFNLEtBQUssQ0FBQyxTQU1iO1FBVFMsaUJBQVcsR0FBRyxFQUFFLENBQUM7UUFJekIsSUFBTSxXQUFXLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDekQsSUFBSSxZQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzlCLElBQU0sY0FBYyxHQUFHLFlBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzdELEtBQUksQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMvQzs7SUFDSCxDQUFDO0lBRU8sOEJBQU0sR0FBZCxVQUFlLFdBQXlCO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUM7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLGVBQWUsQ0FBQztJQUN6RCxDQUFDO0lBRUQsc0JBQXNCO0lBQ3RCLDhDQUE4QztJQUM5QyxJQUFJO0lBQ0osaUNBQWlDO0lBQ2pDLGtDQUFrQztJQUNsQyw4QkFBOEI7SUFDOUIsZUFBZTtJQUNmLDZDQUE2QztJQUM3Qyx1REFBdUQ7SUFDdkQsMkRBQTJEO0lBQzNELDRCQUE0QjtJQUM1QixtREFBbUQ7SUFDbkQsVUFBVTtJQUNWLFFBQVE7SUFDUixNQUFNO0lBRU4sZ0JBQWdCO0lBQ2hCLElBQUk7SUFFVSw4QkFBTSxHQUFwQixVQUFxQixHQUFHLEVBQUUsUUFBUTs7OztnQkFDaEMsWUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSztvQkFDekIsSUFBSSxHQUFHLEVBQUU7d0JBQ1AsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ25CO3lCQUFNO3dCQUNMLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJOzRCQUNqQixJQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzs0QkFDdEMsWUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBTyxHQUFHLEVBQUUsS0FBSzs7OztpREFDN0IsR0FBRyxFQUFILHdCQUFHOzRDQUNMLGdCQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7aURBQ1QsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFuQix3QkFBbUI7NENBQzVCLHFCQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFBOzs0Q0FBckMsU0FBcUMsQ0FBQzs7Z0RBRXRDLHFCQUFNLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBQTs7NENBQXhCLFNBQXdCLENBQUM7Ozs7O2lDQUU1QixDQUFDLENBQUM7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7cUJBQ0o7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7Ozs7S0FDSjtJQUVPLG1DQUFXLEdBQW5CLFVBQW9CLEdBQUcsRUFBRSxRQUFhO1FBQXRDLGlCQWFDO1FBYndCLHlCQUFBLEVBQUEsYUFBYTtRQUNwQyxJQUFNLE9BQU8sR0FBRyxZQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1lBQ25CLElBQUksQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDcEMsSUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLElBQUksWUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtvQkFDdkMsT0FBTyxLQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDN0M7cUJBQU07b0JBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDekI7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVhLGtDQUFVLEdBQXhCLFVBQXlCLFFBQVEsRUFBRSxPQUFPLEVBQUUsWUFBYTs7Ozs7O3dCQUNuRCxVQUFVLEdBQVcsT0FBTyxDQUFDLFFBQVEsQ0FBQzt3QkFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7NEJBQ3JCLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7NEJBQ3RELE9BQU8sQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO3lCQUMvQjt3QkFDRCw2Q0FBNkM7d0JBQzdDLElBQUksY0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFOzRCQUNqRCxnQkFBTSxDQUFDLEtBQUssQ0FBSSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFVLENBQUMsQ0FBQzs0QkFDakQsc0JBQU87eUJBQ1I7d0JBQ0ssV0FBVyxHQUFHLGdCQUFnQixDQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksMkJBQTJCLENBQUM7d0JBQ2hHLFNBQVMsR0FBRyx3QkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7O3dCQUVoQyxTQUFTLEdBQUcsWUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDeEMsSUFBSSxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRTs0QkFDdkIsYUFBYTs0QkFDYixnQkFBTSxDQUFDLEtBQUssQ0FBSSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQywwQkFBdUIsQ0FBQyxDQUFDOzRCQUMxRyxzQkFBTzt5QkFDUjs2QkFDRyxDQUFBLFNBQVMsQ0FBQyxJQUFJLElBQUksYUFBYSxDQUFBLEVBQS9CLHlCQUErQjt3QkFFN0IsVUFBVSxHQUFHLEtBQUssQ0FBQzs2QkFDbkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxFQUFyQyx3QkFBcUM7NkJBQ25DLENBQUEsT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBLEVBQXRELHdCQUFzRDt3QkFDbEQsVUFBVSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7d0JBQy9DLFNBQVMsU0FBQSxDQUFDOzZCQUNWLENBQUEsT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBLEVBQXRELHdCQUFzRDt3QkFDeEQsU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDOzs0QkFFckMscUJBQU0sZUFBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQTs7d0JBQWhFLFNBQVMsR0FBRyxTQUFvRCxDQUFDOzs7d0JBRW5FLElBQUksU0FBUyxJQUFJLFVBQVUsS0FBSyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUU7NEJBQ3ZELFVBQVUsR0FBRyxJQUFJLENBQUM7eUJBQ25COzs7NkJBR0QsQ0FBQyxVQUFVLEVBQVgsd0JBQVc7d0JBRVQsT0FBTyxHQUFHOzRCQUNaLElBQUksTUFBQTs0QkFDSixjQUFjLEVBQUUsV0FBVzs0QkFDM0IsYUFBYSxFQUFFLFVBQVEsc0JBQVUsQ0FBQyxPQUFPLENBQUc7eUJBQzdDLENBQUM7d0JBQ0ksVUFBVSxHQUFHLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzVELElBQUksVUFBVSxFQUFFOzRCQUNkLE9BQU8sQ0FBQyxlQUFlLENBQUMsR0FBRywwQkFBMEIsQ0FBQzt5QkFDdkQ7d0JBRUcsSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7d0JBQ3ZDLElBQUksU0FBUyxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUU7NEJBQzdCLDJCQUEyQjs0QkFDM0IsSUFBSSxHQUFHLElBQUksR0FBRyxvQkFBb0IsQ0FBQzt5QkFDcEM7d0JBQ0csR0FBRyxTQUFBLENBQUM7NkJBQ0osQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUEsRUFBN0Isd0JBQTZCO3dCQUMvQixHQUFHLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7Ozt3QkFFaEIsTUFBTSxHQUFHLFlBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDdkMscUJBQU0sb0JBQVMsQ0FBQyxTQUFTLEVBQUU7Z0NBQy9CLE1BQU0sRUFBRSxNQUFNO2dDQUNkLElBQUksRUFBRSxNQUFNO2dDQUNaLE9BQU8sRUFBRSxLQUFLO2dDQUNkLE9BQU8sRUFBRSxPQUFPOzZCQUNqQixDQUFDLEVBQUE7O3dCQUxGLEdBQUcsR0FBRyxTQUtKLENBQUM7Ozt3QkFFTCxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFOzRCQUN0QixPQUFPLENBQUMsR0FBRyxDQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLG1CQUFjLElBQU0sQ0FBQyxDQUFDO3lCQUN2Rzs2QkFBTTs0QkFDTCxTQUFTOzRCQUNULGdCQUFNLENBQUMsS0FBSyxDQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFlBQVMsQ0FBQyxDQUFDO3lCQUM3Rjs7O3dCQUVELFdBQVc7d0JBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBSSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQywrQkFBNEIsQ0FBQyxDQUFDOzs7O3dCQUdoSCxVQUFVO3dCQUNWLGdCQUFNLENBQUMsS0FBSyxDQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLHlCQUFzQixDQUFDLENBQUM7Ozs7O3dCQUczRyxjQUFjO3dCQUNkLGdCQUFNLENBQUMsS0FBSyxDQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLG1CQUFjLEdBQUMsQ0FBQyxPQUFTLENBQUMsQ0FBQzs7Ozs7O0tBRW5FO0lBRUQ7O09BRUc7SUFDVyx5Q0FBaUIsR0FBL0IsVUFBZ0MsRUFBOEM7WUFBNUMsSUFBSSxVQUFBLEVBQUUsT0FBTyxhQUFBLEVBQUUsTUFBTSxZQUFBLEVBQUUsT0FBTyxhQUFBLEVBQUUsVUFBVSxnQkFBQTs7Ozs7O3dCQUNwRSxRQUFRLEdBQUcsZ0JBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHOzRCQUNmLEdBQUcsQ0FBQyxVQUFVLElBQUksT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDOzRCQUN4QyxHQUFHLENBQUMsV0FBVyxJQUFJLE9BQU8sR0FBRyxDQUFDLFdBQVcsQ0FBQzt3QkFDNUMsQ0FBQyxDQUFDLENBQUM7d0JBQ0csYUFBYSxHQUFHOzRCQUNwQixNQUFNLFFBQUE7NEJBQ04sT0FBTyxTQUFBOzRCQUNQLFdBQVcsRUFBRTtnQ0FDWCxFQUFFLEVBQUUsT0FBTztnQ0FDWCxNQUFNLFFBQUE7Z0NBQ04sT0FBTyxTQUFBO2dDQUNQLFVBQVUsWUFBQTtnQ0FDVixJQUFJLE1BQUE7NkJBQ0w7eUJBQ0YsQ0FBQzt3QkFDRix5QkFBeUI7d0JBQ3pCLHFCQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztnQ0FDN0IsSUFBSSxFQUFFLFFBQVE7Z0NBQ2QsTUFBTSxRQUFBOzZCQUNQLENBQUMsRUFBQTs7d0JBSkYseUJBQXlCO3dCQUN6QixTQUdFLENBQUM7NkJBR0MsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUEsRUFBN0Isd0JBQTZCO3dCQUMvQixZQUFZLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7OzRCQUVsQixxQkFBTSx1QkFBYSxDQUFDLGFBQWEsQ0FBQyxFQUFBOzt3QkFBakQsWUFBWSxHQUFHLFNBQWtDLENBQUM7Ozt3QkFFcEQsSUFBSSxZQUFZLENBQUMsT0FBTyxFQUFFOzRCQUN4QixnQkFBTSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDOzRCQUNsRCw2QkFBNkI7eUJBQzlCOzZCQUFNOzRCQUNMLGdCQUFNLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7eUJBQ25EOzs7OztLQUNGO0lBRWEsNENBQW9CLEdBQWxDLFVBQW1DLEtBQWEsRUFBRSxPQUFlOzs7Z0JBQy9ELHNCQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07d0JBQ2pDLElBQUksWUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxFQUFFOzRCQUNuRCxJQUFNLFFBQVEsR0FBRyxxQkFBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRTtnQ0FDOUMsS0FBSyxFQUFFLElBQUk7Z0NBQ1gsR0FBRyxFQUFFLEtBQUs7Z0NBQ1YsS0FBSyxFQUFFLFNBQVM7NkJBQ2pCLENBQUMsQ0FBQzs0QkFDSCxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLElBQUk7Z0NBQ3hCLGdCQUFNLENBQUMsT0FBTyxDQUFDLFdBQUksT0FBTyxzQ0FBOEIsQ0FBQyxDQUFDO2dDQUMxRCxPQUFPLENBQUMsRUFBRSxJQUFJLE1BQUEsRUFBRSxDQUFDLENBQUM7NEJBQ3BCLENBQUMsQ0FBQyxDQUFDO3lCQUNKOzZCQUFNOzRCQUNMLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzt5QkFDYjtvQkFDSCxDQUFDLENBQUMsRUFBQzs7O0tBQ0o7SUFFYSwyQ0FBbUIsR0FBakMsVUFBa0MsRUFBZ0I7WUFBZCxJQUFJLFVBQUEsRUFBRSxNQUFNLFlBQUE7Ozs7Ozs7d0JBQ3hDLGNBQWMsR0FBRyxFQUFFLENBQUM7d0JBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsQ0FBQzs0QkFDbkIsSUFBTSxlQUFlLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBTyxPQUFPLEVBQUUsTUFBTTs7Ozs7Ozs0Q0FFaEQsWUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDOzRDQUNwQixlQUFhLElBQUksQ0FBQyxVQUFVLENBQUM7NENBQzdCLGdCQUFjLElBQUksQ0FBQyxXQUFXLENBQUM7aURBQ2pDLFlBQUUsQ0FBQyxVQUFVLENBQUMsWUFBVSxDQUFDLEVBQXpCLHdCQUF5Qjs0Q0FDM0IscUJBQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVUsRUFBRSxTQUFPLENBQUMsRUFBQTs7NENBQXBELFNBQW9ELENBQUM7NENBQ2pELGVBQWUsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7NENBQy9DLG9CQUFrQixFQUFFLENBQUM7NENBQ3pCLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRO2dEQUMvQixJQUFNLGlCQUFpQixHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsWUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dEQUMxRCxJQUFJLFlBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsRUFBRTtvREFDcEMsaUJBQWUsR0FBRyxpQkFBaUIsQ0FBQztpREFDckM7NENBQ0gsQ0FBQyxDQUFDLENBQUM7aURBQ0MsWUFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBZSxDQUFDLEVBQTlCLHdCQUE4Qjs0Q0FDMUIsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWUsQ0FBQyxDQUFDOzRDQUMxQyxlQUFhLEVBQUUsQ0FBQzs0Q0FDdEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7Z0RBQ3JCLFlBQVUsQ0FBQyxJQUFJLENBQ2IsSUFBSSxPQUFPLENBQUMsVUFBTyxPQUFPLEVBQUUsTUFBTTs7O29FQUNoQyxxQkFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sUUFBQSxFQUFFLE9BQU8sV0FBQSxFQUFFLEVBQUUsaUJBQWUsQ0FBQyxFQUFBOztnRUFBckUsU0FBcUUsQ0FBQztnRUFDdEUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs7O3FEQUNiLENBQUMsQ0FDSCxDQUFDOzRDQUNKLENBQUMsQ0FBQyxDQUFDOzRDQUNILHFCQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBVSxDQUFDLEVBQUE7OzRDQUE3QixTQUE2QixDQUFDOzRDQUM5QixnQkFBTSxDQUFDLElBQUksQ0FBQyxnQkFBUyxTQUFPLHVDQUErQixDQUFDLENBQUM7NENBQzdELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztpREFFSixZQUFFLENBQUMsVUFBVSxDQUFDLGFBQVcsQ0FBQyxFQUExQix5QkFBMEI7NENBQ25DLG9CQUFvQjs0Q0FDcEIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsd0NBQXNDLFNBQVMsQ0FBQyxDQUFDOzRDQUN2RCxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFXLENBQUMsQ0FBQztpREFDeEMsQ0FBQSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQSxFQUFyQix3QkFBcUI7NENBRWpCLFdBQVcsR0FBRyxjQUFJLENBQUMsU0FBUyxDQUFJLGFBQVcsWUFBUyxDQUFDLENBQUM7NENBRTFELHFCQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2YsS0FBSztxREFDRixNQUFNLENBQUMsVUFBQyxRQUFnQjtvREFDdkIsT0FBTyxDQUFDLGNBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnREFDeEQsQ0FBQyxDQUFDO3FEQUNELEdBQUcsQ0FBQyxVQUFDLFFBQWdCO29EQUNwQixJQUFNLFNBQVMsR0FBRyxZQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29EQUN4QyxPQUFPLGVBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBUTt3REFDbEUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxhQUFXLENBQUMsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO29EQUM3RSxDQUFDLENBQUMsQ0FBQztnREFDTCxDQUFDLENBQUMsQ0FDTCxFQUFBOzs0Q0FaQyxnQkFBYyxDQUNoQixTQVdDLENBQ0YsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsR0FBRztnREFDekIsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBVyxDQUFDO2dEQUNsQyxJQUFJLFFBQVEsR0FBRyxDQUFDLElBQUksUUFBUSxJQUFJLGFBQWEsRUFBRTtvREFDN0MsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztpREFDM0Q7Z0RBQ0QsT0FBTyxHQUFHLENBQUM7NENBQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0Q0FDQSxjQUFjLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFhLEVBQUUsR0FBUTtnREFDeEYsT0FBTyxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQzs0Q0FDMUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRDQUNOLFlBQUUsQ0FBQyxhQUFhLENBQ2QsV0FBVyxFQUNYLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxTQUFPLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQVcsQ0FBQyxFQUFFLENBQUMsQ0FDakksQ0FBQzs0Q0FDRixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtnREFDaEMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs2Q0FDekI7NENBRXFCLHFCQUFNLHNCQUFZLENBQUMsTUFBTSxFQUFFLFNBQU8sQ0FBQyxFQUFBOzs0Q0FBbkQsYUFBYSxHQUFHLFNBQW1DOzRDQUNuRCxnQkFBYyxhQUFhLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFFLEdBQUc7Z0RBQzVFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztnREFDeEIsT0FBTyxHQUFHLENBQUM7NENBQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzRDQUVELGVBQWEsRUFBRSxDQUFDOzRDQUN0QixLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBZ0I7Z0RBQzdCLFlBQVUsQ0FBQyxJQUFJLENBQ2IsSUFBSSxPQUFPLENBQUMsVUFBTyxPQUFPLEVBQUUsTUFBTTs7O29FQUNoQyxxQkFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sUUFBQSxFQUFFLE9BQU8sV0FBQSxFQUFFLFdBQVcsZUFBQSxFQUFFLFdBQVcsZUFBQSxFQUFFLEVBQUUsYUFBVyxDQUFDLEVBQUE7O2dFQUEzRixTQUEyRixDQUFDO2dFQUM1RixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Ozs7cURBQ2IsQ0FBQyxDQUNILENBQUM7NENBQ0osQ0FBQyxDQUFDLENBQUM7NENBQ0gscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFVLENBQUMsRUFBQTs7NENBQTdCLFNBQTZCLENBQUM7NENBQzlCLGdCQUFNLENBQUMsSUFBSSxDQUFDLDBDQUF3QyxTQUFTLENBQUMsQ0FBQzs7OzRDQUUvRCxnQkFBTSxDQUFDLEtBQUssQ0FBQyxnQ0FBOEIsU0FBTywyQkFBc0IsS0FBSyxDQUFDLE1BQU0scUJBQWtCLENBQUMsQ0FBQzs7OzRDQUUxRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs0Q0FFWCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7OzRDQUdiLE1BQU0sQ0FBQyxHQUFDLENBQUMsQ0FBQzs7Ozs7aUNBRWIsQ0FBQyxDQUFDOzRCQUNILGNBQWMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7d0JBQ3ZDLENBQUMsQ0FBQyxDQUFDO3dCQUNJLHFCQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUE7NEJBQXhDLHNCQUFPLFNBQWlDLEVBQUM7Ozs7S0FDMUM7SUFFWSw4QkFBTSxHQUFuQixVQUFvQixNQUFrQjs7Ozs7Ozt3QkFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUM1RSxLQUF3QyxNQUFNLENBQUMsS0FBSyxFQUFsRCxNQUFNLFlBQUEsRUFBRSxJQUFJLFVBQUEsRUFBRSxVQUFVLGdCQUFBLEVBQUUsT0FBTyxhQUFBLENBQWtCOzs7O3dCQUVuRCxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFDSixxQkFBTSx1QkFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFBOzt3QkFBMUMsWUFBWSxHQUFHLFNBQTJCOzZCQUM1QyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQXJCLHdCQUFxQjt3QkFDdkIsa0NBQWtDO3dCQUNsQyxNQUFNLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7OzZCQUUxQixDQUFBLFlBQVksQ0FBQyxJQUFJLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUEsRUFBOUMsd0JBQThDO3dCQUUxQyxXQUFXLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7d0JBQzlDLHFCQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztnQ0FDM0IsSUFBSSxNQUFBO2dDQUNKLE9BQU8sRUFBRSxXQUFXLENBQUMsRUFBRTtnQ0FDdkIsTUFBTSxRQUFBO2dDQUNOLE9BQU8sU0FBQTtnQ0FDUCxVQUFVLFlBQUE7NkJBQ1gsQ0FBQyxFQUFBOzt3QkFORixTQU1FLENBQUM7OzRCQUdZLHFCQUFNLHVCQUFhLENBQUMsTUFBTSxDQUFDLEVBQUE7O3dCQUFwQyxNQUFNLEdBQUcsU0FBMkI7NkJBQ3RDLE1BQU0sQ0FBQyxPQUFPLEVBQWQsd0JBQWM7d0JBQ2hCLGdCQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7d0JBQ3ZDLFlBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7d0JBQy9CLHFCQUFNLElBQUksT0FBTyxDQUFDLFVBQU8sT0FBTyxFQUFFLE1BQU07OztvQ0FDdEMsVUFBVSxDQUFDOzs7d0RBQ1QscUJBQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDO3dEQUMzQixJQUFJLE1BQUE7d0RBQ0osT0FBTyxXQUFBO3dEQUNQLE1BQU0sUUFBQTt3REFDTixPQUFPLFNBQUE7d0RBQ1AsVUFBVSxZQUFBO3FEQUNYLENBQUMsRUFBQTs7b0RBTkYsU0FNRSxDQUFDO29EQUNILE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7Ozt5Q0FDYixFQUFFLElBQUksQ0FBQyxDQUFDOzs7aUNBQ1YsQ0FBQyxFQUFBOzt3QkFYRixTQVdFLENBQUM7OzRCQUVILE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7d0JBSXhCLGFBQWEsR0FBRyxhQUFXLE1BQVEsQ0FBQzt3QkFDcEMsV0FBVyxHQUFHLENBQUMseURBQWUsYUFBZSxFQUFFLE9BQU8sRUFBRSxpQkFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ2xHLGlCQUFNLFFBQVEsWUFBQzs0QkFDYixJQUFJLEVBQUUsUUFBUTs0QkFDZCxPQUFPLEVBQUU7Z0NBQ1AsTUFBTSxFQUFFLGFBQWE7Z0NBQ3JCLE1BQU0sRUFBRSxDQUFDOzZCQUNWO3lCQUNGLENBQUMsQ0FBQzt3QkFDSCxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTs0QkFDakMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQzt5QkFDbkU7d0JBQ0Qsc0JBQU8sV0FBVyxFQUFDOzs7d0JBRW5CLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7OztLQUU5QjtJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQTlYRCxDQUEyQyxjQUFhLEdBOFh2RCJ9