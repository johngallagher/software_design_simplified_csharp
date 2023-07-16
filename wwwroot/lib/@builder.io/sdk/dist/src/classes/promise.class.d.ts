export declare class TinyPromise<T = any> {
    private _state;
    private _handlers;
    private _value;
    constructor(executor: (resolve: (val: T) => any, reject: (err: T) => any) => void);
    private _resolve;
    private _fulfill;
    private _reject;
    private _isPending;
    private _isFulfilled;
    private _isRejected;
    private _addHandler;
    private _callHandler;
    then(onFulfilled: (val: T) => any, onRejected: (err: any) => any): TinyPromise<any> | undefined;
}
declare const _default: PromiseConstructor;
export default _default;
