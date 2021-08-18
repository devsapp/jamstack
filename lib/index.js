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
        return _super.call(this, props) || this;
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
            var pathname = path_1.default.join(dir, file);
            if (fs_1.default.statSync(pathname).isDirectory()) {
                return _this.travelAsync(pathname, filesArr);
            }
            else {
                filesArr.push(pathname);
            }
        });
        return filesArr;
    };
    ComponentDemo.prototype.uploadFiles = function (filePath, payload, sourceFolder) {
        return __awaiter(this, void 0, void 0, function () {
            var _shortName, tmpFilePath, contentType, uploadUrl, fileState, headers, cachedFile, hint, stream, res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _shortName = payload.fileName;
                        if (!payload.fileName) {
                            if (process.platform === 'win32') {
                                tmpFilePath = filePath.replace(/\\/g, '/');
                                _shortName = tmpFilePath.replace(sourceFolder + '/', '');
                            }
                            else {
                                _shortName = filePath.replace(sourceFolder + '/', '');
                            }
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
                        _a.trys.push([1, 5, , 6]);
                        fileState = fs_1.default.statSync(filePath);
                        if (!(fileState.size <= MAX_FILE_SIZE)) return [3 /*break*/, 3];
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
                        stream = fs_1.default.createReadStream(filePath);
                        return [4 /*yield*/, node_fetch_1.default(uploadUrl, {
                                method: 'POST',
                                body: stream,
                                timeout: 25000,
                                headers: headers,
                            })];
                    case 2:
                        res = _a.sent();
                        if (res.status === 200) {
                            console.log(_shortName.padEnd(60) + " " + formatBytes(fileState.size).padStart(10) + " Succeeded " + hint);
                        }
                        else {
                            logger_1.default.fatal(_shortName.padEnd(60) + " " + formatBytes(fileState.size).padStart(10) + " Failed");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        logger_1.default.fatal(_shortName.padEnd(60) + " " + formatBytes(fileState.size).padStart(10) + " Failed    Over 10M ");
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        logger_1.default.fatal(_shortName.padEnd(71) + " Failed    " + e_1.message);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
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
                        return [4 /*yield*/, request_1.updateProject(updatePayload)];
                    case 2:
                        updateResult = _b.sent();
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
                                var appName_1, sourceCode_1, releaseCode_1, statisFilesName, staicsFilesPath_1, files, promiseArr_1, files, promiseArr_2, e_2;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 8, , 9]);
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
                                                            case 0: return [4 /*yield*/, this.uploadFiles(fileName, { domain: domain, appName: appName_1 }, staicsFilesPath_1)];
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
                                        case 3: return [3 /*break*/, 7];
                                        case 4:
                                            if (!fs_1.default.existsSync(releaseCode_1)) return [3 /*break*/, 6];
                                            // 如果有直接指定静态文件直接进行上传
                                            logger_1.default.info("Begin to upload the files for app: " + appName_1);
                                            files = this.travelAsync(releaseCode_1);
                                            promiseArr_2 = [];
                                            files.forEach(function (fileName) {
                                                promiseArr_2.push(new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, this.uploadFiles(fileName, { domain: domain, appName: appName_1 }, releaseCode_1)];
                                                            case 1:
                                                                _a.sent();
                                                                resolve('');
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }));
                                            });
                                            return [4 /*yield*/, Promise.all(promiseArr_2)];
                                        case 5:
                                            _a.sent();
                                            logger_1.default.info("Succeed to upload the files for app: " + appName_1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLCtDQUFzQztBQUN0QyxvREFBMkI7QUFDM0IsMENBQW9CO0FBQ3BCLGtEQUF1QjtBQUN2QiwwREFBbUM7QUFDbkMsdURBQTBDO0FBQzFDLDJEQUFxQztBQUNyQyxnREFBOEQ7QUFFOUQsNENBQStFO0FBQy9FLG9DQUFvQztBQUVwQyxJQUFNLElBQUksR0FBRyxjQUFjLENBQUM7QUFDNUIsSUFBTSxnQkFBZ0IsR0FBRztJQUN2QixJQUFJLEVBQUUsMEJBQTBCO0lBQ2hDLEdBQUcsRUFBRSwwQkFBMEI7SUFDL0IsSUFBSSxFQUFFLDJCQUEyQjtJQUNqQyxHQUFHLEVBQUUsMkJBQTJCO0lBQ2hDLEdBQUcsRUFBRSx5QkFBeUI7SUFDOUIsR0FBRyxFQUFFLG9DQUFvQztJQUN6QyxJQUFJLEVBQUUscUNBQXFDO0lBQzNDLEdBQUcsRUFBRSxXQUFXO0lBQ2hCLEdBQUcsRUFBRSxZQUFZO0lBQ2pCLElBQUksRUFBRSxZQUFZO0lBQ2xCLEdBQUcsRUFBRSxjQUFjO0lBQ25CLEdBQUcsRUFBRSxXQUFXO0lBQ2hCLEdBQUcsRUFBRSw4QkFBOEI7SUFDbkMsS0FBSyxFQUFFLHNDQUFzQztJQUM3QyxJQUFJLEVBQUUsaUNBQWlDO0lBQ3ZDLElBQUksRUFBRSxtQ0FBbUM7SUFDekMsR0FBRyxFQUFFLGlDQUFpQztJQUN0QyxHQUFHLEVBQUUsZ0NBQWdDO0lBQ3JDLEVBQUUsRUFBRSx1Q0FBdUM7SUFDM0MsR0FBRyxFQUFFLHlCQUF5QjtJQUM5QixFQUFFLEVBQUUsOEJBQThCO0lBQ2xDLElBQUksRUFBRSxrQkFBa0I7SUFDeEIsR0FBRyxFQUFFLG1CQUFtQjtJQUN4QixHQUFHLEVBQUUsWUFBWTtJQUNqQixHQUFH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