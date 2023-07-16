"use strict";
'use client';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fragment = void 0;
var react_1 = __importDefault(require("react"));
var with_builder_1 = require("../functions/with-builder");
var builder_block_component_1 = require("../components/builder-block.component");
var FragmentComponent = /** @class */ (function (_super) {
    __extends(FragmentComponent, _super);
    function FragmentComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FragmentComponent.prototype.render = function () {
        return (this.props.builderBlock &&
            this.props.builderBlock.children &&
            this.props.builderBlock.children.map(function (block, index) { return (react_1.default.createElement(builder_block_component_1.BuilderBlock, { block: block, key: block.id, index: index })); }));
    };
    return FragmentComponent;
}(react_1.default.Component));
exports.Fragment = (0, with_builder_1.withBuilder)(FragmentComponent, {
    name: 'Core:Fragment',
    canHaveChildren: true,
    noWrap: true,
    static: true,
    hideFromInsertMenu: true,
});
//# sourceMappingURL=Fragment.js.map