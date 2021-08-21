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
var mime_1 = __importDefault(require("mime"));
var hasha_1 = __importDefault(require("hasha"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var base_1 = __importDefault(require("./common/base"));
var logger_1 = __importDefault(require("./common/logger"));
var jwt_token_1 = require("./common/jwt-token");
var request_1 = require("./common/request");
// import i18n from './common/i18n';
var Host = 's.devsapp.cn';
// reset some mime types
mime_1.default.define({ 'text/html; charset=UTF-8': ['html', 'htm'] }, true);
mime_1.default.define({ 'application/xhtml+xml; charset=UTF-8': ['xhtml', 'htm'] }, true);
mime_1.default.define({ 'text/plain; charset=UTF-8': ['text', 'txt'] }, true);
mime_1.default.define({ 'text/xml; charset=UTF-8': ['xml'] }, true);
mime_1.default.define({ 'application/rss+xml; charset=UTF-8': ['rss'] }, true);
mime_1.default.define({ 'application/atom+xml; charset=UTF-8': ['atom'] }, true);
mime_1.default.define({ 'image/svg+xml; charset=UTF-8': ['svg'] }, true);
mime_1.default.define({ 'application/json; charset=UTF-8': ['json'] }, true);
mime_1.default.define({ 'application/x-yaml; charset=UTF-8': ['yaml'] }, true);
mime_1.default.define({ 'application/javascript; charset=UTF-8': ['js'] }, true);
mime_1.default.define({ 'text/css; charset=UTF-8': ['css'] }, true);
mime_1.default.define({ 'text/markdown; charset=UTF-8': ['md'] }, true);
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
function getFileContentType(filePath) {
    return mime_1.default.getType(filePath) || 'application/octet-stream';
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
            var _shortName, fileMetadata, contentType, uploadUrl, fileSize, uploadSkip, remoteEtag, localEtag, headers, cachedFile, hint, res, stream, e_1;
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
                        fileMetadata = null;
                        if (payload.uploadFiles && payload.uploadFiles[_shortName]) {
                            fileMetadata = payload.uploadFiles[_shortName];
                        }
                        contentType = getFileContentType(filePath);
                        uploadUrl = jwt_token_1.getUploadUrl(payload);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 14]);
                        fileSize = void 0;
                        if (fileMetadata) {
                            fileSize = fileMetadata.size;
                        }
                        else {
                            fileSize = fs_1.default.statSync(filePath).size;
                        }
                        if (fileSize == 0) {
                            // empty file
                            logger_1.default.fatal(_shortName.padEnd(60) + " " + formatBytes(fileSize).padStart(10) + " Skipped   Empty file");
                            return [2 /*return*/];
                        }
                        if (!(fileSize <= MAX_FILE_SIZE)) return [3 /*break*/, 11];
                        uploadSkip = false;
                        if (!!(process.env.forceUpload === 'true')) return [3 /*break*/, 5];
                        if (!(payload.remoteFiles && payload.remoteFiles[_shortName])) return [3 /*break*/, 5];
                        remoteEtag = payload.remoteFiles[_shortName];
                        localEtag = void 0;
                        if (!fileMetadata) return [3 /*break*/, 2];
                        localEtag = fileMetadata.etag;
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
                        if (fileSize >= 2097152) {
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
                            console.log(_shortName.padEnd(60) + " " + formatBytes(fileSize).padStart(10) + " Succeeded " + hint);
                        }
                        else {
                            // 文件上传失败
                            logger_1.default.fatal(_shortName.padEnd(60) + " " + formatBytes(fileSize).padStart(10) + " Failed");
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        // 文件没有任何修改
                        console.log(_shortName.padEnd(60) + " " + formatBytes(fileSize).padStart(10) + " Skipped   No local change");
                        _a.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        // 文件大于10M
                        logger_1.default.fatal(_shortName.padEnd(60) + " " + formatBytes(fileSize).padStart(10) + " Failed    Over 10M ");
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
                        successInfo = ["Succeed to deploy, and website url: " + result_domain, ' Deployment info：', js_yaml_1.default.dump(inputs.props)].join('\n');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLCtDQUFzQztBQUN0QyxvREFBMkI7QUFDM0IsMENBQW9CO0FBQ3BCLGtEQUF1QjtBQUN2Qiw4Q0FBd0I7QUFDeEIsZ0RBQTBCO0FBQzFCLDBEQUFtQztBQUNuQyx1REFBMEM7QUFDMUMsMkRBQXFDO0FBQ3JDLGdEQUE4RDtBQUU5RCw0Q0FBNkY7QUFDN0Ysb0NBQW9DO0FBRXBDLElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQztBQUU1Qix3QkFBd0I7QUFDeEIsY0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLDBCQUEwQixFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLHNDQUFzQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDaEYsY0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLDJCQUEyQixFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLHlCQUF5QixFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMxRCxjQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsb0NBQW9DLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JFLGNBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxxQ0FBcUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkUs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