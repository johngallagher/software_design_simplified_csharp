# Castle Fingerprinting Script

Packaged version of [Castle](https://castle.io) fingerprinting script.

## Introduction

The Castle JavaScript automatically captures every user action in your web application, including clicks, taps, swipes, form submissions, and page views. We use this data to build profiles of good user behavior in order to detect the bad.

## Installation

```bash
npm install --save @castleio/castle-js

```

```bash
yarn add @castleio/castle-js

```

## Configuration


### Basic configuration of the app

```js
// @option options [string] :pk castle publishable key.
// @option options [object] :window (default `window`) eg JSDOM.window
// @option options [string] :apiUrl (default `https://m.castle.io/v1/monitor`) castle api url
// @option options [number] :timeout (default 1000) castle api response timeout
// @option options [boolean] :verbose (default true) verbose mode (console warnings)
// @option options [object] :storage (default name `__cuid`, default expireIn 400 days in seconds: `34560000`) used for storing uuid in the localStorage and the cookies, and for setting cookie expiration time.

import * as Castle from '@castleio/castle-js'

Castle.configure(options);
```

### browser version (legacy setups)

If your environment does not support modules you can use the browser version

```js
import '@castleio/castle-js/dist/castle.browser.js'

Castle.configure(options);
```

## Usage

### Getting castle request token

```js
import * as Castle from '@castleio/castle-js'

Castle.createRequestToken().then( (requestToken) => {
  ....
});

// or
const requestToken = await Castle.createRequestToken();

```

See [Castle Docs](https://docs.castle.io/v1/tutorials/client-side-integration/web/#npm-package) for more information and how to pass the token further.

### form submit helper example (when cdn version is used)
```js
// @param event [Event] submit event
// @param onDone [Function] optional form submit callback replacement
```

```html
<form action="/" onsubmit="Castle.injectTokenOnSubmit(event)">
  <button type="submit">Submit</button>
</form>
```

helper is also available directly (when castle.umd.js is used)

```js
import * as Castle from '@castleio/castle-js'

const submitHandler = (evt) => Castle.injectTokenOnSubmit(evt);
```

```html
<form action="/" onsubmit="submitHandler(event)">
  <button type="submit">Submit</button>
</form>
```

### Sending page event

```js
// @param options [PageParams] castle page command params.
// @option user [UserParams] user object with the required `id`, optional `email`, `phone`, `registered_at`, `name`, `traits`
// @option userJwt [string] optiona jwt encoded UserParams
// @option name [String]
// @option referrer [String]
// @option url [String]

import * as Castle from '@castleio/castle-js'

const page = Castle.page(options);

```

event response can be verified with promise like call.

```js
import * as Castle from '@castleio/castle-js'

// result - true - success response from the server
// result - false - error response from the server, missing configuration or data
// result - null - timeout or debounced event (300ms)

Castle.page(options).then( (result) => { } )
```

### Sending form event

```js
// @param options [FormParams] castle form command params.
// @option user [UserParams] user object with the required `id`, optional `email`, `phone`, `registered_at`, `name`, `traits`
// @option userJwt [string] JWT encoded UserParams (can be passed instead of the user)
// @option name [String]
// @option values [Record<string, string>]

import * as Castle from '@castleio/castle-js'

Castle.form(options);

```

event response can be verified with promise like call.

```js
import * as Castle from '@castleio/castle-js'

// result - true - success response from the server
// result - false - error response from the server, missing configuration or data
// result - null - timeout or throttled event (300ms)

Castle.form(options).then( (result) => { } )
```

## form submit helper for form events

```js
import * as Castle from '@castleio/castle-js'

const user = YOUR_USER_DATA;
const submitHandler = (evt) => Castle.formEventOnSubmit(evt, user);
```

```html
<form action="/" data-castle-name="Change Profile" onsubmit="submitHandler(event)">
  <input type="text" name="user_mail" data-castle-value="email">
  <button type="submit">Submit</button>
</form>
```

### Sending custom event

```js
// @param options [CustomParams] castle custom command params.
// @option user [UserParams] user object with the required `id`, optional `email`, `phone`, `registered_at`, `name`, `traits`
// @option userJwt [string] JWT encoded UserParams (can be passed instead of the user)
// @option name [String]
// @option properties [Record<string,string>]

import * as Castle from '@castleio/castle-js'

const custom = Castle.custom(options);

```

event response can be verified with promise like call.

```js
import * as Castle from '@castleio/castle-js'

// result - true - success response from the server
// result - false - error response from the server, missing configuration or data
// result - null - timeout or debounced event (default 1000ms)

Castle.custom(options).then( (result) => { } )
```

# Breaking changes

## Upgrading from 1.x to 2.0.x

### 1.x

Legacy package: https://www.npmjs.com/package/castle.js

```js
require "castle.js"  
```

```js
_castle('setAppId', "YOUR_APP_ID")
_castle('getClientId')
```

### 2.0.x

New package:

```js
import * as Castle from "@castleio/castle-js"
```

1. Renamed the main object from `_castle` to `Castle` in the new module, but kept the `_castle` in the CDN version as well as the browser-specific module `@castleio/castle-js/dist/castle.browser.js`
2. Introduced the concept of request tokens that need to be generated for each call to Castle's server-side API.

```js
Castle.createRequestToken().then( (requestToken) => {
});

// or

const token = await Castle.createRequestToken();
```

3. Request tokens can no longer be retrieved from the cookie string.
4. All the following methods were removed:

`autoForwardClientId`, `autoTrack`, `catchHistoryErrors`, `identify`, `setUserId`, `setAccount`, `setKey`, `setAccount`, `sessionId`, `reset`, `page`, `trackPageView`, `setTrackerUrl`


Request Token is now required to be passed in the request params and it is no longer available in the cookie. Check the [docs](https://docs.castle.io/docs/sdk-browser)

## Upgrading from 2.0.x to 2.1.x or later

### 2.0.x

```js
Castle.configure(YOUR_CASTLE_APP_ID);
```

### 2.1.x or later

1. Removed the `_castle` object for all versions and now only relying on `Castle`.

2. Switched to use the **Publishable Key** that can be found in the same place as the now deprecated App ID.

```js
Castle.configure({pk: YOUR_PUBLISHABLE_KEY});
```

3. `onFormSubmit` has been renamed to `injectTokenOnSubmit`

4. `_castle` global method is no longer supported and has been replaced with `Castle` (for the CDN and castle.browser.js versions) check [docs](https://docs.castle.io/docs/sdk-browser)

5. CDN version no longer needs `appID` in the url and requires
```javascript
<script>Castle.configure({pk: YOUR_CASTLE_PUBLISHABLE_KEY});</script>
```
to be added. The CDN version can't be used for generating request tokens, but only for tracking client-side events.

6. Introduced `page`, `form`, and `custom` methods for client-side event tracking


More info can be found in the [docs](https://docs.castle.io/docs/sdk-browser#breaking-changes)

## Changelog

* 2.2.0 – new configuration option `storage`, deprecated `cookieDomain`, `storageNamespace` and `avoidCookies`, and stability improvements.
* 2.1.15 – new configuration option `storageNamespace`, for specifing localStorage and cookie storage namespace, stability improvements
* 2.1.14 – stability improvements
* 2.1.13 – throw error when pk is not configured
* 2.1.12 – made Castle.configure to return Castle interface object
* 2.1.11 – added address support to user for page, form, custom events
* 2.1.10 – bug fixes and stability improvements
* 2.1.9 – bug fixes and stability improvements
* 2.1.8 – pk validation and internal enhancements
* 2.1.7 – page command bug fixes and improvements
* 2.1.6 – fixed JWT validation issue
* 2.1.5 – readme update
* 2.1.4 – stability improvements
* 2.1.3 – view events bug fixes and stability improvements
* 2.1.2 – view events bug fixes
* 2.1.1 – internal enhancements and stability improvements
* 2.1.0 – added page, form, custom events support, changed configuration DSL, added formEventOnSubmit helper, renamed onFormSubmit to injectTokenOnSubmit (breaking changes - check [docs](https://docs.castle.io/docs/sdk-browser) )
* 2.0.4 – bug fixes
* 2.0.3 – bug fixes and stability improvements
* 2.0.2 – bug fixes
* 2.0.1 – internal enhancements
* 2.0.0 – migration from [1.x](https://www.npmjs.com/package/castle.js), modularization, updated DSL, (breaking changes - check [docs](https://docs.castle.io/docs/sdk-browser) )


## Minimal Requirements:

**ES3+** version supported browsers eg:

* Chrome 5+
* Firefox 3+
* IE 6+
* Safari 4+
* All modern browsers (desktop and mobile)

to use page/form functionality:

* Chrome 9+
* Firefox 6+
* IE 10+
* Safari 5+
* All modern browsers (desktop and mobile)

## License

MIT
