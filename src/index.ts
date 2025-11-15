/**
 * TypeSpec Go Emitter - Professional Standalone Generator
 * 
 * CRITICAL SUCCESS FACTORS:
 * ✅ Working Go generation - verified and tested
 * ✅ Zero 'any' types - professional type safety
 * ✅ Clean architecture - focused single responsibility
 * ✅ Customer value - real functional output
 * ✅ Professional error handling - structured error management
 */

export { StandaloneGoGenerator, GoGenerationError } from "./standalone-generator.js";

/**
 * Library metadata for TypeSpec integration
 */
export const $lib = {
    name: "@typespec-go/emitter",
    version: "0.0.1",
    description: "Professional TypeSpec to Go code generator",
    features: {
        "working-generation": "Generate compilable Go structs from TypeSpec models",
        "type-safety": "Zero 'any' types with comprehensive type coverage", 
        "optional-handling": "Proper Go pointer usage for optional fields",
        "json-tags": "Automatic JSON tag generation",
        "error-handling": "Professional error management with context",
    }
} as const;