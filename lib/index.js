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
var js_yaml_1 = __importDefault(require("js-yaml"));
var fs_1 = __importDefault(require("fs"));
var child_process_1 = require("child_process");
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
            var _shortName, fileMetadata, contentType, uploadUrl, fileSize, uploadSkip, remoteEtag, localEtag, cachedFile, hint, headers, res, stream, e_1;
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
                            logger_1.default.fatal(_shortName.padEnd(71) + " Ignored   Hidden file");
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
                            logger_1.default.fatal(_shortName.padEnd(60) + " " + formatBytes(fileSize).padStart(10) + " Ignored   Empty file");
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
                        if (localEtag && (remoteEtag === localEtag || remoteEtag === localEtag.toUpperCase())) {
                            uploadSkip = true;
                        }
                        _a.label = 5;
                    case 5:
                        cachedFile = isLegalCacheFile('/' + payload.fileName);
                        hint = cachedFile ? 'Cached ' : '';
                        if (fileSize >= 2097152) {
                            // file size more than 2 MB
                            hint = hint + 'Optimize file size';
                        }
                        if (!!uploadSkip) return [3 /*break*/, 9];
                        headers = {
                            Host: Host,
                            'Content-Type': contentType,
                            Authorization: "bear " + jwt_token_1.getJwtoken(payload),
                        };
                        if (cachedFile) {
                            headers['Cache-Control'] = 'public, max-age=31536000';
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
                            logger_1.default.fatal(_shortName.padEnd(60) + " " + formatBytes(fileSize).padStart(10) + " Failed    Upload Failure");
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        // 文件没有任何修改
                        console.log(_shortName.padEnd(60) + " " + formatBytes(fileSize).padStart(10) + " Skipped   No local change " + hint);
                        _a.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        // 文件大于10M
                        logger_1.default.fatal(_shortName.padEnd(60) + " " + formatBytes(fileSize).padStart(10) + " Ignored   Over 10M ");
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
                            app.buildCmd && delete app.buildCmd;
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
                                var appName_1, buildCmd, releaseCode_1, files, staticsFile, uploadFiles_1, totalFilesSize, remoteObjects, remoteFiles_1, promiseArr_1, e_2;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 8, , 9]);
                                            appName_1 = item.name;
                                            buildCmd = item.buildCmd;
                                            releaseCode_1 = item.releaseCode;
                                            if (buildCmd) {
                                                // 执行应用的构建
                                                logger_1.default.info("Begin to build the app: " + appName_1);
                                                try {
                                                    child_process_1.execSync(buildCmd, { stdio: 'inherit' });
                                                }
                                                catch (e) {
                                                    logger_1.default.fatal(e.message);
                                                    process.exit(1);
                                                }
                                            }
                                            if (!fs_1.default.existsSync(releaseCode_1)) return [3 /*break*/, 6];
                                            // 如果有直接指定静态文件直接进行上传
                                            logger_1.default.info("Begin to upload the files for app: " + appName_1);
                                            files = this.travelAsync(releaseCode_1);
                                            if (!(files.length <= 10000)) return [3 /*break*/, 4];
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
                                        case 1:
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
                                            fs_1.default.writeFileSync(staticsFile, JSON.stringify({
                                                domain: domain,
                                                app: appName_1,
                                                totalFilesSize: totalFilesSize,
                                                timestamp: Date.now(),
                                                objectMetadataList: Object.values(uploadFiles_1),
                                            }));
                                            if (!files.includes(staticsFile)) {
                                                files.push(staticsFile);
                                            }
                                            return [4 /*yield*/, request_1.listAppFiles(domain, appName_1)];
                                        case 2:
                                            remoteObjects = _a.sent();
                                            remoteFiles_1 = remoteObjects.objectMetadataList.reduce(function (map, obj) {
                                                map[obj.key] = obj.etag;
                                                return map;
                                            }, {});
                                            promiseArr_1 = [];
                                            files.forEach(function (fileName) {
                                                promiseArr_1.push(new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
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
                                            return [4 /*yield*/, Promise.all(promiseArr_1)];
                                        case 3:
                                            _a.sent();
                                            logger_1.default.info("Succeed to upload the files for app: " + appName_1);
                                            return [3 /*break*/, 5];
                                        case 4:
                                            logger_1.default.error("Failed to upload files for " + appName_1 + ": the files number " + files.length + " more than 10000");
                                            _a.label = 5;
                                        case 5:
                                            resolve(i);
                                            return [3 /*break*/, 7];
                                        case 6:
                                            resolve(i);
                                            _a.label = 7;
                                        case 7: return [3 /*break*/, 9];
                                        case 8:
                                            e_2 = _a.sent();
                                            reject(e_2);
                                            return [3 /*break*/, 9];
                                        case 9: return [2 /*return*/];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLG9EQUEyQjtBQUMzQiwwQ0FBb0I7QUFDcEIsK0NBQXlDO0FBQ3pDLGtEQUF1QjtBQUN2Qiw4Q0FBd0I7QUFDeEIsZ0RBQTBCO0FBQzFCLDBEQUFtQztBQUNuQyx1REFBMEM7QUFDMUMsMkRBQXFDO0FBQ3JDLGdEQUE4RDtBQUU5RCw0Q0FBNkY7QUFDN0Ysb0NBQW9DO0FBRXBDLElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQztBQUU1Qix3QkFBd0I7QUFDeEIsY0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLDBCQUEwQixFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLHNDQUFzQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDaEYsY0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLDJCQUEyQixFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLHlCQUF5QixFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMxRCxjQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsb0NBQW9DLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JFLGNBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxxQ0FBcUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkUs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