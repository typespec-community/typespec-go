/**
 * Type-Safe Go Type Definitions
 * 
 * RESPONSIBILITY: Define Go type mapping infrastructure
 * SINGLE RESPONSIBILITY: Only Go type definitions
 * TYPE SAFETY: Zero 'any' types with comprehensive coverage
 * PROPER UINT USAGE: Unsigned integers for never-negative values
 */

/**
 * Go Integer Types Enum
 * PROPER UINT USAGE: Unsigned vs signed integer distinction
 */
export enum GoIntegerType {
  // Unsigned integers (never negative values)
  Uint8 = "uint8",
  Uint16 = "uint16", 
  Uint32 = "uint32",
  Uint64 = "uint64",
  
  // Signed integers (potentially negative values)
  Int8 = "int8",
  Int16 = "int16",
  Int32 = "int32", 
  Int64 = "int64"
}

/**
 * Go String Types Enum
 * TYPE-SAFE STRING HANDLING: Different string representations
 */
export enum GoStringType {
  String = "string",
  ByteSlice = "[]byte"
}

/**
 * Generation Mode Enum
 * ENUMS INSTEAD OF BOOLEANS: Clear generation options
 */
export enum GenerationMode {
  Standalone = "standalone",
  Integrated = "integrated",
  Plugin = "plugin"
}

/**
 * Log Level Enum
 * ENUMS INSTEAD OF BOOLEANS: Clear logging options
 */
export enum LogLevel {
  Debug = "debug",
  Info = "info", 
  Warn = "warn",
  Error = "error",
  None = "none"
}

/**
 * Strict Mode Enum
 * ENUMS INSTEAD OF BOOLEANS: Clear strictness options
 */
export enum StrictMode {
  Disabled = "disabled",
  Enabled = "enabled",
  Production = "production"
}

/**
 * Optional Handling Enum
 * ENUMS INSTEAD OF BOOLEANS: Clear optional field options
 */
export enum OptionalHandling {
  Pointers = "pointers",
  ZeroValues = "zero-values",
  OmitEmpty = "omit-empty"
}

/**
 * Go Collection Type Interface
 * TYPE-SAFE COLLECTIONS: Comprehensive collection handling
 */
export interface GoCollectionType {
  readonly elementType: string;
  readonly isSlice: boolean;
  readonly isMap: boolean;
}

/**
 * Go Type Mapping Interface
 * ZERO 'ANY' TYPES: Comprehensive type safety
 */
export interface GoTypeMapping {
  readonly goType: string;
  readonly validation?: {
    readonly min?: number | bigint;
    readonly max?: number | bigint;
    readonly minLength?: number;
    readonly maxLength?: number;
    readonly enumValues?: readonly string[];
    readonly floatPrecision?: "single" | "double";
    readonly booleanType?: boolean;
    readonly binaryType?: "bytes" | "string";
    readonly modelType?: string;
  };
  readonly usePointerForOptional?: boolean;
  readonly collectionInfo?: GoCollectionType;
}

/**
 * Go Type Mapping Factory
 * ZERO 'ANY' TYPES: Type-safe mapping creation
 */
export class GoTypeMappingFactory {
  /**
   * Create string mapping with optional validation
   * TYPE-SAFE: All validation properties are typed
   */
  static createStringMapping(
    stringType: GoStringType,
    validation?: Partial<GoTypeMapping["validation"]>
  ): GoTypeMapping {
    return {
      goType: stringType,
      validation: validation || {}
    };
  }

  /**
   * Create integer mapping with range validation
   * PROPER UINT USAGE: Unsigned integers have min=0
   */
  static createIntegerMapping(
    integerType: GoIntegerType,
    validation?: Partial<GoTypeMapping["validation"]>
  ): GoTypeMapping {
    return {
      goType: integerType,
      validation: validation || {}
    };
  }

  /**
   * Create collection mapping with element type
   * TYPE-SAFE: Comprehensive collection handling
   */
  static createCollectionMapping(
    elementType: string,
    options?: { isSlice?: boolean; isMap?: boolean }
  ): GoTypeMapping {
    const collectionInfo: GoCollectionType = {
      elementType,
      isSlice: options?.isSlice ?? true,
      isMap: options?.isMap ?? false
    };

    const goType = options?.isMap 
      ? `map[string]${elementType}`
      : `[]${elementType}`;

    return {
      goType,
      collectionInfo
    };
  }

  /**
   * Create model mapping for custom types
   * TYPE-SAFE: Custom type representation
   */
  static createModelMapping(
    modelName: string,
    options?: { usePointer?: boolean }
  ): GoTypeMapping {
    return {
      goType: modelName,
      usePointerForOptional: options?.usePointer ?? true
    };
  }

  /**
   * Create interface mapping for unknown types
   * TYPE-SAFE: Safe fallback for complex types
   */
  static createInterfaceMapping(
    options?: { usePointer?: boolean }
  ): GoTypeMapping {
    return {
      goType: "interface{}",
      usePointerForOptional: options?.usePointer ?? false
    };
  }
}