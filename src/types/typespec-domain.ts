/**
 * TypeSpec Domain Types - Go Emitter
 *
 * Professional type definitions for TypeSpec integration
 * ZERO ANY TYPES: Complete type safety
 */

/**
 * TypeSpec property node definition
 */
export interface TypeSpecPropertyNode {
  /** Property name */
  name: string;
  /** Property type */
  type: TypeSpecTypeNode;
  /** Whether property is optional */
  optional?: boolean;
}

/**
 * TypeSpec type node with discriminated union
 */
export type TypeSpecTypeNode =
  | TypeSpecScalarType
  | TypeSpecModelType
  | TypeSpecBuiltinType
  | TypeSpecUnionType
  | TypeSpecEnumType
  | TypeSpecTemplateType;

/**
 * TypeSpec scalar type
 */
export interface TypeSpecScalarType {
  kind: "scalar";
  name: string;
}

/**
 * TypeSpec model type
 */
export interface TypeSpecModelType {
  kind: "model";
  name: string;
}

/**
 * TypeSpec built-in type
 */
export interface TypeSpecBuiltinType {
  kind: "String" | "Boolean" | "Number" | "Int8" | "Int16" | "Int32" | "Int64" | "Uint8" | "Uint16" | "Uint32" | "Uint64" | "Float32" | "Float64";
}

/**
 * TypeSpec union type
 */
export interface TypeSpecUnionType {
  kind: "Union";
  variants: Array<{ name: string; type: TypeSpecTypeNode }>;
}

/**
 * TypeSpec enum type
 */
export interface TypeSpecEnumType {
  kind: "Enum";
  name: string;
}

/**
 * TypeSpec template type
 */
export interface TypeSpecTemplateType {
  kind: "template";
  name: string;
}

/**
 * TypeSpec model definition
 */
export interface TypeSpecModel {
  name: string;
  properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  template?: string; // Template definition like "<T>" or "PaginatedResponse<User>"
  extends?: string;
  propertiesFromExtends?: ReadonlyMap<string, TypeSpecPropertyNode>;
}

/**
 * Go emitter options
 */
export interface GoEmitterOptions {
  packageName?: string;
  usePointersForOptional?: boolean;
}