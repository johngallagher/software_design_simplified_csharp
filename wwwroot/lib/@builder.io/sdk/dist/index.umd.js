(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('@builder.io/sdk', ['exports'], factory) :
    (factory((global.BuilderIO = {})));
}(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    (function () {
      if (typeof window === 'undefined' || typeof window.CustomEvent === 'function') return false;

      function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }

      window.CustomEvent = CustomEvent;
    })();

    var isSafari = typeof window !== 'undefined' &&
        /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    // TODO: queue all of these in a debounceNextTick
    function nextTick(fn) {
        // React native
        if (typeof setImmediate === 'function' && typeof window === 'undefined') {
            return setImmediate(fn);
        }
        // TODO: should this be setImmediate instead? Forgot if that is micro or macro task
        // TODO: detect specifically if is server
        // if (typeof process !== 'undefined' && process.nextTick) {
        //   console.log('process.nextTick?');
        //   process.nextTick(fn);
        //   return;
        // }
        // FIXME: fix the real safari issue of this randomly not working
        if (isSafari || typeof MutationObserver === 'undefined') {
            setTimeout(fn);
            return;
        }
        var called = 0;
        var observer = new MutationObserver(function () { return fn(); });
        var element = document.createTextNode('');
        observer.observe(element, {
            characterData: true,
        });
        // tslint:disable-next-line
        element.data = String((called = ++called));
    }

    var PROPERTY_NAME_DENY_LIST = Object.freeze(['__proto__', 'prototype', 'constructor']);
    // TODO: unit tests
    var QueryString = /** @class */ (function () {
        function QueryString() {
        }
        QueryString.parseDeep = function (queryString) {
            var obj = this.parse(queryString);
            return this.deepen(obj);
        };
        QueryString.stringifyDeep = function (obj) {
            var map = this.flatten(obj);
            return this.stringify(map);
        };
        QueryString.parse = function (queryString) {
            var query = {};
            var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                // TODO: node support?
                try {
                    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
                }
                catch (error) {
                    // Ignore malformed URI components
                }
            }
            return query;
        };
        QueryString.stringify = function (map) {
            var str = '';
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    var value = map[key];
                    if (str) {
                        str += '&';
                    }
                    str += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                }
            }
            return str;
        };
        QueryString.deepen = function (map) {
            // FIXME; Should be type Tree = Record<string, string | Tree>
            // requires a typescript upgrade.
            var output = {};
            for (var k in map) {
                var t = output;
                var parts = k.split('.');
                var key = parts.pop();
                for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                    var part = parts_1[_i];
                    assertAllowedPropertyName(part);
                    t = t[part] = t[part] || {};
                }
                t[key] = map[k];
            }
            return output;
        };
        QueryString.flatten = function (obj, _current, _res) {
            if (_res === void 0) { _res = {}; }
            for (var key in obj) {
                var value = obj[key];
                var newKey = _current ? _current + '.' + key : key;
                if (value && typeof value === 'object') {
                    this.flatten(value, newKey, _res);
                }
                else {
                    _res[newKey] = value;
                }
            }
            return _res;
        };
        return QueryString;
    }());
    function assertAllowedPropertyName(name) {
        if (PROPERTY_NAME_DENY_LIST.indexOf(name) >= 0)
            throw new Error("Property name \"".concat(name, "\" is not allowed"));
    }

    var version = "2.0.4-0";

    var Subscription = /** @class */ (function () {
        function Subscription(listeners, listener) {
            this.listeners = listeners;
            this.listener = listener;
            this.unsubscribed = false;
            this.otherSubscriptions = [];
        }
        Object.defineProperty(Subscription.prototype, "closed", {
            get: function () {
                return this.unsubscribed;
            },
            enumerable: false,
            configurable: true
        });
        Subscription.prototype.add = function (subscription) {
            this.otherSubscriptions.push(subscription);
        };
        Subscription.prototype.unsubscribe = function () {
            if (this.unsubscribed) {
                return;
            }
            if (this.listener && this.listeners) {
                var index = this.listeners.indexOf(this.listener);
                if (index > -1) {
                    this.listeners.splice(index, 1);
                }
            }
            this.otherSubscriptions.forEach(function (sub) { return sub.unsubscribe(); });
            this.unsubscribed = true;
        };
        return Subscription;
    }());
    // TODO: follow minimal basic spec: https://github.com/tc39/proposal-observable
    var BehaviorSubject = /** @class */ (function () {
        function BehaviorSubject(value) {
            this.value = value;
            this.listeners = [];
            this.errorListeners = [];
        }
        BehaviorSubject.prototype.next = function (value) {
            this.value = value;
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(value);
            }
        };
        // TODO: implement this as PIPE instead
        BehaviorSubject.prototype.map = function (fn) {
            var newSubject = new BehaviorSubject(fn(this.value));
            // TODO: on destroy delete these
            this.subscribe(function (val) {
                newSubject.next(fn(val));
            });
            this.catch(function (err) {
                newSubject.error(err);
            });
            return newSubject;
        };
        BehaviorSubject.prototype.catch = function (errorListener) {
            this.errorListeners.push(errorListener);
            return new Subscription(this.errorListeners, errorListener);
        };
        BehaviorSubject.prototype.error = function (error) {
            for (var _i = 0, _a = this.errorListeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(error);
            }
        };
        BehaviorSubject.prototype.subscribe = function (listener, errorListener) {
            this.listeners.push(listener);
            if (errorListener) {
                this.errorListeners.push(errorListener);
            }
            return new Subscription(this.listeners, listener);
        };
        BehaviorSubject.prototype.toPromise = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var subscription = _this.subscribe(function (value) {
                    resolve(value);
                    subscription.unsubscribe();
                }, function (err) {
                    reject(err);
                    subscription.unsubscribe();
                });
            });
        };
        BehaviorSubject.prototype.promise = function () {
            return this.toPromise();
        };
        return BehaviorSubject;
    }());

    var State = {
        Pending: 'Pending',
        Fulfilled: 'Fulfilled',
        Rejected: 'Rejected',
    };
    function isFunction(val) {
        return val && typeof val === 'function';
    }
    function isObject(val) {
        return val && typeof val === 'object';
    }
    var TinyPromise = /** @class */ (function () {
        function TinyPromise(executor) {
            this._state = State.Pending;
            this._handlers = [];
            this._value = null;
            executor(this._resolve.bind(this), this._reject.bind(this));
        }
        TinyPromise.prototype._resolve = function (x) {
            var _this = this;
            if (x instanceof TinyPromise) {
                x.then(this._resolve.bind(this), this._reject.bind(this));
            }
            else if (isObject(x) || isFunction(x)) {
                var called_1 = false;
                try {
                    var thenable = x.then;
                    if (isFunction(thenable)) {
                        thenable.call(x, function (result) {
                            if (!called_1)
                                _this._resolve(result);
                            called_1 = true;
                            return undefined;
                        }, function (error) {
                            if (!called_1)
                                _this._reject(error);
                            called_1 = true;
                            return undefined;
                        });
                    }
                    else {
                        this._fulfill(x);
                    }
                }
                catch (ex) {
                    if (!called_1) {
                        this._reject(ex);
                    }
                }
            }
            else {
                this._fulfill(x);
            }
        };
        TinyPromise.prototype._fulfill = function (result) {
            var _this = this;
            this._state = State.Fulfilled;
            this._value = result;
            this._handlers.forEach(function (handler) { return _this._callHandler(handler); });
        };
        TinyPromise.prototype._reject = function (error) {
            var _this = this;
            this._state = State.Rejected;
            this._value = error;
            this._handlers.forEach(function (handler) { return _this._callHandler(handler); });
        };
        TinyPromise.prototype._isPending = function () {
            return this._state === State.Pending;
        };
        TinyPromise.prototype._isFulfilled = function () {
            return this._state === State.Fulfilled;
        };
        TinyPromise.prototype._isRejected = function () {
            return this._state === State.Rejected;
        };
        TinyPromise.prototype._addHandler = function (onFulfilled, onRejected) {
            this._handlers.push({
                onFulfilled: onFulfilled,
                onRejected: onRejected,
            });
        };
        TinyPromise.prototype._callHandler = function (handler) {
            if (this._isFulfilled() && isFunction(handler.onFulfilled)) {
                handler.onFulfilled(this._value);
            }
            else if (this._isRejected() && isFunction(handler.onRejected)) {
                handler.onRejected(this._value);
            }
        };
        TinyPromise.prototype.then = function (onFulfilled, onRejected) {
            var _this = this;
            switch (this._state) {
                case State.Pending: {
                    return new TinyPromise(function (resolve, reject) {
                        _this._addHandler(function (value) {
                            nextTick(function () {
                                try {
                                    if (isFunction(onFulfilled)) {
                                        resolve(onFulfilled(value));
                                    }
                                    else {
                                        resolve(value);
                                    }
                                }
                                catch (ex) {
                                    reject(ex);
                                }
                            });
                        }, function (error) {
                            nextTick(function () {
                                try {
                                    if (isFunction(onRejected)) {
                                        resolve(onRejected(error));
                                    }
                                    else {
                                        reject(error);
                                    }
                                }
                                catch (ex) {
                                    reject(ex);
                                }
                            });
                        });
                    });
                }
                case State.Fulfilled: {
                    return new TinyPromise(function (resolve, reject) {
                        nextTick(function () {
                            try {
                                if (isFunction(onFulfilled)) {
                                    resolve(onFulfilled(_this._value));
                                }
                                else {
                                    resolve(_this._value);
                                }
                            }
                            catch (ex) {
                                reject(ex);
                            }
                        });
                    });
                }
                case State.Rejected: {
                    return new TinyPromise(function (resolve, reject) {
                        nextTick(function () {
                            try {
                                if (isFunction(onRejected)) {
                                    resolve(onRejected(_this._value));
                                }
                                else {
                                    reject(_this._value);
                                }
                            }
                            catch (ex) {
                                reject(ex);
                            }
                        });
                    });
                }
            }
        };
        return TinyPromise;
    }());
    var Promise$1 = (typeof Promise !== 'undefined' ? Promise : TinyPromise);

    // Webpack workaround to conditionally require certain external modules
    // only on the server and not bundle them on the client
    var serverOnlyRequire;
    try {
        // tslint:disable-next-line:no-eval
        serverOnlyRequire = eval('require');
    }
    catch (err) {
        // all good
        serverOnlyRequire = (function () { return null; });
    }
    var serverOnlyRequire$1 = serverOnlyRequire;

    function promiseResolve(value) {
        return new Promise$1(function (resolve) { return resolve(value); });
    }
    // Adapted from https://raw.githubusercontent.com/developit/unfetch/master/src/index.mjs
    function tinyFetch(url, options) {
        if (options === void 0) { options = {}; }
        return new Promise$1(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(options.method || 'get', url, true);
            if (options.headers) {
                for (var i in options.headers) {
                    request.setRequestHeader(i, options.headers[i]);
                }
            }
            request.withCredentials = options.credentials === 'include';
            request.onload = function () {
                resolve(response());
            };
            request.onerror = reject;
            request.send(options.body);
            function response() {
                var keys = [];
                var all = [];
                var headers = {};
                var header = undefined;
                request
                    .getAllResponseHeaders()
                    .replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function (_match, _key, value) {
                    var key = _key;
                    keys.push((key = key.toLowerCase()));
                    all.push([key, value]);
                    header = headers[key];
                    headers[key] = header ? "".concat(header, ",").concat(value) : value;
                    return '';
                });
                return {
                    ok: ((request.status / 100) | 0) === 2,
                    status: request.status,
                    statusText: request.statusText,
                    url: request.responseURL,
                    clone: response,
                    text: function () { return promiseResolve(request.responseText); },
                    json: function () { return promiseResolve(request.responseText).then(JSON.parse); },
                    blob: function () { return promiseResolve(new Blob([request.response])); },
                    headers: {
                        keys: function () { return keys; },
                        entries: function () { return all; },
                        get: function (n) { return headers[n.toLowerCase()]; },
                        has: function (n) { return n.toLowerCase() in headers; },
                    },
                };
            }
        });
    }
    function getFetch() {
        // If fetch is defined, in the browser, via polyfill, or in a Cloudflare worker, use it.
        var _fetch = undefined;
        if (globalThis.fetch) {
            _fetch !== null && _fetch !== void 0 ? _fetch : (_fetch = globalThis.fetch);
        }
        else if (typeof window === 'undefined') {
            // If fetch is not defined, in a Node.js environment, use node-fetch.
            try {
                // node-fetch@^3 is ESM only, and will throw error on require.
                _fetch !== null && _fetch !== void 0 ? _fetch : (_fetch = serverOnlyRequire$1('node-fetch'));
            }
            catch (e) {
                // If node-fetch is not installed, use tiny-fetch.
                console.warn('node-fetch is not installed. consider polyfilling fetch or installing node-fetch.');
                console.warn(e);
            }
        }
        // Otherwise, use tiny-fetch.
        return _fetch !== null && _fetch !== void 0 ? _fetch : tinyFetch;
    }

    function assign(target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    }

    function throttle(func, wait, options) {
        if (options === void 0) { options = {}; }
        var context;
        var args;
        var result;
        var timeout = null;
        var previous = 0;
        var later = function () {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout)
                context = args = null;
        };
        return function () {
            var now = Date.now();
            if (!previous && options.leading === false)
                previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout)
                    context = args = null;
            }
            else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    }

    var camelCaseToKebabCase = function (str) {
        return str ? str.replace(/([A-Z])/g, function (g) { return "-".concat(g[0].toLowerCase()); }) : '';
    };
    var Animator = /** @class */ (function () {
        function Animator() {
        }
        Animator.prototype.bindAnimations = function (animations) {
            for (var _i = 0, animations_1 = animations; _i < animations_1.length; _i++) {
                var animation = animations_1[_i];
                switch (animation.trigger) {
                    case 'pageLoad':
                        this.triggerAnimation(animation);
                        break;
                    case 'hover':
                        this.bindHoverAnimation(animation);
                        break;
                    case 'scrollInView':
                        this.bindScrollInViewAnimation(animation);
                        break;
                }
            }
        };
        Animator.prototype.warnElementNotPresent = function (id) {
            console.warn("Cannot animate element: element with ID ".concat(id, " not found!"));
        };
        Animator.prototype.augmentAnimation = function (animation, element) {
            var stylesUsed = this.getAllStylesUsed(animation);
            var computedStyle = getComputedStyle(element);
            // const computedStyle = getComputedStyle(element);
            // // FIXME: this will break if original load is in one reponsive size then resize to another hmmm
            // Need to use transform instead of left since left can change on screen sizes
            var firstStyles = animation.steps[0].styles;
            var lastStyles = animation.steps[animation.steps.length - 1].styles;
            var bothStyles = [firstStyles, lastStyles];
            // FIXME: this won't work as expected for augmented animations - may need the editor itself to manage this
            for (var _i = 0, bothStyles_1 = bothStyles; _i < bothStyles_1.length; _i++) {
                var styles = bothStyles_1[_i];
                for (var _a = 0, stylesUsed_1 = stylesUsed; _a < stylesUsed_1.length; _a++) {
                    var style = stylesUsed_1[_a];
                    if (!(style in styles)) {
                        styles[style] = computedStyle[style];
                    }
                }
            }
        };
        Animator.prototype.getAllStylesUsed = function (animation) {
            var properties = [];
            for (var _i = 0, _a = animation.steps; _i < _a.length; _i++) {
                var step = _a[_i];
                for (var key in step.styles) {
                    if (properties.indexOf(key) === -1) {
                        properties.push(key);
                    }
                }
            }
            return properties;
        };
        Animator.prototype.triggerAnimation = function (animation) {
            var _this = this;
            // TODO: do for ALL elements
            var elements = Array.prototype.slice.call(document.getElementsByClassName(animation.elementId || animation.id || ''));
            if (!elements.length) {
                this.warnElementNotPresent(animation.elementId || animation.id || '');
                return;
            }
            Array.from(elements).forEach(function (element) {
                _this.augmentAnimation(animation, element);
                // TODO: do this properly, may have other animations of different properties
                // TODO: only override the properties
                // TODO: if there is an entrance and hover animation, the transition duration will get effed
                // element.setAttribute('style', '');
                // const styledUsed = this.getAllStylesUsed(animation);
                element.style.transition = 'none';
                element.style.transitionDelay = '0';
                assign(element.style, animation.steps[0].styles);
                // TODO: queue/batch these timeouts
                // TODO: only include properties explicitly set in the animation
                // using Object.keys(styles)
                setTimeout(function () {
                    element.style.transition = "all ".concat(animation.duration, "s ").concat(camelCaseToKebabCase(animation.easing));
                    if (animation.delay) {
                        element.style.transitionDelay = animation.delay + 's';
                    }
                    assign(element.style, animation.steps[1].styles);
                    // TODO: maybe remove/reset transitoin property after animation duration
                    // TODO: queue timers
                    setTimeout(function () {
                        // TODO: what if has other transition (reset back to what it was)
                        element.style.transition = '';
                        element.style.transitionDelay = '';
                    }, (animation.delay || 0) * 1000 + animation.duration * 1000 + 100);
                });
            });
        };
        Animator.prototype.bindHoverAnimation = function (animation) {
            var _this = this;
            // TODO: is it multiple binding when editing...?
            // TODO: unbind on element remove
            // TODO: apply to ALL elements
            var elements = Array.prototype.slice.call(document.getElementsByClassName(animation.elementId || animation.id || ''));
            if (!elements.length) {
                this.warnElementNotPresent(animation.elementId || animation.id || '');
                return;
            }
            Array.from(elements).forEach(function (element) {
                _this.augmentAnimation(animation, element);
                var defaultState = animation.steps[0].styles;
                var hoverState = animation.steps[1].styles;
                function attachDefaultState() {
                    assign(element.style, defaultState);
                }
                function attachHoverState() {
                    assign(element.style, hoverState);
                }
                attachDefaultState();
                element.addEventListener('mouseenter', attachHoverState);
                element.addEventListener('mouseleave', attachDefaultState);
                // TODO: queue/batch these timeouts
                setTimeout(function () {
                    element.style.transition = "all ".concat(animation.duration, "s ").concat(camelCaseToKebabCase(animation.easing));
                    if (animation.delay) {
                        element.style.transitionDelay = animation.delay + 's';
                    }
                });
            });
        };
        // TODO: unbind on element remove
        Animator.prototype.bindScrollInViewAnimation = function (animation) {
            var _this = this;
            // TODO: apply to ALL matching elements
            var elements = Array.prototype.slice.call(document.getElementsByClassName(animation.elementId || animation.id || ''));
            if (!elements.length) {
                this.warnElementNotPresent(animation.elementId || animation.id || '');
                return;
            }
            // TODO: if server side rendered and scrolled into view don't animate...
            Array.from(elements).forEach(function (element) {
                _this.augmentAnimation(animation, element);
                var triggered = false;
                var pendingAnimation = false;
                function immediateOnScroll() {
                    if (!triggered && isScrolledIntoView(element)) {
                        triggered = true;
                        pendingAnimation = true;
                        setTimeout(function () {
                            assign(element.style, animation.steps[1].styles);
                            if (!animation.repeat) {
                                document.removeEventListener('scroll', onScroll);
                            }
                            setTimeout(function () {
                                pendingAnimation = false;
                                if (!animation.repeat) {
                                    element.style.transition = '';
                                    element.style.transitionDelay = '';
                                }
                            }, (animation.duration + (animation.delay || 0)) * 1000 + 100);
                        });
                    }
                    else if (animation.repeat &&
                        triggered &&
                        !pendingAnimation &&
                        !isScrolledIntoView(element)) {
                        // we want to repeat the animation every time the the element is out of view and back again
                        triggered = false;
                        assign(element.style, animation.steps[0].styles);
                    }
                }
                // TODO: roll all of these in one for more efficiency of checking all the rects
                var onScroll = throttle(immediateOnScroll, 200, { leading: false });
                // TODO: fully in view or partially
                function isScrolledIntoView(elem) {
                    var rect = elem.getBoundingClientRect();
                    var windowHeight = window.innerHeight;
                    var thresholdPercent = (animation.thresholdPercent || 0) / 100;
                    var threshold = thresholdPercent * windowHeight;
                    // TODO: partial in view? or what if element is larger than screen itself
                    return (rect.bottom > threshold && rect.top < windowHeight - threshold // Element is peeking top or bottom
                    // (rect.top > 0 && rect.bottom < window.innerHeight) || // element fits within the screen and is fully on screen (not hanging off at all)
                    // (rect.top < 0 && rect.bottom > window.innerHeight) // element is larger than the screen and hangs over the top and bottom
                    );
                }
                var defaultState = animation.steps[0].styles;
                function attachDefaultState() {
                    assign(element.style, defaultState);
                }
                attachDefaultState();
                // TODO: queue/batch these timeouts!
                setTimeout(function () {
                    element.style.transition = "all ".concat(animation.duration, "s ").concat(camelCaseToKebabCase(animation.easing));
                    if (animation.delay) {
                        element.style.transitionDelay = animation.delay + 's';
                    }
                });
                // TODO: one listener for everything
                document.addEventListener('scroll', onScroll, { capture: true, passive: true });
                // Do an initial check
                immediateOnScroll();
            });
        };
        return Animator;
    }());

    /**
     * Only gets one level up from hostname
     * wwww.example.com -> example.com
     * www.example.co.uk -> example.co.uk
     */
    function getTopLevelDomain(host) {
        var parts = host.split('.');
        if (parts.length > 2) {
            return parts.slice(1).join('.');
        }
        return host;
    }

    /**
     * RegExp to match field-content in RFC 7230 sec 3.2
     *
     * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
     * field-vchar   = VCHAR / obs-text
     * obs-text      = %x80-FF
     */
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    var Cookies = /** @class */ (function () {
        function Cookies(request, response) {
            this.request = request;
            this.response = response;
        }
        Cookies.prototype.get = function (name) {
            var header = this.request.headers['cookie'];
            if (!header) {
                return;
            }
            var match = header.match(getPattern(name));
            if (!match) {
                return;
            }
            var value = match[1];
            return value;
        };
        Cookies.prototype.set = function (name, value, opts) {
            var res = this.response;
            var req = this.request;
            var headers = res.getHeader('Set-Cookie') || [];
            // TODO: just make this always true
            var secure = this.secure !== undefined
                ? !!this.secure
                : req.protocol === 'https' || req.connection.encrypted;
            var cookie = new Cookie(name, value, opts);
            if (typeof headers === 'string') {
                headers = [headers];
            }
            if (!secure && opts && opts.secure) {
                throw new Error('Cannot send secure cookie over unencrypted connection');
            }
            cookie.secure = secure;
            if (opts && 'secure' in opts) {
                cookie.secure = !!opts.secure;
            }
            cookie.domain = req.headers.host && getTopLevelDomain(req.headers.host);
            pushCookie(headers, cookie);
            var setHeader = res.setHeader;
            setHeader.call(res, 'Set-Cookie', headers);
            return this;
        };
        return Cookies;
    }());
    var Cookie = /** @class */ (function () {
        function Cookie(name, value, attrs) {
            this.path = '/';
            this.domain = undefined;
            this.httpOnly = true;
            this.sameSite = false;
            this.secure = false;
            this.overwrite = false;
            this.name = '';
            this.value = '';
            if (!fieldContentRegExp.test(name)) {
                throw new TypeError('argument name is invalid');
            }
            if (value && !fieldContentRegExp.test(value)) {
                throw new TypeError('argument value is invalid');
            }
            if (!value) {
                this.expires = new Date(0);
            }
            this.name = name;
            this.value = value || '';
            if (attrs.expires) {
                this.expires = attrs.expires;
            }
            if (attrs.secure) {
                this.secure = attrs.secure;
            }
        }
        Cookie.prototype.toString = function () {
            return "".concat(this.name, "=").concat(this.value);
        };
        Cookie.prototype.toHeader = function () {
            var header = this.toString();
            if (this.maxAge) {
                this.expires = new Date(Date.now() + this.maxAge);
            }
            if (this.path) {
                header += "; path=".concat(this.path);
            }
            if (this.expires) {
                header += "; expires=".concat(this.expires.toUTCString());
            }
            if (this.domain) {
                header += "; domain=".concat(this.domain);
            }
            // TODO: samesite=none by default (?)
            header += "; SameSite=".concat(this.sameSite === true ? 'strict' : 'None');
            // TODO: On by default
            if (this.secure) {
                header += '; secure';
            }
            if (this.httpOnly) {
                header += '; httponly';
            }
            return header;
        };
        return Cookie;
    }());
    function getPattern(name) {
        return new RegExp("(?:^|;) *".concat(name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), "=([^;]*)"));
    }
    function pushCookie(headers, cookie) {
        if (cookie.overwrite) {
            for (var i = headers.length - 1; i >= 0; i--) {
                if (headers[i].indexOf("".concat(cookie.name, "=")) === 0) {
                    headers.splice(i, 1);
                }
            }
        }
        headers.push(cookie.toHeader());
    }

    function omit(obj) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        var newObject = Object.assign({}, obj);
        for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
            var key = values_1[_a];
            delete newObject[key];
        }
        return newObject;
    }

    /**
     * @credit https://stackoverflow.com/a/2117523
     */
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    /**
     * Slightly cleaner and smaller UUIDs
     */
    function uuid() {
        return uuidv4().replace(/-/g, '');
    }

    function emptyUrl() {
        return {
            query: null,
            port: null,
            auth: null,
            hash: null,
            host: null,
            hostname: null,
            href: null,
            path: null,
            pathname: null,
            protocol: null,
            search: null,
            slashes: null,
        };
    }
    // Replacement for `url.parse` using `URL` global object that works with relative paths.
    // Assumptions: this function operates in a NodeJS environment.
    function parse(url) {
        var out = emptyUrl();
        var u;
        var pathOnly = url === '' || url[0] === '/';
        if (pathOnly) {
            u = new URL(url, 'http://0.0.0.0/');
            out.href = u.href;
            out.href = out.href.slice(14); // remove 'http://0.0.0.0/'
        }
        else {
            u = new URL(url);
            out.href = u.href;
            out.port = u.port === '' ? null : u.port;
            out.hash = u.hash === '' ? null : u.hash;
            out.host = u.host;
            out.hostname = u.hostname;
            out.href = u.href;
            out.pathname = u.pathname;
            out.protocol = u.protocol;
            out.slashes = url[u.protocol.length] === '/'; // check if the mimetype is proceeded by a slash
        }
        out.search = u.search;
        out.query = u.search.slice(1); // remove '?'
        out.path = "".concat(u.pathname).concat(u.search);
        out.pathname = u.pathname;
        return out;
    }

    function pad (hash, len) {
      while (hash.length < len) {
        hash = '0' + hash;
      }
      return hash;
    }

    function fold (hash, text) {
      var i;
      var chr;
      var len;
      if (text.length === 0) {
        return hash;
      }
      for (i = 0, len = text.length; i < len; i++) {
        chr = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
      }
      return hash < 0 ? hash * -2 : hash;
    }

    function foldObject (hash, o, seen) {
      return Object.keys(o).sort().reduce(foldKey, hash);
      function foldKey (hash, key) {
        return foldValue(hash, o[key], key, seen);
      }
    }

    function foldValue (input, value, key, seen) {
      var hash = fold(fold(fold(input, key), toString(value)), typeof value);
      if (value === null) {
        return fold(hash, 'null');
      }
      if (value === undefined) {
        return fold(hash, 'undefined');
      }
      if (typeof value === 'object' || typeof value === 'function') {
        if (seen.indexOf(value) !== -1) {
          return fold(hash, '[Circular]' + key);
        }
        seen.push(value);

        var objHash = foldObject(hash, value, seen);

        if (!('valueOf' in value) || typeof value.valueOf !== 'function') {
          return objHash;
        }

        try {
          return fold(objHash, String(value.valueOf()))
        } catch (err) {
          return fold(objHash, '[valueOf exception]' + (err.stack || err.message))
        }
      }
      return fold(hash, value.toString());
    }

    function toString (o) {
      return Object.prototype.toString.call(o);
    }

    function sum (o) {
      return pad(foldValue(0, o, '', []).toString(16), 8);
    }

    var hashSum = sum;

    /**
     * Safe conversion to error type. Intended to be used in catch blocks where the
     *  value is not guaranteed to be an error.
     *
     *  @example
     *  try {
     *    throw new Error('Something went wrong')
     *  }
     *  catch (err: unknown) {
     *    const error: Error = toError(err)
     *  }
     */
    function toError(err) {
        if (err instanceof Error)
            return err;
        return new Error(String(err));
    }

    var DEFAULT_API_VERSION = 'v3';

    function datePlusMinutes(minutes) {
        if (minutes === void 0) { minutes = 30; }
        return new Date(Date.now() + minutes * 60000);
    }
    var isPositiveNumber = function (thing) {
        return typeof thing === 'number' && !isNaN(thing) && thing >= 0;
    };
    var isReactNative = typeof navigator === 'object' && navigator.product === 'ReactNative';
    var validEnvList = [
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
    var parse$1 = isReactNative
        ? function () { return emptyUrl(); }
        : typeof window === 'object'
            ? urlParser.parse
            : parse;
    function setCookie(name$$1, value, expires) {
        try {
            var expiresString = '';
            // TODO: need to know if secure server side
            if (expires) {
                expiresString = '; expires=' + expires.toUTCString();
            }
            var secure = isBrowser ? location.protocol === 'https:' : true;
            document.cookie =
                name$$1 +
                    '=' +
                    (value || '') +
                    expiresString +
                    '; path=/' +
                    "; domain=".concat(getTopLevelDomain(location.hostname)) +
                    (secure ? ';secure ; SameSite=None' : '');
        }
        catch (err) {
            console.warn('Could not set cookie', err);
        }
    }
    function getCookie(name$$1) {
        try {
            return (decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' +
                encodeURIComponent(name$$1).replace(/[\-\.\+\*]/g, '\\$&') +
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
    var isBrowser = typeof window !== 'undefined' && !isReactNative;
    var isIframe = isBrowser && window.top !== window.self;
    function BuilderComponent(info) {
        if (info === void 0) { info = {}; }
        return Builder.Component(info);
    }
    var Builder = /** @class */ (function () {
        function Builder(apiKey, request, response, forceNewInstance, authToken, apiVersion) {
            if (apiKey === void 0) { apiKey = null; }
            if (forceNewInstance === void 0) { forceNewInstance = false; }
            if (authToken === void 0) { authToken = null; }
            var _this = this;
            this.request = request;
            this.response = response;
            this.eventsQueue = [];
            this.throttledClearEventsQueue = throttle(function () {
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
            this.apiVersion$ = new BehaviorSubject(undefined);
            this.canTrack$ = new BehaviorSubject(!this.browserTrackingDisabled);
            this.apiKey$ = new BehaviorSubject(null);
            this.authToken$ = new BehaviorSubject(null);
            this.userAttributesChanged = new BehaviorSubject(null);
            this.editingMode$ = new BehaviorSubject(isIframe);
            // TODO: decorator to do this stuff with the get/set (how do with typing too? compiler?)
            this.editingModel$ = new BehaviorSubject(null);
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
                this.cookies = new Cookies(this.request, this.response);
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
            if (isBrowser) {
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
            if (isIframe) {
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
            if (isBrowser) {
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
                    data: omit(info, 'component'),
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
        Builder.fields = function (name$$1, fields) {
            var _a;
            (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage({
                type: 'builder.fields',
                data: { name: name$$1, fields: fields },
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
                if (isBrowser && isIframe) {
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
                ? isBrowser && options.models.includes(this.singletonInstance.editingModel)
                : isBrowser;
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
                if (isBrowser) {
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
            getFetch()("".concat(host, "/api/v1/track"), {
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
            if (isIframe || !isBrowser || Builder.isPreviewing) {
                return;
            }
            var apiKey = this.apiKey;
            if (!apiKey) {
                console.error('Builder integration error: Looks like the Builder SDK has not been initialized properly (your API key has not been set). Make sure you are calling `builder.init("«YOUR-API-KEY»");` as early as possible in your application\'s code.');
                return;
            }
            var eventData = JSON.parse(JSON.stringify({
                type: eventName,
                data: __assign(__assign({}, omit(properties, 'meta')), { metadata: __assign(__assign({ sdkVersion: Builder.VERSION, url: location.href }, properties.meta), properties.metadata), ownerId: apiKey, userAttributes: this.getUserAttributes(), sessionId: this.sessionId, visitorId: this.visitorId }),
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
                sessionId = uuid();
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
                visitorId = uuid();
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
            if (isIframe || !isBrowser || Builder.isPreviewing) {
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
            if (isIframe || !isBrowser || Builder.isPreviewing) {
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
            if (isIframe || !isBrowser || Builder.isPreviewing) {
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
            var params = QueryString.parseDeep(this.modifySearch(search || '').substr(1));
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
            var params = QueryString.parseDeep(this.modifySearch(location.search || '').substr(1));
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
                if (validEnvList.indexOf(env || api) > -1) {
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
            if (isBrowser) {
                addEventListener('message', function (event) {
                    var _a, _b, _c, _d, _e;
                    var url = parse$1(event.origin);
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
                                assign(Builder.overrideUserAttributes, userAttributes);
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
                                    error = toError(err);
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
                var params = QueryString.parse((search || '').substr(1));
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
                parsedLocation = parse$1((_a = this.request.url) !== null && _a !== void 0 ? _a : '');
            }
            else if (typeof location === 'object') {
                // in the browser
                parsedLocation = parse$1(location.href);
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
            assign(Builder.overrideUserAttributes, options);
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
            assign(this.trackingUserAttributes, attributes);
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
                    nextTick(function () {
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
                    nextTick(function () {
                        _this.flushGetContentQueue(false, queue_1);
                    });
                }
                else {
                    nextTick(function () {
                        _this.flushGetContentQueue();
                    });
                }
            }
            var observable = new BehaviorSubject(null);
            this.observersByKey[key] = observable;
            if (options.noEditorUpdates) {
                this.noEditorUpdates[key] = true;
            }
            if (initialContent) {
                nextTick(function () {
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
            return getFetch()(url, options).then(function (res) { return res.json(); });
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
                this.apiVersion = DEFAULT_API_VERSION;
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
                ? QueryString.parseDeep(location.search.substr(1))
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
                isIframe ||
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
                var params = omit(QueryString.parse(this.overrideParams), 'apiKey');
                assign(queryParams, params);
            }
            var queryStr = QueryString.stringifyDeep(queryParams);
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
            var promise = getFetch()(url, requestOptions)
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
            if (isIframe) {
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
        Builder.prototype.getCookie = function (name$$1) {
            if (this.cookies) {
                return this.cookies.get(name$$1);
            }
            return Builder.isBrowser && getCookie(name$$1);
        };
        Builder.prototype.setCookie = function (name$$1, value, expires) {
            if (this.cookies && !(Builder.isServer && Builder.isStatic)) {
                return this.cookies.set(name$$1, value, {
                    expires: expires,
                    secure: this.getLocation().protocol === 'https:',
                });
            }
            return Builder.isBrowser && setCookie(name$$1, value, expires);
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
                    ? "".concat(modelName, ":").concat(hashSum(omit(options, 'initialContent', 'req', 'res')))
                    : undefined }))
                .promise();
        };
        /**
         * @hidden
         * @deprecated. This is buggy, and always behind by a version.
         */
        Builder.VERSION = version;
        Builder.components = [];
        /**
         * Makes it so that a/b tests generate code like {@link
         * https://www.builder.io/blog/high-performance-no-code#__next:~:text=Static%20generated%20A%2FB%20testing}
         * instead of the old way where we render only one test group at a time on the
         * server. This is the preferred/better way not and we should ultimately make it
         * the default
         */
        Builder.isStatic = true;
        Builder.animator = new Animator();
        Builder.nextTick = nextTick;
        Builder.throttle = throttle;
        Builder.editors = [];
        Builder.trustedHosts = ['builder.io', 'localhost'];
        Builder.plugins = [];
        Builder.actions = [];
        Builder.registry = {};
        Builder.registryChange = new BehaviorSubject({});
        Builder._editingPage = false;
        Builder.isIframe = isIframe;
        Builder.isBrowser = isBrowser;
        Builder.isReactNative = isReactNative;
        Builder.isServer = !isBrowser && !isReactNative;
        Builder.previewingModel = Builder.isBrowser && getQueryParam(location.href, 'builder.preview');
        Builder.settings = {};
        Builder.settingsChange = new BehaviorSubject({});
        // TODO: this is quick and dirty, do better implementation later. Also can be unreliable
        // if page 301s etc. Use a query param instead? also could have issues with redirects. Injecting var could
        // work but is async...
        Builder.isEditing = Boolean(isIframe &&
            ((document.referrer && document.referrer.match(/builder\.io|localhost:1234/)) ||
                location.search.indexOf('builder.frameEditing=') !== -1));
        Builder.isPreviewing = Boolean(isBrowser &&
            (location.search.indexOf('builder.preview=') !== -1 ||
                location.search.indexOf('builder.frameEditing=') !== -1));
        Builder.isReact = false;
        Builder.overrideUserAttributes = {};
        return Builder;
    }());

    var builder = new Builder(null, undefined, undefined, true);
    Builder.singletonInstance = builder;

    exports.Builder = Builder;
    exports.BuilderComponent = BuilderComponent;
    exports.isBrowser = isBrowser;
    exports.BehaviorSubject = BehaviorSubject;
    exports.Subscription = Subscription;
    exports.builder = builder;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
