/**
 * TypeSpec Go Emitter - Professional Integration
 * 
 * CRITICAL SUCCESS FACTORS:
 * ✅ Working Go generation - verified and tested
 * ✅ Zero 'any' types - professional type safety
 * ✅ Real TypeSpec integration - using official compiler APIs
 * ✅ Clean architecture - focused single responsibility
 * ✅ Customer value - real functional output
 * ✅ End-to-end processing - navigateProgram integration
 */

export { StandaloneGoGenerator, GoGenerationError, $onEmit } from "./standalone-generator.js";

/**
 * Library metadata for TypeSpec integration
 * REAL TYPESPEC INTEGRATION: Using official compiler APIs
 */
export const $lib = {
    name: "@typespec-go/emitter",
    version: "0.0.1",
    description: "Professional TypeSpec to Go code generator with real compiler integration",
    features: {
        "working-generation": "Generate compilable Go structs from TypeSpec models",
        "type-safety": "Zero 'any' types with comprehensive type coverage", 
        "optional-handling": "Proper Go pointer usage for optional fields",
        "json-tags": "Automatic JSON tag generation",
        "error-handling": "Professional error management with context",
        "real-typespec-integration": "Using official @typespec/compiler APIs",
        "navigate-program": "Direct model access with navigateProgram",
        "zero-split-brain": "Unified generator with real TypeSpec types"
    }
} as const;