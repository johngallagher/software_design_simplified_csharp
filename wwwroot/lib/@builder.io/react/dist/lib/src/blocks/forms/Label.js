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
exports.Label = void 0;
var react_1 = __importDefault(require("react"));
var builder_react_1 = require("../../builder-react");
var with_builder_1 = require("../../functions/with-builder");
var LabelComponent = /** @class */ (function (_super) {
    __extends(LabelComponent, _super);
    function LabelComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LabelComponent.prototype.render = function () {
        return (react_1.default.createElement("label", __assign({ htmlFor: this.props.for }, this.props.attributes),
            this.props.text && (react_1.default.createElement("span", { className: "builder-label-text", dangerouslySetInnerHTML: {
                    __html: this.props.text,
                } })),
            this.props.builderBlock &&
                this.props.builderBlock.children &&
                this.props.builderBlock.children.map(function (item) { return (react_1.default.createElement(builder_react_1.BuilderBlockComponent, { key: item.id, block: item })); })));
    };
    return LabelComponent;
}(react_1.default.Component));
// TODO: strict ADA mode that enforces with custom error messages that all inputs need
// labels and names
exports.Label = (0, with_builder_1.withBuilder)(LabelComponent, {
    name: 'Form:Label',
    image: 'https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F9322342f04b545fb9a8091cd801dfb5b',
    inputs: [
        {
            name: 'text',
            type: 'html',
            richText: true,
            defaultValue: 'Label',
        },
        {
            name: 'for',
            type: 'text',
            helperText: 'The name of the input this label is for',
            advanced: true,
        },
    ],
    noWrap: true,
    static: true,
    canHaveChildren: true,
    // TODO: take inner html or blocsk
    // TODO: optional children? maybe as optional form input
    // that only shows if advanced setting is flipped
    // TODO: defaultChildren
    // canHaveChildren: true,
});
//# sourceMappingURL=Label.js.map