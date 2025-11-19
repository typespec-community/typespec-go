/**
 * Type-safe Standalone Generator
 *
 * PROFESSIONAL TYPE SAFETY: Zero any types
 * UNIFIED ERROR SYSTEM: Single source of truth for error handling
 * EXHAUSTIVE MATCHING: Compile-time safety enforced
 * CUSTOMER VALUE: Working Go generation with professional quality
 */

import { 
  ErrorFactory, 
  GoEmitterResult, 
  ErrorHandler,
  InvalidModelReason 
} from "./domain/unified-errors.js";

/**
 * Go type mapping configuration
 */
interface GoTypeMapping {
  /** Go type string */
  readonly goType: string;
  /** Whether to use pointer for optional fields */
  readonly usePointerForOptional: boolean;
}

/**
 * Type-safe TypeSpec type definitions
 * ZERO ANY TYPES: Comprehensive type coverage
 */
export interface TypeSpecTypeNode {
  readonly kind:
    | "String"
    | "Int8"
    | "Int16"
    | "Int32"
    | "Int64"
    | "Uint8"
    | "Uint16"
    | "Uint32"
    | "Uint64"
    | "Float32"
    | "Float64"
    | "Boolean"
    | "Bytes"
    | "Array"
    | "Model"
    | "Enum"
    | "Union";
}

export interface TypeSpecPropertyNode {
  readonly name: string;
  readonly type: TypeSpecTypeNode;
  readonly optional: boolean;
  readonly documentation?: string;
}

/**
 * Type-safe Go type mapping
 * EXHAUSTIVE TYPE MATCHING: All types covered
 */
interface GoTypeMapping {
  readonly goType: string;
  readonly usePointerForOptional: boolean;
}

/**
 * Type-safe Standalone Go Generator
 *
 * ZERO ANY TYPES: Professional type safety
 * EXHAUSTIVE MATCHING: Compile-time safety
 * CUSTOMER VALUE: Working Go generation
 */
export class StandaloneGoGenerator {
  /**
   * Configuration options for Go generation
   */
  private options?: {
    "output-dir"?: string;
    "go-package"?: string;
  };

  constructor(options?: { "output-dir"?: string; "go-package"?: string }) {
    this.options = options;
  }

  /**
   * Type-safe type mapping
   * ZERO ANY TYPES: Comprehensive coverage
   */
  private static TYPE_MAPPINGS: Record<
    TypeSpecTypeNode["kind"],
    GoTypeMapping
  > = {
    String: { goType: "string", usePointerForOptional: true },
    Int8: { goType: "int8", usePointerForOptional: true },
    Int16: { goType: "int16", usePointerForOptional: true },
    Int32: { goType: "int32", usePointerForOptional: true },
    Int64: { goType: "int64", usePointerForOptional: true },
    Uint8: { goType: "uint8", usePointerForOptional: true },
    Uint16: { goType: "uint16", usePointerForOptional: true },
    Uint32: { goType: "uint32", usePointerForOptional: true },
    Uint64: { goType: "uint64", usePointerForOptional: true },
    Float32: { goType: "float32", usePointerForOptional: true },
    Float64: { goType: "float64", usePointerForOptional: true },
    Boolean: { goType: "bool", usePointerForOptional: true },
    Bytes: { goType: "[]byte", usePointerForOptional: true },
    Array: { goType: "[]interface{}", usePointerForOptional: false },
    Model: { goType: "interface{}", usePointerForOptional: false },
    Enum: { goType: "string", usePointerForOptional: true },
    Union: { goType: "interface{}", usePointerForOptional: false },
  } as const;

  /**
   * Type-safe type mapping
   * UNIFIED ERROR SYSTEM: Uses Result pattern but returns GoTypeMapping for internal use
   */
  static mapTypeSpecType(type: TypeSpecTypeNode): GoTypeMapping {
    const mapping = this.TYPE_MAPPINGS[type.kind];
    if (!mapping) {
      throw ErrorFactory.createTypeSpecCompilerError(
        `Unsupported TypeSpec type: ${type.kind}`,
        {
          resolution: "Use supported TypeSpec types: string, int32, int64, bool, arrays, models",
        },
      );
    }
    return mapping;
  }

  /**
   * Type-safe model generation
   * UNIFIED ERROR SYSTEM: Returns GoEmitterResult instead of throwing
   */
  generateModel(model: {
    name: string;
    properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  }): GoEmitterResult {
    // Input validation
    if (!model.name || typeof model.name !== "string") {
      return ErrorFactory.createModelValidationError(
        "Invalid model: name must be a non-empty string",
        model.name || "unknown",
        InvalidModelReason.EmptyName,
        {
          resolution: "Provide a valid model name",
        },
      );
    }

    if (!model.properties || model.properties.size === 0) {
      return ErrorFactory.createModelValidationError(
        "Invalid model: must have at least one property",
        model.name,
        InvalidModelReason.NoProperties,
        {
          context: { propertyCount: model.properties?.size },
          resolution: "Add at least one property to the model",
        },
      );
    }

    try {
      const goCode = this.generateStruct(model.name, Array.from(model.properties.values()));
      return ErrorFactory.createSuccess(new Map([[`${model.name}.go`, goCode]]), {
        generatedFiles: [`${model.name}.go`],
      });
    } catch (error) {
      return ErrorFactory.createGoCodeGenerationError(
        `Failed to generate Go struct: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          fileName: `${model.name}.go`,
          goCode: undefined,
          resolution: "Check model properties and type mappings",
        },
      );
    }
  }

  /**
   * Type-safe struct generation
   * ZERO ANY TYPES: Professional type safety
   */
  generateStruct(name: string, properties: TypeSpecPropertyNode[]): string {
    const fields = properties.map((prop) => this.generateField(prop));

    return this.createGoFile(name, fields);
  }

  /**
   * Type-safe field generation
   * UNIFIED ERROR SYSTEM: Proper error handling for unsupported types
   */
  private generateField(property: TypeSpecPropertyNode): string {
    const goName =
      property.name.charAt(0).toUpperCase() + property.name.slice(1);
    
    try {
      const mapping = StandaloneGoGenerator.mapTypeSpecType(property.type);
      const goType =
        property.optional && mapping.usePointerForOptional
          ? `*${mapping.goType}`
          : mapping.goType;

      const jsonTag = property.optional
        ? `json:"${property.name},omitempty"`
        : `json:"${property.name}"`;

      return `  ${goName} ${goType} \`${jsonTag}\``;
    } catch (error) {
      // This will be caught by the outer try-catch in generateModel
      throw new Error(`Failed to generate field ${property.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create Go file with proper structure
   * ZERO ANY TYPES: Professional type safety
   */
  private createGoFile(name: string, fields: string[]): string {
    const structName = this.capitalizeStructName(name);
    const fieldDefinitions = fields.join("\n");

    return `package api

// Auto-generated from TypeSpec model: ${name}
// Generated by Type-safe Professional Go Emitter
type ${structName} struct {
${fieldDefinitions}
}`;
  }

  /**
   * Capitalize struct name for Go conventions
   */
  private capitalizeStructName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
