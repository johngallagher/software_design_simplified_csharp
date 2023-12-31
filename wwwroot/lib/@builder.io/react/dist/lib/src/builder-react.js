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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = exports.builder = exports.useIsPreviewing = exports.stringToFunction = exports.RawText = exports.Img = exports.TextArea = exports.FormSelect = exports.Label = exports.FormSubmitButton = exports.FormInput = exports.Form = exports.Mutation = exports.Router = exports.StateProvider = exports.Section = exports.Button = exports.Symbol = exports.Video = exports.getSrcSet = exports.Image = exports.CustomCode = exports.Embed = exports.Columns = exports.Fragment = exports.Dropzone = exports.Text = exports.RenderContent = exports.BuilderComponent = exports.onChange = exports.BuilderPage = exports.noWrap = exports.withChildren = exports.withBuilder = exports.BuilderBlock = exports.BuilderAsyncRequestsContext = exports.BuilderMetaContext = exports.BuilderStoreContext = exports.BuilderContent = exports.BuilderBlockComponent = exports.BuilderBlocks = void 0;
require("./scripts/init-editing");
var sdk_1 = require("@builder.io/sdk");
Object.defineProperty(exports, "builder", { enumerable: true, get: function () { return sdk_1.builder; } });
Object.defineProperty(exports, "Builder", { enumerable: true, get: function () { return sdk_1.Builder; } });
sdk_1.Builder.isReact = true;
var builder_blocks_component_1 = require("./components/builder-blocks.component");
Object.defineProperty(exports, "BuilderBlocks", { enumerable: true, get: function () { return builder_blocks_component_1.BuilderBlocks; } });
var builder_block_component_1 = require("./components/builder-block.component");
Object.defineProperty(exports, "BuilderBlockComponent", { enumerable: true, get: function () { return builder_block_component_1.BuilderBlock; } });
var builder_content_component_1 = require("./components/builder-content.component");
Object.defineProperty(exports, "BuilderContent", { enumerable: true, get: function () { return builder_content_component_1.BuilderContent; } });
var builder_component_component_1 = require("./components/builder-component.component");
Object.defineProperty(exports, "BuilderPage", { enumerable: true, get: function () { return builder_component_component_1.BuilderComponent; } });
Object.defineProperty(exports, "BuilderComponent", { enumerable: true, get: function () { return builder_component_component_1.BuilderComponent; } });
Object.defineProperty(exports, "RenderContent", { enumerable: true, get: function () { return builder_component_component_1.BuilderComponent; } });
Object.defineProperty(exports, "onChange", { enumerable: true, get: function () { return builder_component_component_1.onChange; } });
var builder_store_1 = require("./store/builder-store");
Object.defineProperty(exports, "BuilderStoreContext", { enumerable: true, get: function () { return builder_store_1.BuilderStoreContext; } });
var builder_meta_1 = require("./store/builder-meta");
Object.defineProperty(exports, "BuilderMetaContext", { enumerable: true, get: function () { return builder_meta_1.BuilderMetaContext; } });
var builder_async_requests_1 = require("./store/builder-async-requests");
Object.defineProperty(exports, "BuilderAsyncRequestsContext", { enumerable: true, get: function () { return builder_async_requests_1.BuilderAsyncRequestsContext; } });
var builder_block_decorator_1 = require("./decorators/builder-block.decorator");
Object.defineProperty(exports, "BuilderBlock", { enumerable: true, get: function () { return builder_block_decorator_1.BuilderBlock; } });
__exportStar(require("./functions/update-metadata"), exports);
var with_builder_1 = require("./functions/with-builder");
Object.defineProperty(exports, "withBuilder", { enumerable: true, get: function () { return with_builder_1.withBuilder; } });
var with_children_1 = require("./functions/with-children");
Object.defineProperty(exports, "withChildren", { enumerable: true, get: function () { return with_children_1.withChildren; } });
var no_wrap_1 = require("./functions/no-wrap");
Object.defineProperty(exports, "noWrap", { enumerable: true, get: function () { return no_wrap_1.noWrap; } });
var Text_1 = require("./blocks/Text");
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return Text_1.Text; } });
var Slot_1 = require("./blocks/Slot");
Object.defineProperty(exports, "Dropzone", { enumerable: true, get: function () { return Slot_1.Slot; } });
var Fragment_1 = require("./blocks/Fragment");
Object.defineProperty(exports, "Fragment", { enumerable: true, get: function () { return Fragment_1.Fragment; } });
var Columns_1 = require("./blocks/Columns");
Object.defineProperty(exports, "Columns", { enumerable: true, get: function () { return Columns_1.Columns; } });
var Embed_1 = require("./blocks/Embed");
Object.defineProperty(exports, "Embed", { enumerable: true, get: function () { return Embed_1.Embed; } });
var CustomCode_1 = require("./blocks/CustomCode");
Object.defineProperty(exports, "CustomCode", { enumerable: true, get: function () { return CustomCode_1.CustomCode; } });
var Image_1 = require("./blocks/Image");
Object.defineProperty(exports, "Image", { enumerable: true, get: function () { return Image_1.Image; } });
Object.defineProperty(exports, "getSrcSet", { enumerable: true, get: function () { return Image_1.getSrcSet; } });
var Video_1 = require("./blocks/Video");
Object.defineProperty(exports, "Video", { enumerable: true, get: function () { return Video_1.Video; } });
var Symbol_1 = require("./blocks/Symbol");
Object.defineProperty(exports, "Symbol", { enumerable: true, get: function () { return Symbol_1.Symbol; } });
var Button_1 = require("./blocks/Button");
Object.defineProperty(exports, "Button", { enumerable: true, get: function () { return Button_1.Button; } });
var Section_1 = require("./blocks/Section");
Object.defineProperty(exports, "Section", { enumerable: true, get: function () { return Section_1.Section; } });
var StateProvider_1 = require("./blocks/StateProvider");
Object.defineProperty(exports, "StateProvider", { enumerable: true, get: function () { return StateProvider_1.StateProvider; } });
var Router_1 = require("./blocks/Router");
Object.defineProperty(exports, "Router", { enumerable: true, get: function () { return Router_1.Router; } });
var Mutation_1 = require("./blocks/Mutation");
Object.defineProperty(exports, "Mutation", { enumerable: true, get: function () { return Mutation_1.Mutation; } });
var Form_1 = require("./blocks/forms/Form");
Object.defineProperty(exports, "Form", { enumerable: true, get: function () { return Form_1.Form; } });
var Input_1 = require("./blocks/forms/Input");
Object.defineProperty(exports, "FormInput", { enumerable: true, get: function () { return Input_1.FormInput; } });
var Button_2 = require("./blocks/forms/Button");
Object.defineProperty(exports, "FormSubmitButton", { enumerable: true, get: function () { return Button_2.FormSubmitButton; } });
var Label_1 = require("./blocks/forms/Label"); // advanced?
Object.defineProperty(exports, "Label", { enumerable: true, get: function () { return Label_1.Label; } });
var Select_1 = require("./blocks/forms/Select"); // advanced?
Object.defineProperty(exports, "FormSelect", { enumerable: true, get: function () { return Select_1.FormSelect; } });
var TextArea_1 = require("./blocks/forms/TextArea");
Object.defineProperty(exports, "TextArea", { enumerable: true, get: function () { return TextArea_1.TextArea; } });
var Img_1 = require("./blocks/raw/Img");
Object.defineProperty(exports, "Img", { enumerable: true, get: function () { return Img_1.Img; } });
var RawText_1 = require("./blocks/raw/RawText");
Object.defineProperty(exports, "RawText", { enumerable: true, get: function () { return RawText_1.RawText; } });
var string_to_function_1 = require("./functions/string-to-function");
Object.defineProperty(exports, "stringToFunction", { enumerable: true, get: function () { return string_to_function_1.stringToFunction; } });
var useIsPreviewing_1 = require("./hooks/useIsPreviewing");
Object.defineProperty(exports, "useIsPreviewing", { enumerable: true, get: function () { return useIsPreviewing_1.useIsPreviewing; } });
exports.default = sdk_1.builder;
//# sourceMappingURL=builder-react.js.map