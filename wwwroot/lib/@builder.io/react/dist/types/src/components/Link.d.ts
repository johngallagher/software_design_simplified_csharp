import React from 'react';
/**
 * Link component should be used instead of an anchor tag in our components,
 * this is to allow our users to override anchor tags in
 * case they're using a routing Lib that requires using their
 * custom Link component (e.g Next, Gatsby, React Router)
 * <BuilderComponent renderLink=(props) => <myCustomLink {...props} /> />
 */
export declare const Link: React.SFC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
