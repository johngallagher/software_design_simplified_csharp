"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var package_json_1 = require("../../package.json");
if (typeof window !== 'undefined') {
    (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
        type: 'builder.isReactSdk',
        data: {
            value: true,
            supportsPatchUpdates: 'v4',
            supportsCustomBreakpoints: true,
            priorVersion: package_json_1.version,
        },
    }, '*');
}
//# sourceMappingURL=init-editing.js.map