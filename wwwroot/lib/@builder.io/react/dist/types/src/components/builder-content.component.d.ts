import React from 'react';
import { Subscription, GetContentOptions, Builder, BuilderContent as Content } from '@builder.io/sdk';
export type BuilderContentProps<ContentType> = {
    /**
     * Callback to run when content is fetched and loaded.
     */
    contentLoaded?: (data: any, content: any) => void;
    /**
     * Callback to run if an error occurred while fetching content.
     */
    contentError?: (error: any) => void;
    options?: GetContentOptions;
    children: (content: ContentType, loading?: boolean, fullData?: any) => React.ReactNode;
    /**
     * Only render what was explicitly passed in via `content` - don't fetch from
     * the Builder API.
     *
     * @see content
     */
    inline?: boolean;
    /**
     * @package
     * @deprecated
     */
    dataOnly?: boolean;
    /**
     * @package
     * Pass in a specific builder instance to use instead of the default
     * singleton.
     */
    builder?: Builder;
    /**
     * @deprecated and unnecessary
     */
    isStatic?: boolean;
    /**
     * Builder content object to use instead of fetching from the API.
     *
     * Required if `inline` is set to `true`.
     */
    content?: Content;
} & ({
    model: string;
} | {
    modelName: string;
});
/**
 * When passed content json explicitly it'll calculate a/b tests on the content
 * and pass the winning variation down to the children function. If then content
 * prop was omitted it'll try to fetch matching content from your Builder
 * account based on the default user attributes and model.
 */
export declare class BuilderContent<ContentType extends object = any> extends React.Component<BuilderContentProps<ContentType>> {
    ref: HTMLDivElement | null;
    get builder(): Builder;
    get name(): string;
    get renderedVariantId(): any;
    get options(): {
        apiVersion?: "v1" | undefined;
        userAttributes?: import("@builder.io/sdk/dist/src/builder.class").UserAttributes | undefined;
        url?: string | undefined;
        includeUrl?: boolean | undefined;
        includeRefs?: boolean | undefined;
        cacheSeconds?: number | undefined;
        staleCacheSeconds?: number | undefined;
        limit?: number | undefined;
        query?: any;
        cachebust?: boolean | undefined;
        prerender?: boolean | undefined;
        extractCss?: boolean | undefined;
        offset?: number | undefined;
        initialContent?: any;
        model?: string | undefined;
        cache?: boolean | undefined;
        locale?: string | undefined;
        preview?: boolean | undefined;
        entry?: string | undefined;
        alias?: string | undefined;
        fields?: string | undefined;
        omit?: string | undefined;
        key?: string | undefined;
        format?: "react" | "html" | "email" | "solid" | "amp" | undefined;
        noWrap?: true | undefined;
        rev?: string | undefined;
        static?: boolean | undefined;
        options?: {
            [key: string]: any;
        } | undefined;
        noEditorUpdates?: boolean | undefined;
    } | {
        apiVersion?: "v3" | undefined;
        enrich?: boolean | undefined;
        userAttributes?: import("@builder.io/sdk/dist/src/builder.class").UserAttributes | undefined;
        url?: string | undefined;
        includeUrl?: boolean | undefined;
        includeRefs?: boolean | undefined;
        cacheSeconds?: number | undefined;
        staleCacheSeconds?: number | undefined;
        limit?: number | undefined;
        query?: any;
        cachebust?: boolean | undefined;
        prerender?: boolean | undefined;
        extractCss?: boolean | undefined;
        offset?: number | undefined;
        initialContent?: any;
        model?: string | undefined;
        cache?: boolean | undefined;
        locale?: string | undefined;
        preview?: boolean | undefined;
        entry?: string | undefined;
        alias?: string | undefined;
        fields?: string | undefined;
        omit?: string | undefined;
        key?: string | undefined;
        format?: "react" | "html" | "email" | "solid" | "amp" | undefined;
        noWrap?: true | undefined;
        rev?: string | undefined;
        static?: boolean | undefined;
        options?: {
            [key: string]: any;
        } | undefined;
        noEditorUpdates?: boolean | undefined;
    } | {
        apiVersion?: undefined;
        enrich?: boolean | undefined;
        userAttributes?: import("@builder.io/sdk/dist/src/builder.class").UserAttributes | undefined;
        url?: string | undefined;
        includeUrl?: boolean | undefined;
        includeRefs?: boolean | undefined;
        cacheSeconds?: number | undefined;
        staleCacheSeconds?: number | undefined;
        limit?: number | undefined;
        query?: any;
        cachebust?: boolean | undefined;
        prerender?: boolean | undefined;
        extractCss?: boolean | undefined;
        offset?: number | undefined;
        initialContent?: any;
        model?: string | undefined;
        cache?: boolean | undefined;
        locale?: string | undefined;
        preview?: boolean | undefined;
        entry?: string | undefined;
        alias?: string | undefined;
        fields?: string | undefined;
        omit?: string | undefined;
        key?: string | undefined;
        format?: "react" | "html" | "email" | "solid" | "amp" | undefined;
        noWrap?: true | undefined;
        rev?: string | undefined;
        static?: boolean | undefined;
        options?: {
            [key: string]: any;
        } | undefined;
        noEditorUpdates?: boolean | undefined;
    };
    get data(): {
        variationId: any;
        testVariationId: any;
        testVariationName: string;
        '@version'?: number | undefined;
        id?: string | undefined;
        name?: string | undefined;
        published?: "published" | "draft" | "archived" | undefined;
        modelId?: string | undefined;
        priority?: number | undefined;
        lastUpdated?: number | undefined;
        startDate?: number | undefined;
        endDate?: number | undefined;
        variations?: {
            [id: string]: import("@builder.io/sdk").BuilderContentVariation | undefined;
        } | undefined;
        data?: {
            [key: string]: any;
            blocks?: import("@builder.io/sdk").BuilderElement[] | undefined;
            inputs?: import("@builder.io/sdk").Input[] | undefined;
            state?: {
                [key: string]: any;
            } | undefined;
        } | undefined;
        testRatio?: number | undefined;
    } | null;
    state: {
        loading: boolean;
        data: {
            variationId: any;
            testVariationId: any;
            testVariationName: string;
            '@version'?: number | undefined;
            id?: string | undefined;
            name?: string | undefined;
            published?: "published" | "draft" | "archived" | undefined;
            modelId?: string | undefined;
            priority?: number | undefined;
            lastUpdated?: number | undefined;
            startDate?: number | undefined;
            endDate?: number | undefined;
            variations?: {
                [id: string]: import("@builder.io/sdk").BuilderContentVariation | undefined;
            } | undefined;
            data?: {
                [key: string]: any;
                blocks?: import("@builder.io/sdk").BuilderElement[] | undefined;
                inputs?: import("@builder.io/sdk").Input[] | undefined;
                state?: {
                    [key: string]: any;
                } | undefined;
            } | undefined;
            testRatio?: number | undefined;
        } | null;
        updates: number;
    };
    onWindowMessage: (event: MessageEvent) => void;
    subscriptions: Subscription<Function>;
    firstLoad: boolean;
    clicked: boolean;
    trackedImpression: boolean;
    intersectionObserver: IntersectionObserver | null;
    componentDidMount(): void;
    subscribeToContent(): void;
    componentWillUnmount(): void;
    onClick: (reactEvent: React.MouseEvent<HTMLElement>) => void;
    render(): JSX.Element | null;
}
export declare const getContentWithInfo: (content?: Content) => {
    variationId: any;
    testVariationId: any;
    testVariationName: string;
    '@version'?: number | undefined;
    id?: string | undefined;
    name?: string | undefined;
    published?: "published" | "draft" | "archived" | undefined;
    modelId?: string | undefined;
    priority?: number | undefined;
    lastUpdated?: number | undefined;
    startDate?: number | undefined;
    endDate?: number | undefined;
    variations?: {
        [id: string]: import("@builder.io/sdk").BuilderContentVariation | undefined;
    } | undefined;
    data?: {
        [key: string]: any;
        blocks?: import("@builder.io/sdk").BuilderElement[] | undefined;
        inputs?: import("@builder.io/sdk").Input[] | undefined;
        state?: {
            [key: string]: any;
        } | undefined;
    } | undefined;
    testRatio?: number | undefined;
} | null;
