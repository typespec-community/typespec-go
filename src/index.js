/**
 * TypeSpec Go Emitter - Working Minimal Baseline
 *
 * Uses proven string generation + type safety
 * Delivers working TypeSpec → Go pipeline
 */
export { $onEmit } from "./working-emitter.js";
export { $decorators } from "./lib.js";
// Create minimal lib export
export const $lib = {
    name: "@typespec-go/emitter",
    diagnostics: {
        "unsupported-type": {
            severity: "error",
            messages: {
                default: "Type '{typeName}' ({kind}) is not yet supported for Go generation.",
            },
        },
    },
};
