"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
var get_top_level_domain_1 = require("../functions/get-top-level-domain");
var Cookies = /** @class */ (function () {
    function Cookies(request, response) {
        this.request = request;
        this.response = response;
    }
    Cookies.prototype.get = function (name) {
        var header = this.request.headers['cookie'];
        if (!header) {
            return;
        }
        var match = header.match(getPattern(name));
        if (!match) {
            return;
        }
        var value = match[1];
        return value;
    };
    Cookies.prototype.set = function (name, value, opts) {
        var res = this.response;
        var req = this.request;
        var headers = res.getHeader('Set-Cookie') || [];
        // TODO: just make this always true
        var secure = this.secure !== undefined
            ? !!this.secure
            : req.protocol === 'https' || req.connection.encrypted;
        var cookie = new Cookie(name, value, opts);
        if (typeof headers === 'string') {
            headers = [headers];
        }
        if (!secure && opts && opts.secure) {
            throw new Error('Cannot send secure cookie over unencrypted connection');
        }
        cookie.secure = secure;
        if (opts && 'secure' in opts) {
            cookie.secure = !!opts.secure;
        }
        cookie.domain = req.headers.host && (0, get_top_level_domain_1.getTopLevelDomain)(req.headers.host);
        pushCookie(headers, cookie);
        var setHeader = res.setHeader;
        setHeader.call(res, 'Set-Cookie', headers);
        return this;
    };
    return Cookies;
}());
var Cookie = /** @class */ (function () {
    function Cookie(name, value, attrs) {
        this.path = '/';
        this.domain = undefined;
        this.httpOnly = true;
        this.sameSite = false;
        this.secure = false;
        this.overwrite = false;
        this.name = '';
        this.value = '';
        if (!fieldContentRegExp.test(name)) {
            throw new TypeError('argument name is invalid');
        }
        if (value && !fieldContentRegExp.test(value)) {
            throw new TypeError('argument value is invalid');
        }
        if (!value) {
            this.expires = new Date(0);
        }
        this.name = name;
        this.value = value || '';
        if (attrs.expires) {
            this.expires = attrs.expires;
        }
        if (attrs.secure) {
            this.secure = attrs.secure;
        }
    }
    Cookie.prototype.toString = function () {
        return "".concat(this.name, "=").concat(this.value);
    };
    Cookie.prototype.toHeader = function () {
        var header = this.toString();
        if (this.maxAge) {
            this.expires = new Date(Date.now() + this.maxAge);
        }
        if (this.path) {
            header += "; path=".concat(this.path);
        }
        if (this.expires) {
            header += "; expires=".concat(this.expires.toUTCString());
        }
        if (this.domain) {
            header += "; domain=".concat(this.domain);
        }
        // TODO: samesite=none by default (?)
        header += "; SameSite=".concat(this.sameSite === true ? 'strict' : 'None');
        // TODO: On by default
        if (this.secure) {
            header += '; secure';
        }
        if (this.httpOnly) {
            header += '; httponly';
        }
        return header;
    };
    return Cookie;
}());
function getPattern(name) {
    return new RegExp("(?:^|;) *".concat(name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), "=([^;]*)"));
}
function pushCookie(headers, cookie) {
    if (cookie.overwrite) {
        for (var i = headers.length - 1; i >= 0; i--) {
            if (headers[i].indexOf("".concat(cookie.name, "=")) === 0) {
                headers.splice(i, 1);
            }
        }
    }
    headers.push(cookie.toHeader());
}
exports.default = Cookies;
//# sourceMappingURL=cookies.class.js.map