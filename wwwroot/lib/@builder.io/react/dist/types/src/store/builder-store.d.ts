import React from 'react';
export declare const BuilderStoreContext: React.Context<BuilderStore>;
export interface BuilderStore {
    state: any;
    rootState: any;
    content: any;
    context: any;
    update: (mutator: (state: any) => any) => any;
    renderLink?: (props: React.AnchorHTMLAttributes<any>) => React.ReactNode;
}
