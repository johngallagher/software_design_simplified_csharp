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
exports.FormSelect = void 0;
var react_1 = __importDefault(require("react"));
var sdk_1 = require("@builder.io/sdk");
var with_builder_1 = require("../../functions/with-builder");
var FormSelectComponent = /** @class */ (function (_super) {
    __extends(FormSelectComponent, _super);
    function FormSelectComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormSelectComponent.prototype.render = function () {
        var options = this.props.options;
        return (react_1.default.createElement("select", __assign({ value: this.props.value, key: sdk_1.Builder.isEditing && this.props.defaultValue ? this.props.defaultValue : 'default-key', defaultValue: this.props.defaultValue, name: this.props.name }, this.props.attributes), options &&
            options.map(function (option) { return (react_1.default.createElement("option", { value: option.value }, option.name || option.value)); })));
    };
    return FormSelectComponent;
}(react_1.default.Component));
exports.FormSelect = (0, with_builder_1.withBuilder)(FormSelectComponent, {
    name: 'Form:Select',
    image: 'https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F83acca093fb24aaf94dee136e9a4b045',
    defaultStyles: {
        alignSelf: 'flex-start',
    },
    inputs: [
        {
            name: 'options',
            type: 'list',
            required: true,
            subFields: [
                {
                    name: 'value',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'name',
                    type: 'text',
                },
            ],
            defaultValue: [
                {
                    value: 'option 1',
                },
                {
                    value: 'option 2',
                },
            ],
        },
        {
            name: 'name',
            type: 'string',
            required: true,
            helperText: 'Every select in a form needs a unique name describing what it gets, e.g. "email"',
        },
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
            defaultValue: false,
        },
    ],
    static: true,
    noWrap: true,
});
//# sourceMappingURL=Select.js.map