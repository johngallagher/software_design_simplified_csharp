import React from 'react';
/**
 * Higher order component for passing Builder.io styles and attributes directly
 * to the component child without wrapping
 *
 * Useful when you need styles etc applied directly to the component without a
 * wrapping element (e.g. div), and you are already forwarding all props and attributes
 * (e.g. <YourComponent {...props} />)
 *
 * 👉 Important: make sure you always add props.className,
 * even if you supply a className too
 *
 * @example
 * ```tsx
 *
 *    const MyButton = props => <Button
 *      {...props}
 *      className={'my-button ' + (props.className || '')}>
 *      Hello there!
 *    </Button>
 *
 *    const ButtonWithBuilderChildren = noWrap(MyButton)
 *
 *    Builder.registerComponent(ButtonWithBuilderChildren, {
 *      name: 'MyButton',
 *    })
 * ```
 */
export declare const noWrap: <P extends object>(Component: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    attributes?: any;
}> & React.RefAttributes<unknown>>;
