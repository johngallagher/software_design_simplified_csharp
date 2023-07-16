"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toError = void 0;
/**
 * Safe conversion to error type. Intended to be used in catch blocks where the
 *  value is not guaranteed to be an error.
 *
 *  @example
 *  try {
 *    throw new Error('Something went wrong')
 *  }
 *  catch (err: unknown) {
 *    const error: Error = toError(err)
 *  }
 */
function toError(err) {
    if (err instanceof Error)
        return err;
    return new Error(String(err));
}
exports.toError = toError;
//# sourceMappingURL=to-error.js.map