/**
 * TypeSpec v1.7.0 Core Type System
 *
 * MINIMAL ESSENTIAL TYPES - Clean slate architecture
 * Only types required for StandaloneGoGenerator integration
 */

import type {
  Model,
  Type,
  ModelProperty,
  Scalar,
  Union,
  Enum,
  UnionVariant,
  EnumMember,
} from "@typespec/compiler";

/**
 * Enhanced Model interface with required TypeSpec v1.7.0 properties
 */
export interface TypeSpecModel {
  name: string;
  kind: "Model";
  properties?: ReadonlyMap<string, ModelProperty>;
}

/**
 * Enhanced Property interface
 */
export interface TypeSpecProperty extends ModelProperty {
  /** Proper type reference */
  type: Type;
}

/**
 * Essential TypeSpec Scalar types
 */
export interface TypeSpecScalar extends Scalar {
  /** Scalar name */
  name: string;
}

/**
 * TypeSpec Union types
 */
export interface TypeSpecUnion {
  name?: string;
  kind: "Union";
  variants: ReadonlyMap<string | symbol, UnionVariant>;
}

/**
 * TypeSpec Enum types
 */
export interface TypeSpecEnum {
  name?: string;
  kind: "Enum";
  members: ReadonlyMap<string, EnumMember>;
}

/**
 * Type checking utilities - ESSENTIAL ONLY
 */
export const TypeSpecTypeGuards = {
  /** Check if type is String */
  isString: (type: Type): boolean => type.kind === "String",

  /** Check if type is Boolean */
  isBoolean: (type: Type): boolean => type.kind === "Boolean",

  /** Check if type is Number */
  isNumber: (type: Type): boolean => type.kind === "Number",

  /** Check if type is Model */
  isModel: (type: Type): type is Model => type.kind === "Model",

  /** Check if type is Scalar */
  isScalar: (type: Type): type is Scalar => type.kind === "Scalar",

  /** Check if type is Union */
  isUnion: (type: Type): type is Union => type.kind === "Union",

  /** Check if type is Enum */
  isEnum: (type: Type): type is Enum => type.kind === "Enum",
} as const;

/**
 * Go type mapping - MINIMAL ESSENTIAL
 */
export interface GoTypeMapping {
  readonly [key: string]: string;
}

/**
 * Core Go types mapping
 */
export const GoCoreTypes: GoTypeMapping = {
  String: "string",
  Boolean: "bool",
  Int8: "int8",
  UInt8: "uint8",
  UInt16: "uint16",
  UInt32: "uint32",
  UInt64: "uint64",
  Float32: "float32",
  Float64: "float64",
  Bytes: "[]byte",
  PlainDate: "time.Time",
  PlainTime: "time.Time",
  UTCDateTime: "time.Time",
  Duration: "time.Duration",
} as const;

/**
 * Essential TypeSpec to Go type converter
 */
export class TypeSpecTypeMapper {
  /**
   * Convert TypeSpec type to Go type string
   */
  static toGoType(type: Type): string {
    // Built-in scalars
    if (TypeSpecTypeGuards.isString(type)) return "string";
    if (TypeSpecTypeGuards.isBoolean(type)) return "bool";
    if (TypeSpecTypeGuards.isNumber(type)) return "float64";
    if (TypeSpecTypeGuards.isScalar(type)) return this.mapScalarType(type);

    // Model types
    if (TypeSpecTypeGuards.isModel(type)) return this.getModelName(type);

    // Complex types - fallback
    return "interface{}";
  }

  /**
   * Get model name from TypeSpec model
   */
  private static getModelName(model: Model): string {
    return model.name || "UnknownModel";
  }

  /**
   * Map TypeSpec scalar types to Go types
   */
  private static mapScalarType(scalar: Scalar): string {
    const scalarName = scalar.name;
    return GoCoreTypes[scalarName] || "interface{}";
  }
}

/**
 * Export for external usage
 */
export type {
  Model as TypeSpecModelBase,
  Type as TypeSpecTypeBase,
  ModelProperty as TypeSpecPropertyBase,
};
