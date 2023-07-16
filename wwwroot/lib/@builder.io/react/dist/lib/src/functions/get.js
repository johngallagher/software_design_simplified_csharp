"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
var get = function (obj, path, defaultValue) {
    var result = String.prototype.split
        .call(path, /[,[\].]+?/)
        .filter(Boolean)
        .reduce(function (res, key) { return (res !== null && res !== undefined ? res[key] : res); }, obj);
    return result === undefined || result === obj ? defaultValue : result;
};
exports.get = get;
//# sourceMappingURL=get.js.map