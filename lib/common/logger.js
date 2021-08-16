"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var i18n_1 = __importDefault(require("./i18n"));
var core_1 = require("@serverless-devs/core");
var ComponentLogger = /** @class */ (function () {
    function ComponentLogger() {
    }
    ComponentLogger.setContent = function (content) {
        ComponentLogger.CONTENT = content;
    };
    ComponentLogger.log = function (m) {
        core_1.Logger.log(i18n_1.default.__(m) || m);
    };
    ComponentLogger.info = function (m) {
        core_1.Logger.info(ComponentLogger.CONTENT, i18n_1.default.__(m) || m);
    };
    ComponentLogger.debug = function (m) {
        core_1.Logger.debug(ComponentLogger.CONTENT, i18n_1.default.__(m) || m);
    };
    ComponentLogger.error = function (m) {
        core_1.Logger.error(ComponentLogger.CONTENT, i18n_1.default.__(m) || m);
    };
    ComponentLogger.warning = function (m) {
        core_1.Logger.warn(ComponentLogger.CONTENT, i18n_1.default.__(m) || m);
    };
    ComponentLogger.success = function (m) {
        core_1.Logger.log(i18n_1.default.__(m) || m, 'green');
    };
    ComponentLogger.CONTENT = 'Jamstack';
    return ComponentLogger;
}());
exports.default = ComponentLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1vbi9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBMEI7QUFDMUIsOENBQStDO0FBRS9DO0lBQUE7SUEyQkEsQ0FBQztJQXpCUSwwQkFBVSxHQUFqQixVQUFrQixPQUFPO1FBQ3ZCLGVBQWUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3BDLENBQUM7SUFDTSxtQkFBRyxHQUFWLFVBQVcsQ0FBQztRQUNWLGFBQU0sQ0FBQyxHQUFHLENBQUMsY0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ00sb0JBQUksR0FBWCxVQUFZLENBQUM7UUFDWCxhQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsY0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0scUJBQUssR0FBWixVQUFhLENBQUM7UUFDWixhQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsY0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU0scUJBQUssR0FBWixVQUFhLENBQUM7UUFDWixhQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsY0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU0sdUJBQU8sR0FBZCxVQUFlLENBQUM7UUFDZCxhQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsY0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sdUJBQU8sR0FBZCxVQUFlLENBQUM7UUFDZCxhQUFNLENBQUMsR0FBRyxDQUFDLGNBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUF6Qk0sdUJBQU8sR0FBRyxVQUFVLENBQUM7SUEwQjlCLHNCQUFDO0NBQUEsQUEzQkQsSUEyQkM7a0JBM0JvQixlQUFlIn0=