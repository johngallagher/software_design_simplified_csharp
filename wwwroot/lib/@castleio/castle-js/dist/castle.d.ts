interface StorageOptions {
  name?: string;
  /**
   * Expiration time in seconds.
   */
  expireIn?: number;
}

interface ConfigureOptions {
  window?: any;
  apiUrl?: string;
  timeout?: number;
  /**
   * @deprecated Use {@link storage} instead.
   */
  storageNamespace?: string;
  /**
   * @deprecated It will be removed in a future release.
   */
  cookieDomain?: string;
  /**
   * @deprecated It will be removed in a future release.
   */
  avoidCookies?: boolean;
  pk?: string;
  verbose?: boolean;
  storage?: StorageOptions;
}

interface Thenable<T> {
  _value?: undefined | T | null;
  then: (onFulfilled: (value: T) => any, onRejected?: () => any) => Thenable<T>;
}

interface FormEventOnSubmitOptions {
  injectToken?: boolean;
}

interface UserParams {
  id: string;
  email?: string;
  phone?: string;
  registered_at?: string;
  name?: string;
  traits?: Record<string, any>;
  signature?: string;
}

type PageParams = {
  url?: string;
  name?: string;
  referrer?: string;
} & ({ user: UserParams; userJwt?: string } | { user?: UserParams; userJwt: string });

type FormParams = {
  name: string;
  values?: Record<string, string>;
} & ({ user: UserParams; userJwt?: string } | { user?: UserParams; userJwt: string });

type CustomParams = {
  name: string;
  properties?: Record<string, string>;
  user: UserParams;
} & ({ user: UserParams; userJwt?: string } | { user?: UserParams; userJwt: string });

interface ConfigureResponse {
  createRequestToken(): Thenable<string>;
  page(params: PageParams): Thenable<boolean | null>;
  form(params: FormParams): Thenable<boolean | null>;
  custom(params: CustomParams): Thenable<boolean | null>;
  getVersion(): string;
  formEventOnSubmit(
    event: Event,
    user: UserParams | string,
    opts?: FormEventOnSubmitOptions,
    onDone?: (event: Event, result: boolean | null) => any
  ): void | boolean;
  configure(options?: ConfigureOptions): ConfigureResponse;
}

declare function createRequestToken(): Thenable<string>;
declare function page(params: PageParams): Thenable<boolean | null>;
declare function form(params: FormParams): Thenable<boolean | null>;
declare function custom(params: CustomParams): Thenable<boolean | null>;
declare function getVersion(): string;
declare function injectTokenOnSubmit(event: Event, onDone?: (event: Event) => any): any;
declare function formEventOnSubmit(
  event: Event,
  user: UserParams | string,
  opts?: FormEventOnSubmitOptions,
  onDone?: (event: Event, result: boolean | null) => any
): void | boolean;
declare function configure(options?: ConfigureOptions): ConfigureResponse;

export { ConfigureOptions, CustomParams, FormParams, PageParams, Thenable, UserParams, configure, createRequestToken, custom, form, formEventOnSubmit, getVersion, injectTokenOnSubmit, page };
