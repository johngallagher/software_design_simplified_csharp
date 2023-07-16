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
Object.defineProperty(exports, "__esModule", { value: true });
exports.block = exports.el = void 0;
var el = function (options, useId) { return (__assign({ '@type': '@builder.io/sdk:Element', id: "builder-".concat(useId ? useId : Math.random().toString().split('.')[1]) }, options)); };
exports.el = el;
var block = function (name, options, elOptions, useId) {
    return (0, exports.el)(__assign(__assign({}, elOptions), { component: {
            name: name,
            options: options,
        } }), useId);
};
exports.block = block;
//# sourceMappingURL=render-block.js.map