/**
 * TypeSpec Go Emitter - Professional Standalone Generator
 *
 * CRITICAL SUCCESS FACTORS:
 * ✅ Working Go generation - verified and tested
 * ✅ Zero 'any' types - professional type safety
 * ✅ Clean architecture - focused single responsibility
 * ✅ Customer value - real functional output
 * ✅ Unified error system - single source of truth for error handling
 */

// Legacy generator (working)
export {
  StandaloneGoGenerator,
} from "./standalone-generator.js";

// Unified error system (NEW - primary)
export type {
  GoEmitterResult,
} from "./domain/unified-errors.js";

export {
  ErrorFactory,
  ErrorHandler,
  Entities,
  InvalidModelReason,
} from "./domain/unified-errors.js";

// Legacy type system components (deprecated - will be removed in Phase 2)
export type {
  GeneratorError,
  GeneratorErrorFactory,
  GenerationContext,
} from "./types/errors.js";
export type {
  GoIntegerType,
  GoStringType,
  GoCollectionType,
  LogLevel,
  StrictMode,
  OptionalHandling,
} from "./types/go-types.js";

/**
 * Library metadata for TypeSpec integration
 */
export const $lib = {
  name: "@typespec-go/emitter",
  version: "0.0.1",
  description:
    "Professional TypeSpec to Go code generator with discriminated unions and proper uint usage",
  features: {
    "working-generation": "Generate compilable Go structs from TypeSpec models",
    "type-safety": "Zero 'any' types with comprehensive coverage",
    "optional-handling": "Proper Go pointer usage for optional fields",
    "json-tags": "Automatic JSON tag generation",
    "error-handling": "Unified error system with discriminated unions",
    "discriminated-unions": "Impossible states unrepresentable",
    "proper-uint-usage": "Never-negative values use unsigned integers",
    "enums-instead-of-booleans": "Clear state representation",
    "unified-errors": "Single source of truth for error handling",
  },
} as const;