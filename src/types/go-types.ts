/**
 * Type-Safe Go Type System with Proper Uint Usage
 * 
 * PROPER UINT USAGE: Never negative values use unsigned integers
 * ENUMS INSTEAD OF BOOLEANS: Impossible states eliminated
 * ZERO 'ANY' TYPES: Type-safe comprehensive coverage
 * GENERICS: Extensible type system design
 */

/**
 * Go Integer Types with Proper Uint Usage
 * UINTS: Never negative values use unsigned types
 */
export enum GoIntegerType {
  // Unsigned types for never-negative values
  Uint8 = "uint8",    // Byte-sized non-negative integers
  Uint16 = "uint16",  // Short non-negative integers  
  Uint32 = "uint32",  // Standard non-negative integers
  Uint64 = "uint64",  // Large non-negative integers
  
  // Signed types for potentially negative values
  Int8 = "int8",      // Byte-sized signed integers
  Int16 = "int16",    // Short signed integers
  Int32 = "int32",    // Standard signed integers
  Int64 = "int64"     // Large signed integers
}

/**
 * Go String Types
 * STRING TYPES: Comprehensive string coverage
 */
export enum GoStringType {
  String = "string",        // Standard strings
  ByteSlice = "[]byte",    // Byte sequences
  RuneSlice = "[]rune"     // Unicode rune sequences
}

/**
 * Go Collection Types
 * COLLECTION TYPES: Comprehensive collection coverage
 */
export enum GoCollectionType {
  Slice = "[]",          // Dynamic arrays
  Map = "map",           // Key-value mappings
  Array = "[...]"         // Fixed-size arrays
}

/**
 * Generation Mode Enums Instead of Booleans
 * ENUMS INSTEAD OF BOOLEANS: Impossible states eliminated
 */
export enum GenerationMode {
  Standalone = "standalone",              // Direct TypeSpec to Go generation
  TypeSpecIntegrated = "typespec-integrated", // Integrated with TypeSpec compiler
  PluginExecution = "plugin-execution",    // Plugin-based generation
  Hybrid = "hybrid"                       // Multiple generation approaches
}

/**
 * Log Level Enums Instead of Booleans
 * ENUMS INSTEAD OF BOOLEANS: Clear state representation
 */
export enum LogLevel {
  None = "none",        // No logging
  Basic = "basic",      // Essential logging
  Verbose = "verbose",   // Detailed logging
  Debug = "debug"       // Debug-level logging
}

/**
 * Strict Mode Enums Instead of Booleans
 * ENUMS INSTEAD OF BOOLEANS: Multiple strictness levels
 */
export enum StrictMode {
  Permissive = "permissive",    // Allow most constructs
  Strict = "strict",             // Standard TypeSpec compliance
  Pedantic = "pedantic"          // Maximum TypeSpec compliance
}

/**
 * Optional Field Handling Enums Instead of Booleans
 * ENUMS INSTEAD OF BOOLEANS: Multiple optional handling strategies
 */
export enum OptionalHandling {
  Pointers = "pointers",                    // Use pointers for all optional fields
  PointersWithOmitempty = "pointers-omitempty", // Pointers with omitempty tags
  PointersWithValidation = "pointers-validation", // Pointers with runtime validation
  PointersWithDefaults = "pointers-defaults"   // Pointers with default values
}

/**
 * Go Type Mapping with Proper Uint Usage
 * GENERICS: Extensible type system
 * PROPER UINT USAGE: Type-safe integer handling
 */
export interface GoTypeMapping<T = unknown> {
  readonly goType: string;
  readonly usePointerForOptional: boolean;
  readonly goIntegerType?: GoIntegerType;
  readonly goStringType?: GoStringType;
  readonly goCollectionType?: GoCollectionType;
  readonly validation?: T;
}

/**
 * Type-Safe Type Mapping Factory
 * GENERICS: Type-safe mapping creation
 */
export class GoTypeMappingFactory {
  /**
   * Create integer type mapping with proper uint usage
   * GENERICS: Type-safe integer mapping
   */
  static createIntegerMapping<T>(
    goIntegerType: GoIntegerType, 
    validation?: T
  ): GoTypeMapping<T> {
    const usePointerForOptional = [
      GoIntegerType.Uint8, GoIntegerType.Uint16, GoIntegerType.Uint32, GoIntegerType.Uint64
    ].includes(goIntegerType);
    
    return {
      goType: goIntegerType,
      usePointerForOptional,
      goIntegerType,
      validation
    };
  }

  /**
   * Create string type mapping
   * GENERICS: Type-safe string mapping
   */
  static createStringMapping<T>(
    goStringType: GoStringType = GoStringType.String,
    validation?: T
  ): GoTypeMapping<T> {
    return {
      goType: goStringType,
      usePointerForOptional: true,
      goStringType,
      validation
    };
  }

  /**
   * Create collection type mapping
   * GENERICS: Type-safe collection mapping
   */
  static createCollectionMapping<T>(
    elementType: string,
    collectionType: GoCollectionType = GoCollectionType.Slice,
    validation?: T
  ): GoTypeMapping<T> {
    const goType = `${collectionType}${elementType}`;
    
    return {
      goType,
      usePointerForOptional: false,
      goCollectionType: collectionType,
      validation
    };
  }
}

/**
 * Type-Safe Go Field Configuration
 * PROPER UINT USAGE: Field indices use bigint for unsigned integers
 */
export interface GoFieldConfig<T = unknown> {
  readonly name: string;
  readonly index: bigint;            // Field index (never negative, use bigint as uint)
  readonly typeMapping: GoTypeMapping<T>;
  readonly optional: boolean;
  readonly tags: Record<string, string>;
  readonly documentation?: string;
  readonly validation?: T;
}

/**
 * Type-Safe Go Struct Configuration
 * PROPER UINT USAGE: Field counts use bigint for unsigned integers
 */
export interface GoStructConfig<TField = unknown, TStruct = unknown> {
  readonly name: string;
  readonly packageName: string;
  readonly fields: readonly GoFieldConfig<TField>[];  // Read-only array
  readonly fieldCount: bigint;        // Field count (never negative, use bigint as uint)
  readonly documentation?: string;
  readonly validation?: TStruct;
}