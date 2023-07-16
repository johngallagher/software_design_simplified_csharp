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
exports.FormInput = void 0;
var react_1 = __importDefault(require("react"));
var sdk_1 = require("@builder.io/sdk");
var with_builder_1 = require("../../functions/with-builder");
var FormInputComponent = /** @class */ (function (_super) {
    __extends(FormInputComponent, _super);
    function FormInputComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormInputComponent.prototype.render = function () {
        return (react_1.default.createElement("input", __assign({ key: sdk_1.Builder.isEditing && this.props.defaultValue ? this.props.defaultValue : 'default-key', placeholder: this.props.placeholder, type: this.props.type, name: this.props.name, value: this.props.value, defaultValue: this.props.defaultValue, required: this.props.required }, this.props.attributes)));
    };
    return FormInputComponent;
}(react_1.default.Component));
exports.FormInput = (0, with_builder_1.withBuilder)(FormInputComponent, {
    name: 'Form:Input',
    image: 'https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fad6f37889d9e40bbbbc72cdb5875d6ca',
    inputs: [
        {
            name: 'type',
            type: 'text',
            enum: [
                'text',
                'number',
                'email',
                'url',
                'checkbox',
                'radio',
                'range',
                'date',
                'datetime-local',
                'search',
                'tel',
                'time',
                'file',
                'month',
                'week',
                'password',
                'color',
                'hidden',
            ],
            defaultValue: 'text',
        },
        {
            name: 'name',
            type: 'string',
            required: true,
            helperText: 'Every input in a form needs a unique name describing what it takes, e.g. "email"',
        },
        {
            name: 'placeholder',
            type: 'string',
            defaultValue: 'Hello there',
            helperText: 'Text to display when there is no value',
        },
        // TODO: handle value vs default value automatically like ng-model
        {
            name: 'defaultValue',
            type: 'string',
        },
        {
            name: 'value',
            type: 'string',
            advanced: true,
        },
        {
            name: 'required',
            type: 'boolean',
            helperText: 'Is this input required to be filled out to submit a form',
            defaultValue: false,
        },
    ],
    // TODO
    // TODO: call editorHooks?
    // ...({
    //   hooks: {
    //     'ElementLayout:shiftBottomSide': (element: Element, amount: number, snap: boolean) => {
    //       // TODO: either update line height or split the padding padding on bottom sides hmm
    //     }
    //   } as any,
    // }),
    noWrap: true,
    static: true,
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
});
//# sourceMappingURL=Input.js.map