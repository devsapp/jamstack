"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getProjectInfo = exports.listAppFilesAsync = exports.putObject = exports.listProject = exports.updateProject = exports.listAppFiles = exports.verifyProject = exports.createProject = void 0;
var jwt_token_1 = __importDefault(require("./jwt-token"));
/**
 * 整个项目的调用
 * 1. createProject(申请一个domain会返回一个projectId)
 * 2. updateProject(将项目的信息s.yml转化后的json,和projectId进行关联)
 * @param domain
 * @returns
 */
/**
 * create project: 创建项目
 */
exports.createProject = function (domain) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, jwt_token_1.default("/project/create/" + domain, {
                method: 'POST',
            })];
    });
}); };
/**
 * verify project
 * @param domain
 */
exports.verifyProject = function (domain) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, jwt_token_1.default("/project/verify/" + domain, {
                method: 'POST',
            })];
    });
}); };
exports.listAppFiles = function (domain, appName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, jwt_token_1.default("/objects/" + domain + "/" + appName, {
                method: 'GET',
            })];
    });
}); };
exports.updateProject = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, jwt_token_1.default("/project/update/" + payload.domain, __assign(__assign({ method: 'POST' }, payload), { body: payload.projectInfo }))];
    });
}); };
/**
 * 用户的project列表
 * list project
 */
exports.listProject = function (payload) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, jwt_token_1.default('/project/index', payload)];
}); }); };
/**
 * 上传文件到OSS
 */
exports.putObject = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, jwt_token_1.default("/object/" + payload.domain + "/" + payload.appName + "/" + payload.fileName, __assign(__assign({}, payload), { method: 'POST' }))];
    });
}); };
exports.listAppFilesAsync = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, jwt_token_1.default("/objects/" + payload.domain + "/" + payload.appName + "?marker=", __assign(__assign({}, payload), { method: 'GET' }))];
    });
}); };
exports.getProjectInfo = function (payload) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, jwt_token_1.default("/project/show/" + payload.domain, payload)];
}); }); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tb24vcmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDBEQUFzQztBQVF0Qzs7Ozs7O0dBTUc7QUFFSDs7R0FFRztBQUNVLFFBQUEsYUFBYSxHQUFHLFVBQU8sTUFBYzs7UUFDaEQsc0JBQUEsbUJBQVcsQ0FBQyxxQkFBbUIsTUFBUSxFQUFFO2dCQUN2QyxNQUFNLEVBQUUsTUFBTTthQUNmLENBQUMsRUFBQTs7S0FBQSxDQUFDO0FBRUw7OztHQUdHO0FBQ1UsUUFBQSxhQUFhLEdBQUcsVUFBTyxNQUFjOztRQUNoRCxzQkFBQSxtQkFBVyxDQUFDLHFCQUFtQixNQUFRLEVBQUU7Z0JBQ3ZDLE1BQU0sRUFBRSxNQUFNO2FBQ2YsQ0FBQyxFQUFBOztLQUFBLENBQUM7QUFFUSxRQUFBLFlBQVksR0FBRyxVQUFPLE1BQWMsRUFBRSxPQUFlOztRQUNoRSxzQkFBQSxtQkFBVyxDQUFDLGNBQVksTUFBTSxTQUFJLE9BQVMsRUFBRTtnQkFDM0MsTUFBTSxFQUFFLEtBQUs7YUFDZCxDQUFDLEVBQUE7O0tBQUEsQ0FBQztBQUVRLFFBQUEsYUFBYSxHQUFHLFVBQU8sT0FBOEI7O1FBQ2hFLHNCQUFBLG1CQUFXLENBQUMscUJBQW1CLE9BQU8sQ0FBQyxNQUFRLHNCQUM3QyxNQUFNLEVBQUUsTUFBTSxJQUNYLE9BQU8sS0FDVixJQUFJLEVBQUUsT0FBTyxDQUFDLFdBQVcsSUFDekIsRUFBQTs7S0FBQSxDQUFDO0FBRUw7OztHQUdHO0FBQ1UsUUFBQSxXQUFXLEdBQUcsVUFBTyxPQUF3QjtJQUFLLHNCQUFBLG1CQUFXLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLEVBQUE7U0FBQSxDQUFDO0FBRXRHOztHQUVHO0FBQ1UsUUFBQSxTQUFTLEdBQUcsVUFBTyxPQUEwQjs7UUFDeEQsc0JBQUEsbUJBQVcsQ0FBQyxhQUFXLE9BQU8sQ0FBQyxNQUFNLFNBQUksT0FBTyxDQUFDLE9BQU8sU0FBSSxPQUFPLENBQUMsUUFBVSx3QkFDekUsT0FBTyxLQUNWLE1BQU0sRUFBRSxNQUFNLElBQ2QsRUFBQTs7S0FBQSxDQUFDO0FBQ1EsUUFBQSxpQkFBaUIsR0FBRyxVQUFPLE9BQU87O1FBQzdDLHNCQUFBLG1CQUFXLENBQUMsY0FBWSxPQUFPLENBQUMsTUFBTSxTQUFJLE9BQU8sQ0FBQyxPQUFPLGFBQVUsd0JBQzlELE9BQU8sS0FDVixNQUFNLEVBQUUsS0FBSyxJQUNiLEVBQUE7O0tBQUEsQ0FBQztBQUVRLFFBQUEsY0FBYyxHQUFHLFVBQU8sT0FBTztJQUFLLHNCQUFBLG1CQUFXLENBQUMsbUJBQWlCLE9BQU8sQ0FBQyxNQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUE7U0FBQSxDQUFDIn0=