"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("./url");
var url_2 = require("url");
describe('.parse', function () {
    test('can parse a full url', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            expect((0, url_1.parse)('http://example.com/foo/bar?q=1')).toEqual({
                auth: null,
                hash: null,
                host: 'example.com',
                hostname: 'example.com',
                href: 'http://example.com/foo/bar?q=1',
                path: '/foo/bar?q=1',
                pathname: '/foo/bar',
                port: null,
                protocol: 'http:',
                query: 'q=1',
                search: '?q=1',
                slashes: true,
            });
            return [2 /*return*/];
        });
    }); });
    test('can parse a path', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            expect((0, url_1.parse)('/foo/bar?q=1')).toEqual({
                auth: null,
                hash: null,
                host: null,
                hostname: null,
                href: '/foo/bar?q=1',
                path: '/foo/bar?q=1',
                pathname: '/foo/bar',
                port: null,
                protocol: null,
                query: 'q=1',
                search: '?q=1',
                slashes: null,
            });
            return [2 /*return*/];
        });
    }); });
    test('can parse a url that is missing slashes', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            expect((0, url_1.parse)('http:example.com/foo/bar?q=1')).toEqual({
                auth: null,
                hash: null,
                host: 'example.com',
                hostname: 'example.com',
                href: 'http://example.com/foo/bar?q=1',
                path: '/foo/bar?q=1',
                pathname: '/foo/bar',
                port: null,
                protocol: 'http:',
                query: 'q=1',
                search: '?q=1',
                slashes: false,
            });
            return [2 /*return*/];
        });
    }); });
    describe('behaves the same as the old query function', function () {
        describe.each([{ url: '/foo/bar?a=1&b=2' }, { url: 'http://example.com/foo/bar?a=1&b=2' }])('with url `$url`', function (_a) {
            var url = _a.url;
            var expected = Object.assign({}, (0, url_2.parse)(url));
            var actual = (0, url_1.parse)(url);
            test.each([
                { prop: 'query' },
                { prop: 'port' },
                { prop: 'auth' },
                { prop: 'hash' },
                { prop: 'host' },
                { prop: 'hostname' },
                { prop: 'href' },
                { prop: 'path' },
                { prop: 'pathname' },
                { prop: 'protocol' },
                { prop: 'search' },
                { prop: 'slashes' },
            ])('`$prop` is the same', function (_a) {
                var prop = _a.prop;
                return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        expect(actual[prop]).toEqual(expected[prop]);
                        return [2 /*return*/];
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=url.test.js.map