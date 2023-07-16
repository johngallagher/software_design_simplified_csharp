import { BuilderElement } from '@builder.io/sdk';
type MutationProps = {
    selector: string;
    builderBlock?: BuilderElement;
    type?: 'replace' | 'afterEnd';
};
export declare function Mutation(props: MutationProps): JSX.Element;
export {};
