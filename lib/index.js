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
    gif: 'image/gif; charset=UTF-8',
    jpg: 'image/jpeg; charset=UTF-8',
    jpeg: 'image/jpeg; charset=UTF-8',
    png: 'image/png; charset=UTF-8',
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
var CACHE_RULE_REGEXP = new RegExp('[\\-._a-f\\d][a-f\\d]{8}.(js|css|woff|woff2)$');
var CACHED_PATHS = ['/_nuxt/', '/_snowpack/', '/51cache/'];
var CACHED_EXT_NAMES = ['js', 'css', 'woff', 'woff2'];
var CACHED_FILE_NAME_MIN_LEN = 19;
/**
 * 验证文件是否能被浏览器端缓存
 * @param absoluteFilePath 文件的绝对路径，需要以'/'开头，路径中包含文件名
 * @return  可以被缓存标识
 */
function isLegalCacheFile(absoluteFilePath) {
    var fileName = absoluteFilePath;
    if (fileName.indexOf('/') >= 0) {
        fileName = fileName.substring(fileName.lastIndexOf('/'));
    }
    if (fileName.lastIndexOf('.') <= 0) {
        return false;
    }
    var extName = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (CACHED_PATHS.find(function (whitePath) { return absoluteFilePath.indexOf(whitePath) >= 0; })) {
        logger_1.default.info("File cached by path matched: " + absoluteFilePath);
        return true;
    }
    if (fileName.length >= CACHED_FILE_NAME_MIN_LEN && CACHED_EXT_NAMES.includes(extName)) {
        logger_1.default.info("File cached by name matched: " + fileName);
        return CACHE_RULE_REGEXP.test(fileName);
    }
    return false;
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
            var _shortName, tmpFilePath, contentType, uploadUrl, fileState, headers, cachedFile, stream, res, e_1;
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
                            logger_1.default.info(_shortName + " file upload success");
                        }
                        else {
                            logger_1.default.error(_shortName + " file upload error");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        logger_1.default.error(_shortName + " files over 10M cannot be uploaded");
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        logger_1.default.error(_shortName + " file upload failed the result is " + e_1.message);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
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
                            app.redirects && delete app.redirects;
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
                        return [4 /*yield*/, request_1.updateProject(updatePayload)];
                    case 1:
                        updateResult = _b.sent();
                        if (!updateResult.success) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.checkAndUploadFiles({
                                apps: copyApps,
                                domain: domain,
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
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
                                            logger_1.default.info("-----\u3010" + appName_1 + "\u3011 upload completed ----- \n\n");
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
            var _a, domain, apps, defaultApp, favicon, credentials, result, project_1, projectInfo, result_domain, successInfo, e_3;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = inputs.props, domain = _a.domain, apps = _a.apps, defaultApp = _a.defaultApp, favicon = _a.favicon;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, , 10]);
                        credentials = inputs.credentials;
                        this.setEnv(credentials);
                        return [4 /*yield*/, request_1.createProject(domain)];
                    case 2:
                        result = _b.sent();
                        if (!result.success) return [3 /*break*/, 4];
                        logger_1.default.info("\u65B0\u5E94\u7528\u521B\u5EFA\u6210\u529F \uFF0C\u5F00\u59CB\u8FDB\u884C\u6587\u4EF6\u4E0A\u4F20... \n\n");
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
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(result.msg.indexOf('AppSync-100501') !== -1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, request_1.getProjectInfo({
                                domain: domain,
                            })];
                    case 5:
                        projectInfo = _b.sent();
                        return [4 /*yield*/, this.updateProjectInfo({
                                apps: apps,
                                project: projectInfo.id,
                                domain: domain,
                                favicon: favicon,
                                defaultApp: defaultApp,
                            })];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7: throw Error(result.msg);
                    case 8:
                        result_domain = "https://" + domain;
                        successInfo = ["\u90E8\u7F72\u6210\u529F,\u8BBF\u95EE\u57DF\u540D: " + result_domain, '部署信息：', js_yaml_1.default.dump(inputs.props)].join('\n');
                        _super.prototype.__report.call(this, {
                            name: 'domain',
                            content: {
                                domain: result_domain,
                                weight: 3,
                            },
                        });
                        return [2 /*return*/, successInfo];
                    case 9:
                        e_3 = _b.sent();
                        throw new Error(e_3.message);
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return ComponentDemo;
}(base_1.default));
exports.default = ComponentDemo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLCtDQUFzQztBQUN0QyxvREFBMkI7QUFDM0IsMENBQW9CO0FBQ3BCLGtEQUF1QjtBQUN2QiwwREFBbUM7QUFDbkMsdURBQTBDO0FBQzFDLDJEQUFxQztBQUNyQyxnREFBOEQ7QUFFOUQsNENBQWdGO0FBQ2hGLG9DQUFvQztBQUVwQyxJQUFNLElBQUksR0FBRyxjQUFjLENBQUM7QUFDNUIsSUFBTSxnQkFBZ0IsR0FBRztJQUN2QixJQUFJLEVBQUUsMEJBQTBCO0lBQ2hDLEdBQUcsRUFBRSwwQkFBMEI7SUFDL0IsSUFBSSxFQUFFLDJCQUEyQjtJQUNqQyxHQUFHLEVBQUUsMkJBQTJCO0lBQ2hDLEdBQUcsRUFBRSx5QkFBeUI7SUFDOUIsR0FBRyxFQUFFLG9DQUFvQztJQUN6QyxJQUFJLEVBQUUscUNBQXFDO0lBQzNDLEdBQUcsRUFBRSwwQkFBMEI7SUFDL0IsR0FBRyxFQUFFLDJCQUEyQjtJQUNoQyxJQUFJLEVBQUUsMkJBQTJCO0lBQ2pDLEdBQUcsRUFBRSwwQkFBMEI7SUFDL0IsR0FBRyxFQUFFLDhCQUE4QjtJQUNuQyxLQUFLLEVBQUUsc0NBQXNDO0lBQzdDLElBQUksRUFBRSxpQ0FBaUM7SUFDdkMsSUFBSSxFQUFFLG1DQUFtQztJQUN6QyxHQUFHLEVBQUUsaUNBQWlDO0lBQ3RDLEdBQUcsRUFBRSxnQ0FBZ0M7SUFDckMsRUFBRSxFQUFFLHVDQUF1QztJQUMzQyxHQUFHLEVBQUUseUJBQXlCO0lBQzlCLEVBQUUsRUFBRSw4QkFBOEI7SUFDbEMsSUFBSSxFQUFFLGtCQUFrQjtJQUN4QixHQUFHLEVBQUUsbUJBQW1CO0lBQ3hCLEdBQUcsRUFBRSxZQUFZO0lBQ2pCLEdBQUcsRUFBRSxXQUFXO0lB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