/// <reference types="@types/node" />
/// <reference types="node" />
import React from 'react';
import { BuilderContent } from './builder-content.component';
import { Builder, GetContentOptions, Subscription, BehaviorSubject, BuilderElement, BuilderContent as Content } from '@builder.io/sdk';
import onChange from '../../lib/on-change';
export { onChange };
import { Breakpoints } from '../constants/device-sizes.constant';
import { Url } from 'url';
export interface BuilderComponentProps {
    /**
     * @package
     * @deprecated use {@link model} instead.
     * @hidden
     */
    modelName?: string;
    /**
     * Name of the model this is rendering content for. Default is "page".
     */
    model?: string;
    /**
     * @package
     * @deprecated use {@link model} instead.
     * @hidden
     */
    name?: string;
    /**
     * Data is passed along as `state.*` to the component.
     * @see {@link https://github.com/BuilderIO/builder/tree/master/packages/react#passing-data-and-functions-down}
     *
     * @example
     * ```
     * <BuilderComponent
     *  model="page"
     *  data={{
     *    products: productsList,
     *    myFunction: () => alert('Triggered!'),
     *    foo: 'bar'
     *  }} >
     * ```
     */
    data?: any;
    /**
     * Specific instance of Builder that should be used. You might use this for
     * server side rendering. It's generally not recommended except for very
     * advanced multi-tenant use cases.
     */
    builder?: Builder;
    /**
     * Content entry ID for this component to fetch client side
     */
    entry?: string;
    /**
     * @package
     *
     * Builder public API key.
     *
     * @see {@link builder.init()} for the preferred way of supplying your API key.
     */
    apiKey?: string;
    /**
     * @private
     * @hidden
     */
    codegen?: boolean;
    options?: GetContentOptions;
    /**
     * Function callback invoked with `data` and your content when it becomes
     * available.
     *
     * @see {@link https://github.com/BuilderIO/builder/tree/master/packages/react#passing-data-and-functions-down}
     */
    contentLoaded?: (data: any, content: Content) => void;
    /**
     * Instead of having Builder render a link for you with plain anchor
     * elements, use your own function. Useful when using Next.js, Gatsby, or
     * other client side routers' custom `<Link>` components.
     *
     * ## Notes
     *
     * This must be a function that returns JSX, not a component!
     *
     * ## Examples
     *
     * @see {@link https://github.com/BuilderIO/builder/blob/0f0bc1ca835335f99fc21efb20ff3c4836bc9f41/examples/next-js-builder-site/src/functions/render-link.tsx#L6}
     */
    renderLink?: (props: React.AnchorHTMLAttributes<any>) => React.ReactNode;
    /**
     * Callback to run if an error occurred while fetching content.
     */
    contentError?: (error: any) => void;
    /**
     * Manually specify what Builder content JSON object to render. @see {@link
     * https://github.com/BuilderIO/builder/tree/master/packages/react#passing-content-manually}
     */
    content?: Content;
    /**
     * @package
     * @hidden
     *
     * Location object that provides the current url, path, etc; for server side
     * rendering.
     */
    location?: Location | Url;
    /**
     * Callback to run when Builder state changes (e.g. state.foo = 'bar' in an
     * action)
     */
    onStateChange?: (newData: any) => void;
    /**
     * @package
     * @deprecated
     * @hidden
     */
    noAsync?: boolean;
    /**
     * @package
     * @hidden
     *
     * Flag to render email content (small differences in our render logic for
     * email support).
     */
    emailMode?: boolean;
    /**
     * @package
     * @hidden
     *
     * Flag to render amp content (small differences in our render logic for amp
     * support)
     */
    ampMode?: boolean;
    /**
     * @package
     * @hidden
     *
     * Render content in-line only (can't passed from the content prop) don't
     * fetch content from our API.
     */
    inlineContent?: boolean;
    /**
     * @package
     * @deprecated
     * @hidden
     */
    builderBlock?: BuilderElement;
    /**
     * @package
     * @deprecated
     * @hidden
     */
    dataOnly?: boolean;
    /**
     * @package
     * @deprecated
     * @hidden
     */
    hydrate?: boolean;
    /**
     * @package
     * @deprecated use {@link Builder.isStatic} instead
     * @hidden
     */
    isStatic?: boolean;
    /**
     * Object that will be available in actions and bindings.
     *
     * @see {@link https://github.com/BuilderIO/builder/tree/master/packages/react#passing-data-and-functions-down}
     */
    context?: any;
    /**
     * @deprecated
     * @hidden
     */
    url?: string;
    /**
     * @hidden
     * Set to true if this is not the root content component, for instance for symbols
     */
    isChild?: boolean;
    /**
     * Set to true to not call `event.stopPropagation()` in the editor to avoid
     * issues with client site routing triggering when editing in Builder, causing
     * navigation to other pages unintended
     */
    stopClickPropagationWhenEditing?: boolean;
    /**
     * Set to the current locale in your application if you want localized inputs to be auto-resolved, should match one of the locales keys in your space settings
     * Learn more about adding or removing locales [here](https://www.builder.io/c/docs/add-remove-locales)
     */
    locale?: string;
}
export interface BuilderComponentState {
    state: any;
    update: (state: any) => any;
    updates: number;
    context: any;
    key: number;
    breakpoints?: Breakpoints;
}
/**
 * Responsible for rendering Builder content of type: 'page' or 'section' to
 * react components. It will attempt to fetch content from the API based on
 * defined user attributes (URL path, device type, and any custom targeting you set using `builder.setUserAttributes`) unless a `BuilderContent`
 * object is provided to `props.content`
 *
 * Use it to mount content in desired location, enable editing in place when
 * previewed in the editor.
 *
 * Supports server-side-rendering when passed the content json as
 * `props.content`.
 */
export declare class BuilderComponent extends React.Component<BuilderComponentProps, BuilderComponentState> {
    static defaults: Pick<BuilderComponentProps, 'codegen'>;
    subscriptions: Subscription;
    onStateChange: BehaviorSubject<any, any>;
    asServer: boolean;
    contentRef: BuilderContent | null;
    styleRef: HTMLStyleElement | null;
    rootState: any;
    lastJsCode: string;
    lastHttpRequests: {
        [key: string]: string | undefined;
    };
    httpSubscriptionPerKey: {
        [key: string]: Subscription | undefined;
    };
    firstLoad: boolean;
    ref: HTMLElement | null;
    Component: any;
    get options(): {
        modelName?: string | undefined;
        model?: string | undefined;
        name?: string | undefined;
        data?: any;
        builder?: Builder | undefined;
        entry?: string | undefined;
        apiKey?: string | undefined;
        codegen?: boolean | undefined;
        options?: GetContentOptions | undefined;
        contentLoaded?: ((data: any, content: Content) => void) | undefined;
        renderLink?: ((props: React.AnchorHTMLAttributes<any>) => React.ReactNode) | undefined;
        contentError?: ((error: any) => void) | undefined;
        content?: Content | undefined;
        location?: Location | Url | undefined;
        onStateChange?: ((newData: any) => void) | undefined;
        noAsync?: boolean | undefined;
        emailMode?: boolean | undefined;
        ampMode?: boolean | undefined;
        inlineContent?: boolean | undefined;
        builderBlock?: BuilderElement | undefined;
        dataOnly?: boolean | undefined;
        hydrate?: boolean | undefined;
        isStatic?: boolean | undefined;
        context?: any;
        url?: string | undefined;
        isChild?: boolean | undefined;
        stopClickPropagationWhenEditing?: boolean | undefined;
        locale?: string | undefined;
        children?: React.ReactNode;
    };
    get name(): string | undefined;
    private _asyncRequests?;
    private _errors?;
    private _logs?;
    private sizes;
    get element(): HTMLElement | null;
    get inlinedContent(): Content | undefined;
    constructor(props: BuilderComponentProps);
    get builder(): Builder;
    getHtmlData(): any;
    get device(): "mobile" | "tablet" | "desktop";
    get locationState(): {
        path: any;
        query: {
            [key: string]: string;
        };
        search: any;
        host: any;
        hostname: any;
        pathname: any;
    };
    get deviceSizeState(): string;
    messageListener: (event: MessageEvent) => void;
    resizeFn: () => void;
    resizeListener: (this: any) => any;
    static renderInto(elementOrSelector: string | HTMLElement, props?: BuilderComponentProps, hydrate?: boolean, fresh?: boolean): void;
    mounted: boolean;
    componentDidMount(): void;
    updateState: (fn?: ((state: any) => void) | undefined) => void;
    get isPreviewing(): boolean;
    notifyStateChange(): void;
    processStateFromApi(state: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
    get location(): any;
    getCssFromFont(font: any, data?: any): string;
    componentWillUnmount(): void;
    getFontCss(data?: any): any;
    ensureFontsLoaded(data?: any): void;
    getCss(data?: any): any;
    get data(): any;
    componentDidUpdate(prevProps: BuilderComponentProps): void;
    checkStyles(data: any): void;
    reload(): void;
    get content(): Content | undefined;
    get externalState(): any;
    get useContent(): any;
    render(): JSX.Element;
    evalExpression(expression: string): string;
    handleRequest(propertyName: string, url: string): Promise<any>;
    unsubscribe(): void;
    handleBuilderRequest(propertyName: string, optionsString: string): void;
    onContentLoaded: (data: any, content: Content) => void;
}
