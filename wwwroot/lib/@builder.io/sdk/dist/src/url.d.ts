/// <reference types="@types/node" />
import { UrlWithStringQuery } from 'url';
type Fix<T> = {
    [P in keyof T]: T[P] | null;
};
export type UrlLike = Fix<UrlWithStringQuery>;
export declare function emptyUrl(): UrlLike;
export declare function parse(url: string): UrlLike;
export {};
