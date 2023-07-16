export type StringMap = Record<string, string>;
export declare class QueryString {
    static parseDeep(queryString: string): any;
    static stringifyDeep(obj: any): string;
    static parse(queryString: string): StringMap;
    static stringify(map: StringMap): string;
    static deepen(map: StringMap): any;
    static flatten(obj: any, _current?: any, _res?: any): StringMap;
}
