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
exports.Img = void 0;
var react_1 = __importDefault(require("react"));
var with_builder_1 = require("../../functions/with-builder");
// TODO: srcset, alt text input, object size/position input, etc
var ImgComponent = /** @class */ (function (_super) {
    __extends(ImgComponent, _super);
    function ImgComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImgComponent.prototype.render = function () {
        var attributes = this.props.attributes || {};
        return (react_1.default.createElement("img", __assign({}, this.props.attributes, { src: this.props.image || attributes.src })));
    };
    return ImgComponent;
}(react_1.default.Component));
exports.Img = (0, with_builder_1.withBuilder)(ImgComponent, {
    // friendlyName?
    name: 'Raw:Img',
    hideFromInsertMenu: true,
    image: 'https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-insert_photo-24px.svg?alt=media&token=4e5d0ef4-f5e8-4e57-b3a9-38d63a9b9dc4',
    inputs: [
        {
            name: 'image',
            bubble: true,
            type: 'file',
            allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg'],
            required: true,
        },
    ],
    noWrap: true,
    static: true,
});
//# sourceMappingURL=Img.js.map