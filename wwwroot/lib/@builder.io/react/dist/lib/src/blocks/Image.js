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
exports.Image = exports.getSizes = exports.getSrcSet = exports.updateQueryParam = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var builder_block_component_1 = require("../components/builder-block.component");
var sdk_1 = require("@builder.io/sdk");
var builder_meta_1 = require("../store/builder-meta");
var with_builder_1 = require("../functions/with-builder");
var throttle_1 = require("../functions/throttle");
var device_sizes_constant_1 = require("../constants/device-sizes.constant");
// Taken from (and modified) the shopify theme script repo
// https://github.com/Shopify/theme-scripts/blob/bcfb471f2a57d439e2f964a1bb65b67708cc90c3/packages/theme-images/images.js#L59
function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
}
function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}
function getShopifyImageUrl(src, size) {
    if (!src || !(src === null || src === void 0 ? void 0 : src.match(/cdn\.shopify\.com/)) || !size) {
        return src;
    }
    if (size === 'master') {
        return removeProtocol(src);
    }
    var match = src.match(/(_\d+x(\d+)?)?(\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?)/i);
    if (match) {
        var prefix = src.split(match[0]);
        var suffix = match[3];
        var useSize = size.match('x') ? size : "".concat(size, "x");
        return removeProtocol("".concat(prefix[0], "_").concat(useSize).concat(suffix));
    }
    return null;
}
var DEFAULT_ASPECT_RATIO = 0.7041;
function updateQueryParam(uri, key, value) {
    if (uri === void 0) { uri = ''; }
    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + '=' + encodeURIComponent(value) + '$2');
    }
    return uri + separator + key + '=' + encodeURIComponent(value);
}
exports.updateQueryParam = updateQueryParam;
function getSrcSet(url) {
    if (!url) {
        return url;
    }
    var sizes = [100, 200, 400, 800, 1200, 1600, 2000];
    if (url.match(/builder\.io/)) {
        var srcUrl = url;
        var widthInSrc_1 = Number(url.split('?width=')[1]);
        if (!isNaN(widthInSrc_1)) {
            srcUrl = "".concat(srcUrl, " ").concat(widthInSrc_1, "w");
        }
        return sizes
            .filter(function (size) { return size !== widthInSrc_1; })
            .map(function (size) { return "".concat(updateQueryParam(url, 'width', size), " ").concat(size, "w"); })
            .concat([srcUrl])
            .join(', ');
    }
    if (url.match(/cdn\.shopify\.com/)) {
        return sizes
            .map(function (size) { return [getShopifyImageUrl(url, "".concat(size, "x").concat(size)), size]; })
            .filter(function (_a) {
            var sizeUrl = _a[0];
            return !!sizeUrl;
        })
            .map(function (_a) {
            var sizeUrl = _a[0], size = _a[1];
            return "".concat(sizeUrl, " ").concat(size, "w");
        })
            .concat([url])
            .join(', ');
    }
    return url;
}
exports.getSrcSet = getSrcSet;
var getSizes = function (sizes, block, contentBreakpoints) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (contentBreakpoints === void 0) { contentBreakpoints = {}; }
    var useSizes = '';
    if (sizes) {
        var splitSizes = sizes.split(',');
        var sizesLength_1 = splitSizes.length;
        useSizes = splitSizes
            .map(function (size, index) {
            if (sizesLength_1 === index + 1) {
                // If it is the last size in the array, then we want to strip out
                // any media query information. According to the img spec, the last
                // value for sizes cannot have a media query. If there is a media
                // query at the end it breaks AMP mode rendering
                // https://github.com/ampproject/amphtml/blob/b6313e372fdd1298928e2417dcc616b03288e051/src/size-list.js#L169
                return size.replace(/\([\s\S]*?\)/g, '').trim();
            }
            else {
                return size;
            }
        })
            .join(', ');
    }
    else if (block && block.responsiveStyles) {
        var generatedSizes = [];
        var hasSmallOrMediumSize = false;
        var unitRegex = /^\d+/;
        var breakpointSizes = (0, device_sizes_constant_1.getSizesForBreakpoints)(contentBreakpoints);
        if ((_c = (_b = (_a = block.responsiveStyles) === null || _a === void 0 ? void 0 : _a.small) === null || _b === void 0 ? void 0 : _b.width) === null || _c === void 0 ? void 0 : _c.match(unitRegex)) {
            hasSmallOrMediumSize = true;
            var mediaQuery = "(max-width: ".concat(breakpointSizes.small.max, "px)");
            var widthAndQuery = "".concat(mediaQuery, " ").concat(block.responsiveStyles.small.width.replace('%', 'vw'));
            generatedSizes.push(widthAndQuery);
        }
        if ((_f = (_e = (_d = block.responsiveStyles) === null || _d === void 0 ? void 0 : _d.medium) === null || _e === void 0 ? void 0 : _e.width) === null || _f === void 0 ? void 0 : _f.match(unitRegex)) {
            hasSmallOrMediumSize = true;
            var mediaQuery = "(max-width: ".concat(breakpointSizes.medium.max, "px)");
            var widthAndQuery = "".concat(mediaQuery, " ").concat(block.responsiveStyles.medium.width.replace('%', 'vw'));
            generatedSizes.push(widthAndQuery);
        }
        if ((_h = (_g = block.responsiveStyles) === null || _g === void 0 ? void 0 : _g.large) === null || _h === void 0 ? void 0 : _h.width) {
            var width = block.responsiveStyles.large.width.replace('%', 'vw');
            generatedSizes.push(width);
        }
        else if (hasSmallOrMediumSize) {
            generatedSizes.push('100vw');
        }
        if (generatedSizes.length) {
            useSizes = generatedSizes.join(', ');
        }
    }
    return useSizes;
};
exports.getSizes = getSizes;
// TODO: use picture tag to support more formats
var ImageComponent = /** @class */ (function (_super) {
    __extends(ImageComponent, _super);
    function ImageComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // TODO: setting to always fade in the images (?)
        _this.state = {
            imageLoaded: !_this.useLazyLoading,
            load: !_this.useLazyLoading,
        };
        _this.pictureRef = null;
        _this.scrollListener = null;
        _this.intersectionObserver = null;
        return _this;
    }
    Object.defineProperty(ImageComponent.prototype, "useLazyLoading", {
        get: function () {
            // Use builder.getLocation()
            return sdk_1.Builder.isBrowser && location.search.includes('builder.lazyLoadImages=false')
                ? false
                : sdk_1.Builder.isBrowser && location.href.includes('builder.lazyLoadImages=true')
                    ? true
                    : this.props.lazy;
        },
        enumerable: false,
        configurable: true
    });
    ImageComponent.prototype.componentWillUnmount = function () {
        if (sdk_1.Builder.isBrowser) {
            if (this.scrollListener) {
                window.removeEventListener('scroll', this.scrollListener);
                this.scrollListener = null;
            }
            if (this.intersectionObserver && this.pictureRef) {
                this.intersectionObserver.unobserve(this.pictureRef);
            }
        }
    };
    ImageComponent.prototype.componentDidMount = function () {
        var _this = this;
        if (this.props.lazy && sdk_1.Builder.isBrowser) {
            if (this.pictureRef && isElementInViewport(this.pictureRef)) {
                this.setState({
                    load: true,
                });
            }
            else if (typeof IntersectionObserver === 'function' && this.pictureRef) {
                var observer = (this.intersectionObserver = new IntersectionObserver(function (entries, observer) {
                    entries.forEach(function (entry) {
                        // In view
                        if (entry.intersectionRatio > 0) {
                            _this.setState({
                                load: true,
                            });
                            if (_this.pictureRef) {
                                observer.unobserve(_this.pictureRef);
                            }
                        }
                    });
                }));
                observer.observe(this.pictureRef);
            }
            else {
                // throttled scroll capture listener
                var listener_1 = (0, throttle_1.throttle)(function (event) {
                    if (_this.pictureRef) {
                        var rect = _this.pictureRef.getBoundingClientRect();
                        var buffer = window.innerHeight / 2;
                        if (rect.top < window.innerHeight + buffer) {
                            _this.setState(__assign(__assign({}, _this.state), { load: true }));
                            window.removeEventListener('scroll', listener_1);
                            _this.scrollListener = null;
                        }
                    }
                }, 400, {
                    leading: false,
                    trailing: true,
                });
                this.scrollListener = listener_1;
                window.addEventListener('scroll', listener_1, {
                    capture: true,
                    passive: true,
                });
                listener_1();
            }
        }
    };
    Object.defineProperty(ImageComponent.prototype, "image", {
        // Allow our legacy `image` prop, as well as allow a `src` prop for more intuitive
        // DX of manual usage (<Image src="..." />)
        get: function () {
            return this.props.image || this.props.src;
        },
        enumerable: false,
        configurable: true
    });
    ImageComponent.prototype.getSrcSet = function () {
        var url = this.image;
        if (!url) {
            return;
        }
        // We can auto add srcset for cdn.builder.io and shopify
        // images, otherwise you can supply this prop manually
        if (!(url.match(/builder\.io/) || url.match(/cdn\.shopify\.com/))) {
            return;
        }
        return getSrcSet(url);
    };
    ImageComponent.prototype.render = function () {
        var _this = this;
        var _a, _b;
        var _c = this.props, aspectRatio = _c.aspectRatio, lazy = _c.lazy, builderBlock = _c.builderBlock, builderState = _c.builderState;
        var children = this.props.builderBlock && this.props.builderBlock.children;
        var srcset = this.props.srcset;
        var sizes = (0, exports.getSizes)(this.props.sizes, builderBlock, ((_b = (_a = builderState === null || builderState === void 0 ? void 0 : builderState.context.builderContent) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.breakpoints) || {});
        var image = this.image;
        if (srcset && image && image.includes('builder.io/api/v1/image')) {
            if (!srcset.includes(image.split('?')[0])) {
                console.debug('Removed given srcset');
                srcset = this.getSrcSet();
            }
        }
        else if (image && !srcset) {
            srcset = this.getSrcSet();
        }
        var isPixel = builderBlock === null || builderBlock === void 0 ? void 0 : builderBlock.id.startsWith('builder-pixel-');
        var fitContent = this.props.fitContent;
        return ((0, core_1.jsx)(builder_meta_1.BuilderMetaContext.Consumer, null, function (value) {
            var _a;
            var amp = value.ampMode;
            var Tag = amp ? 'amp-img' : 'img';
            var imageContents = (!lazy || _this.state.load || amp) && ((0, core_1.jsx)(Tag, __assign({}, (amp
                ? {
                    layout: 'responsive',
                    height: _this.props.height ||
                        (aspectRatio ? Math.round(aspectRatio * 1000) : undefined),
                    width: _this.props.width ||
                        (aspectRatio ? Math.round(1000 / aspectRatio) : undefined),
                }
                : null), { alt: _this.props.altText, key: sdk_1.Builder.isEditing
                    ? (typeof _this.image === 'string' && _this.image.split('?')[0]) || undefined
                    : undefined, role: !_this.props.altText ? 'presentation' : undefined, css: __assign(__assign({ opacity: amp ? 1 : _this.useLazyLoading && !_this.state.imageLoaded ? 0 : 1, transition: 'opacity 0.2s ease-in-out', objectFit: _this.props.backgroundSize || 'cover', objectPosition: _this.props.backgroundPosition || 'center' }, (aspectRatio &&
                    !amp && {
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    left: 0,
                    top: 0,
                })), (amp && (_a = {},
                    _a['& img'] = {
                        objectFit: _this.props.backgroundSize,
                        objectPosition: _this.props.backgroundPosition,
                    },
                    _a))), loading: isPixel ? 'eager' : 'lazy', className: 'builder-image' + (_this.props.className ? ' ' + _this.props.className : ''), src: _this.image }, (!amp && {
                // TODO: queue these so react renders all loads at once
                onLoad: function () { return _this.setState({ imageLoaded: true }); },
            }), { 
                // TODO: memoize on image on client
                srcSet: srcset, sizes: !amp && sizes ? sizes : undefined })));
            return ((0, core_1.jsx)(react_1.default.Fragment, null,
                amp ? (imageContents) : ((0, core_1.jsx)("picture", { ref: function (ref) { return (_this.pictureRef = ref); } },
                    srcset && srcset.match(/builder\.io/) && !_this.props.noWebp && ((0, core_1.jsx)("source", { srcSet: srcset.replace(/\?/g, '?format=webp&'), type: "image/webp" })),
                    imageContents)),
                aspectRatio && !amp && !(fitContent && children && children.length) ? ((0, core_1.jsx)("div", { className: "builder-image-sizer", css: {
                        width: '100%',
                        paddingTop: aspectRatio * 100 + '%',
                        pointerEvents: 'none',
                        fontSize: 0,
                    } }, ' ')) : null,
                children && children.length ? (fitContent ? (children.map(function (block, index) { return ((0, core_1.jsx)(builder_block_component_1.BuilderBlock, { key: block.id, block: block })); })) : (
                // TODO: if no aspect ratio and has children, don't make this absolute but instead
                // make the image absolute and fit the children (or with a special option)
                (0, core_1.jsx)("div", { css: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    } }, children.map(function (block, index) { return ((0, core_1.jsx)(builder_block_component_1.BuilderBlock, { key: block.id, block: block })); })))) : null));
        }));
    };
    return ImageComponent;
}(react_1.default.Component));
exports.Image = (0, with_builder_1.withBuilder)(ImageComponent, {
    name: 'Image',
    static: true,
    image: 'https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-insert_photo-24px.svg?alt=media&token=4e5d0ef4-f5e8-4e57-b3a9-38d63a9b9dc4',
    defaultStyles: {
        position: 'relative',
        minHeight: '20px',
        minWidth: '20px',
        overflow: 'hidden',
    },
    canHaveChildren: true,
    inputs: [
        {
            // TODO: new editor type 'responsiveImage' that can do different crops per breakpoint
            // and sets an object and that is read here
            name: 'image',
            type: 'file',
            bubble: true,
            allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg'],
            required: true,
            defaultValue: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a',
            onChange: function (options) {
                var DEFAULT_ASPECT_RATIO = 0.7041;
                options.delete('srcset');
                options.delete('noWebp');
                function loadImage(url, timeout) {
                    if (timeout === void 0) { timeout = 60000; }
                    return new Promise(function (resolve, reject) {
                        var img = document.createElement('img');
                        var loaded = false;
                        img.onload = function () {
                            loaded = true;
                            resolve(img);
                        };
                        img.addEventListener('error', function (event) {
                            console.warn('Image load failed', event.error);
                            reject(event.error);
                        });
                        img.src = url;
                        setTimeout(function () {
                            if (!loaded) {
                                reject(new Error('Image load timed out'));
                            }
                        }, timeout);
                    });
                }
                function round(num) {
                    return Math.round(num * 1000) / 1000;
                }
                var value = options.get('image');
                var aspectRatio = options.get('aspectRatio');
                // For SVG images - don't render as webp, keep them as SVG
                fetch(value)
                    .then(function (res) { return res.blob(); })
                    .then(function (blob) {
                    if (blob.type.includes('svg')) {
                        options.set('noWebp', true);
                    }
                });
                if (value && (!aspectRatio || aspectRatio === DEFAULT_ASPECT_RATIO)) {
                    return loadImage(value).then(function (img) {
                        var possiblyUpdatedAspectRatio = options.get('aspectRatio');
                        if (options.get('image') === value &&
                            (!possiblyUpdatedAspectRatio || possiblyUpdatedAspectRatio === DEFAULT_ASPECT_RATIO)) {
                            if (img.width && img.height) {
                                options.set('aspectRatio', round(img.height / img.width));
                                options.set('height', img.height);
                                options.set('width', img.width);
                            }
                        }
                    });
                }
            },
        },
        {
            name: 'backgroundSize',
            type: 'text',
            defaultValue: 'cover',
            enum: [
                {
                    label: 'contain',
                    value: 'contain',
                    helperText: 'The image should never get cropped',
                },
                {
                    label: 'cover',
                    value: 'cover',
                    helperText: "The image should fill its box, cropping when needed",
                },
                // TODO: add these options back
                // { label: 'auto', value: 'auto', helperText: '' },
                // { label: 'fill', value: 'fill', helperText: 'The image should fill the box, being stretched or squished if necessary' },
            ],
        },
        {
            name: 'backgroundPosition',
            type: 'text',
            defaultValue: 'center',
            enum: [
                'center',
                'top',
                'left',
                'right',
                'bottom',
                'top left',
                'top right',
                'bottom left',
                'bottom right',
            ],
        },
        {
            name: 'altText',
            type: 'string',
            helperText: 'Text to display when the user has images off',
        },
        {
            name: 'height',
            type: 'number',
            hideFromUI: true,
        },
        {
            name: 'width',
            type: 'number',
            hideFromUI: true,
        },
        {
            name: 'sizes',
            type: 'string',
            hideFromUI: true,
        },
        {
            name: 'srcset',
            type: 'string',
            hideFromUI: true,
        },
        // TODO: force lazy load option (maybe via binding for now hm component.options.lazy: true)
        {
            name: 'lazy',
            type: 'boolean',
            defaultValue: true,
            hideFromUI: true,
        },
        {
            name: 'fitContent',
            type: 'boolean',
            helperText: "When child blocks are provided, fit to them instead of using the image's aspect ratio",
            defaultValue: true,
        },
        {
            name: 'aspectRatio',
            type: 'number',
            helperText: "This is the ratio of height/width, e.g. set to 1.5 for a 300px wide and 200px tall photo. Set to 0 to not force the image to maintain it's aspect ratio",
            advanced: true,
            defaultValue: DEFAULT_ASPECT_RATIO,
        },
        // {
        //   name: 'backgroundRepeat',
        //   type: 'text',
        //   defaultValue: 'no-repeat',
        //   enum: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'],
        // },
    ],
});
//# sourceMappingURL=Image.js.map