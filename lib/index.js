"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
mime_1.default.define({ 'text/avro': ['avsc'] }, true);
mime_1.default.define({ 'text/proto': ['proto'] }, true);
var MAX_FILE_SIZE = 10485760;
var CACHE_RULE_REGEXP = new RegExp('[\\-._a-f\\d][a-f\\d]{8}.[a-z\\d]{3,}$');
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
                        uploadUrl = (0, jwt_token_1.getUploadUrl)(payload);
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
                            Authorization: "bear " + (0, jwt_token_1.getJwtoken)(payload),
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
                        return [4 /*yield*/, (0, node_fetch_1.default)(uploadUrl, {
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
                    case 2: return [4 /*yield*/, (0, request_1.updateProject)(updatePayload)];
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
                                                    (0, child_process_1.execSync)(buildCmd, { stdio: 'inherit' });
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
                                            return [4 /*yield*/, (0, request_1.listAppFiles)(domain, appName_1)];
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
                        return [4 /*yield*/, (0, request_1.verifyProject)(domain)];
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
                    case 5: return [4 /*yield*/, (0, request_1.createProject)(domain)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBd0I7QUFDeEIsb0RBQTJCO0FBQzNCLDBDQUFvQjtBQUNwQiwrQ0FBeUM7QUFDekMsa0RBQXVCO0FBQ3ZCLDhDQUF3QjtBQUN4QixnREFBMEI7QUFDMUIsMERBQW1DO0FBQ25DLHVEQUEwQztBQUMxQywyREFBcUM7QUFDckMsZ0RBQThEO0FBRTlELDRDQUE2RjtBQUM3RixvQ0FBb0M7QUFFcEMsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDO0FBRTVCLHdCQUF3QjtBQUN4QixjQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuRSxjQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsc0NBQXNDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNoRixjQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwRSxjQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUseUJBQXlCLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFELGNBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxvQ0FBb0MsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLHFDQUFxQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2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