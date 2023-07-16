export interface SimplifiedFetchOptions {
    body?: string;
    headers?: {
        [key: string]: string;
    };
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    credentials?: 'include';
    mode?: RequestMode;
}
export interface SimpleFetchResponse {
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
    clone: () => any;
    text: () => Promise<string>;
    json: () => Promise<any>;
    blob: () => Promise<Blob>;
    headers: {
        keys: () => string[];
        entries: () => [string, string][];
        get: (n: string) => string;
        has: (n: string) => boolean;
    };
}
declare function tinyFetch(url: string, options?: SimplifiedFetchOptions): Promise<SimpleFetchResponse>;
export declare function getFetch(): typeof fetch | typeof tinyFetch;
export {};
