"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var sdk_1 = require("@builder.io/sdk");
var builder_blocks_component_1 = require("../components/builder-blocks.component");
sdk_1.Builder.registerComponent(Mutation, {
    name: 'Builder:Mutation',
    canHaveChildren: true,
    noWrap: true,
    hideFromInsertMenu: true,
    inputs: [
        {
            name: 'type',
            type: 'string',
            defaultValue: 'replace',
            enum: [
                {
                    label: 'Replace',
                    value: 'replace',
                    helperText: 'Replace the contents of this site region with content from Builder',
                },
                {
                    label: 'Append',
                    value: 'afterEnd',
                    helperText: 'Append Builder content after the chosen site region',
                },
            ],
        },
        {
            name: 'selector',
            // TODO: special UI for this
            type: 'builder:domSelector',
        },
    ],
});
function Mutation(props) {
    var _a, _b;
    var ref = react_1.default.useRef(null);
    useWaitForSelector(props.selector, function (node) {
        // TODO: static generate this logic
        if (props.type !== 'afterEnd') {
            node.innerHTML = '';
        }
        node.appendChild(ref.current.firstElementChild);
    });
    var children = (_a = props.builderBlock) === null || _a === void 0 ? void 0 : _a.children;
    return ((0, core_1.jsx)("span", { style: { display: 'none' }, ref: ref },
        (0, core_1.jsx)(builder_blocks_component_1.BuilderBlocks, { style: {
                display: 'inline',
            }, child: true, parentElementId: (_b = props.builderBlock) === null || _b === void 0 ? void 0 : _b.id, dataPath: "this.children", blocks: children })));
}
exports.Mutation = Mutation;
function useWaitForSelector(selector, cb) {
    react_1.default.useLayoutEffect(function () {
        try {
            var existingElement = document.querySelector(selector);
            if (existingElement) {
                cb(existingElement);
                return;
            }
        }
        catch (err) {
            console.warn(err);
        }
        var observer = new MutationObserver(function () {
            try {
                var foundElement = document.querySelector(selector);
                if (foundElement) {
                    observer.disconnect();
                    cb(foundElement);
                }
            }
            catch (err) {
                console.warn(err);
            }
        });
        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            characterData: true,
        });
        return function () {
            observer.disconnect();
        };
    }, [selector]);
}
//# sourceMappingURL=Mutation.js.map