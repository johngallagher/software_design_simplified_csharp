"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = exports.Observer = exports.BehaviorSubject = exports.Subscription = void 0;
var Subscription = /** @class */ (function () {
    function Subscription(listeners, listener) {
        this.listeners = listeners;
        this.listener = listener;
        this.unsubscribed = false;
        this.otherSubscriptions = [];
    }
    Object.defineProperty(Subscription.prototype, "closed", {
        get: function () {
            return this.unsubscribed;
        },
        enumerable: false,
        configurable: true
    });
    Subscription.prototype.add = function (subscription) {
        this.otherSubscriptions.push(subscription);
    };
    Subscription.prototype.unsubscribe = function () {
        if (this.unsubscribed) {
            return;
        }
        if (this.listener && this.listeners) {
            var index = this.listeners.indexOf(this.listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        }
        this.otherSubscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        this.unsubscribed = true;
    };
    return Subscription;
}());
exports.Subscription = Subscription;
// TODO: follow minimal basic spec: https://github.com/tc39/proposal-observable
var BehaviorSubject = /** @class */ (function () {
    function BehaviorSubject(value) {
        this.value = value;
        this.listeners = [];
        this.errorListeners = [];
    }
    BehaviorSubject.prototype.next = function (value) {
        this.value = value;
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(value);
        }
    };
    // TODO: implement this as PIPE instead
    BehaviorSubject.prototype.map = function (fn) {
        var newSubject = new BehaviorSubject(fn(this.value));
        // TODO: on destroy delete these
        this.subscribe(function (val) {
            newSubject.next(fn(val));
        });
        this.catch(function (err) {
            newSubject.error(err);
        });
        return newSubject;
    };
    BehaviorSubject.prototype.catch = function (errorListener) {
        this.errorListeners.push(errorListener);
        return new Subscription(this.errorListeners, errorListener);
    };
    BehaviorSubject.prototype.error = function (error) {
        for (var _i = 0, _a = this.errorListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(error);
        }
    };
    BehaviorSubject.prototype.subscribe = function (listener, errorListener) {
        this.listeners.push(listener);
        if (errorListener) {
            this.errorListeners.push(errorListener);
        }
        return new Subscription(this.listeners, listener);
    };
    BehaviorSubject.prototype.toPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var subscription = _this.subscribe(function (value) {
                resolve(value);
                subscription.unsubscribe();
            }, function (err) {
                reject(err);
                subscription.unsubscribe();
            });
        });
    };
    BehaviorSubject.prototype.promise = function () {
        return this.toPromise();
    };
    return BehaviorSubject;
}());
exports.BehaviorSubject = BehaviorSubject;
// TODO: make different classes
exports.Observer = BehaviorSubject;
exports.Observable = BehaviorSubject;
//# sourceMappingURL=observable.class.js.map