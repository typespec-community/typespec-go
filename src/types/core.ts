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
  String as StringType,
  Boolean as BooleanType,
  Number as NumberType
} from "@typespec/compiler";

/**
 * Enhanced Model interface with required TypeSpec v1.7.0 properties
 */
export interface TypeSpecModel extends Model {
  /** All properties with proper typing */
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
export interface TypeSpecUnion extends Union {
  /** All union variants */
  variants: ReadonlyMap<string | symbol, UnionVariant>;
}

/**
 * TypeSpec Enum types
 */
export interface TypeSpecEnum extends Enum {
  /** All enum members */
  members: ReadonlyMap<string, EnumMember>;
}

/**
 * Type checking utilities - ESSENTIAL ONLY
 */
export const TypeSpecTypeGuards = {
  /** Check if type is String */
  isString: (type: Type): type is StringType => type.kind === "String",
  
  /** Check if type is Boolean */  
  isBoolean: (type: Type): type is BooleanType => type.kind === "Boolean",
  
  /** Check if type is Number */
  isNumber: (type: Type): type is NumberType => type.kind === "Number",
  
  /** Check if type is Model */
  isModel: (type: Type): type is Model => type.kind === "Model",
  
  /** Check if type is Scalar */
  isScalar: (type: Type): type is Scalar => type.kind === "Scalar",
  
  /** Check if type is Union */
  isUnion: (type: Type): type is Union => type.kind === "Union",
  
  /** Check if type is Enum */
  isEnum: (type: Type): type is Enum => type.kind === "Enum"
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
  Duration: "time.Duration"
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
    if (TypeSpecTypeGuards.isNumber(type)) return this.mapNumberType(type);
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
    return (model as any).name || "UnknownModel";
  }
  
  /**
   * Map TypeSpec number types to Go types
   */
  private static mapNumberType(type: NumberType): string {
    // TypeSpec v1.7.0 number types
    switch ((type as any).name) {
      case "int8": return "int8";
      case "int16": return "int16";
      case "int32": return "int32";
      case "int64": return "int64";
      case "uint8": return "uint8";
      case "uint16": return "uint16";
      case "uint32": return "uint32";
      case "uint64": return "uint64";
      case "float32": return "float32";
      case "float64": return "float64";
      default: return "float64";
    }
  }
  
  /**
   * Map TypeSpec scalar types to Go types
   */
  private static mapScalarType(scalar: Scalar): string {
    const scalarName = (scalar as any).name;
    return GoCoreTypes[scalarName] || "interface{}";
  }
}

/**
 * Export for external usage
 */
export type { 
  Model as TypeSpecModelBase,
  Type as TypeSpecTypeBase,
  ModelProperty as TypeSpecPropertyBase
};