'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeDynamicRequire = void 0;
var sdk_1 = require("@builder.io/sdk");
var noop = function () { return null; };
/*
 * The if condition below used to be
 *
 *     if (typeof globalThis.require === "function")
 *
 * That broke in case Builder was running on the server (Next, SSR use-cases) where
 * globalThis.require was undefined. Avoiding use of Builder.isServer for Cloudflare worker cases
 * That said, if change it to
 *
 * if (typeof require === 'function') {
 *   localSafeDynamicRequire = eval('require');
 * }
 *
 * Then the TSC / rollup compiler over-optimizes and replaces the if condition with true always
 * causing it to blow up on the client side. Hence this convoluted way of doing it.
 *
 * In Summary:
 *
 * 1. Node -> globalThis.require does not work
 * 2. Cloudflare edge -> only globalThis.require works
 */
if (typeof (globalThis === null || globalThis === void 0 ? void 0 : globalThis.require) === 'function' ||
    (sdk_1.Builder.isServer && typeof require === 'function')) {
    try {
        /*
          This is a hack to get around webpack bundling the require function, which is not available in the browser
          Needs to be eval'd to avoid webpack bundling it
        */
        exports.safeDynamicRequire = eval('require');
    }
    catch (e) {
        /*
          This is a patch for enviornments where eval is not allowed, like Shopify-hydrogen storefront
          Relevant issue : https://github.com/BuilderIO/builder-shopify-hydrogen/issues/12
        */
        if (globalThis === null || globalThis === void 0 ? void 0 : globalThis.require) {
            exports.safeDynamicRequire = globalThis.require;
        }
        else {
            // @ts-ignore
            exports.safeDynamicRequire = noop;
        }
    }
}
exports.safeDynamicRequire !== null && exports.safeDynamicRequire !== void 0 ? exports.safeDynamicRequire : (exports.safeDynamicRequire = noop);
//# sourceMappingURL=safe-dynamic-require.js.map