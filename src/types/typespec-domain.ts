/**
 * TypeSpec Domain-Driven Design Types
 *
 * RESPONSIBILITY: Align with existing StandaloneGoGenerator types
 * ZERO ANY TYPES: Compile-time safety enforced
 * IMPOSSIBLE STATES: Discriminated unions for all cases
 */

/**
 * TypeSpec Kind Type
 * discriminated union for all TypeSpec node kinds
 */
export type TypeSpecKind =
  | "Model"
  | "Union"
  | "Enum"
  | "String"
  | "Boolean"
  | "Decorator"
  | "EnumMember"
  | "FunctionParameter"
  | "Interface"
  | "Intrinsic"
  | "ModelProperty"
  | "Namespace"
  | "Number"
  | "Scalar"
  | "Tuple"
  | "UnionVariant"
  | "Int32"
  | "Int64"
  | "Float32"
  | "Float64"
  | "Array";

/**
 * TypeSpec Visibility Lifecycle Enum
 * Maps to TypeSpec's @visibility decorator lifecycle phases
 */
export type TypeSpecVisibilityLifecycle = 
  | "Create"
  | "Read" 
  | "Update"
  | "Delete"
  | "Query";

/**
 * TypeSpec Property Visibility Information
 * Extracted from @visibility and @invisible decorators
 */
export interface TypeSpecPropertyVisibility {
  readonly visible: boolean;
  readonly lifecycle: readonly TypeSpecVisibilityLifecycle[];
  readonly isInvisible: boolean;
  readonly source: "decorator" | "default" | "inferred";
}

// Direct type definitions to avoid export issues
export interface TypeSpecPropertyNode {
  readonly name: string;
  readonly type: TypeSpecTypeNode;
  readonly optional: boolean;
  readonly documentation?: string;
  readonly visibility?: TypeSpecPropertyVisibility; // Added visibility support
}

export interface TypeSpecTypeNode {
  readonly kind: TypeSpecKind;
  readonly name?: string;
  readonly properties?: ReadonlyMap<string, TypeSpecPropertyNode>;
  readonly optional?: boolean;
}

/**
 * TypeSpec Template Definition
 * DOMAIN MODEL: Template parameter and definition
 */
export interface TypeSpecTemplate {
  readonly name: string;
  readonly parameters: readonly string[];
  readonly properties: ReadonlyMap<string, TypeSpecPropertyNode>;
}

/**
 * TypeSpec Model with Composition Support
 * DOMAIN MODEL: Immutable TypeSpec model with composition
 */
export interface TypeSpecModel {
  readonly name: string;
  readonly properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  readonly namespace?: string;
  readonly extends?: string; // Parent model name for composition
  readonly propertiesFromExtends?: ReadonlyMap<string, TypeSpecPropertyNode>; // Spread operator properties
  readonly templates?: ReadonlyMap<string, TypeSpecTemplate>; // Template definitions
  readonly template?: string; // Template parameter (e.g., "<T>")
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
  /** Error package configuration */
  readonly "error-package"?: {
    /** Enable centralized error package generation */
    readonly enabled?: boolean;
    /** Custom error package path (default: "pkg/errors") */
    readonly path?: string;
    /** Generate package declarations */
    readonly "generate-package"?: boolean;
  };
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

// DELETED: shouldUseUnsignedType() - UNNECESSARY AI OVER-ENGINEERING!
//
// TypeSpec has native uint types! Use them directly for 1:1 mapping:
//   ✅ CORRECT: userID: uint32  →  Go: UserID uint32
//   ❌ WRONG:   userID: int32 + AI detection → Go: UserID uint32
//
// Use native TypeSpec types for direct, simple, honest mapping!
