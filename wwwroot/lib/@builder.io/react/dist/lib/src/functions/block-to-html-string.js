"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockToHtmlString = exports.htmlEscape = void 0;
var htmlEscape = function (str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};
exports.htmlEscape = htmlEscape;
// TODO: handle self closing tags
// TODO: how allow components (e.g. react components) in templates?
var blockToHtmlString = function (block) {
    var _a;
    return "<".concat((0, exports.htmlEscape)(block.tagName || 'div'), " \n    class=\"builder-block ").concat(block.id, " ").concat(block.class || '', "\"\n    builder-id=\"").concat(block.id, "\"\n  ").concat(Object.keys(block.properties || {})
        .map(function (key) { return "".concat((0, exports.htmlEscape)(key), "=\"").concat((0, exports.htmlEscape)(block.properties[key]), "\""); })
        .join(' '), "\n  >").concat(((_a = block === null || block === void 0 ? void 0 : block.component) === null || _a === void 0 ? void 0 : _a.name) === 'Text'
        ? block.component.options.text
        : block.children
            ? block.children.map(function (item) { return (0, exports.blockToHtmlString)(item); }).join('')
            : '', "</").concat(block.tagName || 'div', ">").replace(/\s+/g, ' ');
};
exports.blockToHtmlString = blockToHtmlString;
//# sourceMappingURL=block-to-html-string.js.map