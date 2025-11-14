/**
 * Type-Safe TypeSpec Type Definitions
 * 
 * ELIMINATES ALL 'any' TYPES
 * Enables compile-time type safety with exhaustive matching
 * Supports complete TypeSpec type system
 */

/**
 * Core TypeSpec type nodes with zero 'any' usage
 */
export interface TypeSpecStringNode {
  readonly kind: "String";
}

export interface TypeSpecInt8Node {
  readonly kind: "Int8";
}

export interface TypeSpecInt16Node {
  readonly kind: "Int16";
}

export interface TypeSpecInt32Node {
  readonly kind: "Int32";
}

export interface TypeSpecInt64Node {
  readonly kind: "Int64";
}

export interface TypeSpecUint8Node {
  readonly kind: "Uint8";
}

export interface TypeSpecUint16Node {
  readonly kind: "Uint16";
}

export interface TypeSpecUint32Node {
  readonly kind: "Uint32";
}

export interface TypeSpecUint64Node {
  readonly kind: "Uint64";
}

export interface TypeSpecFloat32Node {
  readonly kind: "Float32";
}

export interface TypeSpecFloat64Node {
  readonly kind: "Float64";
}

export interface TypeSpecBooleanNode {
  readonly kind: "Boolean";
}

export interface TypeSpecBytesNode {
  readonly kind: "Bytes";
}

export interface TypeSpecArrayNode {
  readonly kind: "Array";
  readonly elementType?: TypeSpecTypeNode;
}

export interface TypeSpecModelNode {
  readonly kind: "Model";
  readonly name?: string;
  readonly properties?: ReadonlyMap<string, TypeSpecPropertyNode>;
}

export interface TypeSpecEnumNode {
  readonly kind: "Enum";
  readonly name?: string;
  readonly members?: ReadonlyArray<string>;
}

export interface TypeSpecUnionNode {
  readonly kind: "Union";
  readonly variants?: ReadonlyArray<TypeSpecTypeNode>;
}

/**
 * Complete TypeSpec type union with ZERO 'any' usage
 * Enables exhaustive matching and compile-time safety
 */
export type TypeSpecTypeNode = 
  | TypeSpecStringNode
  | TypeSpecInt8Node
  | TypeSpecInt16Node
  | TypeSpecInt32Node
  | TypeSpecInt64Node
  | TypeSpecUint8Node
  | TypeSpecUint16Node
  | TypeSpecUint32Node
  | TypeSpecUint64Node
  | TypeSpecFloat32Node
  | TypeSpecFloat64Node
  | TypeSpecBooleanNode
  | TypeSpecBytesNode
  | TypeSpecArrayNode
  | TypeSpecModelNode
  | TypeSpecEnumNode
  | TypeSpecUnionNode;

/**
 * Simplified type for flexibility in tests
 */
export type TypeSpecKind = TypeSpecTypeNode["kind"];

/**
 * Type-safe property definitions
 */
export interface TypeSpecPropertyNode {
  readonly name: string;
  readonly type: TypeSpecTypeNode;
  readonly optional: boolean;
  readonly documentation?: string;
}

/**
 * Go type mapping with strong typing
 */
export interface GoTypeMapping {
  readonly goType: string;
  readonly usePointerForOptional: boolean;
  readonly validationRules?: ReadonlyArray<ValidationRule>;
}

export interface ValidationRule {
  readonly type: "min" | "max" | "pattern";
  readonly value: string | number;
  readonly message: string;
}

/**
 * Optional handling strategies with enums (no booleans)
 */
export enum OptionalHandlingStrategy {
  Pointer = "pointer",
  DefaultValue = "default",
  NullObject = "null-object",
  Validation = "validation"
}

/**
 * Type-safe field generation contract
 */
export interface GoField {
  readonly name: string;
  readonly type: string;
  readonly jsonTag: string;
  readonly documentation?: string;
  readonly validation?: ValidationRule[];
}