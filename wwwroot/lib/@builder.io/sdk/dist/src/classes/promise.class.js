"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TinyPromise = void 0;
var next_tick_function_1 = require("../functions/next-tick.function");
var State = {
    Pending: 'Pending',
    Fulfilled: 'Fulfilled',
    Rejected: 'Rejected',
};
function isFunction(val) {
    return val && typeof val === 'function';
}
function isObject(val) {
    return val && typeof val === 'object';
}
var TinyPromise = /** @class */ (function () {
    function TinyPromise(executor) {
        this._state = State.Pending;
        this._handlers = [];
        this._value = null;
        executor(this._resolve.bind(this), this._reject.bind(this));
    }
    TinyPromise.prototype._resolve = function (x) {
        var _this = this;
        if (x instanceof TinyPromise) {
            x.then(this._resolve.bind(this), this._reject.bind(this));
        }
        else if (isObject(x) || isFunction(x)) {
            var called_1 = false;
            try {
                var thenable = x.then;
                if (isFunction(thenable)) {
                    thenable.call(x, function (result) {
                        if (!called_1)
                            _this._resolve(result);
                        called_1 = true;
                        return undefined;
                    }, function (error) {
                        if (!called_1)
                            _this._reject(error);
                        called_1 = true;
                        return undefined;
                    });
                }
                else {
                    this._fulfill(x);
                }
            }
            catch (ex) {
                if (!called_1) {
                    this._reject(ex);
                }
            }
        }
        else {
            this._fulfill(x);
        }
    };
    TinyPromise.prototype._fulfill = function (result) {
        var _this = this;
        this._state = State.Fulfilled;
        this._value = result;
        this._handlers.forEach(function (handler) { return _this._callHandler(handler); });
    };
    TinyPromise.prototype._reject = function (error) {
        var _this = this;
        this._state = State.Rejected;
        this._value = error;
        this._handlers.forEach(function (handler) { return _this._callHandler(handler); });
    };
    TinyPromise.prototype._isPending = function () {
        return this._state === State.Pending;
    };
    TinyPromise.prototype._isFulfilled = function () {
        return this._state === State.Fulfilled;
    };
    TinyPromise.prototype._isRejected = function () {
        return this._state === State.Rejected;
    };
    TinyPromise.prototype._addHandler = function (onFulfilled, onRejected) {
        this._handlers.push({
            onFulfilled: onFulfilled,
            onRejected: onRejected,
        });
    };
    TinyPromise.prototype._callHandler = function (handler) {
        if (this._isFulfilled() && isFunction(handler.onFulfilled)) {
            handler.onFulfilled(this._value);
        }
        else if (this._isRejected() && isFunction(handler.onRejected)) {
            handler.onRejected(this._value);
        }
    };
    TinyPromise.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        switch (this._state) {
            case State.Pending: {
                return new TinyPromise(function (resolve, reject) {
                    _this._addHandler(function (value) {
                        (0, next_tick_function_1.nextTick)(function () {
                            try {
                                if (isFunction(onFulfilled)) {
                                    resolve(onFulfilled(value));
                                }
                                else {
                                    resolve(value);
                                }
                            }
                            catch (ex) {
                                reject(ex);
                            }
                        });
                    }, function (error) {
                        (0, next_tick_function_1.nextTick)(function () {
                            try {
                                if (isFunction(onRejected)) {
                                    resolve(onRejected(error));
                                }
                                else {
                                    reject(error);
                                }
                            }
                            catch (ex) {
                                reject(ex);
                            }
                        });
                    });
                });
            }
            case State.Fulfilled: {
                return new TinyPromise(function (resolve, reject) {
                    (0, next_tick_function_1.nextTick)(function () {
                        try {
                            if (isFunction(onFulfilled)) {
                                resolve(onFulfilled(_this._value));
                            }
                            else {
                                resolve(_this._value);
                            }
                        }
                        catch (ex) {
                            reject(ex);
                        }
                    });
                });
            }
            case State.Rejected: {
                return new TinyPromise(function (resolve, reject) {
                    (0, next_tick_function_1.nextTick)(function () {
                        try {
                            if (isFunction(onRejected)) {
                                resolve(onRejected(_this._value));
                            }
                            else {
                                reject(_this._value);
                            }
                        }
                        catch (ex) {
                            reject(ex);
                        }
                    });
                });
            }
        }
    };
    return TinyPromise;
}());
exports.TinyPromise = TinyPromise;
exports.default = (typeof Promise !== 'undefined' ? Promise : TinyPromise);
//# sourceMappingURL=promise.class.js.map