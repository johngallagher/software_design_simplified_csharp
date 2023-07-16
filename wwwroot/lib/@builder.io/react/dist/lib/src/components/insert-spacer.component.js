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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertSpacer = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var sdk_1 = require("@builder.io/sdk");
var builder_store_1 = require("../store/builder-store");
var Growser = /** @class */ (function (_super) {
    __extends(Growser, _super);
    function Growser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            grow: false,
            show: false,
        };
        return _this;
    }
    Growser.prototype.componentDidMount = function () {
        var _this = this;
        // setTimeout needed?
        setTimeout(function () {
            _this.setState({
                grow: true,
            });
        });
    };
    Growser.prototype.render = function () {
        return ((0, core_1.jsx)("div", { className: (this.props.className || '') + ' ' + (this.state.grow ? 'builder__spacer__grow' : ''), css: {
                height: this.state.grow ? 30 : 0,
                opacity: this.state.grow ? 1 : 0,
            } }));
    };
    return Growser;
}(react_1.default.Component));
var InsertSpacer = /** @class */ (function (_super) {
    __extends(InsertSpacer, _super);
    function InsertSpacer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InsertSpacer.prototype.componentDidMount = function () {
        // TODO: only after grow
        // this.setState({
        //   grow: true
        // })
    };
    InsertSpacer.prototype.render = function () {
        var _this = this;
        if (!sdk_1.Builder.isEditing) {
            return null;
        }
        return ((0, core_1.jsx)(builder_store_1.BuilderStoreContext.Consumer, null, function (_a) {
            var state = _a.state;
            var spacer = state._spacer;
            if (!(spacer && spacer.subject === _this.props.id)) {
                return null;
            }
            if (['top', 'left'].indexOf(spacer.direction) > -1 && _this.props.position === 'after') {
                return null;
            }
            if (['bottom', 'right'].indexOf(spacer.direction) > -1 &&
                _this.props.position === 'before') {
                return null;
            }
            var isHorizontal = ['left', 'right'].indexOf(spacer.direction) > -1;
            if (isHorizontal) {
                return null;
            }
            return ((0, core_1.jsx)(Growser, { className: "builder__spacer", css: {
                    // width: 0,
                    width: '100%',
                    alignSelf: 'stretch',
                    backgroundColor: 'rgba(28, 151, 204, 0.2)',
                    pointerEvents: 'none',
                    borderRadius: 4,
                    transition: 'all 0.2s cubic-bezier(.37,.01,0,.98) !important',
                    border: '1px solid rgba(28, 151, 204, 0.4)',
                    // ...(this.state.grow && {
                    //   width: '100%',
                    //   height: 30
                    // })
                } }));
        }));
    };
    return InsertSpacer;
}(react_1.default.Component));
exports.InsertSpacer = InsertSpacer;
//# sourceMappingURL=insert-spacer.component.js.map