export interface AnimationStep {
    styles: {
        [key: string]: string;
    };
    delay?: number;
}
export interface Animation {
    elementId: string;
    trigger: string;
    steps: AnimationStep[];
    duration: number;
    delay?: number;
    easing?: string;
    id?: string;
    repeat?: boolean;
    thresholdPercent?: number;
}
export declare class Animator {
    bindAnimations(animations: Animation[]): void;
    private warnElementNotPresent;
    private augmentAnimation;
    private getAllStylesUsed;
    triggerAnimation(animation: Animation): void;
    bindHoverAnimation(animation: Animation): void;
    bindScrollInViewAnimation(animation: Animation): void;
}
