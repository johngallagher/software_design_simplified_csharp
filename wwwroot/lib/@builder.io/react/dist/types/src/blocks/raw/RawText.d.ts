import { BuilderElement } from '@builder.io/sdk';
export interface RawTextProps {
    attributes?: any;
    text?: string;
    builderBlock?: BuilderElement;
}
export declare const RawText: (props: RawTextProps) => JSX.Element;
