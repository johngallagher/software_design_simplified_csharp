"use strict";
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
exports.BuilderBlocks = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var sdk_1 = require("@builder.io/sdk");
var builder_block_component_1 = require("./builder-block.component");
var react_dom_1 = __importDefault(require("react-dom"));
var builder_store_1 = require("../store/builder-store");
// TODO: options to set direciotn
var BuilderBlocks = /** @class */ (function (_super) {
    __extends(BuilderBlocks, _super);
    function BuilderBlocks() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onClickEmptyBlocks = function () {
            var _a;
            if (sdk_1.Builder.isIframe && _this.noBlocks) {
                (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                    type: 'builder.clickEmptyBlocks',
                    data: {
                        parentElementId: _this.parentId,
                        dataPath: _this.path,
                    },
                }, '*');
            }
        };
        _this.onHoverEmptyBlocks = function () {
            var _a;
            if (sdk_1.Builder.isEditing && _this.noBlocks) {
                (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                    type: 'builder.hoverEmptyBlocks',
                    data: {
                        parentElementId: _this.parentId,
                        dataPath: _this.path,
                    },
                }, '*');
            }
        };
        return _this;
    }
    Object.defineProperty(BuilderBlocks.prototype, "isRoot", {
        get: function () {
            return !this.props.child;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderBlocks.prototype, "noBlocks", {
        get: function () {
            var blocks = this.props.blocks;
            return !(blocks && blocks.length); // TODO: allow react nodes
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderBlocks.prototype, "path", {
        get: function () {
            var pathPrefix = 'component.options.';
            var path = this.props.dataPath || '';
            var thisPrefix = 'this.';
            if (path.trim()) {
                if (path.startsWith(thisPrefix)) {
                    path = path.replace(thisPrefix, '');
                }
                else if (!path.startsWith(pathPrefix)) {
                    path = pathPrefix + path;
                }
            }
            return path;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderBlocks.prototype, "parentId", {
        get: function () {
            if (this.props.parentElementId) {
                return this.props.parentElementId;
            }
            return this.props.parent && this.props.parent.id;
        },
        enumerable: false,
        configurable: true
    });
    // <!-- Builder Blocks --> in comments hmm
    BuilderBlocks.prototype.render = function () {
        var _this = this;
        var blocks = this.props.blocks;
        var TagName = this.props.emailMode ? 'span' : 'div';
        // TODO: how deep check this automatically for mobx... hmmm optional / peer dependency?
        return (
        // TODO: component <Stack direction="vertical">
        // TODO: react.fragment instead?
        (0, core_1.jsx)(TagName, __assign({ className: 'builder-blocks' +
                (this.noBlocks ? ' no-blocks' : '') +
                (this.props.child ? ' builder-blocks-child' : '') +
                (this.props.className ? ' ' + this.props.className : ''), "builder-type": "blocks", "builder-path": sdk_1.Builder.isIframe ? this.path : undefined, "builder-parent-id": this.parentId, css: __assign(__assign({}, (!this.props.emailMode && {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
            })), this.props.style), onClick: function () {
                if (_this.noBlocks) {
                    _this.onClickEmptyBlocks();
                }
            } }, (sdk_1.Builder.isEditing && {
            onMouseEnter: function () { return _this.onHoverEmptyBlocks(); },
        })), (blocks &&
            Array.isArray(blocks) &&
            blocks.map(function (block, index) {
                return block && block['@type'] === '@builder.io/sdk:Element' ? ((0, core_1.jsx)(builder_block_component_1.BuilderBlock, { key: block.id, block: block, index: index, fieldName: _this.props.fieldName, child: _this.props.child, emailMode: _this.props.emailMode })) : (block);
            })) ||
            blocks));
    };
    BuilderBlocks.renderInto = function (elementOrSelector, props, builderState) {
        if (props === void 0) { props = {}; }
        if (!elementOrSelector) {
            return;
        }
        var element = null;
        if (typeof elementOrSelector === 'string') {
            element = document.querySelector(elementOrSelector);
        }
        else {
            if (elementOrSelector instanceof Element) {
                element = elementOrSelector;
            }
        }
        return react_dom_1.default.render((0, core_1.jsx)(builder_store_1.BuilderStoreContext.Provider, { value: builderState },
            (0, core_1.jsx)(BuilderBlocks, __assign({}, props))), element);
    };
    return BuilderBlocks;
}(react_1.default.Component));
exports.BuilderBlocks = BuilderBlocks;
//# sourceMappingURL=builder-blocks.component.js.map