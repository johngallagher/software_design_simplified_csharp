"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = void 0;
var set = function (obj, _path, value) {
    if (Object(obj) !== obj) {
        return obj;
    }
    var path = Array.isArray(_path)
        ? _path
        : _path.toString().match(/[^.[\]]+/g);
    path
        .slice(0, -1)
        .reduce(function (a, c, i) {
        return Object(a[c]) === a[c]
            ? a[c]
            : (a[c] = Math.abs(Number(path[i + 1])) >> 0 === +path[i + 1] ? [] : {});
    }, obj)[path[path.length - 1]] = value;
    return obj;
};
exports.set = set;
//# sourceMappingURL=set.js.map