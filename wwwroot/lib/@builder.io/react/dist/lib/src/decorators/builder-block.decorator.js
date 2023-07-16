"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderBlock = void 0;
var sdk_1 = require("@builder.io/sdk");
function BuilderBlock(options) {
    options.type = 'react';
    return sdk_1.Builder.Component(options);
}
exports.BuilderBlock = BuilderBlock;
//# sourceMappingURL=builder-block.decorator.js.map