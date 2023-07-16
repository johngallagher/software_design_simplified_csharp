"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextTick = void 0;
var isSafari = typeof window !== 'undefined' &&
    /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
var isClient = typeof window !== 'undefined';
// TODO: queue all of these in a debounceNextTick
function nextTick(fn) {
    // React native
    if (typeof setImmediate === 'function' && typeof window === 'undefined') {
        return setImmediate(fn);
    }
    // TODO: should this be setImmediate instead? Forgot if that is micro or macro task
    // TODO: detect specifically if is server
    // if (typeof process !== 'undefined' && process.nextTick) {
    //   console.log('process.nextTick?');
    //   process.nextTick(fn);
    //   return;
    // }
    // FIXME: fix the real safari issue of this randomly not working
    if (isSafari || typeof MutationObserver === 'undefined') {
        setTimeout(fn);
        return;
    }
    var called = 0;
    var observer = new MutationObserver(function () { return fn(); });
    var element = document.createTextNode('');
    observer.observe(element, {
        characterData: true,
    });
    // tslint:disable-next-line
    element.data = String((called = ++called));
}
exports.nextTick = nextTick;
//# sourceMappingURL=next-tick.function.js.map