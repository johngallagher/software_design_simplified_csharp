"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderStoreContext = void 0;
var react_1 = __importDefault(require("react"));
exports.BuilderStoreContext = react_1.default.createContext({
    state: {},
    rootState: {},
    content: {},
    context: {},
    update: function (mutator) { return null; },
});
//# sourceMappingURL=builder-store.js.map