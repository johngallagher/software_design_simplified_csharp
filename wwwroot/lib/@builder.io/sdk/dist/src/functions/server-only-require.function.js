"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Webpack workaround to conditionally require certain external modules
// only on the server and not bundle them on the client
var serverOnlyRequire;
try {
    // tslint:disable-next-line:no-eval
    serverOnlyRequire = eval('require');
}
catch (err) {
    // all good
    serverOnlyRequire = (function () { return null; });
}
exports.default = serverOnlyRequire;
//# sourceMappingURL=server-only-require.function.js.map