"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderAsyncRequestsContext = exports.isRequestInfo = exports.isPromise = void 0;
var react_1 = __importDefault(require("react"));
var isPromise = function (thing) {
    return typeof thing.then === 'function';
};
exports.isPromise = isPromise;
var isRequestInfo = function (thing) { return !(0, exports.isPromise)(thing); };
exports.isRequestInfo = isRequestInfo;
exports.BuilderAsyncRequestsContext = react_1.default.createContext({
    requests: [],
    errors: [],
    logs: [],
});
//# sourceMappingURL=builder-async-requests.js.map