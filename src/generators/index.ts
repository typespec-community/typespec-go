/**
 * Generators Module Exports
 *
 * Type-safe generator registry and exports
 * Professional architecture with clean abstractions
 */

export { BaseGenerator, GeneratorRegistry, type Generator } from "./base-generator.js";
export { ModelGenerator } from "./model-generator.js";
export { EnumGenerator } from "./enum-generator.js";

// Register all generators for extensibility
import { GeneratorRegistry } from "./base-generator.js";
import { ModelGenerator } from "./model-generator.js";
import { EnumGenerator } from "./enum-generator.js";

// Auto-register generators
GeneratorRegistry.register(new ModelGenerator());
GeneratorRegistry.register(new EnumGenerator());