/**
 * Components Barrel Export
 *
 * Centralized exports for all TypeSpec Go emitter components and utilities
 * Provides clean import paths for the complete code generation system
 */

// Utility exports
export * from "../utils/strings.js";
export * from "../utils/typespec-utils.js";
export * from "../utils/go-formatter.js";

// Domain exports
export * from "../domain/clean-type-mapper.js";
export * from "../domain/error-factory.js";
export * from "../domain/structured-logging.js";

// Type exports
export * from "../types/emitter.types.js";
export * from "../types/typespec-domain.js";
export * from "../domain/error-types.js";

// Emitter exports
// export * from '../emitter/main.js'  // Commented out - file doesn't exist
