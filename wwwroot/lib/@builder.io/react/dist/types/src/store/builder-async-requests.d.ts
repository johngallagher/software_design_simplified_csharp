import React from 'react';
export interface RequestInfo {
    promise: Promise<any>;
    url?: string;
}
export type RequestOrPromise = RequestInfo | Promise<any>;
export declare const isPromise: (thing: RequestOrPromise) => thing is Promise<any>;
export declare const isRequestInfo: (thing: RequestOrPromise) => thing is RequestInfo;
export declare const BuilderAsyncRequestsContext: React.Context<{
    requests: RequestOrPromise[];
    errors: Error[];
    logs: string[];
}>;
