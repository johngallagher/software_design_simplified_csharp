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
exports.withChildren = void 0;
var react_1 = __importDefault(require("react"));
var builder_block_component_1 = require("../components/builder-block.component");
/**
 * Higher order component for passing Builder.io children as React children
 *
 * @example
 * ```tsx
 *
 *    const MyButton = props => <Button>
 *      {children}
 *    </Button>
 *
 *    const ButtonWithBuilderChildren = withChildren(MyButton)
 *
 *    Builder.registerComponent(ButtonWithBuilderChildren, {
 *      name: 'MyButton',
 *      defaultChildren: [
 *        {
 *          '@type': '@builder.io/sdk:Element'
 *        }
 *      ]
 *    })
 * ```
 */
var withChildren = function (Component) {
    var HOC = react_1.default.forwardRef(function (props, ref) {
        var children = props.children ||
            (props.builderBlock &&
                props.builderBlock.children &&
                props.builderBlock.children.map(function (child) { return react_1.default.createElement(builder_block_component_1.BuilderBlock, { key: child.id, block: child }); }));
        return (
        // getting type errors due to `@types/react` version mismatches. Can safely ignore.
        // @ts-ignore
        react_1.default.createElement(Component, __assign({}, props, { ref: ref }), children));
    });
    HOC.builderOptions = {
        canHaveChildren: true,
    };
    return HOC;
};
exports.withChildren = withChildren;
//# sourceMappingURL=with-children.js.map