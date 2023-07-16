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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSizesForBreakpoints = exports.sizeNames = void 0;
var utils_1 = require("../functions/utils");
exports.sizeNames = ['xsmall', 'small', 'medium', 'large'];
// TODO: put in @builder.io/core
var sizes = {
    xsmall: {
        min: 0,
        default: 0,
        max: 0,
    },
    small: {
        min: 320,
        default: 321,
        max: 640,
    },
    medium: {
        min: 641,
        default: 642,
        max: 991,
    },
    large: {
        min: 990,
        default: 991,
        max: 1200,
    },
    getWidthForSize: function (size) {
        return this[size].default;
    },
    getSizeForWidth: function (width) {
        for (var _i = 0, sizeNames_1 = exports.sizeNames; _i < sizeNames_1.length; _i++) {
            var size = sizeNames_1[_i];
            var value = this[size];
            if (width <= value.max) {
                return size;
            }
        }
        return 'large';
    },
};
var getSizesForBreakpoints = function (_a) {
    var small = _a.small, medium = _a.medium;
    var newSizes = __assign(__assign({}, sizes), (0, utils_1.fastClone)(sizes));
    if (!small || !medium) {
        return newSizes;
    }
    var smallMin = Math.floor(small / 2);
    newSizes.small = {
        max: small,
        min: smallMin,
        default: smallMin + 1,
    };
    var mediumMin = newSizes.small.max + 1;
    newSizes.medium = {
        max: medium,
        min: mediumMin,
        default: mediumMin + 1,
    };
    var largeMin = newSizes.medium.max + 1;
    newSizes.large = {
        max: 2000,
        min: largeMin,
        default: largeMin + 1,
    };
    return newSizes;
};
exports.getSizesForBreakpoints = getSizesForBreakpoints;
//# sourceMappingURL=device-sizes.constant.js.map