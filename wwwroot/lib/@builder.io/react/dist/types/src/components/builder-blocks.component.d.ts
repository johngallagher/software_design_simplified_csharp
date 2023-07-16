import React from 'react';
import { Size } from '../constants/device-sizes.constant';
export interface BuilderBlocksProps {
    fieldName?: string;
    blocks?: any[] | React.ReactNode;
    child?: boolean;
    size?: Size;
    style?: React.CSSProperties;
    parentElementId?: string;
    parent?: any;
    dataPath?: string;
    className?: string;
    emailMode?: boolean;
}
interface BuilderBlocksState {
}
export declare class BuilderBlocks extends React.Component<BuilderBlocksProps, BuilderBlocksState> {
    get isRoot(): boolean;
    get noBlocks(): boolean;
    get path(): string;
    get parentId(): any;
    onClickEmptyBlocks: () => void;
    onHoverEmptyBlocks: () => void;
    render(): JSX.Element;
    static renderInto(elementOrSelector: string | HTMLElement, props: BuilderBlocksProps | undefined, builderState: any): void;
}
export {};
