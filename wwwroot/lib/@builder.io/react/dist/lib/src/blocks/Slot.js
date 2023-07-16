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
exports.Slot = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = require("react");
var sdk_1 = require("@builder.io/sdk");
var builder_blocks_component_1 = require("../components/builder-blocks.component");
var builder_store_1 = require("../store/builder-store");
sdk_1.Builder.registerComponent(Slot, {
    name: 'Slot',
    description: 'Allow child blocks to be inserted into this content when used as a Symbol',
    docsLink: 'https://www.builder.io/c/docs/symbols-with-blocks',
    image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F3aad6de36eae43b59b52c85190fdef56',
    // Maybe wrap this for canHaveChildren so bind children to this hm
    inputs: [{ name: 'name', type: 'string', required: true, defaultValue: 'children' }],
});
function Slot(props) {
    var name = props.name;
    var context = (0, react_1.useContext)(builder_store_1.BuilderStoreContext);
    var isEditingThisSlot = !context.context.symbolId;
    return ((0, core_1.jsx)("div", __assign({ css: {
            pointerEvents: 'auto',
        } }, (isEditingThisSlot && {
        'builder-slot': name,
    })),
        (0, core_1.jsx)(builder_blocks_component_1.BuilderBlocks, { child: true, parentElementId: context.context.symbolId, dataPath: "symbol.data.".concat(name), blocks: context.state[name] || [] })));
}
exports.Slot = Slot;
//# sourceMappingURL=Slot.js.map