"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawText = void 0;
var React = __importStar(require("react"));
var sdk_1 = require("@builder.io/sdk");
var RawText = function (props) {
    var attributes = props.attributes || {};
    return (React.createElement("span", { className: (attributes === null || attributes === void 0 ? void 0 : attributes.class) || (attributes === null || attributes === void 0 ? void 0 : attributes.className), dangerouslySetInnerHTML: { __html: props.text || '' } }));
};
exports.RawText = RawText;
sdk_1.Builder.registerComponent(exports.RawText, {
    name: 'Builder:RawText',
    hideFromInsertMenu: true,
    inputs: [
        {
            name: 'text',
            bubble: true,
            type: 'longText',
            required: true,
        },
    ],
});
//# sourceMappingURL=RawText.js.map