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
exports.Text = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var sdk_1 = require("@builder.io/sdk");
var with_builder_1 = require("../functions/with-builder");
var builder_store_1 = require("../store/builder-store");
var try_eval_1 = require("../functions/try-eval");
var iconUrl = 'https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-text_fields-24px%20(1).svg?alt=media&token=12177b73-0ee3-42ca-98c6-0dd003de1929';
var TextComponent = /** @class */ (function (_super) {
    __extends(TextComponent, _super);
    function TextComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.textRef = null;
        return _this;
    }
    TextComponent.prototype.componentDidUpdate = function (prevProps) {
        if (!this.allowTextEdit) {
            return;
        }
        if (this.textRef &&
            !(this.textRef.contentEditable === 'true' && this.textRef === document.activeElement)) {
            if (this.props.text !== prevProps.text) {
                this.textRef.innerHTML = this.props.text;
            }
        }
    };
    TextComponent.prototype.componentDidMount = function () {
        if (this.textRef) {
            this.textRef.innerHTML = this.props.text;
        }
    };
    TextComponent.prototype.evalExpression = function (expression, state) {
        return String(expression).replace(/{{([^}]+)}}/g, function (match, group) { return (0, try_eval_1.tryEval)(group, state); });
    };
    Object.defineProperty(TextComponent.prototype, "allowTextEdit", {
        get: function () {
            return (sdk_1.Builder.isBrowser &&
                sdk_1.Builder.isEditing &&
                location.search.includes('builder.allowTextEdit=true') &&
                !(this.props.builderBlock &&
                    this.props.builderBlock.bindings &&
                    (this.props.builderBlock.bindings['component.options.text'] ||
                        this.props.builderBlock.bindings['options.text'] ||
                        this.props.builderBlock.bindings['text'])));
        },
        enumerable: false,
        configurable: true
    });
    TextComponent.prototype.render = function () {
        var _this = this;
        var allowEditingText = this.allowTextEdit;
        var textCSS = {
            outline: 'none',
            '& p:first-of-type, & .builder-paragraph:first-of-type': {
                margin: 0,
            },
            '& > p, & .builder-paragraph': {
                color: 'inherit',
                lineHeight: 'inherit',
                letterSpacing: 'inherit',
                fontWeight: 'inherit',
                fontSize: 'inherit',
                textAlign: 'inherit',
                fontFamily: 'inherit',
            },
        };
        return ((0, core_1.jsx)(builder_store_1.BuilderStoreContext.Consumer, null, function (state) {
            var _a;
            if ((_a = state.content.meta) === null || _a === void 0 ? void 0 : _a.rtlMode) {
                textCSS.direction = 'rtl';
            }
            return ((0, core_1.jsx)(react_1.default.Fragment, null,
                (0, core_1.jsx)("span", __assign({ ref: function (ref) {
                        _this.textRef = ref;
                    }, contentEditable: allowEditingText || undefined, onInput: function (e) {
                        var _a;
                        if (allowEditingText) {
                            (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                                type: 'builder.textEdited',
                                data: {
                                    id: _this.props.builderBlock && _this.props.builderBlock.id,
                                    value: e.currentTarget.innerHTML,
                                },
                            }, '*');
                        }
                    }, onKeyDown: function (e) {
                        if (allowEditingText &&
                            _this.textRef &&
                            e.which === 27 &&
                            document.activeElement === _this.textRef) {
                            _this.textRef.blur();
                        }
                    }, onFocus: function (e) {
                        var _a;
                        if (allowEditingText) {
                            (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                                type: 'builder.textFocused',
                                data: {
                                    id: _this.props.builderBlock && _this.props.builderBlock.id,
                                },
                            }, '*');
                        }
                    }, onBlur: function (e) {
                        var _a;
                        if (allowEditingText) {
                            (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                                type: 'builder.textBlurred',
                                data: {
                                    id: _this.props.builderBlock && _this.props.builderBlock.id,
                                },
                            }, '*');
                        }
                    }, css: textCSS, className: "builder-text" }, (!allowEditingText && {
                    dangerouslySetInnerHTML: {
                        __html: _this.evalExpression(_this.props.text || _this.props.content || '', state.state),
                    },
                })))));
        }));
    };
    return TextComponent;
}(react_1.default.Component));
exports.Text = (0, with_builder_1.withBuilder)(TextComponent, {
    name: 'Text',
    static: true,
    image: iconUrl,
    inputs: [
        {
            name: 'text',
            type: 'html',
            required: true,
            autoFocus: true,
            bubble: true,
            defaultValue: 'Enter some text...',
        },
    ],
    // Maybe optionally a function that takes in some params like block vs absolute, etc
    defaultStyles: {
        lineHeight: 'normal',
        height: 'auto',
        textAlign: 'center',
    },
});
//# sourceMappingURL=Text.js.map