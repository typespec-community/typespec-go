/**
 * Type-safe TypeSpec Types
 * 
 * ZERO ANY TYPES: Professional type safety
 * EXHAUSTIVE MATCHING: Compile-time safety enforced
 * UNREPRESENTABLE INVALID STATES: Strong typing
 */

/**
 * TypeSpec Type Node
 * 
 * EXHAUSTIVE TYPE MATCHING: All TypeSpec types covered
 * ZERO ANY TYPES: Professional type safety
 */
export interface TypeSpecTypeNode {
  readonly kind: "String" | "Int8" | "Int16" | "Int32" | "Int64" | 
           "Uint8" | "Uint16" | "Uint32" | "Uint64" | 
           "Float32" | "Float64" | "Boolean" | "Bytes" |
           "Array" | "Model" | "Enum" | "Union";
}

/**
 * TypeSpec Property Node
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Property concerns only
 */
export interface TypeSpecPropertyNode {
  readonly name: string;
  readonly type: TypeSpecTypeNode;
  readonly optional: boolean;
  readonly documentation?: string;
}

/**
 * TypeSpec Model Node
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Model concerns only
 */
export interface TypeSpecModelNode {
  readonly name: string;
  readonly properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  readonly documentation?: string;
}

/**
 * TypeSpec Program Node
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Program concerns only
 */
export interface TypeSpecProgramNode {
  readonly models: ReadonlyMap<string, TypeSpecModelNode>;
  readonly namespaces: ReadonlyMap<string, TypeSpecNamespaceNode>;
}

/**
 * TypeSpec Namespace Node
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Namespace concerns only
 */
export interface TypeSpecNamespaceNode {
  readonly name: string;
  readonly models: ReadonlyMap<string, TypeSpecModelNode>;
  readonly namespaces: ReadonlyMap<string, TypeSpecNamespaceNode>;
}

/**
 * Type-safe Array Node
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Array concerns only
 */
export interface TypeSpecArrayNode {
  readonly kind: "Array";
  readonly elementType: TypeSpecTypeNode;
  readonly minLength?: number;
  readonly maxLength?: number;
}

/**
 * Type-safe Union Node
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Union concerns only
 */
export interface TypeSpecUnionNode {
  readonly kind: "Union";
  readonly variants: ReadonlyArray<TypeSpecTypeNode>;
  readonly discriminant?: string;
}

/**
 * Type-safe Enum Node
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Enum concerns only
 */
export interface TypeSpecEnumNode {
  readonly kind: "Enum";
  readonly members: ReadonlyArray<string>;
  readonly underlyingType: TypeSpecTypeNode;
}

/**
 * Type-safe Model Node
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Model concerns only
 */
export interface TypeSpecModelDefinitionNode {
  readonly kind: "Model";
  readonly extends?: TypeSpecTypeNode;
  readonly implements?: ReadonlyArray<TypeSpecTypeNode>;
  readonly is?: ReadonlyArray<TypeSpecTypeNode>;
}