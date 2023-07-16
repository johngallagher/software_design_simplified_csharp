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
exports.FormSubmitButton = void 0;
var react_1 = __importDefault(require("react"));
var with_builder_1 = require("../../functions/with-builder");
var FormSubmitButtonComponent = /** @class */ (function (_super) {
    __extends(FormSubmitButtonComponent, _super);
    function FormSubmitButtonComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormSubmitButtonComponent.prototype.render = function () {
        return (react_1.default.createElement("button", __assign({ type: "submit" }, this.props.attributes), this.props.text));
    };
    return FormSubmitButtonComponent;
}(react_1.default.Component));
exports.FormSubmitButton = (0, with_builder_1.withBuilder)(FormSubmitButtonComponent, {
    name: 'Form:SubmitButton',
    image: 'https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fdf2820ffed1f4349a94c40b3221f5b98',
    defaultStyles: {
        appearance: 'none',
        paddingTop: '15px',
        paddingBottom: '15px',
        paddingLeft: '25px',
        paddingRight: '25px',
        backgroundColor: '#3898EC',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    inputs: [
        {
            name: 'text',
            type: 'text',
            defaultValue: 'Click me',
        },
    ],
    static: true,
    noWrap: true,
    // TODO: optional children? maybe as optional form input
    // that only shows if advanced setting is flipped
    // TODO: defaultChildren
    // canHaveChildren: true,
});
//# sourceMappingURL=Button.js.map