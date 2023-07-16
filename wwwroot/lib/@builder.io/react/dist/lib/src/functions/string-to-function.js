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
exports.stringToFunction = exports.api = void 0;
var sdk_1 = require("@builder.io/sdk");
var safe_dynamic_require_1 = require("./safe-dynamic-require");
var fnCache = {};
var api = function (state) { return sdk_1.builder; };
exports.api = api;
function stringToFunction(str, expression, errors, logs) {
    if (expression === void 0) { expression = true; }
    /* TODO: objedct */
    if (!str || !str.trim()) {
        return function () { return undefined; };
    }
    var cacheKey = str + ':' + expression;
    if (fnCache[cacheKey]) {
        return fnCache[cacheKey];
    }
    // FIXME: gross hack
    var useReturn = (expression &&
        !(str.includes(';') || str.includes(' return ') || str.trim().startsWith('return '))) ||
        str.trim().startsWith('builder.run');
    var fn = function () {
        /* intentionally empty */
    };
    try {
        // tslint:disable-next-line:no-function-constructor-with-string-args
        if (sdk_1.Builder.isBrowser) {
            // TODO: use strict and eval
            fn = new Function('state', 'event', 'block', 'builder', 'Device', 'update', 'Builder', 'context', 
            // TODO: remove the with () {} - make a page v3 that doesn't use this
            // Or only do if can't find state\s*\. anywhere hm
            "\n          var names = [\n            'state',\n            'event',\n            'block',\n            'builder',\n            'Device',\n            'update',\n            'Builder',\n            'context'\n          ];\n          var rootState = state;\n          if (typeof Proxy !== 'undefined') {\n            rootState = new Proxy(rootState, {\n              set: function () {\n                return false;\n              },\n              get: function (target, key) {\n                if (names.includes(key)) {\n                  return undefined;\n                }\n                return target[key];\n              }\n            });\n          }\n          /* Alias */\n          var ctx = context;\n          with (rootState) {\n            ".concat(useReturn ? "return (".concat(str, ");") : str, ";\n          }\n        "));
        }
    }
    catch (error) {
        if (errors) {
            errors.push(error);
        }
        var message = error && error.message;
        if (message && typeof message === 'string') {
            if (logs && logs.indexOf(message) === -1) {
                logs.push(message);
            }
        }
        if (sdk_1.Builder.isBrowser) {
            console.warn("Function compile error in ".concat(str), error);
        }
    }
    var final = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            if (sdk_1.Builder.isBrowser) {
                return fn.apply(void 0, args);
            }
            else {
                // TODO: memoize on server
                // TODO: use something like this instead https://www.npmjs.com/package/rollup-plugin-strip-blocks
                // There must be something more widely used?
                // TODO: regex for between comments instead so can still type check the code... e.g. //SERVER-START ... code ... //SERVER-END
                // Below is a hack to get certain code to *only* load in the server build, to not screw with
                // browser bundler's like rollup and webpack. Our rollup plugin strips these comments only
                // for the server build
                // TODO: cache these for better performancs with new VmScript
                // tslint:disable:comment-format
                var VM = (0, safe_dynamic_require_1.safeDynamicRequire)('vm2').VM;
                var state = args[0], event_1 = args[1], _block = args[2], _builder = args[3], _Device = args[4], _update = args[5], _Builder = args[6], context = args[7];
                return new VM({
                    timeout: 100,
                    sandbox: __assign(__assign(__assign(__assign(__assign({}, state), { state: state }), { context: context }), { builder: exports.api }), { event: event_1 }),
                }).run(str.replace(/(^|;)return /, '$1'));
                // tslint:enable:comment-format
            }
        }
        catch (error) {
            if (sdk_1.Builder.isBrowser) {
                console.warn('Builder custom code error:', error.message || error, 'in', str, error.stack || error);
            }
            else {
                if (typeof process !== 'undefined' &&
                    typeof process.env !== 'undefined' &&
                    process.env.DEBUG) {
                    console.debug('Builder custom code error:', error.message || error, 'in', str, error.stack || error);
                }
            }
            if (errors) {
                errors.push(error);
            }
            return null;
        }
    };
    if (sdk_1.Builder.isBrowser) {
        fnCache[cacheKey] = final;
    }
    return final;
}
exports.stringToFunction = stringToFunction;
//# sourceMappingURL=string-to-function.js.map