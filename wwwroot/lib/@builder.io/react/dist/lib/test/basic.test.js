"use strict";
/**
 * @jest-environment jsdom
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var server_1 = require("react-dom/server");
var react_1 = require("@testing-library/react");
var sdk_1 = require("@builder.io/sdk");
var builder_react_1 = require("../src/builder-react");
var render_block_1 = require("./functions/render-block");
var reactTestRenderer = __importStar(require("react-test-renderer"));
var get_builder_pixel_1 = require("../src/functions/get-builder-pixel");
sdk_1.builder.init('null');
describe('Dummy test', function () {
    it('tests run correctly', function () {
        expect(true).toBeTruthy();
    });
});
var server = function (cb) {
    sdk_1.Builder.isServer = true;
    try {
        cb();
    }
    finally {
        sdk_1.Builder.isServer = false;
    }
};
describe('Renders tons of components', function () {
    var blocks = [
        (0, render_block_1.block)('Columns', {
            columns: [{ blocks: [(0, render_block_1.el)()] }, { blocks: [(0, render_block_1.el)()] }],
        }),
        (0, render_block_1.block)('CustomCode', {
            code: '<!-- hello -->',
        }),
        (0, render_block_1.block)('Embed', {
            content: '<!-- hello -->',
        }),
        (0, render_block_1.block)('Symbol'),
        (0, render_block_1.block)('Router'),
        (0, render_block_1.block)('Image', { image: 'foobar' }),
        (0, render_block_1.block)('Form:Form'),
        (0, render_block_1.block)('Video', { video: 'foobar' }),
        (0, render_block_1.block)('Button', { text: 'foobar' }),
        (0, render_block_1.block)('Section', null, { children: [(0, render_block_1.el)()] }),
        (0, render_block_1.block)('Form:SubmitButton', { text: 'foobar' }),
        (0, render_block_1.block)('Form:Input', { type: 'text' }),
        (0, render_block_1.block)('Form:Label'),
        (0, render_block_1.block)('Form:Select'),
        (0, render_block_1.block)('Form:TextArea', { placeholder: 'foobar' }),
        (0, render_block_1.block)('Raw:Img', { image: 'foobar' }),
    ];
    var getRenderExampleElement = function () { return (React.createElement(builder_react_1.BuilderPage, { model: "page", content: {
            data: {
                blocks: blocks,
            },
        } })); };
    it('works with dom', function () {
        var testApi = (0, react_1.render)(getRenderExampleElement());
    });
    it('works with SSR', function () {
        (0, server_1.renderToString)(getRenderExampleElement());
    });
});
describe('Data rendering', function () {
    var TEXT_STRING = 'Hello 1234';
    var bindingBlock = (0, render_block_1.el)({
        bindings: {
            'component.options.text': 'state.foo',
        },
        component: {
            name: 'Text',
        },
    });
    var getBindingExampleElement = function () { return (React.createElement(builder_react_1.BuilderPage, { model: "page", data: { foo: TEXT_STRING }, content: {
            data: {
                blocks: [bindingBlock],
            },
        } })); };
    it('works with dom', function () {
        var testApi = (0, react_1.render)(getBindingExampleElement());
        expect(testApi.getByText(TEXT_STRING)).toBeInTheDocument();
    });
    it('works with SSR', function () {
        server(function () {
            var renderedString = (0, server_1.renderToString)(getBindingExampleElement());
            expect(renderedString).toContain(TEXT_STRING);
        });
    });
});
describe('Content changes when new content provided', function () {
    var textA = 'textA';
    var textB = 'textB';
    var idA = 'id-a';
    var idB = 'id-b';
    it('Handles content passed and changed correctly', function () {
        var testApi = (0, react_1.render)(React.createElement(builder_react_1.BuilderPage, { model: "page", content: {
                id: idA,
                data: {
                    blocks: [(0, render_block_1.block)('Text', { text: textA })],
                },
            } }));
        expect(testApi.getByText(textA)).toBeInTheDocument();
        testApi.rerender(React.createElement(builder_react_1.BuilderPage, { model: "page", content: {
                id: idB,
                data: {
                    blocks: [(0, render_block_1.block)('Text', { text: textB })],
                },
            } }));
        expect(testApi.getByText(textB)).toBeInTheDocument();
    });
    it('Should be in controlled mode for null or underined content', function () {
        var testApi = (0, react_1.render)(React.createElement(builder_react_1.BuilderPage, { model: "page", content: undefined }));
        expect(testApi.queryByText(textB)).toBeNull();
        testApi.rerender(React.createElement(builder_react_1.BuilderPage, { model: "page", content: {
                id: idB,
                data: {
                    blocks: [(0, render_block_1.block)('Text', { text: textB })],
                },
            } }));
        expect(testApi.getByText(textB)).toBeInTheDocument();
    });
    it('Should be in controlled mode for null or underined content', function () {
        var testApi = (0, react_1.render)(React.createElement(builder_react_1.BuilderPage, { model: "page" }));
        expect(testApi.queryByText(textB)).toBeNull();
        testApi.rerender(React.createElement(builder_react_1.BuilderPage, { model: "page", content: {
                id: idB,
                data: {
                    blocks: [(0, render_block_1.block)('Text', { text: textB })],
                },
            } }));
        expect(testApi.getByText(textB)).toBeInTheDocument();
    });
});
describe('Builder Pixel', function () {
    it('Should NOT be added if blocks array is empty', function () {
        var renderedBlock = reactTestRenderer.create(React.createElement(builder_react_1.BuilderPage, { model: "page", content: {
                id: 'id',
                data: {
                    blocks: [],
                },
            } }));
        expect(renderedBlock).toMatchSnapshot();
    });
    it('Should NOT be added again if already present in blocks array', function () {
        var renderedBlock = reactTestRenderer.create(React.createElement(builder_react_1.BuilderPage, { model: "page", content: {
                id: 'id',
                data: {
                    blocks: [(0, get_builder_pixel_1.getBuilderPixel)('null')],
                },
            } }));
        expect(renderedBlock).toMatchSnapshot();
    });
    it('Should be added if pixel is missing and blocks array has other block(s)', function () {
        var renderedBlock = reactTestRenderer.create(React.createElement(builder_react_1.BuilderPage, { model: "page", content: {
                id: 'id',
                data: {
                    blocks: [
                        {
                            '@type': '@builder.io/sdk:Element',
                            '@version': 2,
                            id: 'builder-270035a08d734ae88ea177daff3595c0',
                            component: {
                                name: 'Text',
                                options: {
                                    text: '<p>some text...</p>',
                                },
                            },
                            responsiveStyles: {
                                large: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    flexShrink: '0',
                                    boxSizing: 'border-box',
                                    marginTop: '20px',
                                    lineHeight: 'normal',
                                    height: 'auto',
                                },
                            },
                        },
                    ],
                },
            } }));
        expect(renderedBlock).toMatchSnapshot();
    });
});
//# sourceMappingURL=basic.test.js.map