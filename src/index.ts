export { $onEmit } from "./emitter.js";
export { $decorators } from "./lib.js";

// Create simple lib export
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
} as const;
