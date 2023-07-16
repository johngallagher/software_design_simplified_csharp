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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var sdk_1 = require("@builder.io/sdk");
var builder_store_1 = require("../store/builder-store");
var builder_component_component_1 = require("../components/builder-component.component");
var with_builder_1 = require("../functions/with-builder");
var prefetched = new Set();
function searchToObject(location) {
    var pairs = (location.search || '').substring(1).split('&');
    var obj = {};
    for (var i in pairs) {
        if (!(pairs[i] && typeof pairs[i] === 'string')) {
            continue;
        }
        var pair = pairs[i].split('=');
        obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return obj;
}
var RouterComponent = /** @class */ (function (_super) {
    __extends(RouterComponent, _super);
    function RouterComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.builder = sdk_1.builder;
        _this.routed = false;
        _this.preloadQueue = 0;
        _this.onPopState = function (event) {
            _this.updateLocationState();
        };
        _this.onMouseOverOrTouchStart = function (event) {
            if (_this.preloadQueue > 4) {
                return;
            }
            if (_this.props.preloadOnHover === false) {
                return;
            }
            var hrefTarget = _this.findHrefTarget(event);
            if (!hrefTarget) {
                return;
            }
            var href = hrefTarget.getAttribute('href');
            if (!href) {
                return;
            }
            // TODO: onPreload hook and preload dom event
            // Also allow that to be defaultPrevented to cancel this behavior
            if (!_this.isRelative(href)) {
                var converted = _this.convertToRelative(href);
                if (converted) {
                    href = converted;
                }
                else {
                    return;
                }
            }
            if (href.startsWith('#')) {
                return;
            }
            if (prefetched.has(href)) {
                return;
            }
            prefetched.add(href);
            var parsedUrl = _this.parseUrl(href);
            // TODO: override location!
            _this.preloadQueue++;
            // TODO: use builder from context
            var attributes = sdk_1.builder.getUserAttributes();
            attributes.urlPath = parsedUrl.pathname;
            attributes.queryString = parsedUrl.search;
            // Should be queue?
            var subscription = sdk_1.builder
                .get(_this.model, {
                userAttributes: attributes,
                key: _this.model + ':' + parsedUrl.pathname + parsedUrl.search,
            })
                .subscribe(function () {
                _this.preloadQueue--;
                subscription.unsubscribe();
            });
        };
        _this.onClick = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var hrefTarget, href, routeEvent, converted;
            return __generator(this, function (_a) {
                if (this.props.handleRouting === false) {
                    return [2 /*return*/];
                }
                if (event.button !== 0 || event.ctrlKey || event.defaultPrevented || event.metaKey) {
                    // If this is a non-left click, or the user is holding ctr/cmd, or the url is absolute,
                    // or if the link has a target attribute, don't route on the client and let the default
                    // href property handle the navigation
                    return [2 /*return*/];
                }
                hrefTarget = this.findHrefTarget(event);
                if (!hrefTarget) {
                    return [2 /*return*/];
                }
                // target="_blank" or target="_self" etc
                if (hrefTarget.target && hrefTarget.target !== '_client') {
                    return [2 /*return*/];
                }
                href = hrefTarget.getAttribute('href');
                if (!href) {
                    return [2 /*return*/];
                }
                if (this.props.onRoute) {
                    routeEvent = {
                        url: href,
                        anchorNode: hrefTarget,
                        preventDefault: function () {
                            this.defaultPrevented = true;
                        },
                        defaultPrevented: false,
                    };
                    this.props.onRoute(routeEvent);
                    if (routeEvent.defaultPrevented) {
                        // Wait should this be here? they may want browser to handle this by deault preventing ours...
                        // event.preventDefault()
                        return [2 /*return*/];
                    }
                }
                if (!this.isRelative(href)) {
                    converted = this.convertToRelative(href);
                    if (converted) {
                        href = converted;
                    }
                    else {
                        return [2 /*return*/];
                    }
                }
                if (href.startsWith('#')) {
                    return [2 /*return*/];
                }
                // Otherwise if this url is relative, navigate on the client
                event.preventDefault();
                this.route(href);
                return [2 /*return*/];
            });
        }); };
        _this.privateState = null;
        return _this;
    }
    // TODO: handle route to same url as current (do nothing)
    // TODO: replaceState option
    RouterComponent.prototype.route = function (url) {
        var _a;
        this.routed = true;
        // TODO: check if relative?
        if (typeof ((_a = window.history) === null || _a === void 0 ? void 0 : _a.pushState) === 'function') {
            history.pushState(null, '', url);
            this.updateLocationState();
            return true;
        }
        else {
            location.href = url;
            return false;
        }
    };
    RouterComponent.prototype.updateLocationState = function () {
        if (this.privateState) {
            // Reload path info
            this.privateState.update(function (obj) {
                // TODO: force always override the location path info... hmm
                obj.location = __assign(__assign({}, obj.location), { pathname: location.pathname, search: location.search, path: location.pathname.split('/').slice(1), query: searchToObject(location) });
            });
        }
    };
    Object.defineProperty(RouterComponent.prototype, "model", {
        get: function () {
            return this.props.model || 'page';
        },
        enumerable: false,
        configurable: true
    });
    RouterComponent.prototype.componentDidMount = function () {
        if (typeof document !== 'undefined') {
            document.addEventListener('click', this.onClick);
            window.addEventListener('popstate', this.onPopState);
            document.addEventListener('mouseover', this.onMouseOverOrTouchStart);
            document.addEventListener('touchstart', this.onMouseOverOrTouchStart);
        }
    };
    RouterComponent.prototype.componentWillUnmount = function () {
        if (typeof document !== 'undefined') {
            document.removeEventListener('click', this.onClick);
            document.removeEventListener('mouseover', this.onMouseOverOrTouchStart);
            window.removeEventListener('popstate', this.onPopState);
            document.removeEventListener('touchstart', this.onMouseOverOrTouchStart);
        }
    };
    RouterComponent.prototype.render = function () {
        var _this = this;
        var model = this.model;
        return ((0, core_1.jsx)(builder_store_1.BuilderStoreContext.Consumer, null, function (state) {
            _this.privateState = state;
            // TODO: useEffect based on this that fetches new data and
            // populates as content={} param for fast updates
            var url = state.state &&
                state.state.location &&
                state.state.location.pathname + state.state.location.search;
            return ((0, core_1.jsx)("div", { className: "builder-router", "data-model": model },
                (0, core_1.jsx)("style", null, "\n                @keyframes builderLoadingSpinner {\n                  0% {\n                    transform: rotate(0deg);\n                  }\n                  100% {\n                    transform: rotate(360deg);\n                  }\n                }\n                /* TODO: overridable tag */\n                .builder-page-loading {\n                  -webkit-animation: builderLoadingSpinner 1s infinite linear;\n                  animation: builderLoadingSpinner 1s infinite linear;\n                  -webkit-transform: translateZ(0);\n                  transform: translateZ(0);\n                  border-radius: 50%;\n                  width: 36px;\n                  height: 36px;\n                  margin: 6px auto;\n                  position: relative;\n                  border: 1px solid transparent;\n                  border-left: 1px solid #808284;\n                }\n              "),
                (0, core_1.jsx)(builder_component_component_1.BuilderComponent
                // TODO: this key strategy is inidial bc it gives loading for full page when fetching content
                // Also sometimes content flashes to loading even when it's already precached in memory and should immediately display
                // - why
                , { 
                    // TODO: this key strategy is inidial bc it gives loading for full page when fetching content
                    // Also sometimes content flashes to loading even when it's already precached in memory and should immediately display
                    // - why
                    key: url, data: _this.props.data, content: _this.routed ? undefined : _this.props.content, modelName: model, options: {
                        key: sdk_1.Builder.isEditing ? undefined : _this.model + ':' + url, // TODO: other custom targets specify if should refetch components on change
                    } }, _this.props.children || ((0, core_1.jsx)("div", { css: { display: 'flex' } },
                    (0, core_1.jsx)("div", { css: { margin: '40vh auto' }, className: "builder-page-loading" }))))));
        }));
    };
    RouterComponent.prototype.findHrefTarget = function (event) {
        // TODO: move to core
        var element = event.target;
        while (element) {
            if (element instanceof HTMLAnchorElement && element.getAttribute('href')) {
                return element;
            }
            if (element === event.currentTarget) {
                break;
            }
            element = element.parentElement;
        }
        return null;
    };
    RouterComponent.prototype.isRelative = function (href) {
        return !href.match(/^(\/\/|https?:\/\/)/i);
    };
    // This method can only be called client side only. It is only invoked on click events
    RouterComponent.prototype.parseUrl = function (url) {
        var a = document.createElement('a');
        a.href = url;
        return a;
    };
    RouterComponent.prototype.convertToRelative = function (href) {
        var currentUrl = this.parseUrl(location.href);
        var hrefUrl = this.parseUrl(href);
        if (currentUrl.host === hrefUrl.host) {
            var relativeUrl = hrefUrl.pathname + (hrefUrl.search ? hrefUrl.search : '');
            if (relativeUrl.startsWith('#')) {
                return null;
            }
            return relativeUrl || '/';
        }
        return null;
    };
    return RouterComponent;
}(react_1.default.Component));
exports.Router = (0, with_builder_1.withBuilder)(RouterComponent, {
    name: 'Core:Router',
    hideFromInsertMenu: true,
    // TODO: advanced: true
    inputs: [
        {
            // TODO: search picker
            name: 'model',
            type: 'string',
            defaultValue: 'page',
            advanced: true,
        },
        {
            name: 'handleRouting',
            type: 'boolean',
            defaultValue: true,
            advanced: true,
        },
        {
            name: 'preloadOnHover',
            type: 'boolean',
            defaultValue: true,
            advanced: true,
        },
        {
            name: 'onRoute',
            type: 'function',
            advanced: true,
            // Subfields are function arguments - object with properties
        },
    ],
});
//# sourceMappingURL=Router.js.map