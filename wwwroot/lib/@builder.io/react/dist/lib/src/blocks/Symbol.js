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
exports.Symbol = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var builder_component_component_1 = require("../components/builder-component.component");
var sdk_1 = require("@builder.io/sdk");
var hash_sum_1 = __importDefault(require("hash-sum"));
var no_wrap_1 = require("../components/no-wrap");
var builder_store_1 = require("../store/builder-store");
var with_builder_1 = require("../functions/with-builder");
var size = function (thing) { return Object.keys(thing).length; };
var isShopify = sdk_1.Builder.isBrowser && 'Shopify' in window;
var refs = {};
if (sdk_1.Builder.isBrowser) {
    try {
        Array.from(document.querySelectorAll('[builder-static-symbol]')).forEach(function (el) {
            var id = el.getAttribute('builder-static-symbol');
            if (id) {
                refs[id] = el;
            }
        });
    }
    catch (err) {
        console.error('Builder replace nodes error:', err);
    }
}
var SymbolComponent = /** @class */ (function (_super) {
    __extends(SymbolComponent, _super);
    function SymbolComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ref = null;
        _this.staticRef = null;
        return _this;
    }
    Object.defineProperty(SymbolComponent.prototype, "placeholder", {
        get: function () {
            return ((0, core_1.jsx)("div", { css: { padding: 10 } }, "Symbols let you reuse dynamic elements across your content. Please choose a model and entry for this symbol."));
        },
        enumerable: false,
        configurable: true
    });
    SymbolComponent.prototype.componentDidMount = function () {
        var _a, _b, _c;
        if (this.useStatic && this.staticRef && refs[(_a = this.props.builderBlock) === null || _a === void 0 ? void 0 : _a.id]) {
            (_b = this.staticRef.parentNode) === null || _b === void 0 ? void 0 : _b.replaceChild(refs[(_c = this.props.builderBlock) === null || _c === void 0 ? void 0 : _c.id], this.staticRef);
        }
    };
    Object.defineProperty(SymbolComponent.prototype, "useStatic", {
        get: function () {
            var _a;
            return Boolean(sdk_1.Builder.isBrowser &&
                refs[(_a = this.props.builderBlock) === null || _a === void 0 ? void 0 : _a.id] &&
                !(sdk_1.Builder.isEditing || sdk_1.Builder.isPreviewing));
        },
        enumerable: false,
        configurable: true
    });
    SymbolComponent.prototype.render = function () {
        var _this = this;
        var _a;
        if (this.useStatic) {
            return (0, core_1.jsx)("div", { ref: function (el) { return (_this.staticRef = el); } });
        }
        var symbol = this.props.symbol;
        var showPlaceholder = false;
        if (!symbol) {
            showPlaceholder = true;
        }
        var TagName = this.props.dataOnly
            ? no_wrap_1.NoWrap
            : (this.props.builderBlock && this.props.builderBlock.tagName) || 'div';
        var _b = symbol || {}, model = _b.model, entry = _b.entry, data = _b.data, content = _b.content, inline = _b.inline;
        var dynamic = (symbol === null || symbol === void 0 ? void 0 : symbol.dynamic) || this.props.dynamic;
        if (!(model && (entry || dynamic)) && !((_a = content === null || content === void 0 ? void 0 : content.data) === null || _a === void 0 ? void 0 : _a.blocksJs) && !inline) {
            showPlaceholder = true;
        }
        var key = dynamic ? undefined : [model, entry].join(':');
        var dataString = sdk_1.Builder.isEditing ? null : data && size(data) && (0, hash_sum_1.default)(data);
        if (key && dataString && dataString.length < 300) {
            key += ':' + dataString;
        }
        var attributes = this.props.attributes || {};
        return ((0, core_1.jsx)(builder_store_1.BuilderStoreContext.Consumer, { key: (model || 'no model') + ':' + (entry || 'no entry') }, function (state) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            var builderComponentKey = "".concat(key, "_").concat(((_a = state === null || state === void 0 ? void 0 : state.state) === null || _a === void 0 ? void 0 : _a.locale) || 'Default');
            return ((0, core_1.jsx)(TagName, __assign({ "data-model": model }, attributes, { className: (attributes.class || attributes.className || '') +
                    ' builder-symbol' +
                    ((symbol === null || symbol === void 0 ? void 0 : symbol.inline) ? ' builder-inline-symbol' : '') +
                    ((symbol === null || symbol === void 0 ? void 0 : symbol.dynamic) || _this.props.dynamic ? ' builder-dynamic-symbol' : '') }), showPlaceholder ? (_this.placeholder) : ((0, core_1.jsx)(builder_component_component_1.BuilderComponent, __assign({}, (((_b = state.state) === null || _b === void 0 ? void 0 : _b.locale) && { locale: state.state.locale }), { isChild: true, ref: function (ref) { return (_this.ref = ref); }, context: __assign(__assign({}, state.context), { symbolId: (_c = _this.props.builderBlock) === null || _c === void 0 ? void 0 : _c.id }), modelName: model, entry: entry, data: __assign(__assign(__assign({}, data), (!!_this.props.inheritState && state.state)), (_j = (_h = (_g = (_f = (_e = (_d = _this.props.builderBlock) === null || _d === void 0 ? void 0 : _d.component) === null || _e === void 0 ? void 0 : _e.options) === null || _f === void 0 ? void 0 : _f.symbol) === null || _g === void 0 ? void 0 : _g.content) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.state), renderLink: state.renderLink, inlineContent: symbol === null || symbol === void 0 ? void 0 : symbol.inline }, (content && { content: content }), { key: builderComponentKey, options: { key: builderComponentKey, noEditorUpdates: true }, codegen: !!((_k = content === null || content === void 0 ? void 0 : content.data) === null || _k === void 0 ? void 0 : _k.blocksJs), hydrate: (_l = state.state) === null || _l === void 0 ? void 0 : _l._hydrate, builderBlock: _this.props.builderBlock, dataOnly: _this.props.dataOnly }), _this.props.children))));
        }));
    };
    return SymbolComponent;
}(react_1.default.Component));
exports.Symbol = (0, with_builder_1.withBuilder)(SymbolComponent, {
    // Builder:Symbol
    name: 'Symbol',
    noWrap: true,
    static: true,
    // TODO: allow getter for icon so different icon if data symbol hm,
    // Maybe "this" context is the block element in editor, and it's the
    // builderBlock json otherwise. In BuilderBlock decorator find any getters
    // and convert to strings when passing and convert back to getters after
    // with `this` bound
    inputs: [
        {
            name: 'symbol',
            type: 'uiSymbol',
        },
        {
            name: 'dataOnly',
            helperText: "Make this a data symbol that doesn't display any UI",
            type: 'boolean',
            defaultValue: false,
            advanced: true,
            hideFromUI: true,
        },
        {
            name: 'inheritState',
            helperText: "Inherit the parent component state and data",
            type: 'boolean',
            defaultValue: isShopify,
            advanced: true,
        },
        {
            name: 'renderToLiquid',
            helperText: 'Render this symbols contents to liquid. Turn off to fetch with javascript and use custom targeting',
            type: 'boolean',
            defaultValue: isShopify,
            advanced: true,
            hideFromUI: true,
        },
        {
            name: 'useChildren',
            hideFromUI: true,
            type: 'boolean',
        },
    ],
});
//# sourceMappingURL=Symbol.js.map