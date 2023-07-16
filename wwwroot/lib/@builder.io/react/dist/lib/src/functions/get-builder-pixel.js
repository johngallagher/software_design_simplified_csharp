"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuilderPixel = void 0;
function getBuilderPixel(apiKey) {
    return {
        id: 'builder-pixel-' + Math.random().toString(36).split('.')[1],
        '@type': '@builder.io/sdk:Element',
        tagName: 'img',
        properties: {
            role: 'presentation',
            'aria-hidden': 'true',
            src: "https://cdn.builder.io/api/v1/pixel?apiKey=".concat(apiKey),
        },
        responsiveStyles: {
            large: {
                height: '0',
                width: '0',
                display: 'inline-block',
                opacity: '0',
                overflow: 'hidden',
                pointerEvents: 'none',
            },
        },
    };
}
exports.getBuilderPixel = getBuilderPixel;
//# sourceMappingURL=get-builder-pixel.js.map