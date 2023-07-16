import { Component } from '@builder.io/sdk';
/**
 * Update metadata for a Builder component
 *
 * @param component Builder react component
 * @param fn Updater
 *
 * @example
 *    updatMetadata(TextBlock, current => ({
 *       ...current,
 *       fields: [
 *        ...curent.fields,
 *        { name: 'myNewField', type: 'string' }
 *       ]
 *    }))
 */
export declare function updateMetadata(component: Function | string, fn: (currentMetadata: Component | null) => Component | void): void;
