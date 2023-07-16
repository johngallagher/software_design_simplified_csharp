"use strict";
'use client';
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
var react_1 = __importDefault(require("react"));
var builder_store_1 = require("../store/builder-store");
/**
 * Link component should be used instead of an anchor tag in our components,
 * this is to allow our users to override anchor tags in
 * case they're using a routing Lib that requires using their
 * custom Link component (e.g Next, Gatsby, React Router)
 * <BuilderComponent renderLink=(props) => <myCustomLink {...props} /> />
 */
var Link = function (props) { return (react_1.default.createElement(builder_store_1.BuilderStoreContext.Consumer, null, function (context) {
    if (context.renderLink) {
        return context.renderLink(props);
    }
    return react_1.default.createElement("a", __assign({}, props));
})); };
exports.Link = Link;
//# sourceMappingURL=Link.js.map