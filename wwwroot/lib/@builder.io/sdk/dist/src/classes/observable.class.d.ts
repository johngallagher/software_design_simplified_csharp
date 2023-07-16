export type Listener<T> = (value: T) => void;
export declare class Subscription<FunctionType = Function> {
    private listeners?;
    private listener?;
    constructor(listeners?: FunctionType[] | undefined, listener?: FunctionType | undefined);
    unsubscribed: boolean;
    get closed(): boolean;
    private readonly otherSubscriptions;
    add(subscription: Subscription): void;
    unsubscribe(): void;
}
export declare class BehaviorSubject<T = any, ErrorType = any> {
    value: T;
    constructor(value: T);
    private listeners;
    private errorListeners;
    next(value: T): void;
    map<NewType = any>(fn: (item: T) => NewType): BehaviorSubject<NewType, any>;
    catch(errorListener: Listener<ErrorType>): Subscription<Listener<ErrorType>>;
    error(error: ErrorType): void;
    subscribe(listener: Listener<T>, errorListener?: Listener<ErrorType>): Subscription<Listener<T>>;
    toPromise(): Promise<T>;
    promise(): Promise<T>;
}
export declare const Observer: typeof BehaviorSubject;
export declare const Observable: typeof BehaviorSubject;
