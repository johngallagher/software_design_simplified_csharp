"use strict";
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
exports.Builder = exports.BuilderComponent = exports.isIframe = exports.isBrowser = exports.validEnvList = exports.isReactNative = void 0;
require("./polyfills/custom-event-polyfill");
var next_tick_function_1 = require("./functions/next-tick.function");
var query_string_class_1 = require("./classes/query-string.class");
var package_json_1 = require("../package.json");
var observable_class_1 = require("./classes/observable.class");
var fetch_function_1 = require("./functions/fetch.function");
var assign_function_1 = require("./functions/assign.function");
var throttle_function_1 = require("./functions/throttle.function");
var animator_class_1 = require("./classes/animator.class");
var cookies_class_1 = __importDefault(require("./classes/cookies.class"));
var omit_function_1 = require("./functions/omit.function");
var get_top_level_domain_1 = require("./functions/get-top-level-domain");
var uuid_1 = require("./functions/uuid");
var url_1 = require("./url");
// Do not change this to a require! It throws runtime errors - rollup
// will preserve the `require` and throw runtime errors
var hash_sum_1 = __importDefault(require("hash-sum"));
var to_error_1 = require("./functions/to-error");
var url_2 = require("./url");
var api_version_1 = require("./types/api-version");
function datePlusMinutes(minutes) {
    if (minutes === void 0) { minutes = 30; }
    return new Date(Date.now() + minutes * 60000);
}
var isPositiveNumber = function (thing) {
    return typeof thing === 'number' && !isNaN(thing) && thing >= 0;
};
exports.isReactNative = typeof navigator === 'object' && navigator.product === 'ReactNative';
exports.validEnvList = [
    'production',
    'qa',
    'test',
    'development',
    'dev',
    'cdn-qa',
    'cloud',
    'fast',
    'cdn2',
    'cdn-prod',
];
function getQueryParam(url, variable) {
    var query = url.split('?')[1] || '';
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}
var urlParser = {
    parse: function (url) {
        var el = document.createElement('a');
        el.href = url;
        var out = {};
        var props = [
            'username',
            'password',
            'host',
            'hostname',
            'port',
            'protocol',
            'origin',
            'pathname',
            'search',
            'hash',
        ];
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var prop = props_1[_i];
            out[prop] = el[prop];
        }
        // IE 11 pathname handling workaround
        // (IE omits preceeding '/', unlike other browsers)
        if ((out.pathname || out.pathname === '') &&
            typeof out.pathname === 'string' &&
            out.pathname.indexOf('/') !== 0) {
            out.pathname = '/' + out.pathname;
        }
        return out;
    },
};
var parse = exports.isReactNative
    ? function () { return (0, url_2.emptyUrl)(); }
    : typeof window === 'object'
        ? urlParser.parse
        : url_1.parse;
function setCookie(name, value, expires) {
    try {
        var expiresString = '';
        // TODO: need to know if secure server side
        if (expires) {
            expiresString = '; expires=' + expires.toUTCString();
        }
        var secure = exports.isBrowser ? location.protocol === 'https:' : true;
        document.cookie =
            name +
                '=' +
                (value || '') +
                expiresString +
                '; path=/' +
                "; domain=".concat((0, get_top_level_domain_1.getTopLevelDomain)(location.hostname)) +
                (secure ? ';secure ; SameSite=None' : '');
    }
    catch (err) {
        console.warn('Could not set cookie', err);
    }
}
function getCookie(name) {
    try {
        return (decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' +
            encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&') +
            '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null);
    }
    catch (err) {
        console.warn('Could not get cookie', err);
    }
}
function size(object) {
    return Object.keys(object).length;
}
function find(target, callback) {
    var list = target;
    // Makes sures is always has an positive integer as length.
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    for (var i = 0; i < length; i++) {
        var element = list[i];
        if (callback.call(thisArg, element, i, list)) {
            return element;
        }
    }
}
var sessionStorageKey = 'builderSessionId';
var localStorageKey = 'builderVisitorId';
exports.isBrowser = typeof window !== 'undefined' && !exports.isReactNative;
exports.isIframe = exports.isBrowser && window.top !== window.self;
function BuilderComponent(info) {
    if (info === void 0) { info = {}; }
    return Builder.Component(info);
}
exports.BuilderComponent = BuilderComponent;
var Builder = /** @class */ (function () {
    function Builder(apiKey, request, response, forceNewInstance, authToken, apiVersion) {
        if (apiKey === void 0) { apiKey = null; }
        if (forceNewInstance === void 0) { forceNewInstance = false; }
        if (authToken === void 0) { authToken = null; }
        var _this = this;
        this.request = request;
        this.response = response;
        this.eventsQueue = [];
        this.throttledClearEventsQueue = (0, throttle_function_1.throttle)(function () {
            _this.processEventsQueue();
            // Extend the session cookie
            _this.setCookie(sessionStorageKey, _this.sessionId, datePlusMinutes(30));
        }, 5);
        this.env = 'production';
        this.sessionId = this.getSessionId();
        this.targetContent = true;
        this.contentPerRequest = 1;
        // TODO: make array or function
        this.allowCustomFonts = true;
        this.cookies = null;
        // TODO: api options object
        this.cachebust = false;
        this.overrideParams = '';
        this.noCache = false;
        this.preview = false;
        this.apiVersion$ = new observable_class_1.BehaviorSubject(undefined);
        this.canTrack$ = new observable_class_1.BehaviorSubject(!this.browserTrackingDisabled);
        this.apiKey$ = new observable_class_1.BehaviorSubject(null);
        this.authToken$ = new observable_class_1.BehaviorSubject(null);
        this.userAttributesChanged = new observable_class_1.BehaviorSubject(null);
        this.editingMode$ = new observable_class_1.BehaviorSubject(exports.isIframe);
        // TODO: decorator to do this stuff with the get/set (how do with typing too? compiler?)
        this.editingModel$ = new observable_class_1.BehaviorSubject(null);
        this.userAgent = (typeof navigator === 'object' && navigator.userAgent) || '';
        this.trackingHooks = [];
        // Set this to control the userId
        // TODO: allow changing it mid session and updating existing data to be associated
        // e.g. for when a user navigates and then logs in
        this.visitorId = this.getVisitorId();
        this.autoTrack = !Builder.isBrowser
            ? false
            : !this.isDevelopmentEnv &&
                !(Builder.isBrowser && location.search.indexOf('builder.preview=') !== -1);
        this.trackingUserAttributes = {};
        this.blockContentLoading = '';
        this.observersByKey = {};
        this.noEditorUpdates = {};
        this.overrides = {};
        this.queryOptions = {};
        this.getContentQueue = null;
        this.priorContentQueue = null;
        this.testCookiePrefix = 'builder.tests';
        this.cookieQueue = [];
        // TODO: use a window variable for this perhaps, e.g. bc webcomponents may be loading builder twice
        // with it's and react (use rollup build to fix)
        if (Builder.isBrowser && !forceNewInstance && Builder.singletonInstance) {
            return Builder.singletonInstance;
        }
        if (this.request && this.response) {
            this.setUserAgent(this.request.headers['user-agent'] || '');
            this.cookies = new cookies_class_1.default(this.request, this.response);
        }
        if (apiKey) {
            this.apiKey = apiKey;
        }
        if (apiVersion) {
            this.apiVersion = apiVersion;
        }
        if (authToken) {
            this.authToken = authToken;
        }
        if (exports.isBrowser) {
            this.bindMessageListeners();
            if (Builder.isEditing) {
                parent.postMessage({
                    type: 'builder.animatorOptions',
                    data: {
                        options: {
                            version: 2,
                        },
                    },
                }, '*');
            }
            // TODO: postmessage to parent the builder info for every package
            // type: 'builder.sdk', data: { name: '@builder.io/react', version: '0.1.23' }
            // (window as any).BUILDER_VERSION = Builder.VERSION;
            // Ensure always one Builder global singleton
            // TODO: some people won't want this, e.g. rakuten
            // Maybe hide this behind symbol or on document, etc
            // if ((window as any).Builder) {
            //   Builder.components = (window as any).Builder.components;
            // } else {
            //   (window as any).Builder = Builder;
            // }
        }
        if (exports.isIframe) {
            this.messageFrameLoaded();
        }
        // TODO: on destroy clear subscription
        this.canTrack$.subscribe(function (value) {
            if (value) {
                if (typeof sessionStorage !== 'undefined') {
                    try {
                        if (!sessionStorage.getItem(sessionStorageKey)) {
                            sessionStorage.setItem(sessionStorageKey, _this.sessionId);
                        }
                    }
                    catch (err) {
                        console.debug('Session storage error', err);
                    }
                }
                if (_this.eventsQueue.length) {
                    _this.throttledClearEventsQueue();
                }
                if (_this.cookieQueue.length) {
                    _this.cookieQueue.forEach(function (item) {
                        _this.setCookie(item[0], item[1]);
                    });
                    _this.cookieQueue.length = 0;
                }
            }
        });
        if (exports.isBrowser) {
            // TODO: defer so subclass constructor runs and injects location service
            this.setTestsFromUrl();
            // TODO: do this on every request send?
            this.getOverridesFromQueryString();
        }
    }
    Builder.register = function (type, info) {
        // TODO: all must have name and can't conflict?
        var typeList = this.registry[type];
        if (!typeList) {
            typeList = this.registry[type] = [];
        }
        typeList.push(info);
        if (Builder.isBrowser) {
            var message = {
                type: 'builder.register',
                data: {
                    type: type,
                    info: info,
                },
            };
            try {
                parent.postMessage(message, '*');
                if (parent !== window) {
                    window.postMessage(message, '*');
                }
            }
            catch (err) {
                console.debug('Could not postmessage', err);
            }
        }
        this.registryChange.next(this.registry);
    };
    Builder.registerEditor = function (info) {
        if (Builder.isBrowser) {
            window.postMessage({
                type: 'builder.registerEditor',
                data: (0, omit_function_1.omit)(info, 'component'),
            }, '*');
            var hostname = location.hostname;
            if (!Builder.isTrustedHost(hostname)) {
                console.error('Builder.registerEditor() called in the wrong environment! You cannot load custom editors from your app, they must be loaded through the Builder.io app itself. Follow the readme here for more details: https://github.com/builderio/builder/tree/master/plugins/cloudinary or contact chat us in our Spectrum community for help: https://spectrum.chat/builder');
            }
        }
        this.editors.push(info);
    };
    Builder.registerPlugin = function (info) {
        this.plugins.push(info);
    };
    Builder.registerAction = function (action) {
        this.actions.push(action);
    };
    Builder.registerTrustedHost = function (host) {
        this.trustedHosts.push(host);
    };
    Builder.isTrustedHost = function (hostname) {
        return (this.trustedHosts.findIndex(function (trustedHost) { return trustedHost === hostname || hostname.endsWith(".".concat(trustedHost)); }) > -1);
    };
    Builder.runAction = function (action) {
        // TODO
        var actionObject = typeof action === 'string' ? find(this.actions, function (item) { return item.name === action; }) : action;
        if (!actionObject) {
            throw new Error("Action not found: ".concat(action));
        }
    };
    Builder.fields = function (name, fields) {
        var _a;
        (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
            type: 'builder.fields',
            data: { name: name, fields: fields },
        }, '*');
    };
    /**
     * @deprecated
     * @hidden
     *
     * Use Builder.register('editor.settings', {}) instead.
     */
    Builder.set = function (settings) {
        Builder.register('editor.settings', settings);
    };
    Builder.import = function (packageName) {
        if (!Builder.isBrowser) {
            // TODO: server side support *maybe*
            console.warn('Builder.import used on the server - this should only be used in the browser');
            return;
        }
        var System = window.System;
        if (!System) {
            console.warn('System.js not available. Please include System.js when using Builder.import');
            return;
        }
        return System.import("https://cdn.builder.io/systemjs/".concat(packageName));
    };
    Object.defineProperty(Builder, "editingPage", {
        // useCdnApi = false;
        get: function () {
            return this._editingPage;
        },
        set: function (editingPage) {
            this._editingPage = editingPage;
            if (exports.isBrowser && exports.isIframe) {
                if (editingPage) {
                    document.body.classList.add('builder-editing-page');
                }
                else {
                    document.body.classList.remove('builder-editing-page');
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Builder.prepareComponentSpecToSend = function (spec) {
        return __assign(__assign(__assign({}, spec), (spec.inputs && {
            inputs: spec.inputs.map(function (input) {
                var _a;
                // TODO: do for nexted fields too
                // TODO: probably just convert all functions, not just
                // TODO: put this in input hooks: { onChange: ..., showIf: ... }
                var keysToConvertFnToString = ['onChange', 'showIf'];
                for (var _i = 0, keysToConvertFnToString_1 = keysToConvertFnToString; _i < keysToConvertFnToString_1.length; _i++) {
                    var key = keysToConvertFnToString_1[_i];
                    if (input[key] && typeof input[key] === 'function') {
                        var fn = input[key];
                        input = __assign(__assign({}, input), (_a = {}, _a[key] = "return (".concat(fn.toString(), ").apply(this, arguments)"), _a));
                    }
                }
                return input;
            }),
        })), { hooks: Object.keys(spec.hooks || {}).reduce(function (memo, key) {
                var value = spec.hooks && spec.hooks[key];
                if (!value) {
                    return memo;
                }
                if (typeof value === 'string') {
                    memo[key] = value;
                }
                else {
                    memo[key] = "return (".concat(value.toString(), ").apply(this, arguments)");
                }
                return memo;
            }, {}), class: undefined });
    };
    Builder.registerBlock = function (component, options) {
        this.registerComponent(component, options);
    };
    Builder.registerComponent = function (component, options) {
        var _a;
        var spec = __assign(__assign({ class: component }, component.builderOptions), options);
        this.addComponent(spec);
        var editable = options.models && this.singletonInstance.editingModel
            ? exports.isBrowser && options.models.includes(this.singletonInstance.editingModel)
            : exports.isBrowser;
        if (editable) {
            var sendSpec = this.prepareComponentSpecToSend(spec);
            (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                type: 'builder.registerComponent',
                data: sendSpec,
            }, '*');
        }
    };
    Builder.addComponent = function (component) {
        var current = find(this.components, function (item) { return item.name === component.name; });
        if (current) {
            // FIXME: why does sometimes we get an extra post without class - probably
            // from postMessage handler wrong in some place
            if (current.class && !component.class) {
                return;
            }
            this.components.splice(this.components.indexOf(current), 1, component);
        }
        else {
            this.components.push(component);
        }
    };
    // TODO: style guide, etc off this system as well?
    Builder.component = function (info) {
        var _this = this;
        if (info === void 0) { info = {}; }
        return function (component) {
            var _a;
            var spec = __assign(__assign({}, info), { class: component });
            if (!spec.name) {
                spec.name = component.name;
            }
            _this.addComponent(spec);
            var sendSpec = _this.prepareComponentSpecToSend(spec);
            // TODO: serialize component name and inputs
            if (exports.isBrowser) {
                (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                    type: 'builder.registerComponent',
                    data: sendSpec,
                }, '*');
            }
            return component;
        };
    };
    Object.defineProperty(Builder, "Component", {
        get: function () {
            return this.component;
        },
        enumerable: false,
        configurable: true
    });
    Builder.prototype.processEventsQueue = function () {
        if (!this.eventsQueue.length) {
            return;
        }
        var events = this.eventsQueue;
        this.eventsQueue = [];
        var fullUserAttributes = __assign(__assign({}, Builder.overrideUserAttributes), this.trackingUserAttributes);
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            if (!event_1.data.metadata) {
                event_1.data.metadata = {};
            }
            if (!event_1.data.metadata.user) {
                event_1.data.metadata.user = {};
            }
            Object.assign(event_1.data.metadata.user, fullUserAttributes, event_1.data.metadata.user);
        }
        var host = this.host;
        (0, fetch_function_1.getFetch)()("".concat(host, "/api/v1/track"), {
            method: 'POST',
            body: JSON.stringify({ events: events }),
            headers: {
                'content-type': 'application/json',
            },
            mode: 'cors',
        }).catch(function () {
            // Not the end of the world
        });
    };
    Object.defineProperty(Builder.prototype, "browserTrackingDisabled", {
        get: function () {
            return Builder.isBrowser && Boolean(window.builderNoTrack || !navigator.cookieEnabled);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "canTrack", {
        get: function () {
            return this.canTrack$.value;
        },
        set: function (canTrack) {
            if (this.canTrack !== canTrack) {
                this.canTrack$.next(canTrack);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "apiVersion", {
        get: function () {
            return this.apiVersion$.value;
        },
        set: function (apiVersion) {
            if (this.apiVersion !== apiVersion) {
                this.apiVersion$.next(apiVersion);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "editingMode", {
        get: function () {
            return this.editingMode$.value;
        },
        set: function (value) {
            if (value !== this.editingMode) {
                this.editingMode$.next(value);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "editingModel", {
        get: function () {
            return this.editingModel$.value;
        },
        set: function (value) {
            if (value !== this.editingModel) {
                this.editingModel$.next(value);
            }
        },
        enumerable: false,
        configurable: true
    });
    Builder.prototype.findParentElement = function (target, callback, checkElement) {
        if (checkElement === void 0) { checkElement = true; }
        if (!(target instanceof HTMLElement)) {
            return null;
        }
        var parent = checkElement ? target : target.parentElement;
        do {
            if (!parent) {
                return null;
            }
            var matches = callback(parent);
            if (matches) {
                return parent;
            }
        } while ((parent = parent.parentElement));
        return null;
    };
    Builder.prototype.findBuilderParent = function (target) {
        return this.findParentElement(target, function (el) {
            var id = el.getAttribute('builder-id') || el.id;
            return Boolean(id && id.indexOf('builder-') === 0);
        });
    };
    Builder.prototype.setUserAgent = function (userAgent) {
        this.userAgent = userAgent || '';
    };
    /**
     * Set a hook to modify events being tracked from builder, such as impressions and clicks
     *
     * For example, to track the model ID of each event associated with content for querying
     * by mode, you can do
     *
     *    builder.setTrackingHook((event, context) => {
     *      if (context.content) {
     *        event.data.metadata.modelId = context.content.modelId
     *      }
     *    })
     */
    Builder.prototype.setTrackingHook = function (hook) {
        this.trackingHooks.push(hook);
    };
    Builder.prototype.track = function (eventName, properties, context) {
        if (properties === void 0) { properties = {}; }
        // TODO: queue up track requests and fire them off when canTrack set to true - otherwise may get lots of clicks with no impressions
        if (exports.isIframe || !exports.isBrowser || Builder.isPreviewing) {
            return;
        }
        var apiKey = this.apiKey;
        if (!apiKey) {
            console.error('Builder integration error: Looks like the Builder SDK has not been initialized properly (your API key has not been set). Make sure you are calling `builder.init("«YOUR-API-KEY»");` as early as possible in your application\'s code.');
            return;
        }
        var eventData = JSON.parse(JSON.stringify({
            type: eventName,
            data: __assign(__assign({}, (0, omit_function_1.omit)(properties, 'meta')), { metadata: __assign(__assign({ sdkVersion: Builder.VERSION, url: location.href }, properties.meta), properties.metadata), ownerId: apiKey, userAttributes: this.getUserAttributes(), sessionId: this.sessionId, visitorId: this.visitorId }),
        }));
        for (var _i = 0, _a = this.trackingHooks; _i < _a.length; _i++) {
            var hook = _a[_i];
            var returnValue = hook(eventData, context || {});
            if (returnValue) {
                eventData = returnValue;
            }
        }
        // batch events
        this.eventsQueue.push(eventData);
        if (this.canTrack) {
            this.throttledClearEventsQueue();
        }
    };
    Builder.prototype.getSessionId = function () {
        var _this = this;
        var sessionId = null;
        try {
            if (Builder.isBrowser && typeof sessionStorage !== 'undefined') {
                sessionId = this.getCookie(sessionStorageKey);
            }
        }
        catch (err) {
            console.debug('Session storage error', err);
            // It's ok
        }
        if (!sessionId) {
            sessionId = (0, uuid_1.uuid)();
        }
        // Give the app a second to start up and set canTrack to false if needed
        if (Builder.isBrowser) {
            setTimeout(function () {
                try {
                    if (_this.canTrack) {
                        _this.setCookie(sessionStorageKey, sessionId, datePlusMinutes(30));
                    }
                }
                catch (err) {
                    console.debug('Cookie setting error', err);
                }
            });
        }
        return sessionId;
    };
    Builder.prototype.getVisitorId = function () {
        var _this = this;
        if (this.visitorId) {
            return this.visitorId;
        }
        var visitorId = null;
        try {
            if (Builder.isBrowser && typeof localStorage !== 'undefined') {
                // TODO: cookie instead?
                visitorId = localStorage.getItem(localStorageKey);
            }
        }
        catch (err) {
            console.debug('Local storage error', err);
            // It's ok
        }
        if (!visitorId) {
            visitorId = (0, uuid_1.uuid)();
        }
        this.visitorId = visitorId;
        // Give the app a second to start up and set canTrack to false if needed
        if (Builder.isBrowser) {
            setTimeout(function () {
                try {
                    if (_this.canTrack && typeof localStorage !== 'undefined' && visitorId) {
                        localStorage.setItem(localStorageKey, visitorId);
                    }
                }
                catch (err) {
                    console.debug('Session storage error', err);
                }
            });
        }
        return visitorId;
    };
    Builder.prototype.trackImpression = function (contentId, variationId, properties, context) {
        if (exports.isIframe || !exports.isBrowser || Builder.isPreviewing) {
            return;
        }
        // TODO: use this.track method
        this.track('impression', {
            contentId: contentId,
            variationId: variationId !== contentId ? variationId : undefined,
            metadata: properties,
        }, context);
    };
    Builder.prototype.trackConversion = function (amount, contentId, variationId, customProperties, context) {
        if (exports.isIframe || !exports.isBrowser || Builder.isPreviewing) {
            return;
        }
        var meta = typeof contentId === 'object' ? contentId : customProperties;
        var useContentId = typeof contentId === 'string' ? contentId : undefined;
        this.track('conversion', { amount: amount, variationId: variationId, meta: meta, contentId: useContentId }, context);
    };
    Object.defineProperty(Builder.prototype, "isDevelopmentEnv", {
        // TODO: set this for QA
        get: function () {
            // Automatic determining of development environment
            return (Builder.isIframe ||
                (Builder.isBrowser && (location.hostname === 'localhost' || location.port !== '')) ||
                this.env !== 'production');
        },
        enumerable: false,
        configurable: true
    });
    Builder.prototype.trackInteraction = function (contentId, variationId, alreadyTrackedOne, event, context) {
        if (alreadyTrackedOne === void 0) { alreadyTrackedOne = false; }
        if (exports.isIframe || !exports.isBrowser || Builder.isPreviewing) {
            return;
        }
        var target = event && event.target;
        var targetBuilderElement = target && this.findBuilderParent(target);
        function round(num) {
            return Math.round(num * 1000) / 1000;
        }
        var metadata = {};
        if (event) {
            var clientX = event.clientX, clientY = event.clientY;
            if (target) {
                var targetRect = target.getBoundingClientRect();
                var xOffset = clientX - targetRect.left;
                var yOffset = clientY - targetRect.top;
                var xRatio = round(xOffset / targetRect.width);
                var yRatio = round(yOffset / targetRect.height);
                metadata.targetOffset = {
                    x: xRatio,
                    y: yRatio,
                };
            }
            if (targetBuilderElement) {
                var targetRect = targetBuilderElement.getBoundingClientRect();
                var xOffset = clientX - targetRect.left;
                var yOffset = clientY - targetRect.top;
                var xRatio = round(xOffset / targetRect.width);
                var yRatio = round(yOffset / targetRect.height);
                metadata.builderTargetOffset = {
                    x: xRatio,
                    y: yRatio,
                };
            }
        }
        var builderId = targetBuilderElement &&
            (targetBuilderElement.getAttribute('builder-id') || targetBuilderElement.id);
        if (builderId && targetBuilderElement) {
            metadata.builderElementIndex = [].slice
                .call(document.getElementsByClassName(builderId))
                .indexOf(targetBuilderElement);
        }
        this.track('click', {
            contentId: contentId,
            metadata: metadata,
            variationId: variationId !== contentId ? variationId : undefined,
            unique: !alreadyTrackedOne,
            targetBuilderElement: builderId || undefined,
        }, context);
    };
    Builder.prototype.component = function (info) {
        if (info === void 0) { info = {}; }
        return Builder.component(info);
    };
    Object.defineProperty(Builder.prototype, "apiKey", {
        get: function () {
            return this.apiKey$.value;
        },
        set: function (key) {
            this.apiKey$.next(key);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "authToken", {
        get: function () {
            return this.authToken$.value;
        },
        set: function (token) {
            this.authToken$.next(token);
        },
        enumerable: false,
        configurable: true
    });
    Builder.prototype.modifySearch = function (search) {
        return search.replace(/(^|&|\?)(builder_.*?)=/gi, function (_match, group1, group2) { return group1 + group2.replace(/_/g, '.') + '='; });
    };
    Builder.prototype.setTestsFromUrl = function () {
        var search = this.getLocation().search;
        var params = query_string_class_1.QueryString.parseDeep(this.modifySearch(search || '').substr(1));
        var tests = params.builder && params.builder.tests;
        if (tests && typeof tests === 'object') {
            for (var key in tests) {
                if (tests.hasOwnProperty(key)) {
                    this.setTestCookie(key, tests[key]);
                }
            }
        }
    };
    Builder.prototype.resetOverrides = function () {
        // Ugly - pass down instances per request instead using react context
        // or use builder.get('foo', { req, res }) in react...........
        Builder.overrideUserAttributes = {};
        this.cachebust = false;
        this.noCache = false;
        this.preview = false;
        this.editingModel = null;
        this.overrides = {};
        this.env = 'production';
        this.userAgent = '';
        this.request = undefined;
        this.response = undefined;
    };
    Builder.prototype.getOverridesFromQueryString = function () {
        var location = this.getLocation();
        var params = query_string_class_1.QueryString.parseDeep(this.modifySearch(location.search || '').substr(1));
        var builder = params.builder;
        if (builder) {
            var userAttributes = builder.userAttributes, overrides = builder.overrides, env = builder.env, host = builder.host, api = builder.api, cachebust = builder.cachebust, noCache = builder.noCache, preview = builder.preview, editing = builder.editing, frameEditing = builder.frameEditing, options = builder.options, overrideParams = builder.params;
            if (userAttributes) {
                this.setUserAttributes(userAttributes);
            }
            if (options) {
                // picking only locale, includeRefs, and enrich for now
                this.queryOptions = __assign(__assign(__assign({}, (options.locale && { locale: options.locale })), (options.includeRefs && { includeRefs: options.includeRefs })), (options.enrich && { enrich: options.enrich }));
            }
            if (overrides) {
                this.overrides = overrides;
            }
            if (exports.validEnvList.indexOf(env || api) > -1) {
                this.env = env || api;
            }
            if (Builder.isEditing) {
                var editingModel = frameEditing || editing || preview;
                if (editingModel && editingModel !== 'true') {
                    this.editingModel = editingModel;
                }
            }
            if (cachebust) {
                this.cachebust = true;
            }
            if (noCache) {
                this.noCache = true;
            }
            if (preview) {
                this.preview = true;
            }
            if (params) {
                this.overrideParams = overrideParams;
            }
        }
    };
    Builder.prototype.messageFrameLoaded = function () {
        var _a;
        (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
            type: 'builder.loaded',
            data: {
                value: true,
            },
        }, '*');
    };
    Builder.prototype.bindMessageListeners = function () {
        var _this = this;
        if (exports.isBrowser) {
            addEventListener('message', function (event) {
                var _a, _b, _c, _d, _e;
                var url = parse(event.origin);
                var isRestricted = ['builder.register', 'builder.registerComponent'].indexOf((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === -1;
                var isTrusted = url.hostname && Builder.isTrustedHost(url.hostname);
                if (isRestricted && !isTrusted) {
                    return;
                }
                var data = event.data;
                if (data) {
                    switch (data.type) {
                        case 'builder.ping': {
                            (_b = window.parent) === null || _b === void 0 ? void 0 : _b.postMessage({
                                type: 'builder.pong',
                                data: {},
                            }, '*');
                            break;
                        }
                        case 'builder.register': {
                            // TODO: possibly do this for all...
                            if (event.source === window) {
                                break;
                            }
                            var options = data.data;
                            if (!options) {
                                break;
                            }
                            var type = options.type, info = options.info;
                            // TODO: all must have name and can't conflict?
                            var typeList = Builder.registry[type];
                            if (!typeList) {
                                typeList = Builder.registry[type] = [];
                            }
                            typeList.push(info);
                            Builder.registryChange.next(Builder.registry);
                            break;
                        }
                        case 'builder.settingsChange': {
                            // TODO: possibly do this for all...
                            if (event.source === window) {
                                break;
                            }
                            var settings = data.data;
                            if (!settings) {
                                break;
                            }
                            Object.assign(Builder.settings, settings);
                            Builder.settingsChange.next(Builder.settings);
                            break;
                        }
                        case 'builder.registerEditor': {
                            // TODO: possibly do this for all...
                            if (event.source === window) {
                                break;
                            }
                            var info_1 = data.data;
                            if (!info_1) {
                                break;
                            }
                            var hasComponent_1 = !!info_1.component;
                            Builder.editors.every(function (thisInfo, index) {
                                if (info_1.name === thisInfo.name) {
                                    if (thisInfo.component && !hasComponent_1) {
                                        return false;
                                    }
                                    else {
                                        Builder.editors[index] = thisInfo;
                                    }
                                    return false;
                                }
                                return true;
                            });
                            break;
                        }
                        case 'builder.triggerAnimation': {
                            Builder.animator.triggerAnimation(data.data);
                            break;
                        }
                        case 'builder.contentUpdate':
                            var key = data.data.key || data.data.alias || data.data.entry || data.data.modelName;
                            var contentData = data.data.data; // hmmm...
                            var observer = _this.observersByKey[key];
                            if (observer && !_this.noEditorUpdates[key]) {
                                observer.next([contentData]);
                            }
                            break;
                        case 'builder.getComponents':
                            (_c = window.parent) === null || _c === void 0 ? void 0 : _c.postMessage({
                                type: 'builder.components',
                                data: Builder.components.map(function (item) { return Builder.prepareComponentSpecToSend(item); }),
                            }, '*');
                            break;
                        case 'builder.editingModel':
                            _this.editingModel = data.data.model;
                            break;
                        case 'builder.registerComponent':
                            var componentData = data.data;
                            Builder.addComponent(componentData);
                            break;
                        case 'builder.blockContentLoading':
                            if (typeof data.data.model === 'string') {
                                _this.blockContentLoading = data.data.model;
                            }
                            break;
                        case 'builder.editingMode':
                            var editingMode = data.data;
                            if (editingMode) {
                                _this.editingMode = true;
                                document.body.classList.add('builder-editing');
                            }
                            else {
                                _this.editingMode = false;
                                document.body.classList.remove('builder-editing');
                            }
                            break;
                        case 'builder.editingPageMode':
                            var editingPageMode = data.data;
                            Builder.editingPage = editingPageMode;
                            break;
                        case 'builder.overrideUserAttributes':
                            var userAttributes = data.data;
                            (0, assign_function_1.assign)(Builder.overrideUserAttributes, userAttributes);
                            _this.flushGetContentQueue(true);
                            // TODO: refetch too
                            break;
                        case 'builder.overrideTestGroup':
                            var _f = data.data, variationId = _f.variationId, contentId = _f.contentId;
                            if (variationId && contentId) {
                                _this.setTestCookie(contentId, variationId);
                                _this.flushGetContentQueue(true);
                            }
                            break;
                        case 'builder.evaluate': {
                            var text = data.data.text;
                            var args = data.data.arguments || [];
                            var id_1 = data.data.id;
                            // tslint:disable-next-line:no-function-constructor-with-string-args
                            var fn = new Function(text);
                            var result = void 0;
                            var error = null;
                            try {
                                result = fn.apply(_this, args);
                            }
                            catch (err) {
                                error = (0, to_error_1.toError)(err);
                            }
                            if (error) {
                                (_d = window.parent) === null || _d === void 0 ? void 0 : _d.postMessage({
                                    type: 'builder.evaluateError',
                                    data: { id: id_1, error: error.message },
                                }, '*');
                            }
                            else {
                                if (result && typeof result.then === 'function') {
                                    result
                                        .then(function (finalResult) {
                                        var _a;
                                        (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                                            type: 'builder.evaluateResult',
                                            data: { id: id_1, result: finalResult },
                                        }, '*');
                                    })
                                        .catch(console.error);
                                }
                                else {
                                    (_e = window.parent) === null || _e === void 0 ? void 0 : _e.postMessage({
                                        type: 'builder.evaluateResult',
                                        data: { result: result, id: id_1 },
                                    }, '*');
                                }
                            }
                            break;
                        }
                    }
                }
            });
        }
    };
    Object.defineProperty(Builder.prototype, "defaultCanTrack", {
        get: function () {
            return Boolean(Builder.isBrowser &&
                navigator.userAgent.trim() &&
                !navigator.userAgent.match(/bot|crawler|spider|robot|crawling|prerender|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|phantom|headless|selenium|puppeteer/i) &&
                !this.browserTrackingDisabled);
        },
        enumerable: false,
        configurable: true
    });
    Builder.prototype.init = function (apiKey, canTrack, req, res, authToken, apiVersion) {
        if (canTrack === void 0) { canTrack = this.defaultCanTrack; }
        if (req) {
            this.request = req;
        }
        if (res) {
            this.response = res;
        }
        this.canTrack = canTrack;
        this.apiKey = apiKey;
        if (authToken) {
            this.authToken = authToken;
        }
        if (apiVersion) {
            this.apiVersion = apiVersion;
        }
        return this;
    };
    Object.defineProperty(Builder.prototype, "previewingModel", {
        get: function () {
            var search = this.getLocation().search;
            var params = query_string_class_1.QueryString.parse((search || '').substr(1));
            return params['builder.preview'];
        },
        enumerable: false,
        configurable: true
    });
    // TODO: allow adding location object as property and/or in constructor
    Builder.prototype.getLocation = function () {
        var _a;
        var parsedLocation = {};
        // in ssr mode
        if (this.request) {
            parsedLocation = parse((_a = this.request.url) !== null && _a !== void 0 ? _a : '');
        }
        else if (typeof location === 'object') {
            // in the browser
            parsedLocation = parse(location.href);
        }
        // IE11 bug with parsed path being empty string
        // causes issues with our user targeting
        if (parsedLocation.pathname === '') {
            parsedLocation.pathname = '/';
        }
        return parsedLocation;
    };
    Builder.prototype.getUserAttributes = function (userAgent) {
        if (userAgent === void 0) { userAgent = this.userAgent || ''; }
        var isMobile = {
            Android: function () {
                return userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return userAgent.match(/iPhone|iPod/i);
            },
            Opera: function () {
                return userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return userAgent.match(/IEMobile/i) || userAgent.match(/WPDesktop/i);
            },
            any: function () {
                return (isMobile.Android() ||
                    isMobile.BlackBerry() ||
                    isMobile.iOS() ||
                    isMobile.Opera() ||
                    isMobile.Windows());
            },
        };
        var isTablet = userAgent.match(/Tablet|iPad/i);
        var url = this.getLocation();
        return __assign({ urlPath: url.pathname, host: url.host || url.hostname, 
            // TODO: maybe an option to choose to target off of mobile/tablet/desktop or just mobile/desktop
            device: isTablet ? 'tablet' : isMobile.any() ? 'mobile' : 'desktop' }, Builder.overrideUserAttributes);
    };
    Builder.prototype.setUserAttributes = function (options) {
        (0, assign_function_1.assign)(Builder.overrideUserAttributes, options);
        this.userAttributesChanged.next(options);
    };
    /**
     * Set user attributes just for tracking purposes.
     *
     * Do this so properties exist on event objects for querying insights, but
     * won't affect targeting
     *
     * Use this when you want to track properties but don't need to target off
     * of them to optimize cache efficiency
     */
    Builder.prototype.setTrackingUserAttributes = function (attributes) {
        (0, assign_function_1.assign)(this.trackingUserAttributes, attributes);
    };
    Builder.prototype.get = function (modelName, options) {
        if (options === void 0) { options = {}; }
        var instance = this;
        if (!Builder.isBrowser) {
            instance = new Builder(options.apiKey || this.apiKey, options.req, options.res, undefined, options.authToken || this.authToken, options.apiVersion || this.apiVersion);
            instance.setUserAttributes(this.getUserAttributes());
        }
        else {
            // NOTE: All these are when .init is not called and the customer
            // directly calls .get on the singleton instance of Builder
            if (options.apiKey && !this.apiKey) {
                this.apiKey = options.apiKey;
            }
            if (options.authToken && !this.authToken) {
                this.authToken = options.authToken;
            }
            if (options.apiVersion && !this.apiVersion) {
                this.apiVersion = options.apiVersion;
            }
        }
        return instance.queueGetContent(modelName, options).map(
        /* map( */ function (matches) {
            var match = matches && matches[0];
            if (Builder.isStatic) {
                return match;
            }
            var matchData = match && match.data;
            if (!matchData) {
                return null;
            }
            if (typeof matchData.blocksString !== 'undefined') {
                matchData.blocks = JSON.parse(matchData.blocksString);
                delete matchData.blocksString;
            }
            return {
                // TODO: add ab test info here and other high level stuff
                data: matchData,
                id: match.id,
                variationId: match.testVariationId || match.variationId || null,
                testVariationId: match.testVariationId || match.variationId || null,
                testVariationName: match.testVariationName || null,
                lastUpdated: match.lastUpdated || null,
            };
        });
        // );
    };
    // TODO: entry id in options
    Builder.prototype.queueGetContent = function (modelName, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        // TODO: if query do modelName + query
        var key = options.key ||
            options.alias ||
            // TODO: SDKs only pass entry key when given to them, and never when editing...
            // options.entry ||
            // TODO: this is ugly - instead of multiple of same model with different options are sent
            // say requires key/alias. Or if not perhaps make a reliable hash of the options and use that.
            // TODO: store last user state on last request and if user attributes different now
            // give a warning that need to use keys to request new contente
            // (options &&
            //   Object.keys(options).filter(key => key !== 'model').length &&
            //   JSON.stringify({ model: modelName, ...options, initialContent: undefined })) ||
            modelName;
        var isEditingThisModel = this.editingModel === modelName;
        // TODO: include params in this key........
        var currentObservable = this.observersByKey[key];
        // if (options.query && options.query._id) {
        //   this.flushGetContentQueue([options])
        // }
        if (this.apiKey === 'DEMO' && !this.overrides[key] && !options.initialContent) {
            options.initialContent = [];
        }
        var initialContent = options.initialContent;
        // TODO: refresh option in options
        if (currentObservable && (!currentObservable.value || options.cache)) {
            // TODO: test if this ran, otherwise on 404 some observers may never be called...
            if (currentObservable.value) {
                (0, next_tick_function_1.nextTick)(function () {
                    // TODO: return a new observable and only that one fires subscribers, don't refire for existing ones
                    currentObservable.next(currentObservable.value);
                });
            }
            return currentObservable;
        }
        if (isEditingThisModel) {
            if (Builder.isBrowser) {
                parent.postMessage({ type: 'builder.updateContent', data: { options: options } }, '*');
            }
        }
        if (!initialContent /* || isEditingThisModel */) {
            if (!this.getContentQueue) {
                this.getContentQueue = [];
            }
            this.getContentQueue.push(__assign(__assign({}, options), { model: modelName, key: key }));
            if (this.getContentQueue && this.getContentQueue.length >= this.contentPerRequest) {
                var queue_1 = this.getContentQueue.slice();
                this.getContentQueue = [];
                (0, next_tick_function_1.nextTick)(function () {
                    _this.flushGetContentQueue(false, queue_1);
                });
            }
            else {
                (0, next_tick_function_1.nextTick)(function () {
                    _this.flushGetContentQueue();
                });
            }
        }
        var observable = new observable_class_1.BehaviorSubject(null);
        this.observersByKey[key] = observable;
        if (options.noEditorUpdates) {
            this.noEditorUpdates[key] = true;
        }
        if (initialContent) {
            (0, next_tick_function_1.nextTick)(function () {
                // TODO: need to testModify this I think...?
                observable.next(initialContent);
            });
        }
        return observable;
    };
    // this is needed to satisfy the Angular SDK, which used to rely on the more complex version of `requestUrl`.
    // even though we only use `fetch()` now, we prefer to keep the old behavior and use the `fetch` that comes from
    // the core SDK for consistency
    Builder.prototype.requestUrl = function (url, options) {
        return (0, fetch_function_1.getFetch)()(url, options).then(function (res) { return res.json(); });
    };
    Object.defineProperty(Builder.prototype, "host", {
        get: function () {
            switch (this.env) {
                case 'qa':
                    return 'https://qa.builder.io';
                case 'test':
                    return 'https://builder-io-test.web.app';
                case 'fast':
                    return 'https://fast.builder.io';
                case 'cloud':
                    return 'https://cloud.builder.io';
                case 'cdn2':
                    return 'https://cdn2.builder.io';
                case 'cdn-qa':
                    return 'https://cdn-qa.builder.io';
                case 'development':
                case 'dev':
                    return 'http://localhost:5000';
                case 'cdn-prod':
                    return 'https://cdn.builder.io';
                default:
                    return Builder.overrideHost || 'https://cdn.builder.io';
            }
        },
        enumerable: false,
        configurable: true
    });
    Builder.prototype.flushGetContentQueue = function (usePastQueue, useQueue) {
        var _this = this;
        if (usePastQueue === void 0) { usePastQueue = false; }
        if (!this.apiKey) {
            throw new Error("Fetching content failed, expected apiKey to be defined instead got: ".concat(this.apiKey));
        }
        if (this.apiVersion) {
            if (!['v1', 'v3'].includes(this.apiVersion)) {
                throw new Error("Invalid apiVersion: expected 'v1' or 'v3', received '".concat(this.apiVersion, "'"));
            }
        }
        else {
            this.apiVersion = api_version_1.DEFAULT_API_VERSION;
        }
        if (!usePastQueue && !this.getContentQueue) {
            return;
        }
        var queue = useQueue || (usePastQueue ? this.priorContentQueue : this.getContentQueue) || [];
        // TODO: do this on every request send?
        this.getOverridesFromQueryString();
        var queryParams = __assign(__assign({ 
            // TODO: way to force a request to be in a separate queue. or just lower queue limit to be 1 by default
            omit: queue[0].omit || 'meta.componentsUsed', apiKey: this.apiKey }, queue[0].options), this.queryOptions);
        if (queue[0].locale) {
            queryParams.locale = queue[0].locale;
        }
        if (queue[0].fields) {
            queryParams.fields = queue[0].fields;
        }
        if (queue[0].format) {
            queryParams.format = queue[0].format;
        }
        var pageQueryParams = typeof location !== 'undefined'
            ? query_string_class_1.QueryString.parseDeep(location.search.substr(1))
            : undefined || {};
        var userAttributes = 
        // FIXME: HACK: only checks first in queue for user attributes overrides, should check all
        // TODO: merge user attributes provided here with defaults and current user attiributes (?)
        queue && queue[0].userAttributes
            ? queue[0].userAttributes
            : this.targetContent
                ? this.getUserAttributes()
                : {
                    urlPath: this.getLocation().pathname,
                };
        var fullUrlQueueItem = queue.find(function (item) { return !!item.includeUrl; });
        if (fullUrlQueueItem) {
            var location_1 = this.getLocation();
            if (location_1.origin) {
                queryParams.url = "".concat(location_1.origin).concat(location_1.pathname).concat(location_1.search);
            }
        }
        var urlQueueItem = useQueue === null || useQueue === void 0 ? void 0 : useQueue.find(function (item) { return item.url; });
        if (urlQueueItem === null || urlQueueItem === void 0 ? void 0 : urlQueueItem.url) {
            userAttributes.urlPath = urlQueueItem.url.split('?')[0];
        }
        // TODO: merge in the attribute from query string ones
        // TODO: make this an option per component/request
        queryParams.userAttributes = userAttributes;
        if (!usePastQueue && !useQueue) {
            this.priorContentQueue = queue;
            this.getContentQueue = null;
        }
        var cachebust = this.cachebust ||
            exports.isIframe ||
            pageQueryParams.cachebust ||
            pageQueryParams['builder.cachebust'];
        if (cachebust || this.env !== 'production') {
            queryParams.cachebust = true;
        }
        if (Builder.isEditing) {
            queryParams.isEditing = true;
        }
        if (this.noCache || this.env !== 'production') {
            queryParams.noCache = true;
        }
        if (size(this.overrides)) {
            for (var key in this.overrides) {
                if (this.overrides.hasOwnProperty(key)) {
                    queryParams["overrides.".concat(key)] = this.overrides[key];
                }
            }
        }
        for (var _i = 0, queue_2 = queue; _i < queue_2.length; _i++) {
            var options = queue_2[_i];
            if (options.format) {
                queryParams.format = options.format;
            }
            // TODO: remove me and make permodel
            if (options.static) {
                queryParams.static = options.static;
            }
            if (options.cachebust) {
                queryParams.cachebust = options.cachebust;
            }
            if (isPositiveNumber(options.cacheSeconds)) {
                queryParams.cacheSeconds = options.cacheSeconds;
            }
            if (isPositiveNumber(options.staleCacheSeconds)) {
                queryParams.staleCacheSeconds = options.staleCacheSeconds;
            }
            var properties = [
                'prerender',
                'extractCss',
                'limit',
                'offset',
                'query',
                'preview',
                'model',
                'entry',
                'rev',
                'static',
            ];
            for (var _a = 0, properties_1 = properties; _a < properties_1.length; _a++) {
                var key = properties_1[_a];
                var value = options[key];
                if (value !== undefined) {
                    queryParams.options = queryParams.options || {};
                    queryParams.options[options.key] = queryParams.options[options.key] || {};
                    queryParams.options[options.key][key] = JSON.stringify(value);
                }
            }
        }
        if (this.preview) {
            queryParams.preview = 'true';
        }
        var hasParams = Object.keys(queryParams).length > 0;
        // TODO: option to force dev or qa api here
        var host = this.host;
        var keyNames = queue.map(function (item) { return encodeURIComponent(item.key); }).join(',');
        if (this.overrideParams) {
            var params = (0, omit_function_1.omit)(query_string_class_1.QueryString.parse(this.overrideParams), 'apiKey');
            (0, assign_function_1.assign)(queryParams, params);
        }
        var queryStr = query_string_class_1.QueryString.stringifyDeep(queryParams);
        var format = queryParams.format;
        var requestOptions = { headers: {} };
        if (this.authToken) {
            requestOptions.headers = __assign(__assign({}, requestOptions.headers), { Authorization: "Bearer ".concat(this.authToken) });
        }
        var fn = format === 'solid' || format === 'react' ? 'codegen' : 'query';
        // NOTE: this is a hack to get around the fact that the codegen endpoint is not yet available in v3
        var apiVersionBasedOnFn = fn === 'query' ? this.apiVersion : 'v1';
        var url = "".concat(host, "/api/").concat(apiVersionBasedOnFn, "/").concat(fn, "/").concat(this.apiKey, "/").concat(keyNames) +
            (queryParams && hasParams ? "?".concat(queryStr) : '');
        var promise = (0, fetch_function_1.getFetch)()(url, requestOptions)
            .then(function (res) { return res.json(); })
            .then(function (result) {
            for (var _i = 0, queue_3 = queue; _i < queue_3.length; _i++) {
                var options = queue_3[_i];
                var keyName = options.key;
                if (options.model === _this.blockContentLoading && !options.noEditorUpdates) {
                    continue;
                }
                var isEditingThisModel = _this.editingModel === options.model;
                if (isEditingThisModel && Builder.isEditing) {
                    parent.postMessage({ type: 'builder.updateContent', data: { options: options } }, '*');
                    // return;
                }
                var observer = _this.observersByKey[keyName];
                if (!observer) {
                    return;
                }
                var data = result[keyName];
                var sorted = data; // sortBy(data, item => item.priority);
                if (data) {
                    var testModifiedResults = Builder.isServer
                        ? sorted
                        : _this.processResultsForTests(sorted);
                    observer.next(testModifiedResults);
                }
                else {
                    var search = _this.getLocation().search;
                    if ((search || '').includes('builder.preview=' + options.model)) {
                        var previewData = {
                            id: 'preview',
                            name: 'Preview',
                            data: {},
                        };
                        observer.next([previewData]);
                    }
                    observer.next([]);
                }
            }
        }, function (err) {
            for (var _i = 0, queue_4 = queue; _i < queue_4.length; _i++) {
                var options = queue_4[_i];
                var observer = _this.observersByKey[options.key];
                if (!observer) {
                    return;
                }
                observer.error(err);
            }
        });
        return promise;
    };
    Builder.prototype.processResultsForTests = function (results) {
        var _this = this;
        var _a;
        var mappedResults = results.map(function (item) {
            if (!item.variations) {
                return item;
            }
            var cookieValue = _this.getTestCookie(item.id);
            var cookieVariation = cookieValue === item.id ? item : item.variations[cookieValue];
            if (cookieVariation) {
                return __assign(__assign({}, item), { data: cookieVariation.data, variationId: cookieValue, testVariationId: cookieValue, testVariationName: cookieVariation.name });
            }
            if (_this.canTrack && item.variations && size(item.variations)) {
                var n = 0;
                var random = Math.random();
                for (var id in item.variations) {
                    var variation = item.variations[id];
                    var testRatio = variation.testRatio;
                    n += testRatio;
                    if (random < n) {
                        _this.setTestCookie(item.id, variation.id);
                        var variationName = variation.name || (variation.id === item.id ? 'Default variation' : '');
                        return __assign(__assign({}, item), { data: variation.data, variationId: variation.id, testVariationId: variation.id, variationName: variationName, testVariationName: variationName });
                    }
                }
                _this.setTestCookie(item.id, item.id);
            }
            return __assign(__assign(__assign({}, item), { variationId: item.id }), (item.variations &&
                size(item.variations) && {
                testVariationId: item.id,
                testVariationName: 'Default variation',
            }));
        });
        if (exports.isIframe) {
            (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({ type: 'builder.contentResults', data: { results: mappedResults } }, '*');
        }
        return mappedResults;
    };
    Builder.prototype.getTestCookie = function (contentId) {
        return this.getCookie("".concat(this.testCookiePrefix, ".").concat(contentId));
    };
    Builder.prototype.setTestCookie = function (contentId, variationId) {
        if (!this.canTrack) {
            this.cookieQueue.push([contentId, variationId]);
            return;
        }
        // 30 days from now
        var future = new Date();
        future.setDate(future.getDate() + 30);
        return this.setCookie("".concat(this.testCookiePrefix, ".").concat(contentId), variationId, future);
    };
    Builder.prototype.getCookie = function (name) {
        if (this.cookies) {
            return this.cookies.get(name);
        }
        return Builder.isBrowser && getCookie(name);
    };
    Builder.prototype.setCookie = function (name, value, expires) {
        if (this.cookies && !(Builder.isServer && Builder.isStatic)) {
            return this.cookies.set(name, value, {
                expires: expires,
                secure: this.getLocation().protocol === 'https:',
            });
        }
        return Builder.isBrowser && setCookie(name, value, expires);
    };
    Builder.prototype.getContent = function (modelName, options) {
        if (options === void 0) { options = {}; }
        if (!this.apiKey) {
            throw new Error("Fetching content from model ".concat(modelName, " failed, expected apiKey to be defined instead got: ").concat(this.apiKey));
        }
        return this.queueGetContent(modelName, options);
    };
    Builder.prototype.getAll = function (modelName, options) {
        if (options === void 0) { options = {}; }
        var instance = this;
        if (!Builder.isBrowser) {
            instance = new Builder(options.apiKey || this.apiKey, options.req, options.res, false, null, options.apiVersion || this.apiVersion);
            instance.setUserAttributes(this.getUserAttributes());
        }
        else {
            // NOTE: All these are when .init is not called and the customer
            // directly calls .get on the singleton instance of Builder
            if (options.apiKey && !this.apiKey) {
                this.apiKey = options.apiKey;
            }
            if (options.apiVersion && !this.apiVersion) {
                this.apiVersion = options.apiVersion;
            }
        }
        return instance
            .getContent(modelName, __assign(__assign({ limit: 30 }, options), { key: options.key ||
                // Make the key include all options, so we don't reuse cache for the same content fetched
                // with different options
                Builder.isBrowser
                ? "".concat(modelName, ":").concat((0, hash_sum_1.default)((0, omit_function_1.omit)(options, 'initialContent', 'req', 'res')))
                : undefined }))
            .promise();
    };
    /**
     * @hidden
     * @deprecated. This is buggy, and always behind by a version.
     */
    Builder.VERSION = package_json_1.version;
    Builder.components = [];
    /**
     * Makes it so that a/b tests generate code like {@link
     * https://www.builder.io/blog/high-performance-no-code#__next:~:text=Static%20generated%20A%2FB%20testing}
     * instead of the old way where we render only one test group at a time on the
     * server. This is the preferred/better way not and we should ultimately make it
     * the default
     */
    Builder.isStatic = true;
    Builder.animator = new animator_class_1.Animator();
    Builder.nextTick = next_tick_function_1.nextTick;
    Builder.throttle = throttle_function_1.throttle;
    Builder.editors = [];
    Builder.trustedHosts = ['builder.io', 'localhost'];
    Builder.plugins = [];
    Builder.actions = [];
    Builder.registry = {};
    Builder.registryChange = new observable_class_1.BehaviorSubject({});
    Builder._editingPage = false;
    Builder.isIframe = exports.isIframe;
    Builder.isBrowser = exports.isBrowser;
    Builder.isReactNative = exports.isReactNative;
    Builder.isServer = !exports.isBrowser && !exports.isReactNative;
    Builder.previewingModel = Builder.isBrowser && getQueryParam(location.href, 'builder.preview');
    Builder.settings = {};
    Builder.settingsChange = new observable_class_1.BehaviorSubject({});
    // TODO: this is quick and dirty, do better implementation later. Also can be unreliable
    // if page 301s etc. Use a query param instead? also could have issues with redirects. Injecting var could
    // work but is async...
    Builder.isEditing = Boolean(exports.isIframe &&
        ((document.referrer && document.referrer.match(/builder\.io|localhost:1234/)) ||
            location.search.indexOf('builder.frameEditing=') !== -1));
    Builder.isPreviewing = Boolean(exports.isBrowser &&
        (location.search.indexOf('builder.preview=') !== -1 ||
            location.search.indexOf('builder.frameEditing=') !== -1));
    Builder.isReact = false;
    Builder.overrideUserAttributes = {};
    return Builder;
}());
exports.Builder = Builder;
//# sourceMappingURL=builder.class.js.map