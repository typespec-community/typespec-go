/**
 * JSX Type Safety Layer for TypeSpec Go Emitter
 *
 * TYPE SAFETY: Professional JSX component typing
 * ZERO ANY TYPES: Strict TypeScript constraints
 * COMPONENT WRAPPERS: Type-safe Alloy.js integration
 */

// Type definitions for now - actual JSX integration will come later
export interface GoFieldConfig {
  readonly name: string;
  readonly type: string;
  readonly optional: boolean;
  readonly jsonTag: string;
  readonly documentation?: string;
}

export interface GoStructConfig {
  readonly name: string;
  readonly fields: readonly GoFieldConfig[];
  readonly documentation?: string;
  readonly packageName?: string;
}

export interface GoFileConfig {
  readonly path: string;
  readonly packageName: string;
  readonly imports: readonly string[];
  readonly structs: readonly GoStructConfig[];
  readonly documentation?: string;
}

export type GoJsxComponent = string; // Placeholder for now

/**
 * Type-safe component factory
 * COMPONENT SAFETY: Ensures valid component creation
 */
export class GoJsxComponentFactory {
  /**
   * Create type-safe field configuration
   * TYPE SAFETY: Validated field creation
   */
  static createField(config: GoFieldConfig): GoFieldConfig {
    // Validate required fields
    if (!config.name?.trim()) {
      throw new Error("Field name is required");
    }
    if (!config.type?.trim()) {
      throw new Error("Field type is required");
    }
    if (!config.jsonTag?.trim()) {
      throw new Error("JSON tag is required");
    }

    // Return validated config
    return {
      name: config.name.trim(),
      type: config.type.trim(),
      optional: Boolean(config.optional),
      jsonTag: config.jsonTag.trim(),
      documentation: config.documentation?.trim()
    };
  }

  /**
   * Create type-safe struct configuration
   * TYPE SAFETY: Validated struct creation
   */
  static createStruct(config: GoStructConfig): GoStructConfig {
    // Validate required fields
    if (!config.name?.trim()) {
      throw new Error("Struct name is required");
    }
    if (!Array.isArray(config.fields) || config.fields.length === 0) {
      throw new Error("Struct must have at least one field");
    }

    // Validate all fields
    const validatedFields = config.fields.map(field => this.createField(field));

    return {
      name: config.name.trim(),
      fields: validatedFields,
      documentation: config.documentation?.trim(),
      packageName: config.packageName?.trim()
    };
  }

  /**
   * Create type-safe file configuration
   * TYPE SAFETY: Validated file creation
   */
  static createFile(config: GoFileConfig): GoFileConfig {
    // Validate required fields
    if (!config.path?.trim()) {
      throw new Error("File path is required");
    }
    if (!config.packageName?.trim()) {
      throw new Error("Package name is required");
    }
    if (!Array.isArray(config.structs) || config.structs.length === 0) {
      throw new Error("File must contain at least one struct");
    }

    // Validate all structs
    const validatedStructs = config.structs.map(struct => this.createStruct(struct));

    return {
      path: config.path.trim(),
      packageName: config.packageName.trim(),
      imports: Array.isArray(config.imports) ? [...config.imports] : [],
      structs: validatedStructs,
      documentation: config.documentation?.trim()
    };
  }
}

/**
 * Type-safe utility functions
 * TYPE SAFETY: Helper functions with strict typing
 */
export class GoJsxUtils {
  /**
   * Convert TypeSpec kind to Go type with type safety
   * TYPE SAFETY: No any types, strict mapping
   */
  static typeSpecKindToGoType(kind: string): string {
    const typeMapping: Record<string, string> = {
      "String": "string",
      "Boolean": "bool", 
      "Int8": "int8",
      "Int16": "int16",
      "Int32": "int32",
      "Int64": "int64",
      "Uint8": "uint8",
      "Uint16": "uint16", 
      "Uint32": "uint32",
      "Uint64": "uint64",
      "Float32": "float32",
      "Float64": "float64"
    };

    const goType = typeMapping[kind];
    if (!goType) {
      throw new Error(`Unsupported TypeSpec kind: ${kind}`);
    }

    return goType;
  }

  /**
   * Generate JSON tag with type safety
   * TYPE SAFETY: Proper tag generation
   */
  static generateJsonTag(fieldName: string): string {
    if (!fieldName?.trim()) {
      throw new Error("Field name is required for JSON tag generation");
    }

    // Convert camelCase to snake_case
    const snakeCase = fieldName
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase();

    return snakeCase === fieldName ? fieldName : snakeCase;
  }

  /**
   * Check if field should be exported (uppercase) with type safety
   * TYPE SAFETY: Proper export determination
   */
  static shouldExport(fieldName: string): boolean {
    if (!fieldName?.trim()) {
      throw new Error("Field name is required for export check");
    }

    // Go exports: first letter uppercase
    return fieldName.charAt(0) === fieldName.charAt(0).toUpperCase();
  }
}

export const GoJsxComponents = {
  ComponentFactory: GoJsxComponentFactory,
  Utils: GoJsxUtils
} as const;

export default GoJsxComponents;