"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var builder_block_component_1 = require("../../components/builder-block.component");
var sdk_1 = require("@builder.io/sdk");
var builder_blocks_component_1 = require("../../components/builder-blocks.component");
var builder_store_1 = require("../../store/builder-store");
var set_1 = require("../../functions/set");
var get_1 = require("../../functions/get");
var with_builder_1 = require("../../functions/with-builder");
var MULTIPART_CONTENT_TYPE = 'multipart/form-data';
var JSON_CONTENT_TYPE = 'application/json';
var ENCODED_CONTENT_TYPE = 'application/x-www-form-urlencoded';
var FormComponent = /** @class */ (function (_super) {
    __extends(FormComponent, _super);
    function FormComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ref = null;
        // TODO: link this state to global state and allow togglign the modes in
        // the style and or data editor. TODO: for now some kind of input for preview state
        // that only impacts in the editor?
        _this.state = {
            state: 'unsubmitted',
            // TODO: separate response and error?
            responseData: null,
            formErrorMessage: '',
        };
        return _this;
    }
    Object.defineProperty(FormComponent.prototype, "submissionState", {
        get: function () {
            return (sdk_1.Builder.isEditing && this.props.previewState) || this.state.state;
        },
        enumerable: false,
        configurable: true
    });
    FormComponent.prototype.render = function () {
        var _this = this;
        return (
        // TODO: JS data bindings
        (0, core_1.jsx)(builder_store_1.BuilderStoreContext.Consumer, null, function (state) { return ((0, core_1.jsx)(builder_store_1.BuilderStoreContext.Provider, { value: __assign(__assign({}, state), { state: __assign(__assign({}, state.state), { formErrorMessage: _this.state.formErrorMessage }) }) },
            (0, core_1.jsx)("form", __assign({ validate: _this.props.validate, ref: function (ref) { return (_this.ref = ref); }, action: !_this.props.sendWithJs && _this.props.action, method: _this.props.method, name: _this.props.name, onSubmit: function (event) {
                    var _a;
                    var sendWithJs = _this.props.sendWithJs || _this.props.sendSubmissionsTo === 'email';
                    // TODO: custom validate event that can preventDefault and use ref or event to set
                    // invalid message
                    if (_this.props.sendSubmissionsTo === 'zapier') {
                        event.preventDefault();
                        // TODO: send submission to zapier
                    }
                    else if (sendWithJs) {
                        if (!(_this.props.action || _this.props.sendSubmissionsTo === 'email')) {
                            event.preventDefault();
                            return;
                        }
                        event.preventDefault();
                        // TODO: error and success state
                        var el = event.currentTarget;
                        var headers = _this.props.customHeaders || {};
                        var body = void 0;
                        var formData = new FormData(el);
                        // TODO: maybe support null
                        var formPairs = Array.from(event.currentTarget.querySelectorAll('input,select,textarea'))
                            .filter(function (el) { return !!el.name; })
                            .map(function (el) {
                            var value;
                            var key = el.name;
                            if (el instanceof HTMLInputElement) {
                                if (el.type === 'radio') {
                                    if (el.checked) {
                                        value = el.name;
                                        return { key: key, value: value };
                                    }
                                }
                                else if (el.type === 'checkbox') {
                                    value = el.checked;
                                }
                                else if (el.type === 'number' || el.type === 'range') {
                                    var num = el.valueAsNumber;
                                    if (!isNaN(num)) {
                                        value = num;
                                    }
                                }
                                else if (el.type === 'file') {
                                    // TODO: one vs multiple files
                                    value = el.files;
                                }
                                else {
                                    value = el.value;
                                }
                            }
                            else {
                                value = el.value;
                            }
                            return { key: key, value: value };
                        });
                        var contentType_1 = _this.props.contentType;
                        if (_this.props.sendSubmissionsTo === 'email') {
                            contentType_1 = MULTIPART_CONTENT_TYPE;
                        }
                        Array.from(formPairs).forEach(function (_a) {
                            var value = _a.value;
                            if (value instanceof File ||
                                (Array.isArray(value) && value[0] instanceof File) ||
                                value instanceof FileList) {
                                contentType_1 = MULTIPART_CONTENT_TYPE;
                            }
                        });
                        if (contentType_1 === MULTIPART_CONTENT_TYPE) {
                            body = formData;
                        }
                        else if (contentType_1 === JSON_CONTENT_TYPE) {
                            var json_1 = {};
                            Array.from(formPairs).forEach(function (_a) {
                                var value = _a.value, key = _a.key;
                                (0, set_1.set)(json_1, key, value);
                            });
                            body = JSON.stringify(json_1);
                        }
                        else if (contentType_1 === ENCODED_CONTENT_TYPE) {
                            body = Array.from(formPairs)
                                .map(function (_a) {
                                var value = _a.value, key = _a.key;
                                return (encodeURIComponent(key) +
                                    '=' +
                                    encodeURIComponent(value));
                            })
                                .join('&');
                        }
                        else {
                            // Unsupported content type
                            console.error('Unsupported content type: ', contentType_1);
                            return;
                        }
                        if (contentType_1 && contentType_1 !== MULTIPART_CONTENT_TYPE) {
                            if (
                            // Zapier doesn't allow content-type header to be sent from browsers
                            !(sendWithJs && ((_a = _this.props.action) === null || _a === void 0 ? void 0 : _a.includes('zapier.com')))) {
                                headers['content-type'] = contentType_1;
                            }
                        }
                        var presubmitEvent = new CustomEvent('presubmit', {
                            detail: {
                                body: body,
                            },
                        });
                        if (_this.ref) {
                            _this.ref.dispatchEvent(presubmitEvent);
                            if (presubmitEvent.defaultPrevented) {
                                return;
                            }
                        }
                        _this.setState(__assign(__assign({}, _this.state), { state: 'sending' }));
                        var formUrl = "".concat(sdk_1.builder.env === 'dev' ? 'http://localhost:5000' : 'https://builder.io', "/api/v1/form-submit?apiKey=").concat(sdk_1.builder.apiKey, "&to=").concat(btoa(_this.props.sendSubmissionsToEmail || ''), "&name=").concat(encodeURIComponent(_this.props.name || ''));
                        fetch(_this.props.sendSubmissionsTo === 'email' ? formUrl : _this.props.action, // TODO: throw error if no action URL
                        {
                            body: body,
                            headers: headers,
                            method: _this.props.method || 'post',
                        }).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            var body, contentType, message, submitSuccessEvent, event_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        contentType = res.headers.get('content-type');
                                        if (!(contentType && contentType.indexOf(JSON_CONTENT_TYPE) !== -1)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, res.json()];
                                    case 1:
                                        body = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 2: return [4 /*yield*/, res.text()];
                                    case 3:
                                        body = _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        if (!res.ok && this.props.errorMessagePath) {
                                            message = (0, get_1.get)(body, this.props.errorMessagePath);
                                            if (message) {
                                                if (typeof message !== 'string') {
                                                    // TODO: ideally convert json to yaml so it woul dbe like
                                                    // error: - email has been taken
                                                    message = JSON.stringify(message);
                                                }
                                                this.setState(__assign(__assign({}, this.state), { formErrorMessage: message }));
                                            }
                                        }
                                        this.setState(__assign(__assign({}, this.state), { responseData: body, state: res.ok ? 'success' : 'error' }));
                                        if (res.ok) {
                                            submitSuccessEvent = new CustomEvent('submit:success', {
                                                detail: {
                                                    res: res,
                                                    body: body,
                                                },
                                            });
                                            if (this.ref) {
                                                this.ref.dispatchEvent(submitSuccessEvent);
                                                if (submitSuccessEvent.defaultPrevented) {
                                                    return [2 /*return*/];
                                                }
                                                // TODO: option to turn this on/off?
                                                if (this.props.resetFormOnSubmit !== false) {
                                                    this.ref.reset();
                                                }
                                            }
                                            // TODO: client side route event first that can be preventDefaulted
                                            if (this.props.successUrl) {
                                                if (this.ref) {
                                                    event_1 = new CustomEvent('route', {
                                                        detail: {
                                                            url: this.props.successUrl,
                                                        },
                                                    });
                                                    this.ref.dispatchEvent(event_1);
                                                    if (!event_1.defaultPrevented) {
                                                        location.href = this.props.successUrl;
                                                    }
                                                }
                                                else {
                                                    location.href = this.props.successUrl;
                                                }
                                            }
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }, function (err) {
                            var submitErrorEvent = new CustomEvent('submit:error', {
                                detail: {
                                    error: err,
                                },
                            });
                            if (_this.ref) {
                                _this.ref.dispatchEvent(submitErrorEvent);
                                if (submitErrorEvent.defaultPrevented) {
                                    return;
                                }
                            }
                            // TODO: send submit error event
                            _this.setState(__assign(__assign({}, _this.state), { responseData: err, state: 'error' }));
                        });
                    }
                } }, _this.props.attributes),
                _this.props.builderBlock &&
                    _this.props.builderBlock.children &&
                    _this.props.builderBlock.children.map(function (block, index) { return ((0, core_1.jsx)(builder_block_component_1.BuilderBlock, { key: block.id, block: block })); }),
                _this.submissionState === 'error' && ((0, core_1.jsx)(builder_blocks_component_1.BuilderBlocks, { dataPath: "errorMessage", blocks: _this.props.errorMessage })),
                _this.submissionState === 'sending' && ((0, core_1.jsx)(builder_blocks_component_1.BuilderBlocks, { dataPath: "sendingMessage", blocks: _this.props.sendingMessage })),
                _this.submissionState === 'error' && _this.state.responseData && (
                // TODO: tag to edit
                (0, core_1.jsx)("pre", { className: "builder-form-error-text", css: { padding: 10, color: 'red', textAlign: 'center' } }, JSON.stringify(_this.state.responseData, null, 2))),
                _this.submissionState === 'success' && ((0, core_1.jsx)(builder_blocks_component_1.BuilderBlocks, { dataPath: "successMessage", blocks: _this.props.successMessage }))))); }));
    };
    return FormComponent;
}(react_1.default.Component));
exports.Form = (0, with_builder_1.withBuilder)(FormComponent, {
    name: 'Form:Form',
    // editableTags: ['builder-form-error']
    defaults: {
        responsiveStyles: {
            large: {
                marginTop: '15px',
                paddingBottom: '15px',
            },
        },
    },
    image: 'https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fef36d2a846134910b64b88e6d18c5ca5',
    inputs: [
        {
            name: 'sendSubmissionsTo',
            type: 'string',
            // TODO: save to builder data and user can download as csv
            // TODO: easy for mode too or computed add/remove fields form mode
            // so you can edit details and high level mode at same time...
            // Later - more integrations like mailchimp
            // /api/v1/form-submit?to=mailchimp
            enum: [
                {
                    label: 'Send to email',
                    value: 'email',
                    helperText: 'Send form submissions to the email address of your choosing',
                },
                {
                    label: 'Custom',
                    value: 'custom',
                    helperText: 'Handle where the form requests go manually with a little code, e.g. to your own custom backend',
                },
            ],
            defaultValue: 'email',
        },
        {
            name: 'sendSubmissionsToEmail',
            type: 'string',
            required: true,
            defaultValue: 'your@email.com',
            showIf: 'options.get("sendSubmissionsTo") === "email"',
        },
        {
            name: 'sendWithJs',
            type: 'boolean',
            helperText: 'Set to false to use basic html form action',
            defaultValue: true,
            showIf: 'options.get("sendSubmissionsTo") === "custom"',
        },
        {
            name: 'name',
            type: 'string',
            defaultValue: 'My form',
            // advanced: true
        },
        {
            name: 'action',
            type: 'string',
            helperText: 'URL to send the form data to',
            showIf: 'options.get("sendSubmissionsTo") === "custom"',
        },
        {
            name: 'contentType',
            type: 'string',
            defaultValue: JSON_CONTENT_TYPE,
            advanced: true,
            // TODO: do automatically if file input
            enum: [JSON_CONTENT_TYPE, MULTIPART_CONTENT_TYPE, ENCODED_CONTENT_TYPE],
            showIf: 'options.get("sendSubmissionsTo") === "custom" && options.get("sendWithJs") === true',
        },
        {
            name: 'method',
            type: 'string',
            showIf: 'options.get("sendSubmissionsTo") === "custom"',
            defaultValue: 'POST',
            advanced: true,
        },
        {
            name: 'previewState',
            type: 'string',
            // TODO: persist: false flag
            enum: ['unsubmitted', 'sending', 'success', 'error'],
            defaultValue: 'unsubmitted',
            helperText: 'Choose a state to edit, e.g. choose "success" to show what users see on success and edit the message',
            showIf: 'options.get("sendSubmissionsTo") !== "zapier" && options.get("sendWithJs") === true',
        },
        {
            name: 'successUrl',
            type: 'url',
            helperText: 'Optional URL to redirect the user to on form submission success',
            showIf: 'options.get("sendSubmissionsTo") !== "zapier" && options.get("sendWithJs") === true',
        },
        {
            name: 'resetFormOnSubmit',
            type: 'boolean',
            showIf: function (options) {
                return options.get('sendSubmissionsTo') === 'custom' && options.get('sendWithJs') === true;
            },
            advanced: true,
        },
        {
            name: 'successMessage',
            type: 'uiBlocks',
            hideFromUI: true,
            defaultValue: [
                {
                    '@type': '@builder.io/sdk:Element',
                    responsiveStyles: {
                        large: {
                            marginTop: '10px',
                        },
                    },
                    component: {
                        name: 'Text',
                        options: {
                            text: '<span>Thanks!</span>',
                        },
                    },
                },
            ],
        },
        {
            name: 'validate',
            type: 'boolean',
            defaultValue: true,
            advanced: true,
        },
        {
            name: 'errorMessagePath',
            type: 'text',
            advanced: true,
            helperText: 'Path to where to get the error message from in a JSON response to display to the user, e.g. "error.message" for a response like { "error": { "message": "this username is taken" }}',
        },
        {
            name: 'errorMessage',
            type: 'uiBlocks',
            hideFromUI: true,
            defaultValue: [
                {
                    '@type': '@builder.io/sdk:Element',
                    responsiveStyles: {
                        large: {
                            marginTop: '10px',
                        },
                    },
                    bindings: {
                        'component.options.text': 'state.formErrorMessage || block.component.options.text',
                    },
                    component: {
                        name: 'Text',
                        options: {
                            // TODO: how pull in API message
                            text: '<span>Form submission error :( Please check your answers and try again</span>',
                        },
                    },
                },
            ],
        },
        {
            name: 'sendingMessage',
            type: 'uiBlocks',
            hideFromUI: true,
            defaultValue: [
                {
                    '@type': '@builder.io/sdk:Element',
                    responsiveStyles: {
                        large: {
                            marginTop: '10px',
                        },
                    },
                    component: {
                        name: 'Text',
                        options: {
                            // TODO: how pull in API message
                            text: '<span>Sending...</span>',
                        },
                    },
                },
            ],
        },
        __assign(__assign({ name: 'customHeaders', type: 'map' }, {
            valueType: {
                type: 'string',
            },
        }), { advanced: true, showIf: 'options.get("sendSubmissionsTo") === "custom" && options.get("sendWithJs") === true' }),
        // TODO: custom headers or any fetch options
        // TODO: json vs serialized (i.e. send on client or not)
        // TODO: success/fail stuff
    ],
    noWrap: true,
    // TODO: defaultChildren with two inputs and submit button
    canHaveChildren: true,
    defaultChildren: [
        {
            '@type': '@builder.io/sdk:Element',
            responsiveStyles: {
                large: {
                    marginTop: '10px',
                },
            },
            component: {
                name: 'Text',
                options: {
                    text: '<span>Enter your name</span>',
                },
            },
        },
        {
            '@type': '@builder.io/sdk:Element',
            responsiveStyles: {
                large: {
                    marginTop: '10px',
                },
            },
            component: {
                name: 'Form:Input',
                options: {
                    name: 'name',
                    placeholder: 'Jane Doe',
                },
            },
        },
        {
            '@type': '@builder.io/sdk:Element',
            responsiveStyles: {
                large: {
                    marginTop: '10px',
                },
            },
            component: {
                name: 'Text',
                options: {
                    text: '<span>Enter your email</span>',
                },
            },
        },
        {
            '@type': '@builder.io/sdk:Element',
            responsiveStyles: {
                large: {
                    marginTop: '10px',
                },
            },
            component: {
                name: 'Form:Input',
                options: {
                    name: 'email',
                    placeholder: 'jane@doe.com',
                },
            },
        },
        {
            '@type': '@builder.io/sdk:Element',
            responsiveStyles: {
                large: {
                    marginTop: '10px',
                },
            },
            component: {
                name: 'Form:SubmitButton',
                options: {
                    text: 'Submit',
                },
            },
        },
    ],
});
//# sourceMappingURL=Form.js.map