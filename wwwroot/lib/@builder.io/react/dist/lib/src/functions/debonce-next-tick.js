"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounceNextTick = void 0;
var sdk_1 = require("@builder.io/sdk");
var nextTick = sdk_1.Builder.nextTick;
function debounceNextTick(target, key, descriptor) {
    if (typeof key === 'undefined' && typeof target === 'function') {
        return debounceNextTickImpl(target);
    }
    return {
        configurable: true,
        enumerable: descriptor.enumerable,
        get: function getter() {
            // Attach this function to the instance (not the class)
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: descriptor.enumerable,
                value: debounceNextTickImpl(descriptor.value),
            });
            return this[key];
        },
    };
}
exports.debounceNextTick = debounceNextTick;
function debounceNextTickImpl(fn) {
    var args = null;
    var context = null;
    return debounced;
    function debounced() {
        var previous = args;
        args = [].slice.call(arguments);
        context = this;
        if (previous !== null)
            return;
        nextTick(next);
    }
    function next() {
        fn.apply(context, args);
        args = null;
        context = null;
    }
}
//# sourceMappingURL=debonce-next-tick.js.map