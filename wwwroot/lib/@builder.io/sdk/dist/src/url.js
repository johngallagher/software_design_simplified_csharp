"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.emptyUrl = void 0;
function emptyUrl() {
    return {
        query: null,
        port: null,
        auth: null,
        hash: null,
        host: null,
        hostname: null,
        href: null,
        path: null,
        pathname: null,
        protocol: null,
        search: null,
        slashes: null,
    };
}
exports.emptyUrl = emptyUrl;
// Replacement for `url.parse` using `URL` global object that works with relative paths.
// Assumptions: this function operates in a NodeJS environment.
function parse(url) {
    var out = emptyUrl();
    var u;
    var pathOnly = url === '' || url[0] === '/';
    if (pathOnly) {
        u = new URL(url, 'http://0.0.0.0/');
        out.href = u.href;
        out.href = out.href.slice(14); // remove 'http://0.0.0.0/'
    }
    else {
        u = new URL(url);
        out.href = u.href;
        out.port = u.port === '' ? null : u.port;
        out.hash = u.hash === '' ? null : u.hash;
        out.host = u.host;
        out.hostname = u.hostname;
        out.href = u.href;
        out.pathname = u.pathname;
        out.protocol = u.protocol;
        out.slashes = url[u.protocol.length] === '/'; // check if the mimetype is proceeded by a slash
    }
    out.search = u.search;
    out.query = u.search.slice(1); // remove '?'
    out.path = "".concat(u.pathname).concat(u.search);
    out.pathname = u.pathname;
    return out;
}
exports.parse = parse;
//# sourceMappingURL=url.js.map