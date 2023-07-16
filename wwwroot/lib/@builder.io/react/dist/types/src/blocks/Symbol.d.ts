import { BuilderElement } from '@builder.io/sdk';
export interface SymbolInfo {
    model?: string;
    entry?: string;
    data?: any;
    content?: any;
    inline?: boolean;
    dynamic?: boolean;
}
export interface SymbolProps {
    symbol?: SymbolInfo;
    dataOnly?: boolean;
    dynamic?: boolean;
    builderBlock?: BuilderElement;
    attributes?: any;
    inheritState?: boolean;
}
export declare const Symbol: Function;
