"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var query_string_class_1 = require("./query-string.class");
test.each([
    // prettier-ignore
    ['__proto__.foo.baz=1'],
    ['prototype.foo=1'],
])('(regression) prototype pollution %#', function (input) {
    expect(function () {
        query_string_class_1.QueryString.parseDeep(input);
    }).toThrowError(/Property name \".*\" is not allowed/);
    var pollutedObject = {};
    expect(pollutedObject.foo).toBeUndefined();
});
describe('.parseDeep', function () {
    test('input string may be prefixed with a question mark', function () {
        var result = query_string_class_1.QueryString.parseDeep('?foo=1');
        expect(result).toEqual({ foo: '1' });
    });
    test('converts the paths to a single object', function () {
        var result = query_string_class_1.QueryString.parseDeep('foo.bar.baz=1&foo.boo=2');
        expect(result).toEqual({ foo: { bar: { baz: '1' }, boo: '2' } });
    });
});
//# sourceMappingURL=query-string.class.test.js.map