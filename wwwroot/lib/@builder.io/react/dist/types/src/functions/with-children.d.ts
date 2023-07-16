import React from 'react';
import { BuilderElement } from '@builder.io/sdk';
/**
 * Higher order component for passing Builder.io children as React children
 *
 * @example
 * ```tsx
 *
 *    const MyButton = props => <Button>
 *      {children}
 *    </Button>
 *
 *    const ButtonWithBuilderChildren = withChildren(MyButton)
 *
 *    Builder.registerComponent(ButtonWithBuilderChildren, {
 *      name: 'MyButton',
 *      defaultChildren: [
 *        {
 *          '@type': '@builder.io/sdk:Element'
 *        }
 *      ]
 *    })
 * ```
 */
export declare const withChildren: <P extends object>(Component: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    children?: React.ReactNode;
} & {
    builderBlock?: BuilderElement | undefined;
}> & React.RefAttributes<any>>;
