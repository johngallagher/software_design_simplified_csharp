export type Size = 'large' | 'medium' | 'small' | 'xsmall';
export declare const sizeNames: Size[];
declare const sizes: {
    xsmall: {
        min: number;
        default: number;
        max: number;
    };
    small: {
        min: number;
        default: number;
        max: number;
    };
    medium: {
        min: number;
        default: number;
        max: number;
    };
    large: {
        min: number;
        default: number;
        max: number;
    };
    getWidthForSize(size: Size): number;
    getSizeForWidth(width: number): Size;
};
export type Sizes = typeof sizes;
export interface Breakpoints {
    small?: number;
    medium?: number;
}
export declare const getSizesForBreakpoints: ({ small, medium }: Breakpoints) => {
    xsmall: {
        min: number;
        default: number;
        max: number;
    };
    small: {
        min: number;
        default: number;
        max: number;
    };
    medium: {
        min: number;
        default: number;
        max: number;
    };
    large: {
        min: number;
        default: number;
        max: number;
    };
    getWidthForSize(size: Size): number;
    getSizeForWidth(width: number): Size;
};
export {};
