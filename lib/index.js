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
var Host = 's.devsapp.cn';
var CONTENT_TYPE_MAP = {
    html: 'text/html; charset=UTF-8',
    htm: 'text/html; charset=UTF-8',
    text: 'text/plain; charset=UTF-8',
    txt: 'text/plain; charset=UTF-8',
    xml: 'text/xml; charset=UTF-8',
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
            var _shortName, contentType, uploadUrl, fileState, headers, cachedFile, stream, res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _shortName = payload.fileName;
                        if (!payload.fileName) {
                            _shortName = filePath.replace(sourceFolder + '/', '');
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
                        apps.forEach(function (item, i) { return __awaiter(_this, void 0, void 0, function () {
                            var promiseFunction;
                            var _this = this;
                            return __generator(this, function (_a) {
                                promiseFunction = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
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
                                return [2 /*return*/];
                            });
                        }); });
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
                        _b.trys.push([1, 8, , 9]);
                        credentials = inputs.credentials;
                        this.setEnv(credentials);
                        return [4 /*yield*/, request_1.createProject(domain)];
                    case 2:
                        result = _b.sent();
                        if (!result.success) return [3 /*break*/, 4];
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
                                    }); }, 3000);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 7];
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
                        _b.label = 7;
                    case 7:
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
                    case 8:
                        e_3 = _b.sent();
                        throw new Error(e_3.message);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return ComponentDemo;
}(base_1.default));
exports.default = ComponentDemo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLCtDQUFzQztBQUN0QyxvREFBMkI7QUFDM0IsMENBQW9CO0FBQ3BCLGtEQUF1QjtBQUN2QiwwREFBbUM7QUFDbkMsdURBQTBDO0FBQzFDLDJEQUFxQztBQUNyQyxnREFBOEQ7QUFFOUQsNENBQWdGO0FBRWhGLElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQztBQUM1QixJQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLElBQUksRUFBRSwwQkFBMEI7SUFDaEMsR0FBRyxFQUFFLDBCQUEwQjtJQUMvQixJQUFJLEVBQUUsMkJBQTJCO0lBQ2pDLEdBQUcsRUFBRSwyQkFBMkI7SUFDaEMsR0FBRyxFQUFFLHlCQUF5QjtJQUM5QixHQUFHLEVBQUUsMEJBQTBCO0lBQy9CLEdBQUcsRUFBRSwyQkFBMkI7SUFDaEMsSUFBSSxFQUFFLDJCQUEyQjtJQUNqQyxHQUFHLEVBQUUsMEJBQTBCO0lBQy9CLEdBQUcsRUFBRSw4QkFBOEI7SUFDbkMsS0FBSyxFQUFFLHNDQUFzQztJQUM3QyxJQUFJLEVBQUUsaUNBQWlDO0lBQ3ZDLElBQUksRUFBRSxtQ0FBbUM7SUFDekMsR0FBRyxFQUFFLGlDQUFpQztJQUN0QyxHQUFHLEVBQUUsZ0NBQWdDO0lBQ3JDLEVBQUUsRUFBRSx1Q0FBdUM7SUFDM0MsR0FBRyxFQUFFLHlCQUF5QjtJQUM5QixFQUFFLEVBQUUsOEJBQThCO0lBQ2xDLElBQUksRUFBRSxrQkFBa0I7SUFDeEIsR0FBRyxFQUFFLG1CQUFtQjtDQUN6QixDQUFDO0FBQ0YsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDO0FBQy9CLElBQU0saUJBQWlCLEdBQUcsSUFBSSxNQUFNLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUN0RixJ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