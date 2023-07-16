/// <reference types="@types/node" />
import './polyfills/custom-event-polyfill';
import { IncomingMessage, ServerResponse } from 'http';
import { nextTick } from './functions/next-tick.function';
import { BehaviorSubject } from './classes/observable.class';
import { throttle } from './functions/throttle.function';
import { Animator } from './classes/animator.class';
import { BuilderElement } from './types/element';
import Cookies from './classes/cookies.class';
import { BuilderContent } from './types/content';
import { ApiVersion } from './types/api-version';
export type Url = any;
export declare const isReactNative: boolean;
export declare const validEnvList: string[];
export declare const isBrowser: boolean;
export declare const isIframe: boolean;
export interface ParamsMap {
    [key: string]: any;
}
type TrackingHook = (eventData: Event, context: {
    content?: BuilderContent;
    [key: string]: any;
}) => Event | undefined;
interface EventData {
    contentId?: string;
    ownerId: string;
    variationId?: string;
    userAttributes?: any;
    targetSelector?: string;
    targetBuilderElement?: string;
    unique?: boolean;
    metadata?: any | string;
    meta?: any | string;
    sessionId?: string;
    visitorId?: string;
    amount?: number;
}
interface Event {
    type: string;
    data: EventData;
}
/**
 * Attributes that can be used for custom targeting. {@link
 * https://www.builder.io/c/docs/guides/targeting-and-scheduling}
 */
export interface UserAttributes {
    [key: string]: undefined | string | string[] | boolean | boolean[] | number | number[] | Record<string, any>;
    /**
     * URL path of the current user.
     */
    urlPath?: string;
    /**
     * @deprecated
     * @hidden
     */
    queryString?: string | ParamsMap;
    /**
     * @deprecated
     * @hidden
     */
    device?: 'mobile' | 'tablet' | 'desktop';
    /**
     * @deprecated
     * @hidden
     */
    location?: any;
    /**
     * @deprecated
     * @hidden
     */
    userAgent?: string;
    /**
     * @deprecated
     * @hidden
     */
    referrer?: string;
    /**
     * @deprecated
     * @hidden
     */
    entryMedium?: string;
    /**
     * @deprecated
     * @hidden
     */
    language?: string;
    /**
     * @deprecated
     * @hidden
     */
    browser?: string;
    /**
     * @deprecated
     * @hidden
     */
    cookie?: string;
    /**
     * @deprecated
     * @hidden
     */
    newVisitor?: boolean;
    /**
     * @deprecated
     * @hidden
     */
    operatingSystem?: string;
}
type AllowEnrich = {
    apiVersion?: Extract<ApiVersion, 'v1'>;
} | {
    apiVersion?: Extract<ApiVersion, 'v3'>;
    enrich?: boolean;
} | {
    apiVersion?: never;
    enrich?: boolean;
};
export type GetContentOptions = AllowEnrich & {
    /**
     * User attribute key value pairs to be used for targeting
     * https://www.builder.io/c/docs/custom-targeting-attributes
     *
     * e.g.
     * ```js
     * userAttributes: {
     *   urlPath: '/',
     *   returnVisitor: true,
     * }
     * ```
     */
    userAttributes?: UserAttributes;
    /**
     * Alias for userAttributes.urlPath except it can handle a full URL (optionally with host,
     * protocol, query, etc) and we will parse out the path.
     */
    url?: string;
    /**
     * @package
     */
    includeUrl?: boolean;
    /**
     * Follow references. If you use the `reference` field to pull in other content without this
     * enabled we will not fetch that content for the final response.
     * @deprecated use `enrich` instead
     */
    includeRefs?: boolean;
    /**
     * How long in seconds content should be cached for. Sets the max-age of the cache-control header
     * response header.
     *
     * Use a higher value for better performance, lower for content that will change more frequently
     *
     * @see {@link https://www.builder.io/c/docs/query-api#__next:~:text=%26includeRefs%3Dtrue-,cacheSeconds,-No}
     */
    cacheSeconds?: number;
    /**
     * Builder.io uses stale-while-revalidate caching at the CDN level. This means we always serve
     * from edge cache and update caches in the background for maximum possible performance. This also
     * means that the more frequently content is requested, the more fresh it will be. The longest we
     * will ever hold something in stale cache is 1 day by default, and you can set this to be shorter
     * yourself as well. We suggest keeping this high unless you have content that must change rapidly
     * and gets very little traffic.
     *
     * @see {@link https://www.fastly.com/blog/prevent-application-network-instability-serve-stale-content}
     */
    staleCacheSeconds?: number;
    /**
     * Maximum number of results to return. Defaults to `1`.
     */
    limit?: number;
    /**
     * Mongodb style query of your data. E.g.:
     *
     * ```js
     * query: {
     *  id: 'abc123',
     *  data: {
     *    myCustomField: { $gt: 20 },
     *  }
     * }
     * ```
     *
     * See more info on MongoDB's query operators and format.
     *
     * @see {@link https://docs.mongodb.com/manual/reference/operator/query/}
     */
    query?: any;
    /**
     * Bust through all caches. Not recommended for production (for performance),
     * but can be useful for development and static builds (so the static site has
     * fully fresh / up to date content)
     */
    cachebust?: boolean;
    /**
     * Convert any visual builder content to HTML.
     *
     * This will be on data.html of the response's content entry object json.
     */
    prerender?: boolean;
    /**
     * Extract any styles to a separate css property when generating HTML.
     */
    extractCss?: boolean;
    /**
     * Pagination results offset. Defaults to zero.
     */
    offset?: number;
    /**
     * @package
     *
     * `BuilderContent` to render instead of fetching.
     */
    initialContent?: any;
    /**
     * The name of the model to fetch content for.
     */
    model?: string;
    /**
     * Set to `false` to not cache responses when running on the client.
     */
    cache?: boolean;
    /**
     * Set to the current locale in your application if you want localized inputs to be auto-resolved, should match one of the locales keys in your space settings
     * Learn more about adding or removing locales [here](https://www.builder.io/c/docs/add-remove-locales)
     */
    locale?: string;
    /**
     * @package
     *
     * Indicate that the fetch request is for preview purposes.
     */
    preview?: boolean;
    /**
     * Specific content entry ID to fetch.
     */
    entry?: string;
    /**
     * @package
     * @deprecated
     * @hidden
     */
    alias?: string;
    fields?: string;
    /**
     * Omit only these fields.
     *
     * @example
     * ```
     * &omit=data.bigField,data.blocks
     * ```
     */
    omit?: string;
    key?: string;
    /**
     * @package
     *
     * Affects HTML generation for specific targets.
     */
    format?: 'amp' | 'email' | 'html' | 'react' | 'solid';
    /**
     * @deprecated
     * @hidden
     */
    noWrap?: true;
    /**
     * @package
     *
     * Specific string to use for cache busting. e.g. every time we generate
     * HTML we generate a rev (a revision ID) and we send that with each request
     * on the client, such that if we generate new server HTML we get a new rev
     * and we use that to bust the cache because even though the content ID may
     * be the same, it could be an updated version of this content that needs to
     * be fresh.
     */
    rev?: string;
    /**
     * @package
     *
     * Tell the API that when generating HTML to generate it in static mode for
     * a/b tests instead of the older way we did this
     */
    static?: boolean;
    /**
     * Additional query params of the Content API to send.
     */
    options?: {
        [key: string]: any;
    };
    /**
     * @package
     *
     * Don't listen to updates in the editor - this is useful for embedded
     * symbols so they don't accidentally listen to messages as you are editing
     * content thinking they should updates when they actually shouldn't.
     */
    noEditorUpdates?: boolean;
};
export type Class = {
    name?: string;
    new (...args: any[]): any;
};
interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    entries(): IterableIterator<[K, V]>;
    forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    set(key: K, value?: V): Map<K, V>;
    size: number;
    values(): IterableIterator<V>;
    [Symbol.iterator](): IterableIterator<[K, V]>;
}
/**
 * This is the interface for inputs in `Builder.registerComponent`
 *
 * ```js
 * Builder.registerComponent(MyComponent, {
 *   inputs: [{ name: 'title', type: 'text' }] // <- Input[]
 * })
 * ```
 *
 * Learn more about registering custom components [here](https://www.builder.io/c/docs/custom-react-components)
 */
export interface Input {
    /** This is the name of the component prop this input represents */
    name: string;
    /** A friendlier name to show in the UI if the component prop name is not ideal for end users */
    friendlyName?: string;
    /** @hidden @deprecated */
    description?: string;
    /** A default value to use */
    defaultValue?: any;
    /**
     * The type of input to use, such as 'text'
     *
     * See all available inputs [here](https://www.builder.io/c/docs/custom-react-components#input-types)
     * and you can create your own custom input types and associated editor UIs with [plugins](https://www.builder.io/c/docs/extending/plugins)
     */
    type: string;
    /** Is this input mandatory or not */
    required?: boolean;
    /** @hidden */
    autoFocus?: boolean;
    subFields?: Input[];
    /**
     * Additional text to render in the UI to give guidance on how to use this
     *
     * @example
     * ```js
     * helperText: 'Be sure to use a proper URL, starting with "https://"'
     * 111
     */
    helperText?: string;
    /** @hidden */
    allowedFileTypes?: string[];
    /** @hidden */
    imageHeight?: number;
    /** @hidden */
    imageWidth?: number;
    /** @hidden */
    mediaHeight?: number;
    /** @hidden */
    mediaWidth?: number;
    /** @hidden */
    hideFromUI?: boolean;
    /** @hidden */
    modelId?: string;
    /**
     * Number field type validation maximum accepted input
     */
    max?: number;
    /**
     * Number field type validation minimum accepted input
     */
    min?: number;
    /**
     * Number field type step size when using arrows
     */
    step?: number;
    /**
     * Set this to `true` to show the editor for this input when
     * children of this component are selected. This is useful for things
     * like Tabs, such that users may not always select the Tabs component
     * directly but will still be looking for how to add additional tabs
     */
    broadcast?: boolean;
    /**
     * Set this to `true` to show the editor for this input when
     * group locked parents of this component are selected. This is useful
     * to bubble up important inputs for locked groups, like text and images
     */
    bubble?: boolean;
    /**
     * Set this to `true` if you want this component to be translatable
     */
    localized?: boolean;
    /** @hidden */
    options?: {
        [key: string]: any;
    };
    /**
     * For "text" input type, specifying an enum will show a dropdown of options instead
     */
    enum?: string[] | {
        label: string;
        value: string | number | boolean;
        helperText?: string;
    }[];
    /** Regex field validation for all string types (text, longText, html, url, etc) */
    regex?: {
        /** pattern to test, like "^\/[a-z]$" */
        pattern: string;
        /** flags for the RegExp constructor, e.g. "gi"  */
        options?: string;
        /**
         * Friendly message to display to end-users if the regex fails, e.g.
         * "You must use a relative url starting with '/...' "
         */
        message: string;
    };
    /**
     * Set this to `true` to put this under the "show more" section of
     * the options editor. Useful for things that are more advanced
     * or more rarely used and don't need to be too prominent
     */
    advanced?: boolean;
    /** @hidden */
    onChange?: Function | string;
    /** @hidden */
    code?: boolean;
    /** @hidden */
    richText?: boolean;
    /** @hidden */
    showIf?: ((options: Map<string, any>) => boolean) | string;
    /** @hidden */
    copyOnAdd?: boolean;
    /**
     * Use optionally with inputs of type `reference`. Restricts the content entry picker to a specific model by name.
     */
    model?: string;
}
/**
 * This is the interface for the options for `Builder.registerComponent`
 *
 * ```js
 * Builder.registerComponent(YourComponent, {
 *  // <- Component options
 * })
 * ```
 *
 * Learn more about registering custom components [here](https://www.builder.io/c/docs/custom-react-components)
 */
export interface Component {
    /**
     * Name your component something unique, e.g. 'MyButton'. You can override built-in components
     * by registering a component with the same name, e.g. 'Text', to replace the built-in text component
     */
    name: string;
    /** @hidden @deprecated */
    description?: string;
    /**
     * Link to a documentation page for this component
     */
    docsLink?: string;
    /**
     * Link to an image to be used as an icon for this component in Builder's editor
     *
     * @example
     * ```js
     * image: 'https://some-cdn.com/my-icon-for-this-component.png'
     * ```
     */
    image?: string;
    /**
     * Link to a screenshot shown when user hovers over the component in Builder's editor
     * use https://builder.io/upload to upload your screeshot, for easier resizing by Builder.
     */
    screenshot?: string;
    /**
     * When overriding built-in components, if you don't want any special behavior that
     * the original has, set this to `true` to skip the default behavior
     *
     * Default behaviors include special "virtual options", such as a custom
     * aspect ratio editor for Images, or a special column editor for Columns
     *
     * Learn more about overriding built-in components here: https://www.builder.io/c/docs/custom-components-overriding
     */
    override?: boolean;
    /**
     * Input schema for your component for users to fill in the options via a UI
     * that translate to this components props
     */
    inputs?: Input[];
    /** @hidden @deprecated */
    class?: any;
    /** @hidden @deprecated */
    type?: 'angular' | 'webcomponent' | 'react' | 'vue';
    /**
     * Default styles to apply when droppged into the Builder.io editor
     *
     * @example
     * ```js
     * defaultStyles: {
     *   // large (default) breakpoint
     *   large: {
     *     backgroundColor: 'black'
     *   },
     * }
     * ```
     */
    defaultStyles?: {
        [key: string]: string;
    };
    /**
     * Turn on if your component can accept children. Be sure to use in combination with
     * withChildren(YourComponent) like here
     * github.com/BuilderIO/builder/blob/master/examples/react-design-system/src/components/HeroWithChildren/HeroWithChildren.builder.js#L5
     */
    canHaveChildren?: boolean;
    /** @hidden */
    fragment?: boolean;
    /**
     * Do not wrap a component in a dom element. Be sure to use {...props.attributes} with this option
     * like here github.com/BuilderIO/builder/blob/master/packages/react/src/blocks/forms/Input.tsx#L34
     */
    noWrap?: boolean;
    /**
     * Default children
     */
    defaultChildren?: BuilderElement[];
    /**
     * Default options to merge in when creating this block
     */
    defaults?: Partial<BuilderElement>;
    /** @hidden @deprecated */
    hooks?: {
        [key: string]: string | Function;
    };
    /**
     * Hide your component in editor, useful for gradually deprecating components
     */
    hideFromInsertMenu?: boolean;
    /** Custom tag name (for custom webcomponents only) */
    tag?: string;
    /** @hidden @deprecated */
    static?: boolean;
    /**
     * Passing a list of model names will restrict using the component to only the models listed here, otherwise it'll be available for all models
     */
    models?: string[];
    /**
     * Specify restrictions direct children must match
     */
    childRequirements?: {
        /** Message to show when this doesn't match, e.g. "Children of 'Columns' must be a 'Column'" */
        message: string;
        /** Simple way to say children must be a specific component name */
        component?: string;
        /**
         * More advanced - specify a MongoDB-style query (using sift.js github.com/crcn/sift.js)
         * of what the children objects should match, e.g.
         *
         * @example
         *  query: {
         *    // Child of this element must be a 'Button' or 'Text' component
         *    'component.name': { $in: ['Button', 'Text'] }
         *  }
         */
        query?: any;
    };
    /**
     * Specify restrictions any parent must match
     */
    requiresParent?: {
        /** Message to show when this doesn't match, e.g. "'Add to cart' buttons must be within a 'Product box'" */
        message: string;
        /** Simple way to say a parent must be a specific component name, e.g. 'Product box' */
        component?: string;
        /**
         * More advanced - specify a MongoDB-style query (using sift.js github.com/crcn/sift.js)
         * of what at least one parent in the parents hierarchy should match, e.g.
         *
         * @example
         *  query: {
         *    // Thils element must be somewhere inside either a 'Product box' or 'Collection' component
         *    'component.name': { $in: ['Product Box', 'Collection'] }
         *  }
         */
        query?: any;
    };
    /** @hidden @deprecated */
    friendlyName?: string;
    /**
     * Use to restrict access to your component based on a the current user permissions
     * By default components will show to all users
     * for more information on permissions in builder check https://www.builder.io/c/docs/guides/roles-and-permissions
     */
    requiredPermissions?: Array<Permission>;
}
type Permission = 'read' | 'publish' | 'editCode' | 'editDesigns' | 'admin' | 'create';
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]>;
};
export interface InsertMenuItem {
    name: string;
    icon?: string;
    item: DeepPartial<BuilderElement>;
}
/**
 * Use this to register custom sections in the Insert menu, for instance
 * to make new sections to organize your custom components
 *
 * ![Example of what a custom section looks like](https://cdn.builder.io/api/v1/image/assets%2F7f7bbcf72a1a4d72bac5daa359e7befd%2Fe5f2792e9c0f44ed89a9dcb77b945858)
 *
 * @example
 * ```js
 * Builder.register('insertMenu', {
 *   name: 'Our components',
 *   items: [
 *     { name: 'Hero' },
 *     { name: 'Double Columns' },
 *     { name: 'Triple Columns' },
 *     { name: 'Dynamic Columns' },
 *   ],
 * })
 * ```
 *
 * You can make as many custom sections as you like
 *
 * See a complete usage example [here](https://github.com/builderio/builder/blob/main/examples/react-design-system/src/builder-settings.js)
 */
export interface InsertMenuConfig {
    name: string;
    priority?: number;
    persist?: boolean;
    advanced?: boolean;
    items: InsertMenuItem[];
}
export declare function BuilderComponent(info?: Partial<Component>): (component: Class) => Class;
type Settings = any;
export interface Action {
    name: string;
    inputs?: Input[];
    returnType?: Input;
    action: Function | string;
}
export declare class Builder {
    protected request?: IncomingMessage | undefined;
    protected response?: ServerResponse | undefined;
    /**
     * @hidden
     * @deprecated. This is buggy, and always behind by a version.
     */
    static VERSION: string;
    static components: Component[];
    static singletonInstance: Builder;
    /**
     * Makes it so that a/b tests generate code like {@link
     * https://www.builder.io/blog/high-performance-no-code#__next:~:text=Static%20generated%20A%2FB%20testing}
     * instead of the old way where we render only one test group at a time on the
     * server. This is the preferred/better way not and we should ultimately make it
     * the default
     */
    static isStatic: boolean;
    static animator: Animator;
    static nextTick: typeof nextTick;
    static throttle: typeof throttle;
    static editors: any[];
    static trustedHosts: string[];
    static plugins: any[];
    static actions: Action[];
    static registry: {
        [key: string]: any[];
    };
    static overrideHost: string | undefined;
    /**
     * @todo `key` property on any info where if a key matches a current
     * key it gets removed
     */
    static register(type: 'insertMenu', info: InsertMenuConfig): void;
    static register(type: string, info: any): void;
    static registryChange: BehaviorSubject<{
        [key: string]: any[];
    }, any>;
    static registerEditor(info: any): void;
    static registerPlugin(info: any): void;
    static registerAction(action: Action): void;
    static registerTrustedHost(host: string): void;
    static isTrustedHost(hostname: string): boolean;
    static runAction(action: Action | string): void;
    static fields(name: string, fields: Input[]): void;
    private static _editingPage;
    static isIframe: boolean;
    static isBrowser: boolean;
    static isReactNative: boolean;
    static isServer: boolean;
    static previewingModel: string | false | null;
    static settings: Settings;
    static settingsChange: BehaviorSubject<any, any>;
    /**
     * @deprecated
     * @hidden
     *
     * Use Builder.register('editor.settings', {}) instead.
     */
    static set(settings: Settings): void;
    static import(packageName: string): any;
    static isEditing: boolean;
    static isPreviewing: boolean;
    static get editingPage(): boolean;
    static set editingPage(editingPage: boolean);
    private static prepareComponentSpecToSend;
    static registerBlock(component: any, options: Component): void;
    static registerComponent(component: any, options: Component): void;
    private static addComponent;
    static component(info?: Partial<Component>): (component: Class) => Class;
    static isReact: boolean;
    static get Component(): typeof Builder.component;
    private eventsQueue;
    private throttledClearEventsQueue;
    private processEventsQueue;
    env: string;
    sessionId: string;
    targetContent: boolean;
    contentPerRequest: number;
    allowCustomFonts: boolean;
    private cookies;
    private cachebust;
    private overrideParams;
    private noCache;
    private preview;
    get browserTrackingDisabled(): boolean;
    get canTrack(): boolean;
    set canTrack(canTrack: boolean);
    get apiVersion(): ApiVersion | undefined;
    set apiVersion(apiVersion: ApiVersion | undefined);
    private apiVersion$;
    private canTrack$;
    private apiKey$;
    private authToken$;
    userAttributesChanged: BehaviorSubject<any, any>;
    get editingMode(): boolean;
    set editingMode(value: boolean);
    editingMode$: BehaviorSubject<boolean, any>;
    get editingModel(): string | null;
    set editingModel(value: string | null);
    private findParentElement;
    private findBuilderParent;
    editingModel$: BehaviorSubject<string | null, any>;
    setUserAgent(userAgent: string): void;
    userAgent: string;
    trackingHooks: TrackingHook[];
    /**
     * Set a hook to modify events being tracked from builder, such as impressions and clicks
     *
     * For example, to track the model ID of each event associated with content for querying
     * by mode, you can do
     *
     *    builder.setTrackingHook((event, context) => {
     *      if (context.content) {
     *        event.data.metadata.modelId = context.content.modelId
     *      }
     *    })
     */
    setTrackingHook(hook: TrackingHook): void;
    track(eventName: string, properties?: Partial<EventData>, context?: any): void;
    getSessionId(): string;
    visitorId: string;
    getVisitorId(): string;
    trackImpression(contentId: string, variationId?: string, properties?: any, context?: any): void;
    trackConversion(amount?: number, customProperties?: any): void;
    autoTrack: boolean;
    private get isDevelopmentEnv();
    trackInteraction(contentId: string, variationId?: string, alreadyTrackedOne?: boolean, event?: MouseEvent, context?: any): void;
    static overrideUserAttributes: Partial<UserAttributes>;
    trackingUserAttributes: {
        [key: string]: any;
    };
    component(info?: Partial<Component>): (component: Class) => Class;
    get apiKey(): string | null;
    set apiKey(key: string | null);
    get authToken(): string | null;
    set authToken(token: string | null);
    constructor(apiKey?: string | null, request?: IncomingMessage | undefined, response?: ServerResponse | undefined, forceNewInstance?: boolean, authToken?: string | null, apiVersion?: ApiVersion);
    private modifySearch;
    setTestsFromUrl(): void;
    resetOverrides(): void;
    getOverridesFromQueryString(): void;
    private messageFrameLoaded;
    private blockContentLoading;
    private bindMessageListeners;
    observersByKey: {
        [key: string]: BehaviorSubject<BuilderContent[]> | undefined;
    };
    noEditorUpdates: {
        [key: string]: boolean;
    };
    get defaultCanTrack(): boolean;
    init(apiKey: string, canTrack?: boolean, req?: IncomingMessage, res?: ServerResponse, authToken?: string | null, apiVersion?: ApiVersion): this;
    get previewingModel(): string;
    getLocation(): Url;
    getUserAttributes(userAgent?: string): UserAttributes;
    protected overrides: {
        [key: string]: string;
    };
    protected queryOptions: {
        [key: string]: string;
    };
    private getContentQueue;
    private priorContentQueue;
    setUserAttributes(options: object): void;
    /**
     * Set user attributes just for tracking purposes.
     *
     * Do this so properties exist on event objects for querying insights, but
     * won't affect targeting
     *
     * Use this when you want to track properties but don't need to target off
     * of them to optimize cache efficiency
     */
    setTrackingUserAttributes(attributes: object): void;
    get(modelName: string, options?: GetContentOptions & {
        req?: IncomingMessage;
        res?: ServerResponse;
        apiKey?: string;
        authToken?: string;
    }): BehaviorSubject<any, any>;
    queueGetContent(modelName: string, options?: GetContentOptions): BehaviorSubject<BuilderContent[], any>;
    requestUrl(url: string, options?: {
        headers: {
            [header: string]: number | string | string[] | undefined;
        };
    }): Promise<any>;
    get host(): string;
    private flushGetContentQueue;
    private testCookiePrefix;
    private processResultsForTests;
    private getTestCookie;
    private cookieQueue;
    private setTestCookie;
    getCookie(name: string): any;
    setCookie(name: string, value: any, expires?: Date): false | void | Cookies;
    getContent(modelName: string, options?: GetContentOptions): BehaviorSubject<BuilderContent[], any>;
    getAll(modelName: string, options?: GetContentOptions & {
        req?: IncomingMessage;
        res?: ServerResponse;
        apiKey?: string;
    }): Promise<BuilderContent[]>;
}
export {};
