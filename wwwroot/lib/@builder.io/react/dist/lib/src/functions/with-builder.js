"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBuilder = void 0;
var builder_block_decorator_1 = require("../decorators/builder-block.decorator");
function withBuilder(component, options) {
    (0, builder_block_decorator_1.BuilderBlock)(options)(component);
    return component;
}
exports.withBuilder = withBuilder;
//# sourceMappingURL=with-builder.js.map