/**
 * TypeSpec Domain-Driven Design Types
 *
 * RESPONSIBILITY: Align with existing StandaloneGoGenerator types
 * ZERO ANY TYPES: Compile-time safety enforced
 * IMPOSSIBLE STATES: Discriminated unions for all cases
 */

// Direct type definitions to avoid export issues
export interface TypeSpecPropertyNode {
  readonly name: string;
  readonly type: TypeSpecTypeNode;
  readonly optional: boolean;
  readonly documentation?: string;
}

export interface TypeSpecTypeNode {
  readonly kind:
    | "String"
    | "Int8"
    | "Int16"
    | "Int32"
    | "Int64"
    | "Uint8"
    | "Uint16"
    | "Uint32"
    | "Uint64"
    | "Float32"
    | "Float64"
    | "Boolean"
    | "Bytes"
    | "Array"
    | "Model"
    | "Enum"
    | "Union";
}

/**
 * TypeSpec Model Domain Entity (compatibility layer)
 * VALUE OBJECT: Immutable TypeSpec model representation
 */
export interface TypeSpecModel {
  readonly name: string;
  readonly properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  readonly namespace?: string;
}

/**
 * TypeSpec Go Emitter Configuration
 * SHARED TYPES: Avoid circular imports
 */
export interface GoEmitterOptions {
  /** Output directory for generated Go files */
  readonly "output-dir"?: string;
  /** Go package path */
  readonly "go-package"?: string;
  /** Generate Go package declarations */
  readonly "generate-package"?: boolean;
}

/**
 * TypeSpec Generator Result Discriminated Union
 * IMPOSSIBLE STATES: Cannot be both success and error
 */
export type TypeSpecGeneratorResult =
  | { readonly _type: "success"; readonly data: Map<string, string> } // ✅ Only success state!
  | { readonly _type: "error"; readonly error: GenerationError }; // ✅ Only error state!

/**
 * Generation Error Discriminated Union
 * IMPOSSIBLE STATES: Error context is exclusive
 */
export type GenerationError =
  | { readonly _type: "validation"; readonly message: string }
  | { readonly _type: "unsupported_type"; readonly typeName: string }
  | {
      readonly _type: "compilation";
      readonly message: string;
      readonly stack?: string;
    };

// NOTE: shouldUseUnsignedType moved to GoTypeMapper to eliminate split brain
// Import from src/domain/go-type-mapper.ts instead
import { GoTypeMapper } from "../domain/go-type-mapper.js";

/**
 * Helper: Detect if field should be unsigned (never-negative)
 * DELEGATED: Uses unified GoTypeMapper logic
 */
export function shouldUseUnsignedType(fieldName: string): boolean {
  return GoTypeMapper.shouldUseUnsignedType(fieldName);
}
