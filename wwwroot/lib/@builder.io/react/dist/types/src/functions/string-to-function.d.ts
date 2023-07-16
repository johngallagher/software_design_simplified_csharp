import { Builder } from '@builder.io/sdk';
type BuilderEvanFunction = (state: object, event?: Event | undefined | null, block?: any, builder?: Builder, Device?: any, update?: Function | null, _Builder?: typeof Builder, context?: object) => any;
export declare const api: (state: any) => Builder;
export declare function stringToFunction(str: string, expression?: boolean, errors?: Error[], logs?: string[]): BuilderEvanFunction;
export {};
