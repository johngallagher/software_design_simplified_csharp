"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryString = void 0;
var PROPERTY_NAME_DENY_LIST = Object.freeze(['__proto__', 'prototype', 'constructor']);
// TODO: unit tests
var QueryString = /** @class */ (function () {
    function QueryString() {
    }
    QueryString.parseDeep = function (queryString) {
        var obj = this.parse(queryString);
        return this.deepen(obj);
    };
    QueryString.stringifyDeep = function (obj) {
        var map = this.flatten(obj);
        return this.stringify(map);
    };
    QueryString.parse = function (queryString) {
        var query = {};
        var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            // TODO: node support?
            try {
                query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
            catch (error) {
                // Ignore malformed URI components
            }
        }
        return query;
    };
    QueryString.stringify = function (map) {
        var str = '';
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                var value = map[key];
                if (str) {
                    str += '&';
                }
                str += encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }
        }
        return str;
    };
    QueryString.deepen = function (map) {
        // FIXME; Should be type Tree = Record<string, string | Tree>
        // requires a typescript upgrade.
        var output = {};
        for (var k in map) {
            var t = output;
            var parts = k.split('.');
            var key = parts.pop();
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                assertAllowedPropertyName(part);
                t = t[part] = t[part] || {};
            }
            t[key] = map[k];
        }
        return output;
    };
    QueryString.flatten = function (obj, _current, _res) {
        if (_res === void 0) { _res = {}; }
        for (var key in obj) {
            var value = obj[key];
            var newKey = _current ? _current + '.' + key : key;
            if (value && typeof value === 'object') {
                this.flatten(value, newKey, _res);
            }
            else {
                _res[newKey] = value;
            }
        }
        return _res;
    };
    return QueryString;
}());
exports.QueryString = QueryString;
function assertAllowedPropertyName(name) {
    if (PROPERTY_NAME_DENY_LIST.indexOf(name) >= 0)
        throw new Error("Property name \"".concat(name, "\" is not allowed"));
}
//# sourceMappingURL=query-string.class.js.map