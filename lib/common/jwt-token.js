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
exports.getUploadUrl = exports.getJwtoken = void 0;
var path_1 = __importDefault(require("path"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var lodash_1 = __importDefault(require("lodash"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var Host = 's.devsapp.cn';
var now = Math.floor(Date.now() / 1000);
var expiredSeconds = 300; // 过期时间，最大300秒
var getPayload = function (payload) {
    var defaultPayload = {
        iat: now,
        exp: now + expiredSeconds,
        accessKey: process.env.accessKey // process.env.accessKey,
    };
    if (payload.domain) {
        return lodash_1.default.assign(defaultPayload, lodash_1.default.pick(payload, 'domain', 'project'));
    }
    else {
        return defaultPayload;
    }
};
function getJwtoken(payload) {
    var jwtToken = jsonwebtoken_1.default.sign(getPayload(payload), process.env.accessSecret, {
        algorithm: 'HS256',
    });
    return jwtToken;
}
exports.getJwtoken = getJwtoken;
function getUploadUrl(payload) {
    return 'https://' + path_1.default.join("" + Host, "/object/" + payload.domain + "/" + payload.appName + "/" + payload.fileName);
}
exports.getUploadUrl = getUploadUrl;
exports.default = (function (url, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, jwtToken, response, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                payload = payload || {};
                _a = payload.type, type = _a === void 0 ? 'json' : _a;
                jwtToken = jsonwebtoken_1.default.sign(getPayload(payload), process.env.accessSecret, {
                    algorithm: 'HS256',
                });
                return [4 /*yield*/, node_fetch_1.default('https://' + path_1.default.join("" + Host, url), {
                        method: payload.method || 'GET',
                        headers: {
                            Host: Host,
                            'Content-Type': type === 'json' ? 'application/json' : 'text/plain',
                            Authorization: "bear " + jwtToken,
                        },
                        body: payload.body ? JSON.stringify(payload.body) : undefined
                    })];
            case 1:
                response = _b.sent();
                if (!(response.status === 200)) return [3 /*break*/, 7];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 6]);
                return [4 /*yield*/, response.json()];
            case 3: return [2 /*return*/, _b.sent()];
            case 4:
                error_1 = _b.sent();
                return [4 /*yield*/, response.text()];
            case 5: return [2 /*return*/, _b.sent()];
            case 6: return [3 /*break*/, 8];
            case 7:
                console.log(response);
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LXRva2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1vbi9qd3QtdG9rZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLDhEQUErQjtBQUMvQixrREFBdUI7QUFDdkIsMERBQW1DO0FBR25DLElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQztBQUU1QixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUMxQyxJQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsQ0FBQyxjQUFjO0FBRTFDLElBQU0sVUFBVSxHQUFHLFVBQUMsT0FBYTtJQUM3QixJQUFNLGNBQWMsR0FBRztRQUNuQixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxHQUFHLEdBQUcsY0FBYztRQUN6QixTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUJBQXlCO0tBQzdELENBQUM7SUFDRixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDaEIsT0FBTyxnQkFBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsZ0JBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQ3pFO1NBQU07UUFDSCxPQUFPLGNBQWMsQ0FBQztLQUN6QjtBQUNMLENBQUMsQ0FBQztBQUNGLFNBQWdCLFVBQVUsQ0FBQyxPQUFPO0lBQzlCLElBQU0sUUFBUSxHQUFHLHNCQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRTtRQUNyRSxTQUFTLEVBQUUsT0FBTztLQUNyQixDQUFDLENBQUM7SUFDSCxPQUFPLFFBQVEsQ0FBQztBQUNwQixDQUFDO0FBTEQsZ0NBS0M7QUFFRCxTQUFnQixZQUFZLENBQUMsT0FBTztJQUNoQyxPQUFPLFVBQVUsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLEtBQUcsSUFBTSxFQUFFLGFBQVcsT0FBTyxDQUFDLE1BQU0sU0FBSSxPQUFPLENBQUMsT0FBTyxTQUFJLE9BQU8sQ0FBQyxRQUFVLENBQUMsQ0FBQztBQUNqSCxDQUFDO0FBRkQsb0NBRUM7QUFDRCxtQkFBZSxVQUFPLEdBQUcsRUFBRSxPQUFhOzs7OztnQkFDcEMsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLEtBQWtCLE9BQU8sS0FBWixFQUFiLElBQUksbUJBQUcsTUFBTSxLQUFBLENBQWE7Z0JBQzVCLFFBQVEsR0FBRyxzQkFBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUU7b0JBQ3JFLFNBQVMsRUFBRSxPQUFPO2lCQUNyQixDQUFDLENBQUM7Z0JBRWMscUJBQU0sb0JBQVMsQ0FBQyxVQUFVLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxLQUFHLElBQU0sRUFBRSxHQUFHLENBQUMsRUFBRTt3QkFDckUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSzt3QkFDL0IsT0FBTyxFQUFFOzRCQUNMLElBQUksTUFBQTs0QkFDSixjQUFjLEVBQUUsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFlBQVk7NEJBQ25FLGFBQWEsRUFBRSxVQUFRLFFBQVU7eUJBQ3BDO3dCQUNELElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztxQkFDaEUsQ0FBQyxFQUFBOztnQkFSSSxRQUFRLEdBQUcsU0FRZjtxQkFDRSxDQUFBLFFBQVEsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFBLEVBQXZCLHdCQUF1Qjs7OztnQkFFWixxQkFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUE7b0JBQTVCLHNCQUFPLFNBQXFCLEVBQUM7OztnQkFFdEIscUJBQU0sUUFBUSxDQUFDLElBQUksRUFBRSxFQUFBO29CQUE1QixzQkFBTyxTQUFxQixFQUFDOzs7Z0JBR2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7Ozs7O0tBRTVCLEVBQUMifQ==