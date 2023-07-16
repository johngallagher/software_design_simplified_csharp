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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryEval = void 0;
var sdk_1 = require("@builder.io/sdk");
var safe_dynamic_require_1 = require("./safe-dynamic-require");
var tryEval = function (str, data, errors) {
    if (data === void 0) { data = {}; }
    var value = str;
    if (!(typeof value === 'string' && value.trim())) {
        return;
    }
    var useReturn = !(value.includes(';') || value.includes(' return '));
    var fn = function () {
        /* Intentionally empty */
    };
    try {
        if (sdk_1.Builder.isBrowser) {
            // tslint:disable-next-line:no-function-constructor-with-string-args
            // TODO: VM in node......
            fn = new Function('state', 
            // TODO: remove the with () {} - make a page v3 that doesn't use this
            "var rootState = state;\n        if (typeof Proxy !== 'undefined') {\n          rootState = new Proxy(rootState, {\n            set: function () {\n              return false;\n            },\n            get: function (target, key) {\n              if (key === 'state') {\n                return state;\n              }\n              return target[key]\n            }\n          });\n        }\n        with (rootState) {\n          ".concat(useReturn ? "return (".concat(str, ");") : str, ";\n        }"));
        }
    }
    catch (error) {
        if (sdk_1.Builder.isBrowser) {
            console.warn('Could not compile javascript', error);
        }
        else {
            // Add to req.options.errors to return to client
        }
    }
    try {
        if (sdk_1.Builder.isBrowser) {
            return fn(data || {});
        }
        else {
            // Below is a hack to get certain code to *only* load in the server build, to not screw with
            // browser bundler's like rollup and webpack. Our rollup plugin strips these comments only
            // for the server build
            // tslint:disable:comment-format
            var VM = (0, safe_dynamic_require_1.safeDynamicRequire)('vm2').VM;
            return new VM({
                sandbox: __assign(__assign({}, data), { state: data }),
                // TODO: convert reutrn to module.exports on server
            }).run(value.replace(/(^|;)return /, '$1'));
            // tslint:enable:comment-format
        }
    }
    catch (error) {
        if (errors) {
            errors.push(error);
        }
        if (sdk_1.Builder.isBrowser) {
            console.warn('Builder custom code error:', error.message, 'in', str, error.stack);
        }
        else {
            if (typeof process !== 'undefined' &&
                typeof process.env !== 'undefined' &&
                process.env.DEBUG) {
                console.debug('Builder custom code error:', error.message, 'in', str, error.stack);
            }
            // Add to req.options.errors to return to client
        }
    }
    return;
};
exports.tryEval = tryEval;
//# sourceMappingURL=try-eval.js.map