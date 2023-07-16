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
exports.CustomCode = void 0;
var react_1 = __importDefault(require("react"));
var sdk_1 = require("@builder.io/sdk");
var with_builder_1 = require("../functions/with-builder");
// TODO: settings context to pass this down. do in shopify-specific generated code
var globalReplaceNodes = {} || null;
var isShopify = sdk_1.Builder.isBrowser && 'Shopify' in window;
if (sdk_1.Builder.isBrowser && globalReplaceNodes) {
    var customCodeQuerySelector_1 = '.builder-custom-code';
    try {
        var allCustomCodeElements_1 = Array.from(document.querySelectorAll(customCodeQuerySelector_1));
        // Search each template element (if present) for custom code blocks since
        // querySelectorAll cannot search all templates that we use for variations, because they are
        // considered document fragments and are not a part of the DOM.
        var builderTemplates = document.querySelectorAll('template[data-template-variant-id]');
        if (builderTemplates.length) {
            Array.from(builderTemplates).forEach(function (template) {
                var content = template.content;
                var codeElements = content.querySelectorAll(customCodeQuerySelector_1);
                if (codeElements.length) {
                    allCustomCodeElements_1 = allCustomCodeElements_1.concat(Array.from(codeElements));
                }
            });
        }
        allCustomCodeElements_1.forEach(function (el) {
            var parent = el.parentElement;
            var id = parent && parent.getAttribute('builder-id');
            if (id) {
                globalReplaceNodes[id] = globalReplaceNodes[id] || [];
                globalReplaceNodes[id].push(isShopify ? el : el.cloneNode(true));
            }
        });
    }
    catch (err) {
        console.error('Builder replace nodes error:', err);
    }
}
var CustomCodeComponent = /** @class */ (function (_super) {
    __extends(CustomCodeComponent, _super);
    function CustomCodeComponent(props) {
        var _this = this;
        var _a;
        _this = _super.call(this, props) || this;
        _this.elementRef = null;
        _this.originalRef = null;
        _this.scriptsInserted = new Set();
        _this.scriptsRun = new Set();
        _this.firstLoad = true;
        _this.replaceNodes = false;
        _this.state = {
            hydrated: false,
        };
        if (sdk_1.Builder.isBrowser) {
            var id = (_a = _this.props.builderBlock) === null || _a === void 0 ? void 0 : _a.id;
            _this.replaceNodes = Boolean(sdk_1.Builder.isBrowser && (props.replaceNodes || isShopify) && id && (globalReplaceNodes === null || globalReplaceNodes === void 0 ? void 0 : globalReplaceNodes[id]));
            if (_this.firstLoad && _this.props.builderBlock) {
                if (id && (globalReplaceNodes === null || globalReplaceNodes === void 0 ? void 0 : globalReplaceNodes[id])) {
                    var el = globalReplaceNodes[id].shift() || null;
                    _this.originalRef = el;
                    if (globalReplaceNodes[id].length === 0) {
                        delete globalReplaceNodes[id];
                    }
                }
                else if (_this.replaceNodes) {
                    var existing = document.querySelectorAll(".".concat(_this.props.builderBlock.id, " .builder-custom-code"));
                    if (existing.length === 1) {
                        var node = existing[0];
                        _this.originalRef = node;
                        _this.originalRef.remove();
                    }
                }
            }
        }
        return _this;
    }
    Object.defineProperty(CustomCodeComponent.prototype, "noReactRender", {
        get: function () {
            var _a;
            // Don't render liquid client side
            return Boolean(isShopify && ((_a = this.props.code) === null || _a === void 0 ? void 0 : _a.match(/{[{%]/g)));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomCodeComponent.prototype, "isHydrating", {
        get: function () {
            return !isShopify && this.originalRef;
        },
        enumerable: false,
        configurable: true
    });
    CustomCodeComponent.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.code !== prevProps.code) {
            this.findAndRunScripts();
        }
    };
    CustomCodeComponent.prototype.componentDidMount = function () {
        var _this = this;
        this.firstLoad = false;
        if (!this.replaceNodes) {
            if (this.isHydrating) {
                // first render need to match what's on ssr (issue with next.js)
                this.setState({
                    hydrated: true,
                });
                sdk_1.Builder.nextTick(function () { return _this.findAndRunScripts(); });
            }
            else {
                this.findAndRunScripts();
            }
        }
        if (sdk_1.Builder.isBrowser && this.replaceNodes && this.originalRef && this.elementRef) {
            this.elementRef.appendChild(this.originalRef);
        }
    };
    CustomCodeComponent.prototype.findAndRunScripts = function () {
        if (this.elementRef && typeof window !== 'undefined') {
            var scripts = this.elementRef.getElementsByTagName('script');
            for (var i = 0; i < scripts.length; i++) {
                var script = scripts[i];
                if (script.src) {
                    if (this.scriptsInserted.has(script.src)) {
                        continue;
                    }
                    this.scriptsInserted.add(script.src);
                    var newScript = document.createElement('script');
                    newScript.async = true;
                    newScript.src = script.src;
                    document.head.appendChild(newScript);
                }
                else if (!script.type ||
                    ['text/javascript', 'application/javascript', 'application/ecmascript'].includes(script.type)) {
                    if (this.scriptsRun.has(script.innerText)) {
                        continue;
                    }
                    try {
                        this.scriptsRun.add(script.innerText);
                        new Function(script.innerText)();
                    }
                    catch (error) {
                        console.warn('Builder custom code component error:', error);
                    }
                }
            }
        }
    };
    Object.defineProperty(CustomCodeComponent.prototype, "code", {
        get: function () {
            // when ssr'd by nextjs it'll break hydration if initial client render doesn't match ssr
            if ((sdk_1.Builder.isServer || (this.isHydrating && this.firstLoad)) &&
                this.props.scriptsClientOnly) {
                return (this.props.code || '').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            }
            return this.props.code;
        },
        enumerable: false,
        configurable: true
    });
    CustomCodeComponent.prototype.render = function () {
        var _this = this;
        // TODO: remove <script> tags for server render (unless has some param to say it's only goingn to be run on server)
        // like embed
        return (react_1.default.createElement("div", __assign({ ref: function (ref) { return (_this.elementRef = ref); }, 
            // TODO: add a class when node replaced in (?)
            className: "builder-custom-code" }, (!this.replaceNodes &&
            !this.noReactRender && {
            dangerouslySetInnerHTML: { __html: this.code },
        }))));
    };
    return CustomCodeComponent;
}(react_1.default.Component));
exports.CustomCode = (0, with_builder_1.withBuilder)(CustomCodeComponent, {
    name: 'Custom Code',
    static: true,
    requiredPermissions: ['editCode'],
    inputs: [
        {
            name: 'code',
            type: 'html',
            required: true,
            defaultValue: '<p>Hello there, I am custom HTML code!</p>',
            code: true,
        },
        __assign({ name: 'replaceNodes', type: 'boolean', helperText: 'Preserve server rendered dom nodes', advanced: true }, (isShopify && {
            defaultValue: true,
        })),
        __assign({ name: 'scriptsClientOnly', type: 'boolean', helperText: 'Only print and run scripts on the client. Important when scripts influence DOM that could be replaced when client loads', advanced: true }, (!isShopify && {
            defaultValue: true,
        })),
    ],
});
//# sourceMappingURL=CustomCode.js.map