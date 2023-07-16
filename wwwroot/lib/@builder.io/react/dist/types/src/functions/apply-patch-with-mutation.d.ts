export declare const applyPatchWithMinimalMutationChain: <T extends object>(obj: T, patch: {
    path: string;
    op: 'add' | 'remove' | 'replace';
    value: any;
}, preserveRoot?: boolean) => T;
