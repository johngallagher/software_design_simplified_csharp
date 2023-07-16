/** @jsx jsx */
import { Builder, BuilderElement } from '@builder.io/sdk';
import React from 'react';
import { Size } from '../constants/device-sizes.constant';
export interface BuilderBlockProps {
    fieldName?: string;
    block: BuilderElement;
    child?: boolean;
    index?: number;
    size?: Size;
    emailMode?: boolean;
}
interface BuilderBlockState {
    state: any;
    rootState: any;
    context: any;
    update: Function;
}
export declare class BuilderBlock extends React.Component<BuilderBlockProps, {
    hasError: boolean;
    updates: number;
}> {
    private _asyncRequests?;
    private _errors?;
    private _logs?;
    state: {
        hasError: boolean;
        updates: number;
    };
    private privateState;
    get store(): BuilderBlockState;
    static getDerivedStateFromError(error: any): {
        hasError: boolean;
    };
    componentDidCatch(error: any, errorInfo: any): void;
    stringToFunction(str: string, expression?: boolean): (state: object, event?: Event | null | undefined, block?: any, builder?: Builder | undefined, Device?: any, update?: Function | null | undefined, _Builder?: typeof Builder | undefined, context?: object | undefined) => any;
    get block(): BuilderElement;
    get emotionCss(): any;
    eval(str: string): any;
    componentWillUnmount(): void;
    onWindowMessage: (event: MessageEvent) => void;
    componentDidMount(): void;
    getElement(index?: number, state?: any): React.ReactNode;
    get id(): string;
    contents(state: BuilderBlockState): React.ReactNode;
    render(): JSX.Element;
}
export {};
