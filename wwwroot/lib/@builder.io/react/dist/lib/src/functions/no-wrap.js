"use strict";
'use client';
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noWrap = void 0;
var react_1 = __importDefault(require("react"));
/**
 * Higher order component for passing Builder.io styles and attributes directly
 * to the component child without wrapping
 *
 * Useful when you need styles etc applied directly to the component without a
 * wrapping element (e.g. div), and you are already forwarding all props and attributes
 * (e.g. <YourComponent {...props} />)
 *
 * 👉 Important: make sure you always add props.className,
 * even if you supply a className too
 *
 * @example
 * ```tsx
 *
 *    const MyButton = props => <Button
 *      {...props}
 *      className={'my-button ' + (props.className || '')}>
 *      Hello there!
 *    </Button>
 *
 *    const ButtonWithBuilderChildren = noWrap(MyButton)
 *
 *    Builder.registerComponent(ButtonWithBuilderChildren, {
 *      name: 'MyButton',
 *    })
 * ```
 */
var noWrap = function (Component) {
    var HOC = react_1.default.forwardRef(function (props, ref) {
        var finalProps = __assign(__assign({}, props), props.attributes);
        // getting type errors due to `@types/react` version mismatches. Can safely ignore.
        // @ts-ignore
        return react_1.default.createElement(Component, __assign({}, finalProps, { ref: ref }));
    });
    HOC.builderOptions = {
        noWrap: true,
    };
    return HOC;
};
exports.noWrap = noWrap;
//# sourceMappingURL=no-wrap.js.map