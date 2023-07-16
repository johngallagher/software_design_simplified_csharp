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
exports.Section = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var builder_block_component_1 = require("../components/builder-block.component");
var with_builder_1 = require("../functions/with-builder");
var SectionComponent = /** @class */ (function (_super) {
    __extends(SectionComponent, _super);
    function SectionComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ref = null;
        _this.unmountCallbacks = [];
        _this.state = {
            inView: false,
        };
        return _this;
    }
    Object.defineProperty(SectionComponent.prototype, "renderContents", {
        get: function () {
            if (this.props.lazyLoad !== true) {
                return true;
            }
            return this.state.inView;
        },
        enumerable: false,
        configurable: true
    });
    SectionComponent.prototype.componentWillUnmount = function () {
        this.unmountCallbacks.forEach(function (cb) { return cb(); });
    };
    SectionComponent.prototype.componentDidMount = function () {
        var _this = this;
        if (this.props.lazyLoad) {
            if (typeof IntersectionObserver === 'undefined' || !this.ref) {
                this.setState({ inView: true });
            }
            else {
                var observer_1 = new IntersectionObserver(function (entries, observer) {
                    entries.forEach(function (entry) {
                        if (entry.intersectionRatio > 0) {
                            _this.setState({
                                inView: true,
                            });
                            if (_this.ref) {
                                observer.unobserve(_this.ref);
                            }
                        }
                    });
                }, {
                    rootMargin: '10px',
                });
                observer_1.observe(this.ref);
                this.unmountCallbacks.push(function () {
                    if (_this.ref) {
                        observer_1.unobserve(_this.ref);
                    }
                });
            }
        }
    };
    SectionComponent.prototype.render = function () {
        var _this = this;
        return ((0, core_1.jsx)("section", { ref: function (ref) { return (_this.ref = ref); }, css: __assign({ width: '100%', 
                // height: '100%' was is here so the inner contents can align center, but that is causing
                // issues in Safari. Need another workaround.
                alignSelf: 'stretch', flexGrow: 1, boxSizing: 'border-box', maxWidth: this.props.maxWidth, display: 'flex', flexDirection: 'column', alignItems: 'stretch', marginLeft: 'auto', marginRight: 'auto' }, (this.renderContents ? null : this.props.lazyStyles)) }, this.renderContents ? ((0, core_1.jsx)(react_1.default.Fragment, null,
            this.props.children,
            this.props.builderBlock &&
                this.props.builderBlock.children &&
                this.props.builderBlock.children.map(function (block, index) { return ((0, core_1.jsx)(builder_block_component_1.BuilderBlock, { key: block.id, block: block })); }))) : null));
    };
    return SectionComponent;
}(react_1.default.Component));
exports.Section = (0, with_builder_1.withBuilder)(SectionComponent, {
    name: 'Core:Section',
    static: true,
    image: 'https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F682efef23ace49afac61748dd305c70a',
    inputs: [
        {
            name: 'maxWidth',
            type: 'number',
            defaultValue: 1200,
        },
        {
            name: 'lazyLoad',
            type: 'boolean',
            defaultValue: false,
            advanced: true,
            description: 'Only render this section when in view',
        },
    ],
    defaultStyles: {
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '50px',
        paddingBottom: '50px',
        marginTop: '0px',
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
    },
    canHaveChildren: true,
    defaultChildren: [
        {
            '@type': '@builder.io/sdk:Element',
            responsiveStyles: {
                large: {
                    textAlign: 'center',
                },
            },
            component: {
                name: 'Text',
                options: {
                    text: "<p><b>I am a section! My content keeps from getting too wide, so that it's easy to read even on big screens.</b></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>",
                },
            },
        },
    ],
});
//# sourceMappingURL=Section.js.map