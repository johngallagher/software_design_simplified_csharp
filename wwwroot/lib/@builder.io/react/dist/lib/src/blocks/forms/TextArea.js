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
exports.TextArea = void 0;
var react_1 = __importDefault(require("react"));
var with_builder_1 = require("../../functions/with-builder");
var TextAreaComponent = /** @class */ (function (_super) {
    __extends(TextAreaComponent, _super);
    function TextAreaComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextAreaComponent.prototype.render = function () {
        return (react_1.default.createElement("textarea", __assign({ placeholder: this.props.placeholder, name: this.props.name, value: this.props.value, defaultValue: this.props.defaultValue }, this.props.attributes)));
    };
    return TextAreaComponent;
}(react_1.default.Component));
exports.TextArea = (0, with_builder_1.withBuilder)(TextAreaComponent, {
    name: 'Form:TextArea',
    image: 'https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Ff74a2f3de58c4c3e939204e5b6b8f6c3',
    inputs: [
        {
            advanced: true,
            name: 'value',
            type: 'string',
        },
        {
            name: 'name',
            type: 'string',
            required: true,
            helperText: 'Every input in a form needs a unique name describing what it gets, e.g. "email"',
        },
        {
            name: 'defaultValue',
            type: 'string',
        },
        {
            name: 'placeholder',
            type: 'string',
            defaultValue: 'Hello there',
        },
        {
            name: 'required',
            type: 'boolean',
            defaultValue: false,
        },
    ],
    defaultStyles: {
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        borderRadius: '3px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#ccc',
    },
    static: true,
    noWrap: true,
});
//# sourceMappingURL=TextArea.js.map