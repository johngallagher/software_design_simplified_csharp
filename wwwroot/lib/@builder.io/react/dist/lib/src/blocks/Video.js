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
exports.Video = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var throttle_1 = require("../functions/throttle");
var with_children_1 = require("../functions/with-children");
var sdk_1 = require("@builder.io/sdk");
var DEFAULT_ASPECT_RATIO = 0.7004048582995948;
var VideoComponent = /** @class */ (function (_super) {
    __extends(VideoComponent, _super);
    function VideoComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.video = null;
        _this.containerRef = null;
        _this.scrollListener = null;
        _this.state = {
            load: !_this.lazyLoad,
        };
        return _this;
    }
    Object.defineProperty(VideoComponent.prototype, "lazyLoad", {
        get: function () {
            // Default is true, must be explicitly turned off to not have this behavior
            // as it's highly recommended for performance and bandwidth optimization
            return this.props.lazyLoad !== false;
        },
        enumerable: false,
        configurable: true
    });
    VideoComponent.prototype.updateVideo = function () {
        var _this = this;
        var video = this.video;
        if (video) {
            // There are some issues with boolean attributes and media elements
            // see: https://github.com/facebook/react/issues/10389
            var boolProps = [
                'muted',
                'playsInline',
                'autoPlay',
            ];
            boolProps.forEach(function (prop) {
                var attr = prop.toLowerCase();
                if (_this.props[prop]) {
                    video.setAttribute(attr, attr);
                }
                else {
                    video.removeAttribute(attr);
                }
            });
        }
    };
    VideoComponent.prototype.componentDidUpdate = function () {
        this.updateVideo();
    };
    VideoComponent.prototype.componentDidMount = function () {
        var _this = this;
        this.updateVideo();
        if (this.lazyLoad && sdk_1.Builder.isBrowser) {
            // TODO: have a way to consolidate all listeners into one timer
            // to avoid excessive reflows
            var listener_1 = (0, throttle_1.throttle)(function (event) {
                if (_this.containerRef) {
                    var rect = _this.containerRef.getBoundingClientRect();
                    var buffer = window.innerHeight / 2;
                    if (rect.top < window.innerHeight + buffer) {
                        _this.setState(function (state) { return (__assign(__assign({}, state), { load: true })); });
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
    };
    VideoComponent.prototype.componentWillUnmount = function () {
        if (sdk_1.Builder.isBrowser && this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
            this.scrollListener = null;
        }
    };
    VideoComponent.prototype.render = function () {
        var _this = this;
        var _a = this.props, aspectRatio = _a.aspectRatio, children = _a.children;
        return ((0, core_1.jsx)("div", { ref: function (ref) { return (_this.containerRef = ref); }, css: { position: 'relative' } },
            (0, core_1.jsx)("video", { key: this.props.video || 'no-src', poster: this.props.posterImage, ref: function (ref) { return (_this.video = ref); }, autoPlay: this.props.autoPlay, muted: this.props.muted, controls: this.props.controls, loop: this.props.loop, className: "builder-video", css: __assign({ width: '100%', height: '100%', objectFit: this.props.fit, objectPosition: this.props.position, zIndex: 2, 
                    // Hack to get object fit to work as expected and not have the video
                    // overflow
                    borderRadius: 1 }, (aspectRatio
                    ? {
                        position: 'absolute',
                    }
                    : null)) }, (!this.lazyLoad || this.state.load) && ((0, core_1.jsx)("source", { type: "video/mp4", src: this.props.video }))),
            aspectRatio && !(this.props.fitContent && children) ? ((0, core_1.jsx)("div", { css: {
                    width: '100%',
                    paddingTop: aspectRatio * 100 + '%',
                    pointerEvents: 'none',
                    fontSize: 0,
                } })) : null,
            children && this.props.fitContent ? ((0, core_1.jsx)("div", { css: { display: 'flex', flexDirection: 'column', alignItems: 'stretch' } }, children)) : children ? ((0, core_1.jsx)("div", { css: {
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                } }, children)) : null));
    };
    return VideoComponent;
}(react_1.default.Component));
exports.Video = sdk_1.Builder.registerComponent((0, with_children_1.withChildren)(VideoComponent), {
    name: 'Video',
    canHaveChildren: true,
    defaultStyles: {
        minHeight: '20px',
        minWidth: '20px',
    },
    image: 'https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-videocam-24px%20(1).svg?alt=media&token=49a84e4a-b20e-4977-a650-047f986874bb',
    inputs: [
        {
            name: 'video',
            type: 'file',
            allowedFileTypes: ['mp4'],
            bubble: true,
            defaultValue: 'https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/assets%2FKQlEmWDxA0coC3PK6UvkrjwkIGI2%2F28cb070609f546cdbe5efa20e931aa4b?alt=media&token=912e9551-7a7c-4dfb-86b6-3da1537d1a7f',
            required: true,
        },
        {
            name: 'posterImage',
            type: 'file',
            allowedFileTypes: ['jpeg', 'png'],
            helperText: 'Image to show before the video plays',
        },
        {
            name: 'autoPlay',
            type: 'boolean',
            defaultValue: true,
        },
        {
            name: 'controls',
            type: 'boolean',
            defaultValue: false,
        },
        {
            name: 'muted',
            type: 'boolean',
            defaultValue: true,
        },
        {
            name: 'loop',
            type: 'boolean',
            defaultValue: true,
        },
        {
            name: 'playsInline',
            type: 'boolean',
            defaultValue: true,
        },
        {
            name: 'fit',
            type: 'text',
            defaultValue: 'cover',
            enum: ['contain', 'cover', 'fill', 'auto'],
        },
        {
            name: 'fitContent',
            type: 'boolean',
            helperText: 'When child blocks are provided, fit to them instead of using the aspect ratio',
            defaultValue: true,
            advanced: true,
        },
        {
            name: 'position',
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
            name: 'height',
            type: 'number',
            advanced: true,
        },
        {
            name: 'width',
            type: 'number',
            advanced: true,
        },
        {
            name: 'aspectRatio',
            type: 'number',
            advanced: true,
            defaultValue: DEFAULT_ASPECT_RATIO,
        },
        {
            name: 'lazyLoad',
            type: 'boolean',
            helperText: 'Load this video "lazily" - as in only when a user scrolls near the video. Recommended for optmized performance and bandwidth consumption',
            defaultValue: true,
            advanced: true,
        },
    ],
});
//# sourceMappingURL=Video.js.map