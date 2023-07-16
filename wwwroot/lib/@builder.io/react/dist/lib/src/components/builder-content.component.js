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
exports.getContentWithInfo = exports.BuilderContent = void 0;
var react_1 = __importDefault(require("react"));
var sdk_1 = require("@builder.io/sdk");
var no_wrap_1 = require("./no-wrap");
var apply_patch_with_mutation_1 = require("../functions/apply-patch-with-mutation");
var variants_provider_component_1 = require("./variants-provider.component");
/**
 * When passed content json explicitly it'll calculate a/b tests on the content
 * and pass the winning variation down to the children function. If then content
 * prop was omitted it'll try to fetch matching content from your Builder
 * account based on the default user attributes and model.
 */
var BuilderContent = /** @class */ (function (_super) {
    __extends(BuilderContent, _super);
    function BuilderContent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ref = null;
        _this.state = {
            loading: !_this.props.content,
            data: (0, exports.getContentWithInfo)(_this.props.content),
            updates: 1,
        };
        _this.onWindowMessage = function (event) {
            var _a, _b;
            var message = event.data;
            if (!message) {
                return;
            }
            switch (message.type) {
                case 'builder.patchUpdates': {
                    if ((_a = _this.props.options) === null || _a === void 0 ? void 0 : _a.noEditorUpdates) {
                        return;
                    }
                    var data = message.data;
                    if (!(data && data.data)) {
                        break;
                    }
                    var patches = data.data[(_b = _this.state.data) === null || _b === void 0 ? void 0 : _b.id];
                    if (!(patches && patches.length)) {
                        return;
                    }
                    if (location.href.includes('builder.debug=true')) {
                        eval('debugger');
                    }
                    var newData = _this.state.data;
                    for (var _i = 0, patches_1 = patches; _i < patches_1.length; _i++) {
                        var patch = patches_1[_i];
                        newData = (0, apply_patch_with_mutation_1.applyPatchWithMinimalMutationChain)(newData, patch, false);
                    }
                    _this.setState({
                        updates: _this.state.updates + 1,
                        data: newData,
                    });
                    if (_this.props.contentLoaded) {
                        _this.props.contentLoaded(newData.data, newData);
                    }
                    break;
                }
            }
        };
        _this.subscriptions = new sdk_1.Subscription();
        _this.firstLoad = true;
        _this.clicked = false;
        _this.trackedImpression = false;
        _this.intersectionObserver = null;
        _this.onClick = function (reactEvent) {
            // TODO: viewport scrolling tracking for impression events
            var event = reactEvent.nativeEvent;
            var content = _this.data;
            if (!content) {
                return;
            }
            if (sdk_1.builder.autoTrack) {
                _this.builder.trackInteraction(content.id, _this.renderedVariantId, _this.clicked, event, {
                    content: content,
                });
            }
            if (!_this.clicked) {
                _this.clicked = true;
            }
        };
        return _this;
    }
    Object.defineProperty(BuilderContent.prototype, "builder", {
        get: function () {
            return this.props.builder || sdk_1.builder;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderContent.prototype, "name", {
        get: function () {
            var props = this.props;
            if ('model' in props) {
                return props.model;
            }
            else {
                return props.modelName;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderContent.prototype, "renderedVariantId", {
        get: function () {
            var _a, _b;
            var id = this.props.isStatic
                ? this.builder.getCookie("builder.tests.".concat((_a = this.data) === null || _a === void 0 ? void 0 : _a.id))
                : (_b = this.data) === null || _b === void 0 ? void 0 : _b.variationId;
            if (id !== null) {
                return id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderContent.prototype, "options", {
        get: function () {
            var _a, _b;
            var options = __assign({}, (this.props.options || {}));
            if (!options.key && ((_a = this.props.content) === null || _a === void 0 ? void 0 : _a.id) && !sdk_1.Builder.isEditing && !sdk_1.Builder.isPreviewing) {
                options.key = this.props.content.id;
            }
            if (this.props.content &&
                !((_b = options.initialContent) === null || _b === void 0 ? void 0 : _b.length) &&
                (this.props.inline || !sdk_1.Builder.isPreviewing)) {
                options.initialContent = [this.props.content];
            }
            return options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuilderContent.prototype, "data", {
        get: function () {
            var content = ((this.props.inline || !sdk_1.Builder.isBrowser || this.firstLoad) &&
                this.options.initialContent &&
                this.options.initialContent[0]) ||
                this.state.data;
            return (0, exports.getContentWithInfo)(content);
        },
        enumerable: false,
        configurable: true
    });
    // TODO: observe model name for changes
    BuilderContent.prototype.componentDidMount = function () {
        var _a, _b;
        // Temporary to test metrics diving in with bigquery and heatmaps
        // this.builder.autoTrack = true;
        // this.builder.env = 'development';
        if (!this.props.inline || sdk_1.Builder.isEditing || sdk_1.Builder.isPreviewing) {
            this.subscribeToContent();
        }
        else if (this.props.inline && ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.initialContent) === null || _b === void 0 ? void 0 : _b.length)) {
            var contentData = this.options.initialContent[0];
            // TODO: intersectionobserver like in subscribetocontent - reuse the logic
            if (contentData === null || contentData === void 0 ? void 0 : contentData.id) {
                this.builder.trackImpression(contentData.id, this.renderedVariantId, undefined, {
                    content: contentData,
                });
            }
        }
        if (sdk_1.Builder.isEditing) {
            addEventListener('message', this.onWindowMessage);
        }
        /// REACT15ONLY if (this.ref) { this.ref.setAttribute('builder-model', this.name); }
    };
    BuilderContent.prototype.subscribeToContent = function () {
        var _this = this;
        if (this.name !== '_inline') {
            // TODO:... using targeting...? express.request hmmm
            this.subscriptions.add(sdk_1.builder.queueGetContent(this.name, this.options).subscribe(function (matches) {
                var match = matches && matches[0];
                _this.setState({
                    data: match,
                    loading: false,
                });
                // when BuilderContent is wrapping a BuilderComponent of the same model, the BuilderComponent is passing initialContent on the same key
                // causing the sdk to resolve this call to the initialContent instead of the previewed/edited content
                // so we test here if the BuilderContent is being used directly ( not inlined ) and it has initial content ( content prop ), we let the first render go through to show the initial content
                // and we subscribe again to get the draft/editing content
                var isPreviewing = (sdk_1.builder.editingModel || sdk_1.builder.previewingModel) === _this.name;
                if (!_this.props.inline && _this.props.content && _this.firstLoad && isPreviewing) {
                    _this.firstLoad = false;
                    _this.subscriptions.unsubscribe();
                    _this.subscribeToContent();
                }
                if (match && _this.firstLoad) {
                    _this.firstLoad = false;
                    // TODO: autoTrack
                    if (sdk_1.builder.autoTrack && !sdk_1.Builder.isEditing) {
                        var addedObserver = false;
                        if (typeof IntersectionObserver === 'function' && _this.ref) {
                            try {
                                var observer = (_this.intersectionObserver = new IntersectionObserver(function (entries, observer) {
                                    entries.forEach(function (entry) {
                                        // In view
                                        if (entry.intersectionRatio > 0 && !_this.trackedImpression) {
                                            _this.builder.trackImpression(match.id, _this.renderedVariantId, undefined, {
                                                content: _this.data,
                                            }),
                                                { content: _this.data };
                                            _this.trackedImpression = true;
                                            if (_this.ref) {
                                                observer.unobserve(_this.ref);
                                            }
                                        }
                                    });
                                }));
                                observer.observe(_this.ref);
                                addedObserver = true;
                            }
                            catch (err) {
                                console.warn('Could not bind intersection observer');
                            }
                        }
                        if (!addedObserver) {
                            _this.trackedImpression = true;
                            _this.builder.trackImpression(match.id, _this.renderedVariantId, undefined, {
                                content: match,
                            });
                        }
                    }
                }
                if (_this.props.contentLoaded) {
                    _this.props.contentLoaded(match && match.data, match);
                }
            }, function (error) {
                if (_this.props.contentError) {
                    _this.props.contentError(error);
                    _this.setState({
                        loading: false,
                    });
                }
            }));
        }
    };
    BuilderContent.prototype.componentWillUnmount = function () {
        if (sdk_1.Builder.isEditing) {
            removeEventListener('message', this.onWindowMessage);
        }
        this.subscriptions.unsubscribe();
        if (this.intersectionObserver && this.ref) {
            this.intersectionObserver.unobserve(this.ref);
        }
    };
    BuilderContent.prototype.render = function () {
        var _this = this;
        if (this.props.dataOnly) {
            return null;
        }
        var loading = this.state.loading;
        var useData = this.data;
        var TagName = this.props.dataOnly ? no_wrap_1.NoWrap : 'div';
        return (react_1.default.createElement(variants_provider_component_1.VariantsProvider, { initialContent: useData }, function (variants, renderScript) {
            return (react_1.default.createElement(react_1.default.Fragment, null, variants.map(function (content, index) {
                // default Variation is at the end, wrap the rest with template
                // TODO: IE11 don't support templates
                var Tag = index === variants.length - 1 ? react_1.default.Fragment : 'template';
                return (react_1.default.createElement(react_1.default.Fragment, { key: String((content === null || content === void 0 ? void 0 : content.id) + index) },
                    Tag !== 'template' && (renderScript === null || renderScript === void 0 ? void 0 : renderScript()),
                    react_1.default.createElement(Tag, __assign({ key: String((content === null || content === void 0 ? void 0 : content.id) + index) }, (Tag === 'template' && {
                        'data-template-variant-id': content === null || content === void 0 ? void 0 : content.id,
                    })),
                        react_1.default.createElement(TagName, __assign({}, (index === 0 &&
                            !_this.props.dataOnly && {
                            ref: function (ref) { return (_this.ref = ref); },
                        }), { className: "builder-content", onClick: _this.onClick, "builder-content-id": content === null || content === void 0 ? void 0 : content.id, "builder-model": _this.name }), _this.props.children(content === null || content === void 0 ? void 0 : content.data, _this.props.inline ? false : loading, useData)))));
            })));
        }));
    };
    return BuilderContent;
}(react_1.default.Component));
exports.BuilderContent = BuilderContent;
var getContentWithInfo = function (content) {
    var _a;
    if (content) {
        var cookieValue = sdk_1.builder.getCookie("builder.tests.".concat(content.id));
        var cookieVariation = cookieValue === content.id ? content : (_a = content.variations) === null || _a === void 0 ? void 0 : _a[cookieValue];
        var variationName = (cookieVariation === null || cookieVariation === void 0 ? void 0 : cookieVariation.name) || ((cookieVariation === null || cookieVariation === void 0 ? void 0 : cookieVariation.id) === content.id ? 'Default variation' : '');
        return __assign(__assign({}, content), { variationId: cookieValue, testVariationId: cookieValue, testVariationName: variationName });
    }
    return null;
};
exports.getContentWithInfo = getContentWithInfo;
//# sourceMappingURL=builder-content.component.js.map