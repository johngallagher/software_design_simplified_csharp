"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderMetaContext = void 0;
var react_1 = __importDefault(require("react"));
exports.BuilderMetaContext = react_1.default.createContext({
    emailMode: false,
    ampMode: false,
    isServer: false,
});
//# sourceMappingURL=builder-meta.js.map