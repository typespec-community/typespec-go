/**
 * TypeSpec Go Emitter - Professional Unified Architecture
 *
 * PRIMARY ASSET EMITTER EXPORTS:
 * ✅ Official TypeSpec compiler integration
 * ✅ Modern Alloy-JS component architecture
 * ✅ Production-ready Go code generation
 * ✅ Zero string-based logic implementation
 */

// PRIMARY EXPORT - TypeSpec AssetEmitter Integration
export { $onEmit } from "./emitter/typespec-go-emitter.js";

/**
 * Library metadata for TypeSpec integration
 */
export const $lib = {
  name: "@typespec-go/emitter",
  version: "0.1.0",
  description:
    "Professional TypeSpec to Go code generator with modern Alloy-JS architecture, component-based generation, and enterprise-grade type safety",
  features: {
    "asset-emitter": "Official TypeSpec compiler integration using createAssetEmitter pattern",
    "alloy-js-components": "Modern component-based code generation with JSX syntax",
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
    "component-architecture": "Modern, maintainable JSX-based generation",
    "zero-string-logic": "Professional component-based approach",
  },
} as const;
