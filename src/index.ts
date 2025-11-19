/**
 * TypeSpec Go Emitter - Professional Unified Architecture
 *
 * CRITICAL SUCCESS FACTORS:
 * ✅ Working Go generation - verified and tested
 * ✅ Zero 'any' types - professional type safety
 * ✅ Clean architecture - focused single responsibility
 * ✅ Customer value - real functional output
 * ✅ Unified error system - single source of truth for error handling
 * ✅ Professional logging - structured observability
 */

// Primary Go generator (working, type-safe)
export { StandaloneGoGenerator } from "./standalone-generator.js";

// Unified error system (SINGLE SOURCE OF TRUTH)
export type { GoEmitterResult } from "./domain/unified-errors.js";

export {
  ErrorFactory,
  ErrorHandler,
  Entities,
  InvalidModelReason,
} from "./domain/unified-errors.js";

// Professional logging system
export { 
  Logger, 
  StructuredLogger, 
  DevelopmentLogger, 
  LogLevel, 
  LogContext 
} from "./domain/structured-logging.js";

// Professional domain types (single source)
export type {
  TypeSpecModel,
  TypeSpecPropertyNode,
  TypeSpecTypeNode,
  GoEmitterOptions,
} from "./types/typespec-domain.js";

/**
 * Library metadata for TypeSpec integration
 */
export const $lib = {
  name: "@typespec-go/emitter",
  version: "0.1.0",
  description:
    "Professional TypeSpec to Go code generator with discriminated unions, structured logging, and proper uint usage",
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
    "structured-logging": "Production-ready observability with context",
    "domain-driven": "Business logic encoded in type system",
  },
} as const;
