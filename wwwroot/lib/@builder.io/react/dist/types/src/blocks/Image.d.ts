import { BuilderElement } from '@builder.io/sdk';
import { Breakpoints } from '../constants/device-sizes.constant';
export declare function updateQueryParam(uri: string | undefined, key: string, value: string | number | boolean): string;
export declare function getSrcSet(url: string): string;
export declare const getSizes: (sizes: string, block: BuilderElement, contentBreakpoints?: Breakpoints) => string;
export declare const Image: Function;
