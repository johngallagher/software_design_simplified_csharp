"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apply_patch_with_mutation_1 = require("./apply-patch-with-mutation");
describe('applyPatchWithMinimalMutationChain', function () {
    test('Basic shallow update', function () {
        var obj = {
            foo: 'bar',
        };
        var patch = {
            op: 'replace',
            path: '/foo',
            value: '60px',
        };
        var applied = (0, apply_patch_with_mutation_1.applyPatchWithMinimalMutationChain)(obj, patch);
        expect(applied.foo).toBe('60px');
        expect(applied).not.toBe(obj);
    });
    test('Deep object updates', function () {
        var obj = {
            foo: {
                bar: true,
            },
            baz: {},
        };
        var patch = {
            op: 'replace',
            path: '/foo/bar',
            value: '60px',
        };
        var applied = (0, apply_patch_with_mutation_1.applyPatchWithMinimalMutationChain)(obj, patch);
        expect(applied.foo.bar).toBe('60px');
        expect(applied).not.toBe(obj);
        expect(applied.foo).not.toBe(obj.foo);
        expect(applied.baz).toBe(obj.baz);
    });
    test('Deep array updates', function () {
        var obj = {
            foo: [{ bar: true }],
            baz: {},
        };
        var patch = {
            op: 'replace',
            path: '/foo/0/bar',
            value: '60px',
        };
        var applied = (0, apply_patch_with_mutation_1.applyPatchWithMinimalMutationChain)(obj, patch);
        expect(applied.foo[0].bar).toBe('60px');
        expect(applied).not.toBe(obj);
        expect(applied.foo).not.toBe(obj.foo);
        expect(applied.foo[0]).not.toBe(obj.foo[0]);
        expect(applied.baz).toBe(obj.baz);
    });
});
//# sourceMappingURL=apply-patch-with-mutation.test.js.map