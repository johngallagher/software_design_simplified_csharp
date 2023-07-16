import { BuilderElement } from '@builder.io/sdk';
export interface RouterProps {
    model?: string;
    data?: string;
    content?: any;
    handleRouting?: boolean;
    builderBlock?: BuilderElement;
    preloadOnHover?: boolean;
    onRoute?: (routeEvent: RouteEvent) => void;
}
export interface RouteEvent {
    /**
     * Url being routed to
     */
    url: string;
    /**
     * Html anchor element the href is on that
     * caused the route
     */
    anchorNode: HTMLAnchorElement;
    /**
     * Has preventDefault() been called preventing
     * builder from routing to the clicked URL
     */
    defaultPrevented: boolean;
    /**
     * Prevents builder from handling routing for you to handle
     * yourself
     */
    preventDefault(): void;
}
export declare const Router: Function;
