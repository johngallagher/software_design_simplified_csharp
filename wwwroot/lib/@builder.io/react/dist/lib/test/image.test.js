"use strict";
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
var Image_1 = require("../src/blocks/Image");
var reactTestRenderer = __importStar(require("react-test-renderer"));
var render_block_1 = require("./functions/render-block");
var builder_react_1 = require("../src/builder-react");
describe('Image', function () {
    it('Builder image url', function () {
        var tree = reactTestRenderer
            .create(React.createElement(Image_1.Image, { image: "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F755c131471fb49ab91dc0bdc45bc85b5?width=1003" }))
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('Builder image url with width', function () {
        var tree = reactTestRenderer
            .create(React.createElement(Image_1.Image, { image: "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F755c131471fb49ab91dc0bdc45bc85b5?width=1003" }))
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('Shopify image url', function () {
        var tree = reactTestRenderer
            .create(React.createElement(Image_1.Image, { image: "https://cdn.shopify.com/s/files/1/0374/6457/2041/products/valerie-elash-o1Ic6JdypmA-unsplash.jpg?v=1592506853" }))
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('Amp image', function () {
        var imageBlock = (0, render_block_1.block)('Image', {
            image: 'https://cdn.shopify.com/s/files/1/0374/6457/2041/products/valerie-elash-o1Ic6JdypmA-unsplash.jpg?v=1592506853',
        }, {
            responsiveStyles: {
                large: {
                    width: '345px',
                },
                medium: {
                    width: '100%',
                },
            },
        }, 1234);
        var renderedBlock = reactTestRenderer
            .create(React.createElement(builder_react_1.BuilderPage, { model: "page", ampMode: true, content: {
                data: {
                    blocks: [imageBlock],
                },
            } }))
            .toJSON();
        expect(renderedBlock).toMatchSnapshot();
    });
    it('Lazy load', function () {
        var tree = reactTestRenderer
            .create(React.createElement(Image_1.Image, { image: "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F755c131471fb49ab91dc0bdc45bc85b5?width=1003", lazy: true }))
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('with sizes, srcset, and alt', function () {
        var tree = reactTestRenderer
            .create(React.createElement(Image_1.Image, { sizes: "(max-width: 600px) 67vw, 92vw", srcset: "nosrcset", altText: "this great image", image: "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F755c131471fb49ab91dc0bdc45bc85b5?width=1003", amp: "true" }))
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('with responsive styles', function () {
        var imageBlock = (0, render_block_1.block)('Image', {
            image: 'https://cdn.shopify.com/s/files/1/0374/6457/2041/products/valerie-elash-o1Ic6JdypmA-unsplash.jpg?v=1592506853',
        }, {
            responsiveStyles: {
                large: {
                    width: '345px',
                },
                medium: {
                    width: '100%',
                },
            },
        }, 1234);
        var renderedBlock = reactTestRenderer
            .create(React.createElement(builder_react_1.BuilderPage, { model: "page", content: {
                data: {
                    blocks: [imageBlock],
                },
            } }))
            .toJSON();
        expect(renderedBlock).toMatchSnapshot();
    });
});
//# sourceMappingURL=image.test.js.map