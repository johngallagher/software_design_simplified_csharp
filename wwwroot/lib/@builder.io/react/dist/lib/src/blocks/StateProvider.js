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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateProvider = void 0;
var react_1 = __importDefault(require("react"));
var builder_block_component_1 = require("../components/builder-block.component");
var builder_store_1 = require("../store/builder-store");
var with_builder_1 = require("../functions/with-builder");
var StateProviderComponent = /** @class */ (function (_super) {
    __extends(StateProviderComponent, _super);
    function StateProviderComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StateProviderComponent.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement(builder_store_1.BuilderStoreContext.Consumer, null, function (state) { return (react_1.default.createElement(builder_store_1.BuilderStoreContext.Provider, { value: __assign(__assign({}, state), { state: __assign(__assign({}, state.state), _this.props.state), context: __assign(__assign({}, state.context), _this.props.context) }) },
            _this.props.builderBlock &&
                _this.props.builderBlock.children &&
                _this.props.builderBlock.children.map(function (block, index) { return (react_1.default.createElement(builder_block_component_1.BuilderBlock, { block: block, key: block.id, index: index, child: true })); }),
            _this.props.children)); }));
    };
    return StateProviderComponent;
}(react_1.default.Component));
exports.StateProvider = (0, with_builder_1.withBuilder)(StateProviderComponent, {
    name: 'Builder:StateProvider',
    // TODO: default children
    canHaveChildren: true,
    static: true,
    noWrap: true,
    hideFromInsertMenu: true,
});
//# sourceMappingURL=StateProvider.js.map