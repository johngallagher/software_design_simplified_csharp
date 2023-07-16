export type Options = {
    root: Element;
    idName: (name: string) => boolean;
    className: (name: string) => boolean;
    tagName: (name: string) => boolean;
    seedMinLength: number;
    optimizedMinLength: number;
    threshold: number;
};
export default function (input: Element, options?: Partial<Options>): string;
