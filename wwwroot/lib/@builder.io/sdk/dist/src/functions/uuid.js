"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = exports.uuidv4 = void 0;
/**
 * @credit https://stackoverflow.com/a/2117523
 */
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.uuidv4 = uuidv4;
/**
 * Slightly cleaner and smaller UUIDs
 */
function uuid() {
    return uuidv4().replace(/-/g, '');
}
exports.uuid = uuid;
//# sourceMappingURL=uuid.js.map