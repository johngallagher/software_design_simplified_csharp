import React from 'react';
export interface SpacerProps {
    id: string;
    position: 'before' | 'after';
}
interface SpacerState {
    grow: boolean;
}
export declare class InsertSpacer extends React.Component<SpacerProps, SpacerState> {
    componentDidMount(): void;
    render(): JSX.Element | null;
}
export {};
