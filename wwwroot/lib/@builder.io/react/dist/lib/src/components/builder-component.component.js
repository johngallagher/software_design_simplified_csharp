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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderComponent = exports.onChange = void 0;
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var core_1 = require("@emotion/core");
var builder_content_component_1 = require("./builder-content.component");
var builder_blocks_component_1 = require("./builder-blocks.component");
var sdk_1 = require("@builder.io/sdk");
var builder_store_1 = require("../store/builder-store");
var hash_sum_1 = __importDefault(require("hash-sum"));
var on_change_1 = __importDefault(require("../../lib/on-change"));
exports.onChange = on_change_1.default;
var device_sizes_constant_1 = require("../constants/device-sizes.constant");
var builder_async_requests_1 = require("../store/builder-async-requests");
var debonce_next_tick_1 = require("../functions/debonce-next-tick");
var throttle_1 = require("../functions/throttle");
var builder_meta_1 = require("../store/builder-meta");
var try_eval_1 = require("../functions/try-eval");
var to_error_1 = require("../to-error");
var get_builder_pixel_1 = require("../functions/get-builder-pixel");
function pick(obj) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    var ret = {};
    keys.forEach(function (key) {
        ret[key] = obj[key];
    });
    return ret;
}
function omit(obj) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    var ret = __assign({}, obj);
    keys.forEach(function (key) {
        delete ret[key];
    });
    return ret;
}
var wrapComponent = function (info) {
    return function (props) {
        var _a;
        // TODO: convention for all of this, like builderTagProps={{ style: {} foo: 'bar' }}
        var Tag = props.builderTag || 'div';
        var inputNames = ['children'].concat(((_a = info.inputs) === null || _a === void 0 ? void 0 : _a.map(function (item) { return item.name; })) || []);
        var baseProps = omit.apply(void 0, __spreadArray(__spreadArray([props], inputNames, false), ['attributes'], false));
        var inputProps = props; // pick(props, ...inputNames);
        if (info.noWrap) {
            return react_1.default.createElement(info.class, __assign({ attributes: baseProps }, inputProps));
        }
        return (react_1.default.createElement(Tag, __assign({}, baseProps),
            react_1.default.createElement(info.class, __assign({}, inputProps))));
    };
};
var size = function (thing) { return Object.keys(thing).length; };
function debounce(func, wait, immediate) {
    if (immediate === void 0) { immediate = false; }
    var timeout;
    return function () {
        var context = this;
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        }, wait);
        if (immediate && !timeout)
            func.apply(context, args);
    };
}
var fontsLoaded = new Set();
var fetch;
if (globalThis.fetch)
    fetch = globalThis.fetch;
fetch !== null && fetch !== void 0 ? fetch : (fetch = require('node-fetch'));
var sizeMap = {
    desktop: 'large',
    tablet: 'medium',
    mobile: 'small',
};
var fetchCache = {};
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
/**
 * Responsible for rendering Builder content of type: 'page' or 'section' to
 * react components. It will attempt to fetch content from the API based on
 * defined user attributes (URL path, device type, and any custom targeting you set using `builder.setUserAttributes`) unless a `BuilderContent`
 * object is provided to `props.content`
 *
 * Use it to mount content in desired location, enable editing in place when
 * previewed in the editor.
 *
 * Supports server-side-rendering when passed the content json as
 * `props.content`.
 */
var BuilderComponent = /** @class */ (function (_super) {
    __extends(BuilderComponent, _super);
    function BuilderComponent(props) {
        var _this = this;
        var _a;
        _this = _super.call(this, props) || this;
        _this.subscriptions = new sdk_1.Subscription();
        // TODO: don't trigger initial one?
        _this.onStateChange = new sdk_1.BehaviorSubject(null);
        _this.asServer = sdk_1.Builder.isServer;
        _this.contentRef = null;
        _this.styleRef = null;
        _this.rootState = sdk_1.Builder.isServer ? {} : (0, on_change_1.default)({}, function () { return _this.updateState(); });
        _this.lastJsCode = '';
        _this.lastHttpRequests = {};
        _this.httpSubscriptionPerKey = {};
        _this.firstLoad = true;
        _this.ref = null;
        _this.messageListener = function (event) {
            var _a;
            var info = event.data;
            switch (info.type) {
                case 'builder.configureSdk': {
                    var data = info.data;
                    if (!data.contentId || data.contentId !== ((_a = _this.useContent) === null || _a === void 0 ? void 0 : _a.id)) {
                        return;
                    }
                    _this.sizes = (0, device_sizes_constant_1.getSizesForBreakpoints)(data.breakpoints || {});
                    _this.setState({
                        state: Object.assign(_this.rootState, {
                            deviceSize: _this.deviceSizeState,
                            // TODO: will user attributes be ready here?
                            device: _this.device,
                        }),
                        updates: ((_this.state && _this.state.updates) || 0) + 1,
                        breakpoints: data.breakpoints,
                    });
                    break;
                }
                case 'builder.updateSpacer': {
                    var data_1 = info.data;
                    var currentSpacer = _this.rootState._spacer;
                    _this.updateState(function (state) {
                        state._spacer = data_1;
                    });
                    break;
                }
                case 'builder.resetState': {
                    var _b = info.data, state = _b.state, model = _b.model;
                    if (model === _this.name) {
                        for (var key in _this.rootState) {
                            // TODO: support nested functions (somehow)
                            if (typeof _this.rootState[key] !== 'function') {
                                delete _this.rootState[key];
                            }
                        }
                        Object.assign(_this.rootState, state);
                        _this.setState(__assign(__assign({}, _this.state), { state: _this.rootState, updates: ((_this.state && _this.state.updates) || 0) + 1 }));
                    }
                    break;
                }
                case 'builder.resetSymbolState': {
                    var _c = info.data.state, state = _c.state, model = _c.model, id = _c.id;
                    if (_this.props.builderBlock && _this.props.builderBlock === id) {
                        for (var key in _this.rootState) {
                            delete _this.rootState[key];
                        }
                        Object.assign(_this.rootState, state);
                        _this.setState(__assign(__assign({}, _this.state), { state: _this.rootState, updates: ((_this.state && _this.state.updates) || 0) + 1 }));
                    }
                    break;
                }
            }
        };
        _this.resizeFn = function () {
            var deviceSize = _this.deviceSizeState;
            if (deviceSize !== _this.state.state.deviceSize) {
                _this.setState(__assign(__assign({}, _this.state), { updates: ((_this.state && _this.state.updates) || 0) + 1, state: Object.assign(_this.rootState, __assign(__assign({}, _this.state.state), { deviceSize: deviceSize })) }));
            }
        };
        _this.resizeListener = sdk_1.Builder.isEditing ? (0, throttle_1.throttle)(_this.resizeFn, 200) : debounce(_this.resizeFn, 400);
        _this.mounted = false;
        _this.updateState = function (fn) {
            var state = _this.rootState;
            if (fn) {
                fn(state);
            }
            if (_this.mounted) {
                _this.setState({
                    update: _this.updateState,
                    state: state,
                    updates: ((_this.state && _this.state.updates) || 0) + 1,
                });
            }
            else {
                _this.state = __assign(__assign({}, _this.state), { update: _this.updateState, state: state, updates: ((_this.state && _this.state.updates) || 0) + 1 });
            }
            _this.notifyStateChange();
        };
        _this.onContentLoaded = function (data, content) {
            if (_this.name === 'page' && sdk_1.Builder.isBrowser) {
                if (data) {
                    var title = data.title, pageTitle = data.pageTitle, description = data.description, pageDescription = data.pageDescription;
                    if (title || pageTitle) {
                        document.title = title || pageTitle;
                    }
                    if (description || pageDescription) {
                        var descriptionTag = document.querySelector('meta[name="description"]');
                        if (!descriptionTag) {
                            descriptionTag = document.createElement('meta');
                            descriptionTag.setAttribute('name', 'description');
                            document.head.appendChild(descriptionTag);
                        }
                        descriptionTag.setAttribute('content', description || pageDescription);
                    }
                }
            }
            if (sdk_1.Builder.isEditing) {
                _this.notifyStateChange();
            }
            if (_this.props.contentLoaded) {
                _this.props.contentLoaded(data, content);
            }
            if (data && data.inputs && Array.isArray(data.inputs) && data.inputs.length) {
                if (!data.state) {
                    data.state = {};
                }
                data.inputs.forEach(function (input) {
                    if (input) {
                        if (input.name &&
                            input.defaultValue !== undefined &&
                            data.state[input.name] === undefined) {
                            data.state[input.name] = input.defaultValue;
                        }
                    }
                });
            }
            if (data && data.state) {
                var newState = __assign(__assign({}, _this.state), { updates: ((_this.state && _this.state.updates) || 0) + 1, state: Object.assign(_this.rootState, __assign(__assign(__assign(__assign({}, _this.state.state), { location: _this.locationState, deviceSize: _this.deviceSizeState, device: _this.device }), data.state), _this.externalState)) });
                if (_this.mounted) {
                    _this.setState(newState);
                }
                else {
                    _this.state = newState;
                }
            }
            // TODO: also throttle on edits maybe
            if (data && data.jsCode && sdk_1.Builder.isBrowser && !_this.options.codegen) {
                // Don't rerun js code when editing and not changed
                var skip = false;
                if (sdk_1.Builder.isEditing) {
                    if (_this.lastJsCode === data.jsCode) {
                        skip = true;
                    }
                    else {
                        _this.lastJsCode = data.jsCode;
                    }
                }
                if (!skip) {
                    var state = _this.state.state;
                    // TODO: real editing method
                    try {
                        var result = new Function('data', 'ref', 'state', 'update', 'element', 'Builder', 'builder', 'context', data.jsCode)(data, _this, state, _this.state.update, _this.ref, sdk_1.Builder, sdk_1.builder, _this.state.context);
                        // TODO: allow exports = { } syntax?
                        // TODO: do something with reuslt like view - methods, computed, actions, properties, template, etc etc
                    }
                    catch (err) {
                        var error = (0, to_error_1.toError)(err);
                        if (sdk_1.Builder.isBrowser) {
                            console.warn('Builder custom code error:', error.message, 'in', data.jsCode, error.stack);
                        }
                        else {
                            if (typeof process !== 'undefined' &&
                                typeof process.env !== 'undefined' &&
                                process.env.DEBUG) {
                                console.debug('Builder custom code error:', error.message, 'in', data.jsCode, error.stack);
                            }
                            // Add to req.options.errors to return to client
                        }
                    }
                }
            }
            if (data && data.httpRequests /* || data.builderData @DEPRECATED */ && !_this.props.noAsync) {
                // Don't rerun http requests when editing and not changed
                // No longer needed?
                var skip = false;
                if (!skip) {
                    var _loop_1 = function (key) {
                        var url = data.httpRequests[key];
                        if (url && (!_this.data[key] || sdk_1.Builder.isEditing)) {
                            if (sdk_1.Builder.isBrowser) {
                                var finalUrl_1 = _this.evalExpression(url);
                                if (sdk_1.Builder.isEditing && _this.lastHttpRequests[key] === finalUrl_1) {
                                    return "continue";
                                }
                                _this.lastHttpRequests[key] = finalUrl_1;
                                var builderModelRe = /builder\.io\/api\/v2\/([^\/\?]+)/i;
                                var builderModelMatch = url.match(builderModelRe);
                                var model = builderModelMatch && builderModelMatch[1];
                                _this.handleRequest(key, finalUrl_1);
                                var currentSubscription = _this.httpSubscriptionPerKey[key];
                                if (currentSubscription) {
                                    currentSubscription.unsubscribe();
                                }
                                // TODO: fix this
                                var newSubscription = (_this.httpSubscriptionPerKey[key] =
                                    _this.onStateChange.subscribe(function () {
                                        var newUrl = _this.evalExpression(url);
                                        if (newUrl !== finalUrl_1) {
                                            _this.handleRequest(key, newUrl);
                                            _this.lastHttpRequests[key] = newUrl;
                                        }
                                    }));
                                _this.subscriptions.add(newSubscription);
                            }
                            else {
                                _this.handleRequest(key, _this.evalExpression(url));
                            }
                        }
                    };
                    // TODO: another structure for this
                    for (var key in data.httpRequests) {
                        _loop_1(key);
                    }
                }
            }
        };
        var _content = _this.inlinedContent;
        if (_content && _content.content) {
            _content = _content.content;
        }
        _this.sizes = (0, device_sizes_constant_1.getSizesForBreakpoints)(((_a = _content === null || _content === void 0 ? void 0 : _content.meta) === null || _a === void 0 ? void 0 : _a.breakpoints) || {});
        // TODO: pass this all the way down - symbols, etc
        // this.asServer = Boolean(props.hydrate && Builder.isBrowser)
        _this.state = {
            // TODO: should change if this prop changes
            context: __assign(__assign({}, props.context), { apiKey: sdk_1.builder.apiKey || _this.props.apiKey }),
            state: Object.assign(_this.rootState, __assign(__assign(__assign(__assign({}, (_this.inlinedContent && _this.inlinedContent.data && _this.inlinedContent.data.state)), { isBrowser: sdk_1.Builder.isBrowser, isServer: !sdk_1.Builder.isBrowser, _hydrate: props.hydrate, location: _this.locationState, deviceSize: _this.deviceSizeState, 
                // TODO: will user attributes be ready here?
                device: _this.device }), _this.getHtmlData()), props.data)),
            updates: 0,
            key: 0,
            update: _this.updateState,
        };
        if (sdk_1.Builder.isBrowser) {
            var key = _this.props.apiKey;
            if (key && key !== _this.builder.apiKey) {
                _this.builder.apiKey = key;
            }
            if (_this.inlinedContent) {
                // Sometimes with graphql we get the content as `content.content`
                var content = _this.inlinedContent.content || _this.inlinedContent;
                _this.onContentLoaded(content === null || content === void 0 ? void 0 : content.data, (0, builder_content_component_1.getContentWithInfo)(content));
            }
        }
        return _this;
    }
    Object.defineProperty(BuilderComponent.prototype, "options", {
        get: function () {
            // TODO: for perf cache this
            return __assign(__assign({}, BuilderComponent.defaults), this.props);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderComponent.prototype, "name", {
        get: function () {
            return this.props.model || this.props.modelName || this.props.name; // || this.props.model
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderComponent.prototype, "element", {
        get: function () {
            return this.ref;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderComponent.prototype, "inlinedContent", {
        get: function () {
            if (this.isPreviewing && !this.props.inlineContent) {
                return undefined;
            }
            return this.props.content;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderComponent.prototype, "builder", {
        get: function () {
            return this.props.builder || sdk_1.builder;
        },
        enumerable: false,
        configurable: true
    });
    BuilderComponent.prototype.getHtmlData = function () {
        var id = (this.inlinedContent && this.inlinedContent.id) || this.props.entry;
        var script = id &&
            sdk_1.Builder.isBrowser &&
            document.querySelector("script[data-builder-json=\"".concat(id, "\"],script[data-builder-state=\"").concat(id, "\"]"));
        if (script) {
            try {
                var json = JSON.parse(script.innerText);
                return json;
            }
            catch (err) {
                console.warn('Could not parse Builder.io HTML data transfer', err, script.innerText);
            }
        }
        return {};
    };
    Object.defineProperty(BuilderComponent.prototype, "device", {
        // TODO: pass down with context
        get: function () {
            return this.builder.getUserAttributes().device || 'desktop';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderComponent.prototype, "locationState", {
        get: function () {
            return __assign(__assign({}, pick(this.location, 'pathname', 'hostname', 'search', 'host')), { path: (this.location.pathname && this.location.pathname.split('/').slice(1)) || '', query: searchToObject(this.location) });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderComponent.prototype, "deviceSizeState", {
        // TODO: trigger state change on screen size change
        get: function () {
            // TODO: use context to pass this down on server
            return sdk_1.Builder.isBrowser
                ? this.sizes.getSizeForWidth(window.innerWidth)
                : sizeMap[this.device] || 'large';
        },
        enumerable: false,
        configurable: true
    });
    BuilderComponent.renderInto = function (elementOrSelector, props, hydrate, fresh) {
        if (props === void 0) { props = {}; }
        if (hydrate === void 0) { hydrate = true; }
        if (fresh === void 0) { fresh = false; }
        console.debug('BuilderPage.renderInto', elementOrSelector, props, hydrate, this);
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
        if (!element) {
            return;
        }
        var exists = element.classList.contains('builder-hydrated');
        if (exists && !fresh) {
            console.debug('Tried to hydrate multiple times');
            return;
        }
        element.classList.add('builder-hydrated');
        var shouldHydrate = hydrate && element.innerHTML.includes('builder-block');
        if (!element.classList.contains('builder-component')) {
            // TODO: maybe remove any builder-api-styles...
            var apiStyles_1 = element.querySelector('.builder-api-styles') ||
                (element.previousElementSibling &&
                    element.previousElementSibling.matches('.builder-api-styles')
                    ? element.previousElementSibling
                    : null);
            var keepStyles_1 = '';
            if (apiStyles_1) {
                var html = apiStyles_1.innerHTML;
                html.replace(/\/\*start:([^\*]+?)\*\/([\s\S]*?)\/\*end:([^\*]+?)\*\//g, function (match, id, content) {
                    var el = null;
                    try {
                        el = document.querySelector("[data-emotion-css=\"".concat(id, "\"]"));
                    }
                    catch (err) {
                        console.warn(err);
                    }
                    if (el) {
                        el.innerHTML = content;
                    }
                    else if (!sdk_1.Builder.isEditing) {
                        keepStyles_1 += match;
                    }
                    return match;
                });
                // NextTick? or longer timeout?
                sdk_1.Builder.nextTick(function () {
                    apiStyles_1.innerHTML = keepStyles_1;
                });
            }
            var useElement = element.querySelector('.builder-component');
            if (useElement) {
                element = useElement;
            }
            else {
                shouldHydrate = false;
            }
        }
        if (location.search.includes('builder.debug=true')) {
            console.debug('hydrate', shouldHydrate, element);
        }
        var useEl = element;
        if (!exists) {
            var div = document.createElement('div');
            element.insertAdjacentElement('beforebegin', div);
            div.appendChild(element);
            useEl = div;
        }
        if (sdk_1.Builder.isEditing || (sdk_1.Builder.isBrowser && location.search.includes('builder.preview='))) {
            shouldHydrate = false;
        }
        if (shouldHydrate && element) {
            // TODO: maybe hydrate again. Maybe...
            var val_1 = react_dom_1.default.render(react_1.default.createElement(BuilderComponent, __assign({}, props)), useEl, useEl.builderRootRef);
            useEl.builderRootRef = val_1;
            return val_1;
        }
        var val = react_dom_1.default.render(react_1.default.createElement(BuilderComponent, __assign({}, props)), useEl, useEl.builderRootRef);
        useEl.builderRootRef = val;
        return val;
    };
    BuilderComponent.prototype.componentDidMount = function () {
        var _this = this;
        var _a;
        this.mounted = true;
        if (this.asServer) {
            this.asServer = false;
            this.updateState(function (state) {
                state.isBrowser = true;
                state.isServer = false;
            });
        }
        if (sdk_1.Builder.isIframe) {
            (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({ type: 'builder.sdkInjected', data: { modelName: this.name } }, '*');
        }
        if (sdk_1.Builder.isBrowser) {
            // TODO: remove event on unload
            window.addEventListener('resize', this.resizeListener);
            if (sdk_1.Builder.isEditing) {
                window.addEventListener('message', this.messageListener);
            }
            if (sdk_1.Builder.isEditing || sdk_1.Builder.isPreviewing) {
                sdk_1.Builder.nextTick(function () {
                    _this.firstLoad = false;
                    _this.reload();
                });
            }
            setTimeout(function () {
                window.dispatchEvent(new CustomEvent('builder:component:load', {
                    detail: {
                        ref: _this,
                    },
                }));
            });
        }
    };
    Object.defineProperty(BuilderComponent.prototype, "isPreviewing", {
        get: function () {
            return ((sdk_1.Builder.isServer || (sdk_1.Builder.isBrowser && sdk_1.Builder.isPreviewing && !this.firstLoad)) &&
                sdk_1.builder.previewingModel === this.name);
        },
        enumerable: false,
        configurable: true
    });
    BuilderComponent.prototype.notifyStateChange = function () {
        if (sdk_1.Builder.isServer) {
            return;
        }
        if (!(this && this.state)) {
            return;
        }
        var nextState = this.state.state;
        // TODO: only run the below once per tick...
        if (this.props.onStateChange) {
            this.props.onStateChange(nextState);
        }
        if (sdk_1.Builder.isBrowser) {
            window.dispatchEvent(new CustomEvent('builder:component:stateChange', {
                detail: {
                    state: nextState,
                    ref: this,
                },
            }));
        }
        this.onStateChange.next(nextState);
    };
    BuilderComponent.prototype.processStateFromApi = function (state) {
        return state; //  mapValues(state, value => tryEval(value, this.data, this._errors))
    };
    Object.defineProperty(BuilderComponent.prototype, "location", {
        get: function () {
            return this.props.location || (sdk_1.Builder.isBrowser ? location : {});
        },
        enumerable: false,
        configurable: true
    });
    BuilderComponent.prototype.getCssFromFont = function (font, data) {
        // TODO: compute what font sizes are used and only load those.......
        var family = font.family + (font.kind && !font.kind.includes('#') ? ', ' + font.kind : '');
        var name = family.split(',')[0];
        var url = font.fileUrl ? font.fileUrl : font.files && font.files.regular;
        var str = '';
        if (url && family && name) {
            str += "\n@font-face {\n  font-family: \"".concat(family, "\";\n  src: local(\"").concat(name, "\"), url('").concat(url, "') format('woff2');\n  font-display: fallback;\n  font-weight: 400;\n}\n        ").trim();
        }
        if (font.files) {
            for (var weight in font.files) {
                var isNumber = String(Number(weight)) === weight;
                if (!isNumber) {
                    continue;
                }
                // TODO: maybe limit number loaded
                var weightUrl = font.files[weight];
                if (weightUrl && weightUrl !== url) {
                    str += "\n@font-face {\n  font-family: \"".concat(family, "\";\n  src: url('").concat(weightUrl, "') format('woff2');\n  font-display: fallback;\n  font-weight: ").concat(weight, ";\n}\n          ").trim();
                }
            }
        }
        return str;
    };
    BuilderComponent.prototype.componentWillUnmount = function () {
        this.unsubscribe();
        if (sdk_1.Builder.isBrowser) {
            window.removeEventListener('resize', this.resizeListener);
            window.removeEventListener('message', this.messageListener);
        }
    };
    BuilderComponent.prototype.getFontCss = function (data) {
        var _this = this;
        if (!this.builder.allowCustomFonts) {
            return '';
        }
        // TODO: separate internal data from external
        return (((data === null || data === void 0 ? void 0 : data.customFonts) &&
            data.customFonts.length &&
            data.customFonts.map(function (font) { return _this.getCssFromFont(font, data); }).join(' ')) ||
            '');
    };
    BuilderComponent.prototype.ensureFontsLoaded = function (data) {
        if (this.builder.allowCustomFonts && (data === null || data === void 0 ? void 0 : data.customFonts) && Array.isArray(data.customFonts)) {
            for (var _i = 0, _a = data.customFonts; _i < _a.length; _i++) {
                var font = _a[_i];
                var url = font.fileUrl ? font.fileUrl : font.files && font.files.regular;
                if (!fontsLoaded.has(url)) {
                    var html = this.getCssFromFont(font, data);
                    fontsLoaded.add(url);
                    if (!html) {
                        continue;
                    }
                    var style = document.createElement('style');
                    style.className = 'builder-custom-font';
                    style.setAttribute('data-builder-custom-font', url);
                    style.innerHTML = html;
                    document.head.appendChild(style);
                }
            }
        }
    };
    BuilderComponent.prototype.getCss = function (data) {
        var _a;
        var contentId = (_a = this.useContent) === null || _a === void 0 ? void 0 : _a.id;
        var cssCode = (data === null || data === void 0 ? void 0 : data.cssCode) || '';
        if (contentId) {
            // Allow using `&` in custom CSS code like @emotion
            // E.g. `& .foobar { ... }` to scope CSS
            // TODO: handle if '&' is within a string like `content: "&"`
            cssCode = cssCode.replace(/&/g, ".builder-component-".concat(contentId));
        }
        return cssCode + this.getFontCss(data);
    };
    Object.defineProperty(BuilderComponent.prototype, "data", {
        get: function () {
            var _a;
            var data = __assign(__assign(__assign({}, (this.inlinedContent && ((_a = this.inlinedContent.data) === null || _a === void 0 ? void 0 : _a.state))), this.externalState), this.state.state);
            Object.assign(this.rootState, data);
            return data;
        },
        enumerable: false,
        configurable: true
    });
    BuilderComponent.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        // TODO: shallow diff
        if (this.props.data && prevProps.data !== this.props.data) {
            this.state.update(function (state) {
                Object.assign(state, _this.externalState);
            });
        }
        if (sdk_1.Builder.isEditing) {
            if (this.inlinedContent && prevProps.content !== this.inlinedContent) {
                this.onContentLoaded(this.inlinedContent.data, this.inlinedContent);
            }
        }
    };
    // FIXME: workaround to issue with CSS extraction and then hydration
    // (might be preact only)
    BuilderComponent.prototype.checkStyles = function (data) {
        if (this.styleRef) {
            var css_1 = this.getCss(data);
            if (this.styleRef.innerHTML !== css_1) {
                this.styleRef.innerHTML = css_1;
            }
        }
    };
    BuilderComponent.prototype.reload = function () {
        this.setState({
            key: this.state.key + 1,
        });
    };
    Object.defineProperty(BuilderComponent.prototype, "content", {
        get: function () {
            var content = this.inlinedContent;
            if (content && content.content) {
                // GraphQL workaround
                content = __assign(__assign({}, content), { data: content.content });
            }
            return content;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderComponent.prototype, "externalState", {
        get: function () {
            return __assign(__assign({}, this.props.data), (this.props.locale ? { locale: this.props.locale } : {}));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderComponent.prototype, "useContent", {
        get: function () {
            return this.content || this.state.context.builderContent;
        },
        enumerable: false,
        configurable: true
    });
    BuilderComponent.prototype.render = function () {
        var _this = this;
        var _a;
        var content = this.content;
        var dataString = sdk_1.Builder.isBrowser &&
            this.externalState &&
            size(this.externalState) &&
            (0, hash_sum_1.default)(this.externalState);
        var key = sdk_1.Builder.isEditing ? this.name : this.props.entry;
        if (key && !sdk_1.Builder.isEditing && dataString && dataString.length < 300) {
            key += ':' + dataString;
        }
        var WrapComponent = this.props.dataOnly ? react_1.default.Fragment : 'div';
        var contentId = (_a = this.useContent) === null || _a === void 0 ? void 0 : _a.id;
        return (
        // TODO: data attributes for model, id, etc?
        react_1.default.createElement(WrapComponent, { onClick: function (event) {
                // Prevent propagation from the root content component when editing to prevent issues
                // like client side routing triggering when links are clicked, unless this behavior is
                // disabled with the stopClickPropagationWhenEditing prop
                if (sdk_1.Builder.isEditing &&
                    !_this.props.isChild &&
                    !_this.props.stopClickPropagationWhenEditing) {
                    event.stopPropagation();
                }
            }, className: "builder-component ".concat(contentId ? "builder-component-".concat(contentId) : ''), "data-name": this.name, "data-source": "Rendered by Builder.io", key: this.state.key, ref: function (ref) { return (_this.ref = ref); } },
            react_1.default.createElement(builder_meta_1.BuilderMetaContext.Consumer, null, function (value) { return (react_1.default.createElement(builder_meta_1.BuilderMetaContext.Provider, { value: typeof _this.props.ampMode === 'boolean'
                    ? __assign(__assign({}, value), { ampMode: _this.props.ampMode }) : value },
                react_1.default.createElement(builder_async_requests_1.BuilderAsyncRequestsContext.Consumer, null, function (value) {
                    var _a;
                    _this._asyncRequests = value && value.requests;
                    _this._errors = value && value.errors;
                    _this._logs = value && value.logs;
                    return (react_1.default.createElement(builder_content_component_1.BuilderContent, { isStatic: _this.props.isStatic || sdk_1.Builder.isStatic, key: ((_a = _this.inlinedContent) === null || _a === void 0 ? void 0 : _a.id) ||
                            ('content' in _this.props && !_this.isPreviewing
                                ? 'null-content-prop'
                                : 'no-content-prop'), builder: _this.builder, ref: function (ref) { return (_this.contentRef = ref); }, 
                        // TODO: pass entry in
                        contentLoaded: function (data, content) { return _this.onContentLoaded(data, content); }, options: __assign(__assign(__assign(__assign(__assign(__assign({ key: key, entry: _this.props.entry }, (content && { initialContent: [content] })), (!content &&
                            'content' in _this.props &&
                            !_this.isPreviewing && { initialContent: [] })), (_this.props.url && { url: _this.props.url })), _this.props.options), (_this.props.locale ? { locale: _this.props.locale } : {})), (_this.options.codegen && {
                            format: 'react',
                        })), inline: _this.props.inlineContent || (!_this.isPreviewing && 'content' in _this.props), contentError: _this.props.contentError, modelName: _this.name || 'page' }, function (data, loading, fullData) {
                        var _a;
                        if (_this.props.dataOnly) {
                            return null;
                        }
                        if (fullData && fullData.id) {
                            if (_this.state.breakpoints) {
                                fullData.meta = fullData.meta || {};
                                fullData.meta.breakpoints = _this.state.breakpoints;
                            }
                            _this.state.context.builderContent = fullData;
                        }
                        if (sdk_1.Builder.isBrowser) {
                            sdk_1.Builder.nextTick(function () {
                                _this.checkStyles(data);
                            });
                        }
                        var codegen = _this.options.codegen;
                        if (codegen && !_this.Component && (data === null || data === void 0 ? void 0 : data.blocksJs)) {
                            var builderComponentNames = Array.from(new Set(sdk_1.Builder.components.map(function (item) { return item.name; })));
                            var reversedcomponents_1 = sdk_1.Builder.components.slice().reverse();
                            var builderComponents = builderComponentNames.map(function (name) {
                                return reversedcomponents_1.find(function (item) { return item.class && item.name === name; });
                            });
                            var useBuilderState = function (initialState) {
                                var _a = react_1.default.useState(0), setTick = _a[1];
                                var state = react_1.default.useState(function () {
                                    return (0, on_change_1.default)(initialState, function () {
                                        setTick(function (tick) { return tick + 1; });
                                    });
                                })[0];
                                return state;
                            };
                            var mappedComponentNames = builderComponentNames.map(function (name) {
                                return (name || '').replace(/[^\w]+/gi, '');
                            });
                            var finalizedComponents = builderComponents.map(function (info) {
                                return wrapComponent(info);
                            });
                            _this.Component = new (Function.bind.apply(Function, __spreadArray(__spreadArray([void 0, 'jsx',
                                '_css',
                                'Builder',
                                'builder',
                                'React',
                                'useBuilderState'], mappedComponentNames, false), [data.blocksJs], false)))().apply(void 0, __spreadArray([core_1.jsx,
                                core_1.css,
                                sdk_1.Builder,
                                sdk_1.builder,
                                react_1.default,
                                useBuilderState], finalizedComponents, false));
                        }
                        var blocks = (data === null || data === void 0 ? void 0 : data.blocks) || [];
                        var hasPixel = blocks.find(function (block) { var _a; return (_a = block.id) === null || _a === void 0 ? void 0 : _a.startsWith('builder-pixel'); });
                        if (data && !hasPixel && blocks.length > 0) {
                            blocks.push((0, get_builder_pixel_1.getBuilderPixel)(sdk_1.builder.apiKey));
                        }
                        // TODO: loading option - maybe that is what the children is or component prop
                        // TODO: get rid of all these wrapper divs
                        return data ? (react_1.default.createElement("div", __assign({ "data-builder-component": _this.name, "data-builder-content-id": fullData.id }, (_this.isPreviewing
                            ? {
                                'data-builder-variation-id': fullData.testVariationId || fullData.variationId || fullData.id,
                            }
                            : {})),
                            !codegen && _this.getCss(data) && (react_1.default.createElement("style", { ref: function (ref) { return (_this.styleRef = ref); }, className: "builder-custom-styles", dangerouslySetInnerHTML: {
                                    __html: _this.getCss(data),
                                } })),
                            react_1.default.createElement(builder_store_1.BuilderStoreContext.Provider, { value: __assign(__assign({}, _this.state), { rootState: _this.rootState, state: _this.data, content: fullData, renderLink: _this.props.renderLink }) }, codegen && _this.Component ? (react_1.default.createElement(_this.Component, { data: _this.data, context: _this.state.context })) : (react_1.default.createElement(builder_blocks_component_1.BuilderBlocks, { key: String(!!((_a = data === null || data === void 0 ? void 0 : data.blocks) === null || _a === void 0 ? void 0 : _a.length)), emailMode: _this.props.emailMode, fieldName: "blocks", blocks: blocks }))))) : loading ? (react_1.default.createElement("div", { "data-builder-component": _this.name, className: "builder-loading" }, _this.props.children)) : (react_1.default.createElement("div", { "data-builder-component": _this.name, className: "builder-no-content" }));
                    }));
                }))); })));
    };
    BuilderComponent.prototype.evalExpression = function (expression) {
        var _this = this;
        var data = this.data;
        return String(expression).replace(/{{([^}]+)}}/g, function (match, group) {
            return (0, try_eval_1.tryEval)(group, data, _this._errors);
        });
    };
    BuilderComponent.prototype.handleRequest = function (propertyName, url) {
        return __awaiter(this, void 0, void 0, function () {
            var request, existing, promise_1, promise;
            var _this = this;
            return __generator(this, function (_a) {
                // TODO: Builder.isEditing = just checks if iframe and parent page is this.builder.io or localhost:1234
                if (sdk_1.Builder.isIframe && fetchCache[url]) {
                    this.updateState(function (ctx) {
                        ctx[propertyName] = fetchCache[url];
                    });
                    return [2 /*return*/, fetchCache[url]];
                }
                request = function () { return __awaiter(_this, void 0, void 0, function () {
                    var requestStart, json, result, err_1, error;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                requestStart = Date.now();
                                if (!sdk_1.Builder.isBrowser) {
                                    console.time('Fetch ' + url);
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, 5, 6]);
                                return [4 /*yield*/, fetch(url)];
                            case 2:
                                result = _a.sent();
                                return [4 /*yield*/, result.json()];
                            case 3:
                                json = _a.sent();
                                return [3 /*break*/, 6];
                            case 4:
                                err_1 = _a.sent();
                                error = (0, to_error_1.toError)(err_1);
                                if (this._errors) {
                                    this._errors.push(error);
                                }
                                if (this._logs) {
                                    this._logs.push("Fetch to ".concat(url, " errored in ").concat(Date.now() - requestStart, "ms"));
                                }
                                return [2 /*return*/];
                            case 5:
                                if (!sdk_1.Builder.isBrowser) {
                                    console.timeEnd('Fetch ' + url);
                                    if (this._logs) {
                                        this._logs.push("Fetched ".concat(url, " in ").concat(Date.now() - requestStart, "ms"));
                                    }
                                }
                                return [7 /*endfinally*/];
                            case 6:
                                if (json) {
                                    if (sdk_1.Builder.isIframe) {
                                        fetchCache[url] = json;
                                    }
                                    // TODO: debounce next tick all of these when there are a bunch
                                    this.updateState(function (ctx) {
                                        ctx[propertyName] = json;
                                    });
                                }
                                return [2 /*return*/, json];
                        }
                    });
                }); };
                existing = this._asyncRequests &&
                    this._asyncRequests.find(function (req) { return (0, builder_async_requests_1.isRequestInfo)(req) && req.url === url; });
                if (existing) {
                    promise_1 = existing.promise;
                    promise_1.then(function (json) {
                        if (json) {
                            _this.updateState(function (ctx) {
                                ctx[propertyName] = json;
                            });
                        }
                    });
                    return [2 /*return*/, promise_1];
                }
                promise = request();
                sdk_1.Builder.nextTick(function () {
                    if (_this._asyncRequests) {
                        _this._asyncRequests.push(promise);
                    }
                });
                return [2 /*return*/, promise];
            });
        });
    };
    BuilderComponent.prototype.unsubscribe = function () {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
            this.subscriptions = new sdk_1.Subscription();
        }
    };
    BuilderComponent.prototype.handleBuilderRequest = function (propertyName, optionsString) {
        var _this = this;
        var options = (0, try_eval_1.tryEval)(optionsString, this.data, this._errors);
        // TODO: this will screw up for multiple bits of data
        if (this.subscriptions) {
            this.unsubscribe();
        }
        // TODO: don't unsubscribe and resubscribe every time data changes, will make a TON of requests if that's the case when editing...
        // I guess will be cached then
        if (options) {
            // TODO: unsubscribe on destroy
            this.subscriptions.add(this.builder.queueGetContent(options.model, options).subscribe(function (matches) {
                if (matches) {
                    _this.updateState(function (ctx) {
                        ctx[propertyName] = matches;
                    });
                }
            }));
        }
    };
    BuilderComponent.defaults = {
        codegen: Boolean(sdk_1.Builder.isBrowser && location.href.includes('builder.codegen=true')),
    };
    __decorate([
        debonce_next_tick_1.debounceNextTick,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], BuilderComponent.prototype, "notifyStateChange", null);
    return BuilderComponent;
}(react_1.default.Component));
exports.BuilderComponent = BuilderComponent;
//# sourceMappingURL=builder-component.component.js.map