"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFetch = void 0;
var promise_class_1 = __importDefault(require("../classes/promise.class"));
var server_only_require_function_1 = __importDefault(require("./server-only-require.function"));
function promiseResolve(value) {
    return new promise_class_1.default(function (resolve) { return resolve(value); });
}
// Adapted from https://raw.githubusercontent.com/developit/unfetch/master/src/index.mjs
function tinyFetch(url, options) {
    if (options === void 0) { options = {}; }
    return new promise_class_1.default(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open(options.method || 'get', url, true);
        if (options.headers) {
            for (var i in options.headers) {
                request.setRequestHeader(i, options.headers[i]);
            }
        }
        request.withCredentials = options.credentials === 'include';
        request.onload = function () {
            resolve(response());
        };
        request.onerror = reject;
        request.send(options.body);
        function response() {
            var keys = [];
            var all = [];
            var headers = {};
            var header = undefined;
            request
                .getAllResponseHeaders()
                .replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function (_match, _key, value) {
                var key = _key;
                keys.push((key = key.toLowerCase()));
                all.push([key, value]);
                header = headers[key];
                headers[key] = header ? "".concat(header, ",").concat(value) : value;
                return '';
            });
            return {
                ok: ((request.status / 100) | 0) === 2,
                status: request.status,
                statusText: request.statusText,
                url: request.responseURL,
                clone: response,
                text: function () { return promiseResolve(request.responseText); },
                json: function () { return promiseResolve(request.responseText).then(JSON.parse); },
                blob: function () { return promiseResolve(new Blob([request.response])); },
                headers: {
                    keys: function () { return keys; },
                    entries: function () { return all; },
                    get: function (n) { return headers[n.toLowerCase()]; },
                    has: function (n) { return n.toLowerCase() in headers; },
                },
            };
        }
    });
}
function getFetch() {
    // If fetch is defined, in the browser, via polyfill, or in a Cloudflare worker, use it.
    var _fetch = undefined;
    if (globalThis.fetch) {
        _fetch !== null && _fetch !== void 0 ? _fetch : (_fetch = globalThis.fetch);
    }
    else if (typeof window === 'undefined') {
        // If fetch is not defined, in a Node.js environment, use node-fetch.
        try {
            // node-fetch@^3 is ESM only, and will throw error on require.
            _fetch !== null && _fetch !== void 0 ? _fetch : (_fetch = (0, server_only_require_function_1.default)('node-fetch'));
        }
        catch (e) {
            // If node-fetch is not installed, use tiny-fetch.
            console.warn('node-fetch is not installed. consider polyfilling fetch or installing node-fetch.');
            console.warn(e);
        }
    }
    // Otherwise, use tiny-fetch.
    return _fetch !== null && _fetch !== void 0 ? _fetch : tinyFetch;
}
exports.getFetch = getFetch;
//# sourceMappingURL=fetch.function.js.map