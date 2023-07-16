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
exports.Button = void 0;
var react_1 = __importDefault(require("react"));
var with_builder_1 = require("../functions/with-builder");
var Link_1 = require("../components/Link");
var ButtonComponent = /** @class */ (function (_super) {
    __extends(ButtonComponent, _super);
    function ButtonComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonComponent.prototype.render = function () {
        var Tag = this.props.link ? Link_1.Link : 'span';
        return (react_1.default.createElement(Tag, __assign({ role: "button", href: this.props.link, target: this.props.openLinkInNewTab ? '_blank' : undefined }, this.props.attributes), this.props.text));
    };
    return ButtonComponent;
}(react_1.default.Component));
exports.Button = (0, with_builder_1.withBuilder)(ButtonComponent, {
    name: 'Core:Button',
    image: 'https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F81a15681c3e74df09677dfc57a615b13',
    defaultStyles: {
        // TODO: make min width more intuitive and set one
        appearance: 'none',
        paddingTop: '15px',
        paddingBottom: '15px',
        paddingLeft: '25px',
        paddingRight: '25px',
        backgroundColor: '#000000',
        color: 'white',
        borderRadius: '4px',
        textAlign: 'center',
        cursor: 'pointer',
    },
    inputs: [
        {
            name: 'text',
            type: 'text',
            defaultValue: 'Click me!',
            bubble: true,
        },
        {
            name: 'link',
            type: 'url',
            bubble: true,
        },
        {
            name: 'openLinkInNewTab',
            type: 'boolean',
            defaultValue: false,
            friendlyName: 'Open link in new tab',
        },
    ],
    static: true,
    noWrap: true,
});
//# sourceMappingURL=Button.js.map