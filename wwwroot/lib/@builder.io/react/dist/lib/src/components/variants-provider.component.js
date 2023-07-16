"use strict";
'use client';
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantsProvider = void 0;
var React = __importStar(require("react"));
var sdk_1 = require("@builder.io/sdk");
function getData(content) {
    if (typeof (content === null || content === void 0 ? void 0 : content.data) === 'undefined') {
        return undefined;
    }
    var _a = content.data, blocks = _a.blocks, blocksString = _a.blocksString;
    var hasBlocks = Array.isArray(blocks) || typeof blocksString === 'string';
    var newData = __assign(__assign({}, content.data), (hasBlocks && { blocks: blocks || JSON.parse(blocksString) }));
    delete newData.blocksString;
    return newData;
}
var variantsScript = function (variantsString, contentId) {
    return "\n(function() {\n  if (window.builderNoTrack || !navigator.cookieEnabled) {\n    return;\n  }\n\n  var variants = ".concat(variantsString, ";\n  function removeVariants() {\n    variants.forEach(function (template) {\n      document.querySelector('template[data-template-variant-id=\"' + template.id + '\"]').remove();\n    });\n    document.getElementById('variants-script-").concat(contentId, "').remove();\n  }\n\n  if (typeof document.createElement(\"template\").content === 'undefined') {\n    removeVariants();\n    return ;\n  }\n\n  function setCookie(name,value,days) {\n    var expires = \"\";\n    if (days) {\n        var date = new Date();\n        date.setTime(date.getTime() + (days*24*60*60*1000));\n        expires = \"; expires=\" + date.toUTCString();\n    }\n    document.cookie = name + \"=\" + (value || \"\")  + expires + \"; path=/\" + \"; Secure; SameSite=None\";\n  }\n\n  function getCookie(name) {\n    var nameEQ = name + \"=\";\n    var ca = document.cookie.split(';');\n    for(var i=0;i < ca.length;i++) {\n        var c = ca[i];\n        while (c.charAt(0)==' ') c = c.substring(1,c.length);\n        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);\n    }\n    return null;\n  }\n  var cookieName = 'builder.tests.").concat(contentId, "';\n  var variantInCookie = getCookie(cookieName);\n  var availableIDs = variants.map(function(vr) { return vr.id }).concat('").concat(contentId, "');\n  var variantId;\n  if (availableIDs.indexOf(variantInCookie) > -1) {\n    variantId = variantInCookie;\n  }\n  if (!variantId) {\n    var n = 0;\n    var random = Math.random();\n    for (var i = 0; i < variants.length; i++) {\n      var variant = variants[i];\n      var testRatio = variant.testRatio;\n      n += testRatio;\n      if (random < n) {\n        setCookie(cookieName, variant.id);\n        variantId = variant.id;\n        break;\n      }\n    }\n    if (!variantId) {\n      variantId = \"").concat(contentId, "\";\n      setCookie(cookieName, \"").concat(contentId, "\");\n    }\n  }\n  if (variantId && variantId !== \"").concat(contentId, "\") {\n    var winningTemplate = document.querySelector('template[data-template-variant-id=\"' + variantId + '\"]');\n    if (winningTemplate) {\n      var parentNode = winningTemplate.parentNode;\n      var newParent = parentNode.cloneNode(false);\n      newParent.appendChild(winningTemplate.content.firstChild);\n      parentNode.parentNode.replaceChild(newParent, parentNode);\n    }\n  } else if (variants.length > 0) {\n    removeVariants();\n  }\n})()").replace(/\s+/g, ' ');
};
var VariantsProvider = function (_a) {
    var initialContent = _a.initialContent, children = _a.children;
    if (sdk_1.Builder.isBrowser && !sdk_1.builder.canTrack) {
        return children([initialContent]);
    }
    var hasTests = Boolean(Object.keys((initialContent === null || initialContent === void 0 ? void 0 : initialContent.variations) || {}).length);
    if (!hasTests)
        return children([initialContent]);
    var variants = Object.keys(initialContent.variations).map(function (id) { return (__assign(__assign({ id: id }, initialContent.variations[id]), { data: getData(initialContent.variations[id]) })); });
    var allVariants = __spreadArray(__spreadArray([], variants, true), [initialContent], false);
    if (sdk_1.Builder.isServer) {
        var variantsJson_1 = JSON.stringify(Object.keys(initialContent.variations || {}).map(function (item) { return ({
            id: item,
            testRatio: initialContent.variations[item].testRatio,
        }); }));
        var renderScript = function () { return (React.createElement("script", { id: "variants-script-".concat(initialContent.id), dangerouslySetInnerHTML: {
                __html: variantsScript(variantsJson_1, initialContent.id),
            } })); };
        // render all variants on the server side
        return React.createElement(React.Fragment, null, children(allVariants, renderScript));
    }
    var cookieName = "builder.tests.".concat(initialContent.id);
    var variantId = sdk_1.builder.getCookie(cookieName);
    if (!variantId && sdk_1.Builder.isBrowser) {
        var n = 0;
        var random = Math.random();
        for (var i = 0; i < variants.length; i++) {
            var variant = variants[i];
            var testRatio = variant.testRatio;
            n += testRatio;
            if (random < n) {
                sdk_1.builder.setCookie(cookieName, variant.id);
                variantId = variant.id;
                break;
            }
        }
    }
    if (!variantId) {
        // render initial content when no winning variation or on the server
        variantId = initialContent.id;
        sdk_1.builder.setCookie(cookieName, variantId);
    }
    return children([allVariants.find(function (item) { return item.id === variantId; })]);
};
exports.VariantsProvider = VariantsProvider;
//# sourceMappingURL=variants-provider.component.js.map