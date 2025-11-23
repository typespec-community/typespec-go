/**
 * Go Type Interfaces - TypeSpec Go Emitter
 *
 * TYPE INTERFACES: Core Go type definitions
 * ZERO ANY TYPES: Professional type safety
 * FOCUSED MODULES: Single responsibility principle
 */

/**
 * Enhanced Go type model with impossible state prevention
 */

/**
 * Basic types that don't need additional properties
 */
interface BasicGoType {
  readonly kind: "basic" | "struct" | "enum" | "template" | "spread" | "unknown";
  readonly name?: string;
  readonly requiresImport?: boolean;
  readonly importPath?: string;
  readonly usePointerForOptional?: boolean;
  readonly template?: string;
  readonly baseTypes?: string[];
}

/**
 * Array/slice types that require element type
 */
interface ArrayGoType {
  readonly kind: "array" | "slice";
  readonly name?: string;
  readonly requiresImport?: boolean;
  readonly importPath?: string;
  readonly usePointerForOptional?: boolean;
  readonly elementType: MappedGoType; // Required
}

/**
 * Pointer types that require base type
 */
interface PointerGoType {
  readonly kind: "pointer";
  readonly name?: string;
  readonly requiresImport?: boolean;
  readonly importPath?: string;
  readonly usePointerForOptional?: boolean;
  readonly baseType: MappedGoType; // Required
}

/**
 * Union types that require variants
 */
interface UnionGoType {
  readonly kind: "union";
  readonly name?: string;
  readonly requiresImport?: boolean;
  readonly importPath?: string;
  readonly usePointerForOptional?: boolean;
  readonly unionVariants: readonly MappedGoType[]; // Required
  readonly variants?: readonly MappedGoType[]; // Backward compatibility
}

/**
 * Enhanced MappedGoType with impossible states prevented
 */
export type MappedGoType = BasicGoType | ArrayGoType | PointerGoType | UnionGoType;

/**
 * Type guards for runtime checking
 */
export const TypeGuards = {
  isBasic: (type: MappedGoType): type is BasicGoType => 
    ["basic", "struct", "enum", "template", "spread", "unknown"].includes(type.kind),

  isArray: (type: MappedGoType): type is ArrayGoType => 
    type.kind === "array" || type.kind === "slice",

  isPointer: (type: MappedGoType): type is PointerGoType => 
    type.kind === "pointer",

  isUnion: (type: MappedGoType): type is UnionGoType => 
    type.kind === "union",

  hasElement: (type: MappedGoType): type is ArrayGoType => 
    "elementType" in type && type.elementType !== undefined,

  hasVariants: (type: MappedGoType): type is UnionGoType => 
    "unionVariants" in type && type.unionVariants !== undefined,
} as const;

/**
 * Branded types for validation
 */
export type Validated<T, Brand extends string> = T & { readonly __brand: Brand };

export type ValidatedGoType = Validated<MappedGoType, "ValidatedGoType">;
export type ValidatedArrayType = Validated<ArrayGoType, "ValidatedArray">;
export type ValidatedUnionType = Validated<UnionGoType, "ValidatedUnion">;

/**
 * Type constructors for safe creation
 */
export const TypeConstructors = {
  basic: (name: string, usePointerForOptional = false): BasicGoType => ({
    kind: "basic",
    name,
    usePointerForOptional,
  }),

  slice: (elementType: MappedGoType, usePointerForOptional = true): ArrayGoType => ({
    kind: "slice",
    elementType,
    usePointerForOptional,
  }),

  array: (elementType: MappedGoType, usePointerForOptional = true): ArrayGoType => ({
    kind: "array", 
    elementType,
    usePointerForOptional,
  }),

  pointer: (baseType: MappedGoType, usePointerForOptional = false): PointerGoType => ({
    kind: "pointer",
    baseType,
    usePointerForOptional,
  }),

  union: (unionVariants: readonly MappedGoType[], name?: string): UnionGoType => ({
    kind: "union",
    unionVariants,
    name,
    usePointerForOptional: false,
  }),

  struct: (name: string, usePointerForOptional = false): BasicGoType => ({
    kind: "struct",
    name,
    usePointerForOptional,
  }),

  enum: (name: string, usePointerForOptional = false): BasicGoType => ({
    kind: "enum",
    name,
    usePointerForOptional,
  }),
} as const;

/**
 * Basic mapped Go type for scalar mappings
 */
export interface BasicMappedType {
  name: string;
  requiresImport: boolean;
  importPath?: string;
  usePointerForOptional: boolean;
}

/**
 * Validation helpers for type safety
 */
export const TypeValidators = {
  isValidArrayType: (type: MappedGoType): type is ArrayGoType => 
    TypeGuards.isArray(type) && type.elementType !== undefined,

  isValidUnionType: (type: MappedGoType): type is UnionGoType => 
    TypeGuards.isUnion(type) && type.unionVariants.length > 0,

  hasValidElementType: (type: MappedGoType): boolean => 
    !TypeGuards.isArray(type) || type.elementType !== undefined,

  hasValidUnionVariants: (type: MappedGoType): boolean => 
    !TypeGuards.isUnion(type) || (type.unionVariants && type.unionVariants.length > 0),
} as const;
