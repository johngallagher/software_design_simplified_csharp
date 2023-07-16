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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPatchWithMinimalMutationChain = void 0;
var applyPatchWithMinimalMutationChain = function (obj, patch, preserveRoot) {
    if (preserveRoot === void 0) { preserveRoot = false; }
    if (Object(obj) !== obj) {
        return obj;
    }
    var path = patch.path, op = patch.op, value = patch.value;
    var pathArr = path.split(/\//);
    if (pathArr[0] === '') {
        pathArr.shift();
    }
    var newObj = preserveRoot ? obj : __assign({}, obj);
    var objPart = newObj;
    for (var i = 0; i < pathArr.length; i++) {
        var isLast = i === pathArr.length - 1;
        var property = pathArr[i];
        if (isLast) {
            if (op === 'replace') {
                objPart[property] = value;
            }
            else if (op === 'add') {
                var index = Number(property);
                if (Array.isArray(objPart)) {
                    if (property === '-') {
                        objPart.push(value);
                    }
                    else {
                        objPart.splice(index, 0, value);
                    }
                }
                else {
                    objPart[property] = value;
                }
            }
            else if (op === 'remove') {
                var index = Number(property);
                if (Array.isArray(objPart)) {
                    objPart.splice(index, 1);
                }
                else {
                    delete objPart[property];
                }
            }
        }
        else {
            var nextProperty = pathArr[i + 1];
            var newPart = Object(objPart[property]) === objPart[property]
                ? objPart[property]
                : String(Number(nextProperty)) === nextProperty
                    ? []
                    : {};
            objPart = objPart[property] = Array.isArray(newPart) ? __spreadArray([], newPart, true) : __assign({}, newPart);
        }
    }
    return newObj;
};
exports.applyPatchWithMinimalMutationChain = applyPatchWithMinimalMutationChain;
//# sourceMappingURL=apply-patch-with-mutation.js.map