/// <reference types="@types/node" />
import { IncomingMessage, ServerResponse } from 'http';
interface Options {
    secure?: boolean;
    expires?: Date;
}
declare class Cookies {
    private request;
    private response;
    secure?: boolean;
    constructor(request: IncomingMessage, response: ServerResponse);
    get(name: string): string | undefined;
    set(name: string, value: string, opts: Options): this;
}
export default Cookies;
