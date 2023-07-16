"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastClone = void 0;
// TODO: pull from builder internal utils
var fastClone = function (obj) { return JSON.parse(JSON.stringify(obj)); };
exports.fastClone = fastClone;
//# sourceMappingURL=utils.js.map