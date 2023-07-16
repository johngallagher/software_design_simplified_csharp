"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omit = void 0;
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
exports.omit = omit;
//# sourceMappingURL=omit.function.js.map