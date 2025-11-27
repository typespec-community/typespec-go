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
    if (TypeSpecTypeGuards.isNumber(type)) return this.mapNumericByName(type);
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
   * Map TypeSpec number types to Go types
   */
  private static mapNumberType(type: NumberType): string {
    // TypeSpec v1.7.0 number types
    // NumericLiteral doesn't have name, use value to determine type
    const value = type.value;
    if (Number.isInteger(value)) {
      if (value >= 0) {
        if (value <= 255) return "uint8";
        if (value <= 65535) return "uint16";
        if (value <= 4294967295) return "uint32";
        return "uint64";
      } else {
        if (value >= -128 && value <= 127) return "int8";
        if (value >= -32768 && value <= 32767) return "int16";
        if (value >= -2147483648 && value <= 2147483647) return "int32";
        return "int64";
      }
    }
    return "float64";
  }
  
  /**
   * Map numeric type based on intrinsic scalar name if available
   */
  private static mapNumericByName(type: NumberType): string {
    // Check if this is a numeric type with a name (intrinsic scalar)
    const typeString = type.valueAsString;
    if (typeString === "int8") return "int8";
    if (typeString === "int16") return "int16";
    if (typeString === "int32") return "int32";
    if (typeString === "int64") return "int64";
    if (typeString === "uint8") return "uint8";
    if (typeString === "uint16") return "uint16";
    if (typeString === "uint32") return "uint32";
    if (typeString === "uint64") return "uint64";
    if (typeString === "float32") return "float32";
    if (typeString === "float64") return "float64";
    
    // Fallback to value-based mapping
    return this.mapNumberType(type);
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
  ModelProperty as TypeSpecPropertyBase
};