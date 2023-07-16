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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = void 0;
var react_1 = __importDefault(require("react"));
var sdk_1 = require("@builder.io/sdk");
var with_builder_1 = require("../functions/with-builder");
var EmbedComponent = /** @class */ (function (_super) {
    __extends(EmbedComponent, _super);
    function EmbedComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.elementRef = null;
        _this.scriptsInserted = new Set();
        _this.scriptsRun = new Set();
        return _this;
    }
    EmbedComponent.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.content !== prevProps.content) {
            this.findAndRunScripts();
        }
    };
    EmbedComponent.prototype.componentDidMount = function () {
        this.findAndRunScripts();
    };
    EmbedComponent.prototype.findAndRunScripts = function () {
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
                else {
                    if (this.scriptsRun.has(script.innerText)) {
                        continue;
                    }
                    this.scriptsRun.add(script.innerText);
                    try {
                        new Function(script.innerText)();
                    }
                    catch (error) {
                        console.warn('Builder custom code component error:', error);
                    }
                }
            }
        }
    };
    Object.defineProperty(EmbedComponent.prototype, "content", {
        get: function () {
            // Remove scripts on server - if they manipulate dom there can be issues on hydration
            // TODO: allow this to by bypassed by context or prop that says if this is going to be HTML
            // loaded without client JS/hydration (static)
            if (sdk_1.Builder.isServer) {
                return (this.props.content || '').replace(/<script[\s\S]*?<\/script>/g, '');
            }
            return this.props.content;
        },
        enumerable: false,
        configurable: true
    });
    EmbedComponent.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement("div", { ref: function (ref) { return (_this.elementRef = ref); }, className: "builder-embed", dangerouslySetInnerHTML: { __html: this.content } }));
    };
    return EmbedComponent;
}(react_1.default.Component));
exports.Embed = (0, with_builder_1.withBuilder)(EmbedComponent, {
    name: 'Embed',
    static: true,
    inputs: [
        {
            name: 'url',
            type: 'url',
            required: true,
            defaultValue: '',
            helperText: 'e.g. enter a youtube url, google map, etc',
            onChange: function (options) {
                var url = options.get('url');
                if (url) {
                    options.set('content', 'Loading...');
                    // TODO: get this out of here!
                    var apiKey = 'ae0e60e78201a3f2b0de4b';
                    return fetch("https://iframe.ly/api/iframely?url=".concat(url, "&api_key=").concat(apiKey))
                        .then(function (res) { return res.json(); })
                        .then(function (data) {
                        if (options.get('url') === url) {
                            if (data.html) {
                                options.set('content', data.html);
                            }
                            else {
                                options.set('content', 'Invalid url, please try another');
                            }
                        }
                    })
                        .catch(function (err) {
                        options.set('content', 'There was an error embedding this URL, please try again or another URL');
                    });
                }
                else {
                    options.delete('content');
                }
            },
        },
        {
            name: 'content',
            type: 'html',
            defaultValue: "<div style=\"padding: 20px; text-align: center\">(Choose an embed URL)<div>",
            hideFromUI: true,
        },
    ],
});
//# sourceMappingURL=Embed.js.map