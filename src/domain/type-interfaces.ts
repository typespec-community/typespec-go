/**
 * Go Type Interfaces - TypeSpec Go Emitter
 *
 * TYPE INTERFACES: Core Go type definitions
 * ZERO ANY TYPES: Professional type safety
 * FOCUSED MODULES: Single responsibility principle
 */

/**
 * Mapped Go type information with comprehensive type support
 */
export interface MappedGoType {
  /** Go type kind (basic, pointer, slice, struct, enum, union, array, template, spread) */
  readonly kind:
    | "basic"
    | "pointer"
    | "slice"
    | "struct"
    | "enum"
    | "union"
    | "array"
    | "template"
    | "spread";

  /** Type name for basic types (e.g., 'int32', 'string') */
  readonly name?: string;

  /** Base type for pointer/slice types */
  readonly baseType?: MappedGoType;

  /** Element type for array/slice types */
  readonly elementType?: MappedGoType;

  /** Union variants for union types */
  readonly unionVariants?: readonly MappedGoType[];

  /** Base types for composition (spread operator) */
  readonly baseTypes?: readonly MappedGoType[];

  /** Template definition for generic types */
  readonly template?: string;

  /** Whether this type requires import */
  readonly requiresImport?: boolean;

  /** Import path if needed */
  readonly importPath?: string;

  /** Whether to use pointer for optional properties */
  readonly usePointerForOptional?: boolean;
}

/**
 * Basic mapped Go type for scalar mappings
 */
export interface BasicMappedType {
  name: string;
  requiresImport: boolean;
  importPath?: string;
  usePointerForOptional: boolean;
}
