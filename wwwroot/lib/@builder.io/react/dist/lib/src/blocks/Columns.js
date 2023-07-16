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
exports.Columns = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var builder_blocks_component_1 = require("../components/builder-blocks.component");
var with_builder_1 = require("../functions/with-builder");
var Link_1 = require("../components/Link");
var device_sizes_constant_1 = require("../constants/device-sizes.constant");
var DEFAULT_ASPECT_RATIO = 0.7004048582995948;
var defaultBlocks = [
    {
        '@type': '@builder.io/sdk:Element',
        responsiveStyles: {
            large: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                flexShrink: '0',
                position: 'relative',
                marginTop: '30px',
                textAlign: 'center',
                lineHeight: 'normal',
                height: 'auto',
                minHeight: '20px',
                minWidth: '20px',
                overflow: 'hidden',
            },
        },
        component: {
            name: 'Image',
            options: {
                image: 'https://builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                aspectRatio: DEFAULT_ASPECT_RATIO,
            },
        },
    },
    {
        '@type': '@builder.io/sdk:Element',
        responsiveStyles: {
            large: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                flexShrink: '0',
                position: 'relative',
                marginTop: '30px',
                textAlign: 'center',
                lineHeight: 'normal',
                height: 'auto',
            },
        },
        component: {
            name: 'Text',
            options: {
                text: '<p>Enter some text...</p>',
            },
        },
    },
];
var ColumnsComponent = /** @class */ (function (_super) {
    __extends(ColumnsComponent, _super);
    function ColumnsComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ColumnsComponent.prototype, "columns", {
        // TODO: Column interface
        get: function () {
            return this.props.columns || [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColumnsComponent.prototype, "gutterSize", {
        get: function () {
            return typeof this.props.space === 'number' ? this.props.space || 0 : 20;
        },
        enumerable: false,
        configurable: true
    });
    ColumnsComponent.prototype.getWidth = function (index) {
        return (this.columns[index] && this.columns[index].width) || 100 / this.columns.length;
    };
    ColumnsComponent.prototype.getColumnWidth = function (index) {
        var _a = this, columns = _a.columns, gutterSize = _a.gutterSize;
        var subtractWidth = (gutterSize * (columns.length - 1)) / columns.length;
        return "calc(".concat(this.getWidth(index), "% - ").concat(subtractWidth, "px)");
    };
    ColumnsComponent.prototype.render = function () {
        var _a;
        var _this = this;
        var _b, _c, _d;
        var _e = this, columns = _e.columns, gutterSize = _e.gutterSize;
        var contentBreakpoints = ((_d = (_c = (_b = this.props.builderState) === null || _b === void 0 ? void 0 : _b.context.builderContent) === null || _c === void 0 ? void 0 : _c.meta) === null || _d === void 0 ? void 0 : _d.breakpoints) || {};
        var breakpointSizes = (0, device_sizes_constant_1.getSizesForBreakpoints)(contentBreakpoints);
        return (
        // FIXME: make more elegant
        (0, core_1.jsx)(react_1.default.Fragment, null,
            (0, core_1.jsx)("div", { className: "builder-columns", css: __assign({ display: 'flex' }, (this.props.stackColumnsAt !== 'never' && (_a = {},
                    _a["@media (max-width: ".concat(this.props.stackColumnsAt !== 'tablet'
                        ? breakpointSizes.small.max
                        : breakpointSizes.medium.max, "px)")] = {
                        flexDirection: this.props.reverseColumnsWhenStacked ? 'column-reverse' : 'column',
                        alignItems: 'stretch',
                    },
                    _a))) }, columns.map(function (col, index) {
                var _a, _b;
                var TagName = col.link ? Link_1.Link : 'div';
                // TODO: pass size down in context
                return ((0, core_1.jsx)(react_1.default.Fragment, { key: index },
                    (0, core_1.jsx)(TagName, __assign({ className: "builder-column" }, (col.link ? { href: col.link } : null), { 
                        // TODO: generate width and margin-left as CSS instead so can override with pure CSS for best responsieness
                        // and no use of !important
                        css: __assign((_a = { display: 'flex', flexDirection: 'column', alignItems: 'stretch', lineHeight: 'normal' }, _a['& > .builder-blocks'] = {
                            flexGrow: 1,
                        }, _a.width = _this.getColumnWidth(index), _a.marginLeft = index === 0 ? 0 : gutterSize, _a), (_this.props.stackColumnsAt !== 'never' && (_b = {},
                            _b["@media (max-width: ".concat(_this.props.stackColumnsAt !== 'tablet'
                                ? breakpointSizes.small.max
                                : breakpointSizes.medium.max, "px)")] = {
                                width: '100%',
                                marginLeft: 0,
                            },
                            _b))) }),
                        (0, core_1.jsx)(builder_blocks_component_1.BuilderBlocks, { key: index, 
                            // TODO: childOf [parentBlocks]?
                            child: true, parentElementId: _this.props.builderBlock && _this.props.builderBlock.id, blocks: col.blocks, dataPath: "component.options.columns.".concat(index, ".blocks") }))));
            }))));
    };
    return ColumnsComponent;
}(react_1.default.Component));
exports.Columns = (0, with_builder_1.withBuilder)(ColumnsComponent, {
    name: 'Columns',
    static: true,
    inputs: [
        {
            name: 'columns',
            type: 'array',
            broadcast: true,
            subFields: [
                {
                    name: 'blocks',
                    type: 'array',
                    hideFromUI: true,
                    defaultValue: defaultBlocks,
                },
                {
                    name: 'width',
                    type: 'number',
                    hideFromUI: true,
                    helperText: 'Width %, e.g. set to 50 to fill half of the space',
                },
                {
                    name: 'link',
                    type: 'url',
                    helperText: 'Optionally set a url that clicking this column will link to',
                },
            ],
            defaultValue: [{ blocks: defaultBlocks }, { blocks: defaultBlocks }],
            onChange: function (options) {
                function clearWidths() {
                    columns.forEach(function (col) {
                        col.delete('width');
                    });
                }
                var columns = options.get('columns');
                if (Array.isArray(columns)) {
                    var containsColumnWithWidth = !!columns.find(function (col) { return col.get('width'); });
                    if (containsColumnWithWidth) {
                        var containsColumnWithoutWidth = !!columns.find(function (col) { return !col.get('width'); });
                        if (containsColumnWithoutWidth) {
                            clearWidths();
                        }
                        else {
                            var sumWidths = columns.reduce(function (memo, col) {
                                return memo + col.get('width');
                            }, 0);
                            var widthsDontAddUp = sumWidths !== 100;
                            if (widthsDontAddUp) {
                                clearWidths();
                            }
                        }
                    }
                }
            },
        },
        {
            name: 'space',
            type: 'number',
            defaultValue: 20,
            helperText: 'Size of gap between columns',
            advanced: true,
        },
        {
            name: 'stackColumnsAt',
            type: 'string',
            defaultValue: 'tablet',
            helperText: 'Convert horizontal columns to vertical at what device size',
            enum: ['tablet', 'mobile', 'never'],
            advanced: true,
        },
        {
            name: 'reverseColumnsWhenStacked',
            type: 'boolean',
            defaultValue: false,
            helperText: 'When stacking columns for mobile devices, reverse the ordering',
            advanced: true,
        },
    ],
});
//# sourceMappingURL=Columns.js.map