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
exports.BuilderBlock = void 0;
/** @jsx jsx */
var sdk_1 = require("@builder.io/sdk");
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var device_sizes_constant_1 = require("../constants/device-sizes.constant");
var set_1 = require("../functions/set");
var string_to_function_1 = require("../functions/string-to-function");
var builder_async_requests_1 = require("../store/builder-async-requests");
var builder_store_1 = require("../store/builder-store");
var apply_patch_with_mutation_1 = require("../functions/apply-patch-with-mutation");
var block_to_html_string_1 = require("../functions/block-to-html-string");
var Link_1 = require("./Link");
var utils_1 = require("../functions/utils");
var camelCaseToKebabCase = function (str) {
    return str ? str.replace(/([A-Z])/g, function (g) { return "-".concat(g[0].toLowerCase()); }) : '';
};
var kebabCaseToCamelCase = function (str) {
    if (str === void 0) { str = ''; }
    return str.replace(/-([a-z])/g, function (match) { return match[1].toUpperCase(); });
};
var Device = { desktop: 0, tablet: 1, mobile: 2 };
var voidElements = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
    'textarea', // In React, we want to treat this as void (no children, otherwise React throws errors)
]);
var last = function (arr) { return arr[arr.length - 1]; };
function omit(obj, values) {
    var newObject = Object.assign({}, obj);
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var key = values_1[_i];
        delete newObject[key];
    }
    return newObject;
}
var cssCase = function (property) {
    if (!property) {
        return property;
    }
    var str = camelCaseToKebabCase(property);
    if (property[0] === property[0].toUpperCase()) {
        str = '-' + str;
    }
    return str;
};
function capitalize(str) {
    if (!str) {
        return;
    }
    return str[0].toUpperCase() + str.slice(1);
}
var BuilderBlock = /** @class */ (function (_super) {
    __extends(BuilderBlock, _super);
    function BuilderBlock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hasError: false,
            updates: 0,
        };
        _this.privateState = {
            state: {},
            rootState: {},
            context: {},
            update: function () {
                /* Intentionally empty */
            },
        };
        _this.onWindowMessage = function (event) {
            var message = event.data;
            if (!message) {
                return;
            }
            switch (message.type) {
                case 'builder.selectionChange': {
                    var data = message.data;
                    if (!data) {
                        break;
                    }
                    var selection = data.selection;
                    var id = _this.block && _this.block.id;
                    if (id && Array.isArray(selection) && selection.indexOf(id) > -1) {
                        setTimeout(function () {
                            window.$block = _this;
                            if (!window.$blocks) {
                                window.$blocks = [];
                            }
                            window.$blocks.push(_this);
                        });
                    }
                    break;
                }
                case 'builder.patchUpdates': {
                    var data = message.data;
                    if (!(data && data.data)) {
                        break;
                    }
                    var patches = data.data[_this.block.id];
                    if (!patches) {
                        return;
                    }
                    if (location.href.includes('builder.debug=true')) {
                        eval('debugger');
                    }
                    for (var _i = 0, patches_1 = patches; _i < patches_1.length; _i++) {
                        var patch = patches_1[_i];
                        (0, apply_patch_with_mutation_1.applyPatchWithMinimalMutationChain)(_this.props.block, patch, true);
                    }
                    _this.setState({ updates: _this.state.updates + 1 });
                    break;
                }
            }
        };
        return _this;
    }
    Object.defineProperty(BuilderBlock.prototype, "store", {
        get: function () {
            return this.privateState;
        },
        enumerable: false,
        configurable: true
    });
    BuilderBlock.getDerivedStateFromError = function (error) {
        return { hasError: true };
    };
    BuilderBlock.prototype.componentDidCatch = function (error, errorInfo) {
        console.error('Builder block error:', error, errorInfo);
    };
    // TODO: handle adding return if none provided
    // TODO: cache/memoize this (globally with LRU?)
    BuilderBlock.prototype.stringToFunction = function (str, expression) {
        if (expression === void 0) { expression = true; }
        return (0, string_to_function_1.stringToFunction)(str, expression, this._errors, this._logs);
    };
    Object.defineProperty(BuilderBlock.prototype, "block", {
        get: function () {
            return this.props.block;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderBlock.prototype, "emotionCss", {
        get: function () {
            var _a, _b, _c, _d;
            var initialAnimationStepStyles;
            var block = this.block;
            if (sdk_1.Builder.isServer) {
                var animation = block.animations && block.animations[0];
                if (animation && animation.trigger !== 'hover') {
                    var firstStep = animation && animation.steps && animation.steps[0];
                    var stepStyles = firstStep && firstStep.styles;
                    if (stepStyles) {
                        initialAnimationStepStyles = stepStyles;
                    }
                }
            }
            var reversedNames = device_sizes_constant_1.sizeNames.slice().reverse();
            var self = this.block;
            var styles = {};
            if (self.responsiveStyles) {
                for (var _i = 0, reversedNames_1 = reversedNames; _i < reversedNames_1.length; _i++) {
                    var size = reversedNames_1[_i];
                    if (size === 'large') {
                        if (!this.props.emailMode) {
                            styles["&.builder-block"] = Object.assign({}, self.responsiveStyles[size], initialAnimationStepStyles);
                        }
                    }
                    else {
                        var sizesPerBreakpoints = (0, device_sizes_constant_1.getSizesForBreakpoints)(((_b = (_a = this.privateState.context.builderContent) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.breakpoints) || {});
                        styles["@media only screen and (max-width: ".concat(sizesPerBreakpoints[size].max, "px)")] = {
                            '&.builder-block': self.responsiveStyles[size],
                        };
                    }
                }
            }
            var hoverAnimation = block.animations && block.animations.find(function (item) { return item.trigger === 'hover'; });
            if (hoverAnimation) {
                styles[':hover'] = ((_d = (_c = hoverAnimation.steps) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.styles) || {};
                // TODO: if manually has set transition property deal with that
                // TODO: only include properties explicitly set in the animation
                // using Object.keys(styles)
                styles.transition = "all ".concat(hoverAnimation.duration, "s ").concat(camelCaseToKebabCase(hoverAnimation.easing));
                if (hoverAnimation.delay) {
                    styles.transitionDelay = hoverAnimation.delay + 's';
                }
            }
            return styles;
        },
        enumerable: false,
        configurable: true
    });
    BuilderBlock.prototype.eval = function (str) {
        var fn = this.stringToFunction(str);
        // TODO: only one root instance of this, don't rewrap every time...
        return fn(this.privateState.state, undefined, this.block, sdk_1.builder, Device, this.privateState.update, sdk_1.Builder, this.privateState.context);
    };
    BuilderBlock.prototype.componentWillUnmount = function () {
        if (sdk_1.Builder.isEditing) {
            removeEventListener('message', this.onWindowMessage);
        }
    };
    BuilderBlock.prototype.componentDidMount = function () {
        var _this = this;
        var _a;
        var block = this.block;
        var animations = block && block.animations;
        if (sdk_1.Builder.isEditing) {
            addEventListener('message', this.onWindowMessage);
        }
        // tslint:disable-next-line:comment-format
        ///REACT15ONLY if (this.ref) { this.ref.setAttribute('builder-id', block.id); }
        if (animations) {
            var options = {
                animations: (0, utils_1.fastClone)(animations),
            };
            // TODO: listen to Builder.editingMode and bind animations when editing
            // and unbind when not
            // TODO: apply bindings first
            if (block.bindings) {
                for (var key in block.bindings) {
                    if (!((_a = key.trim) === null || _a === void 0 ? void 0 : _a.call(key))) {
                        continue;
                    }
                    if (key.startsWith('animations.')) {
                        // TODO: this needs to run in getElement bc of local state per element for repeats
                        var value = this.stringToFunction(block.bindings[key]);
                        if (value !== undefined) {
                            (0, set_1.set)(options, key, value(this.privateState.state, null, block, sdk_1.builder, null, null, sdk_1.Builder, this.privateState.context));
                        }
                    }
                }
            }
            sdk_1.Builder.animator.bindAnimations(options.animations
                .filter(function (item) { return item.trigger !== 'hover'; })
                .map(function (animation) { return (__assign(__assign({}, animation), { elementId: _this.block.id })); }));
        }
    };
    // <!-- Builder Blocks --> in comments hmm
    BuilderBlock.prototype.getElement = function (index, state) {
        var _a;
        var _this = this;
        var _b, _c, _d, _e;
        if (index === void 0) { index = 0; }
        if (state === void 0) { state = this.privateState.state; }
        var _f = this.props, child = _f.child, fieldName = _f.fieldName;
        var block = this.block;
        var TagName = (block.tagName || 'div').toLowerCase();
        if (TagName === 'template') {
            var html = block.children
                ? block.children.map(function (item) { return (0, block_to_html_string_1.blockToHtmlString)(item); }).join(' ')
                : '';
            console.debug('template html', html);
            return (
            // React has an undesired behavior (for us) for template tags, so we must
            // turn the contents into a string
            (0, core_1.jsx)("template", __assign({}, block.properties, { dangerouslySetInnerHTML: {
                    __html: html,
                } })));
        }
        var InnerComponent;
        var componentName = block.component && (block.component.name || block.component.component);
        var componentInfo = null;
        if (block.component && !block.component.class) {
            if (block.component && block.component.tag) {
                InnerComponent = block.component.tag;
            }
            else {
                componentInfo = sdk_1.Builder.components.find(function (item) { return item.name === componentName; }) || null;
                if (componentInfo && componentInfo.class) {
                    InnerComponent = componentInfo.class;
                }
                else if (componentInfo && componentInfo.tag) {
                    InnerComponent = componentInfo.tag;
                }
                else {
                    if (componentName === null || componentName === void 0 ? void 0 : componentName.startsWith('Builder:')) {
                        console.warn("Missing @builder.io/widgets installation, please install and import @builder.io/widgets to use ".concat(componentName.split(':')[1], " in your content, more info here: https://github.com/BuilderIO/builder/tree/main/packages/widgets"));
                    }
                    else if (componentName) {
                        console.warn("Missing registration for ".concat(componentName, ", have you included the registration in your bundle?"));
                    }
                }
            }
        }
        var TextTag = 'span';
        var options = __assign(__assign({}, block.properties), { style: {} });
        options = __assign(__assign({}, options.properties), options);
        if (block.component) {
            options.component = (0, utils_1.fastClone)(block.component);
        }
        // Binding should be properties to href or href?
        // Manual style editor show bindings
        // Show if things bound in overlays hmm
        if (block.bindings) {
            for (var key in block.bindings) {
                if (!((_b = key.trim) === null || _b === void 0 ? void 0 : _b.call(key))) {
                    continue;
                }
                var value = this.stringToFunction(block.bindings[key]);
                // TODO: pass block, etc
                (0, set_1.set)(options, key, value(state, null, block, (0, string_to_function_1.api)(state), Device, null, sdk_1.Builder, this.privateState.context));
            }
        }
        if (options.hide) {
            return null;
        }
        else {
            delete options.hide;
        }
        // TODO: UI for this
        if (('show' in options || (block.bindings && block.bindings.show)) && !options.show) {
            return null;
        }
        else {
            delete options.show;
        }
        if (block.actions) {
            var _loop_1 = function (key) {
                if (!((_c = key.trim) === null || _c === void 0 ? void 0 : _c.call(key))) {
                    return "continue";
                }
                var value = block.actions[key];
                options['on' + capitalize(key)] = function (event) {
                    var useState = state;
                    if (typeof Proxy !== 'undefined') {
                        useState = new Proxy(state, {
                            set: function (obj, prop, value) {
                                obj[prop] = value;
                                _this.privateState.rootState[prop] = value;
                                return true;
                            },
                        });
                    }
                    var fn = _this.stringToFunction(value, false);
                    // TODO: only one root instance of this, don't rewrap every time...
                    return fn(useState, event, _this.block, sdk_1.builder, Device, _this.privateState.update, sdk_1.Builder, _this.privateState.context);
                };
            };
            for (var key in block.actions) {
                _loop_1(key);
            }
        }
        var innerComponentProperties = (options.component || options.options) && __assign(__assign({}, options.options), (options.component.options || options.component.data));
        var isVoid = voidElements.has(TagName);
        var noWrap = componentInfo && (componentInfo.fragment || componentInfo.noWrap);
        var styleStr = ((_d = options.attr) === null || _d === void 0 ? void 0 : _d.style) || (typeof options.style === 'string' ? options.style : '') || '';
        if (typeof styleStr === 'string') {
            if (typeof options.style !== 'object') {
                options.style = {};
            }
            var styleSplit = styleStr.split(';');
            for (var _i = 0, styleSplit_1 = styleSplit; _i < styleSplit_1.length; _i++) {
                var pair = styleSplit_1[_i];
                var stylePieces = pair.split(':');
                if (!stylePieces.length) {
                    return;
                }
                var key = stylePieces[0], value = stylePieces[1];
                if (!key) {
                    continue;
                }
                if (stylePieces.length > 2) {
                    value = stylePieces.slice(1).join(':');
                }
                options.style[kebabCaseToCamelCase(key)] = value;
            }
        }
        var finalOptions = __assign(__assign(__assign({}, omit(options, ['class', 'component', 'attr'])), (_a = {}, _a[typeof TagName === 'string' && !TagName.includes('-') ? 'className' : 'class'] = "builder-block ".concat(this.id).concat(block.class ? " ".concat(block.class) : '').concat(block.component && !(['Image', 'Video', 'Banner'].indexOf(componentName) > -1)
            ? " builder-has-component"
            : '') +
            (options.class ? ' ' + options.class : '') +
            (sdk_1.Builder.isEditing && ((_e = this.privateState.state._spacer) === null || _e === void 0 ? void 0 : _e.parent) === block.id
                ? ' builder-spacer-parent'
                : ''), _a.key = this.id + index, _a['builder-id'] = this.id, _a)), (index !== 0 && {
            'builder-index': index, // String(state.$index)
        }));
        // tslint:disable-next-line:comment-format
        ///REACT15ONLY finalOptions.className = finalOptions.class
        if (sdk_1.Builder.isEditing) {
            // TODO: removed bc JS can add styles inline too?
            finalOptions['builder-inline-styles'] = !(options.attr && options.attr.style)
                ? ''
                : Object.keys(options.style).reduce(function (memo, key) { return (memo ? "".concat(memo, ";") : '') + "".concat(cssCase(key), ":").concat(options.style[key], ";"); }, '');
        }
        if (((finalOptions.properties && finalOptions.properties.href) ||
            finalOptions.href) &&
            TagName === 'div') {
            TagName = 'a';
        }
        if (TagName === 'a') {
            TagName = Link_1.Link;
        }
        // const css = this.css
        // const styleTag = css.trim() && (
        //   <style className="builder-style">
        //     {(InnerComponent && !isBlock ? `.${this.id} > * { height: 100%; width: 100%; }` : '') +
        //       this.css}
        //   </style>
        // )
        var children = block.children || finalOptions.children || [];
        // TODO: test it out
        return ((0, core_1.jsx)(react_1.default.Fragment, null,
            (0, core_1.jsx)(core_1.ClassNames, null, function (_a) {
                var css = _a.css, cx = _a.cx;
                if (!_this.props.emailMode) {
                    var addClass = ' ' + css(_this.emotionCss);
                    if (finalOptions.class) {
                        finalOptions.class += addClass;
                    }
                    if (finalOptions.className) {
                        finalOptions.className += addClass;
                    }
                }
                return ((0, core_1.jsx)(builder_async_requests_1.BuilderAsyncRequestsContext.Consumer, null, function (value) {
                    _this._asyncRequests = value && value.requests;
                    _this._errors = value && value.errors;
                    _this._logs = value && value.logs;
                    return isVoid ? ((0, core_1.jsx)(TagName, __assign({}, finalOptions))) : InnerComponent && (noWrap || _this.props.emailMode) ? (
                    // TODO: pass the class to be easier
                    // TODO: acceptsChildren option?
                    (0, core_1.jsx)(InnerComponent
                    // Final options maaay be wrong here hm
                    , __assign({}, innerComponentProperties, { 
                        // should really call this builderAttributes bc people can name a
                        // componet input "attributes"
                        attributes: finalOptions, builderBlock: block, builderState: _this.privateState }))) : ((0, core_1.jsx)(TagName, __assign({}, finalOptions),
                        InnerComponent && ((0, core_1.jsx)(InnerComponent, __assign({ builderState: _this.privateState, builderBlock: block }, innerComponentProperties))),
                        block.text || options.text
                            ? options.text
                            : !InnerComponent && children && Array.isArray(children) && children.length
                                ? children.map(function (block, index) { return ((0, core_1.jsx)(BuilderBlock, { key: (_this.id || '') + index, block: block, index: index, size: _this.props.size, fieldName: _this.props.fieldName, child: _this.props.child, emailMode: _this.props.emailMode })); })
                                : null));
                }));
            })));
    };
    Object.defineProperty(BuilderBlock.prototype, "id", {
        get: function () {
            var block = this.block;
            if (!block.id.startsWith('builder')) {
                return 'builder-' + block.id;
            }
            return block.id;
        },
        enumerable: false,
        configurable: true
    });
    BuilderBlock.prototype.contents = function (state) {
        var _this = this;
        var block = this.block;
        // this.setState(state);
        this.privateState = state;
        if (block.repeat && block.repeat.collection) {
            var collectionPath = block.repeat.collection;
            var collectionName = last((collectionPath || '').trim().split('(')[0].trim().split('.'));
            var itemName_1 = block.repeat.itemName || (collectionName ? collectionName + 'Item' : 'item');
            var array = this.stringToFunction(collectionPath)(state.state, null, block, (0, string_to_function_1.api)(state), Device, null, sdk_1.Builder, this.privateState.context);
            if (Array.isArray(array)) {
                return array.map(function (data, index) {
                    var _a;
                    // TODO: Builder state produce the data
                    var childState = __assign(__assign({}, state.state), (_a = { $index: index, $item: data }, _a[itemName_1] = data, _a["$".concat(itemName_1, "Index")] = index, _a));
                    return ((0, core_1.jsx)(builder_store_1.BuilderStoreContext.Provider, { key: index, value: __assign(__assign({}, state), { state: childState }) }, _this.getElement(index, childState)));
                });
            }
            return null;
        }
        return this.getElement();
    };
    BuilderBlock.prototype.render = function () {
        var _this = this;
        if (this.state.hasError) {
            return ((0, core_1.jsx)("span", { css: {
                    display: 'inline-block',
                    padding: 5,
                    color: '#999',
                    fontSize: 11,
                    fontStyle: 'italic',
                } }, "Builder block error :( Check console for details"));
        }
        return ((0, core_1.jsx)(builder_store_1.BuilderStoreContext.Consumer, null, function (value) { return _this.contents(value); }));
    };
    return BuilderBlock;
}(react_1.default.Component));
exports.BuilderBlock = BuilderBlock;
//# sourceMappingURL=builder-block.component.js.map