"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMetadata = void 0;
var sdk_1 = require("@builder.io/sdk");
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
function updateMetadata(component, fn) {
    var match = sdk_1.Builder.components.find(function (item) {
        if (typeof component === 'string') {
            return item.name === component;
        }
        else {
            return item.class === item;
        }
    }) || null;
    var updated = fn(match);
    if (match && updated) {
        // re-registering the same component will replace it
        sdk_1.Builder.registerComponent(updated.class || match.class, updated);
    }
    else if (match && !updated) {
        // TODO: have a way to message to remove component
    }
    else if (!match && updated) {
        sdk_1.Builder.registerComponent(updated.class, updated);
    }
}
exports.updateMetadata = updateMetadata;
//# sourceMappingURL=update-metadata.js.map