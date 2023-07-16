"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animator = void 0;
var throttle_function_1 = require("../functions/throttle.function");
var assign_function_1 = require("../functions/assign.function");
var camelCaseToKebabCase = function (str) {
    return str ? str.replace(/([A-Z])/g, function (g) { return "-".concat(g[0].toLowerCase()); }) : '';
};
var Animator = /** @class */ (function () {
    function Animator() {
    }
    Animator.prototype.bindAnimations = function (animations) {
        for (var _i = 0, animations_1 = animations; _i < animations_1.length; _i++) {
            var animation = animations_1[_i];
            switch (animation.trigger) {
                case 'pageLoad':
                    this.triggerAnimation(animation);
                    break;
                case 'hover':
                    this.bindHoverAnimation(animation);
                    break;
                case 'scrollInView':
                    this.bindScrollInViewAnimation(animation);
                    break;
            }
        }
    };
    Animator.prototype.warnElementNotPresent = function (id) {
        console.warn("Cannot animate element: element with ID ".concat(id, " not found!"));
    };
    Animator.prototype.augmentAnimation = function (animation, element) {
        var stylesUsed = this.getAllStylesUsed(animation);
        var computedStyle = getComputedStyle(element);
        // const computedStyle = getComputedStyle(element);
        // // FIXME: this will break if original load is in one reponsive size then resize to another hmmm
        // Need to use transform instead of left since left can change on screen sizes
        var firstStyles = animation.steps[0].styles;
        var lastStyles = animation.steps[animation.steps.length - 1].styles;
        var bothStyles = [firstStyles, lastStyles];
        // FIXME: this won't work as expected for augmented animations - may need the editor itself to manage this
        for (var _i = 0, bothStyles_1 = bothStyles; _i < bothStyles_1.length; _i++) {
            var styles = bothStyles_1[_i];
            for (var _a = 0, stylesUsed_1 = stylesUsed; _a < stylesUsed_1.length; _a++) {
                var style = stylesUsed_1[_a];
                if (!(style in styles)) {
                    styles[style] = computedStyle[style];
                }
            }
        }
    };
    Animator.prototype.getAllStylesUsed = function (animation) {
        var properties = [];
        for (var _i = 0, _a = animation.steps; _i < _a.length; _i++) {
            var step = _a[_i];
            for (var key in step.styles) {
                if (properties.indexOf(key) === -1) {
                    properties.push(key);
                }
            }
        }
        return properties;
    };
    Animator.prototype.triggerAnimation = function (animation) {
        var _this = this;
        // TODO: do for ALL elements
        var elements = Array.prototype.slice.call(document.getElementsByClassName(animation.elementId || animation.id || ''));
        if (!elements.length) {
            this.warnElementNotPresent(animation.elementId || animation.id || '');
            return;
        }
        Array.from(elements).forEach(function (element) {
            _this.augmentAnimation(animation, element);
            // TODO: do this properly, may have other animations of different properties
            // TODO: only override the properties
            // TODO: if there is an entrance and hover animation, the transition duration will get effed
            // element.setAttribute('style', '');
            // const styledUsed = this.getAllStylesUsed(animation);
            element.style.transition = 'none';
            element.style.transitionDelay = '0';
            (0, assign_function_1.assign)(element.style, animation.steps[0].styles);
            // TODO: queue/batch these timeouts
            // TODO: only include properties explicitly set in the animation
            // using Object.keys(styles)
            setTimeout(function () {
                element.style.transition = "all ".concat(animation.duration, "s ").concat(camelCaseToKebabCase(animation.easing));
                if (animation.delay) {
                    element.style.transitionDelay = animation.delay + 's';
                }
                (0, assign_function_1.assign)(element.style, animation.steps[1].styles);
                // TODO: maybe remove/reset transitoin property after animation duration
                // TODO: queue timers
                setTimeout(function () {
                    // TODO: what if has other transition (reset back to what it was)
                    element.style.transition = '';
                    element.style.transitionDelay = '';
                }, (animation.delay || 0) * 1000 + animation.duration * 1000 + 100);
            });
        });
    };
    Animator.prototype.bindHoverAnimation = function (animation) {
        var _this = this;
        // TODO: is it multiple binding when editing...?
        // TODO: unbind on element remove
        // TODO: apply to ALL elements
        var elements = Array.prototype.slice.call(document.getElementsByClassName(animation.elementId || animation.id || ''));
        if (!elements.length) {
            this.warnElementNotPresent(animation.elementId || animation.id || '');
            return;
        }
        Array.from(elements).forEach(function (element) {
            _this.augmentAnimation(animation, element);
            var defaultState = animation.steps[0].styles;
            var hoverState = animation.steps[1].styles;
            function attachDefaultState() {
                (0, assign_function_1.assign)(element.style, defaultState);
            }
            function attachHoverState() {
                (0, assign_function_1.assign)(element.style, hoverState);
            }
            attachDefaultState();
            element.addEventListener('mouseenter', attachHoverState);
            element.addEventListener('mouseleave', attachDefaultState);
            // TODO: queue/batch these timeouts
            setTimeout(function () {
                element.style.transition = "all ".concat(animation.duration, "s ").concat(camelCaseToKebabCase(animation.easing));
                if (animation.delay) {
                    element.style.transitionDelay = animation.delay + 's';
                }
            });
        });
    };
    // TODO: unbind on element remove
    Animator.prototype.bindScrollInViewAnimation = function (animation) {
        var _this = this;
        // TODO: apply to ALL matching elements
        var elements = Array.prototype.slice.call(document.getElementsByClassName(animation.elementId || animation.id || ''));
        if (!elements.length) {
            this.warnElementNotPresent(animation.elementId || animation.id || '');
            return;
        }
        // TODO: if server side rendered and scrolled into view don't animate...
        Array.from(elements).forEach(function (element) {
            _this.augmentAnimation(animation, element);
            var triggered = false;
            var pendingAnimation = false;
            function immediateOnScroll() {
                if (!triggered && isScrolledIntoView(element)) {
                    triggered = true;
                    pendingAnimation = true;
                    setTimeout(function () {
                        (0, assign_function_1.assign)(element.style, animation.steps[1].styles);
                        if (!animation.repeat) {
                            document.removeEventListener('scroll', onScroll);
                        }
                        setTimeout(function () {
                            pendingAnimation = false;
                            if (!animation.repeat) {
                                element.style.transition = '';
                                element.style.transitionDelay = '';
                            }
                        }, (animation.duration + (animation.delay || 0)) * 1000 + 100);
                    });
                }
                else if (animation.repeat &&
                    triggered &&
                    !pendingAnimation &&
                    !isScrolledIntoView(element)) {
                    // we want to repeat the animation every time the the element is out of view and back again
                    triggered = false;
                    (0, assign_function_1.assign)(element.style, animation.steps[0].styles);
                }
            }
            // TODO: roll all of these in one for more efficiency of checking all the rects
            var onScroll = (0, throttle_function_1.throttle)(immediateOnScroll, 200, { leading: false });
            // TODO: fully in view or partially
            function isScrolledIntoView(elem) {
                var rect = elem.getBoundingClientRect();
                var windowHeight = window.innerHeight;
                var thresholdPercent = (animation.thresholdPercent || 0) / 100;
                var threshold = thresholdPercent * windowHeight;
                // TODO: partial in view? or what if element is larger than screen itself
                return (rect.bottom > threshold && rect.top < windowHeight - threshold // Element is peeking top or bottom
                // (rect.top > 0 && rect.bottom < window.innerHeight) || // element fits within the screen and is fully on screen (not hanging off at all)
                // (rect.top < 0 && rect.bottom > window.innerHeight) // element is larger than the screen and hangs over the top and bottom
                );
            }
            var defaultState = animation.steps[0].styles;
            function attachDefaultState() {
                (0, assign_function_1.assign)(element.style, defaultState);
            }
            attachDefaultState();
            // TODO: queue/batch these timeouts!
            setTimeout(function () {
                element.style.transition = "all ".concat(animation.duration, "s ").concat(camelCaseToKebabCase(animation.easing));
                if (animation.delay) {
                    element.style.transitionDelay = animation.delay + 's';
                }
            });
            // TODO: one listener for everything
            document.addEventListener('scroll', onScroll, { capture: true, passive: true });
            // Do an initial check
            immediateOnScroll();
        });
    };
    return Animator;
}());
exports.Animator = Animator;
//# sourceMappingURL=animator.class.js.map