import * as React from 'react';
import { BuilderContent } from '@builder.io/sdk';
interface VariantsProviderProps {
    initialContent: BuilderContent;
    children: (variants: BuilderContent[], renderScript?: () => JSX.Element) => JSX.Element;
}
export declare const VariantsProvider: React.SFC<VariantsProviderProps>;
export {};
