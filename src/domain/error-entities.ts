/**
 * Error Entities - TypeSpec Go Emitter
 *
 * DOMAIN ENTITIES: Core business objects
 * TYPE SAFETY: Compile-time validation
 * IMMUTABILITY: Readonly interfaces
 * VALIDATION: Built-in validation logic
 */

/**
 * TypeSpec ID - Unique identifier for TypeSpec elements
 */
export interface TypeSpecId {
  readonly _tag: "typespec_id";
  readonly value: string;
  readonly namespace?: string;
  readonly name: string;
}

/**
 * Model Name - TypeSpec model identifier
 */
export interface ModelName {
  readonly _tag: "model_name";
  readonly value: string;
  readonly isExported: boolean;
  readonly packagePath?: string;
}

/**
 * Property Name - TypeSpec property identifier
 */
export interface PropertyName {
  readonly _tag: "property_name";
  readonly value: string;
  readonly isOptional: boolean;
  readonly isKey: boolean;
}

/**
 * Error ID - Unique error identifier
 */
export interface ErrorId {
  readonly _tag: "error_id";
  readonly value: string;
  readonly timestamp: Date;
  readonly sequence: number;
}

/**
 * File Name - Generated file identifier
 */
export interface FileName {
  readonly _tag: "file_name";
  readonly value: string;
  readonly extension: string;
  readonly path?: string;
  readonly isPackage: boolean;
}

/**
 * Entity factory functions
 */
export class Entities {
  /**
   * Create TypeSpec ID
   */
  static createTypeSpecId(value: string, namespace?: string): TypeSpecId {
    const parts = value.split(".");
    return {
      _tag: "typespec_id",
      value,
      namespace: namespace || (parts.length > 1 ? parts[0] : undefined),
      name: parts[parts.length - 1],
    };
  }

  /**
   * Create Model Name
   */
  static createModelName(value: string, packagePath?: string): ModelName {
    return {
      _tag: "model_name",
      value,
      isExported: /^[A-Z]/.test(value),
      packagePath,
    };
  }

  /**
   * Create Property Name
   */
  static createPropertyName(value: string, isOptional = false, isKey = false): PropertyName {
    return {
      _tag: "property_name",
      value,
      isOptional,
      isKey,
    };
  }

  /**
   * Create Error ID
   */
  static createErrorId(sequence = 0): ErrorId {
    return {
      _tag: "error_id",
      value: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sequence,
    };
  }

  /**
   * Create File Name
   */
  static createFileName(value: string, path?: string, isPackage = false): FileName {
    const parts = value.split(".");
    const extension = parts.length > 1 ? parts[parts.length - 1] : "";
    return {
      _tag: "file_name",
      value,
      extension,
      path,
      isPackage,
    };
  }

  /**
   * Validate TypeSpec ID
   */
  static validateTypeSpecId(id: TypeSpecId): boolean {
    return (id.value.length > 0 && id.name.length > 0);
  }

  /**
   * Validate Model Name
   */
  static validateModelName(name: ModelName): boolean {
    return name.value.length > 0 && /^[A-Za-z][A-Za-z0-9_]*$/.test(name.value);
  }

  /**
   * Validate Property Name
   */
  static validatePropertyName(name: PropertyName): boolean {
    return name.value.length > 0 && /^[a-z][A-Za-z0-9_]*$/.test(name.value);
  }

  /**
   * Validate Error ID
   */
  static validateErrorId(id: ErrorId): boolean {
    return id.value.length > 0;
  }

  /**
   * Validate File Name
   */
  static validateFileName(name: FileName): boolean {
    return name.value.length > 0;
  }
}

/**
 * Entity validation utilities
 */
export class EntityValidation {
  /**
   * Validate all entities in an object
   */
  static validateEntities(entities: Record<string, unknown>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    let isValid = true;

    for (const [key, entity] of Object.entries(entities)) {
      if (!entity || typeof entity !== "object") {
        errors.push(`Entity ${key} is not an object`);
        isValid = false;
        continue;
      }

      const typedEntity = entity as { _tag: string };
      if (!typedEntity._tag) {
        errors.push(`Entity ${key} missing _tag property`);
        isValid = false;
        continue;
      }

      switch (typedEntity._tag) {
        case "typespec_id":
          if (!Entities.validateTypeSpecId(entity as TypeSpecId)) {
            errors.push(`Invalid TypeSpecId: ${key}`);
            isValid = false;
          }
          break;
        case "model_name":
          if (!Entities.validateModelName(entity as ModelName)) {
            errors.push(`Invalid ModelName: ${key}`);
            isValid = false;
          }
          break;
        case "property_name":
          if (!Entities.validatePropertyName(entity as PropertyName)) {
            errors.push(`Invalid PropertyName: ${key}`);
            isValid = false;
          }
          break;
        case "error_id":
          if (!Entities.validateErrorId(entity as ErrorId)) {
            errors.push(`Invalid ErrorId: ${key}`);
            isValid = false;
          }
          break;
        case "file_name":
          if (!Entities.validateFileName(entity as FileName)) {
            errors.push(`Invalid FileName: ${key}`);
            isValid = false;
          }
          break;
        default:
          errors.push(`Unknown entity type: ${typedEntity._tag} for ${key}`);
          isValid = false;
      }
    }

    return { isValid, errors };
  }

  /**
   * Validate TypeSpec model structure
   */
  static validateTypeSpecModel(model: unknown): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!model || typeof model !== "object") {
      errors.push("Model must be an object");
      return { isValid: false, errors };
    }

    const typedModel = model as { name: unknown; properties: unknown };

    if (!typedModel.name || typeof typedModel.name !== "string") {
      errors.push("Model must have a valid name");
    }

    if (!typedModel.properties) {
      errors.push("Model must have properties");
    } else if (typeof typedModel.properties !== "object") {
      errors.push("Model properties must be an object");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate Go field structure
   */
  static validateGoField(field: unknown): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!field || typeof field !== "object") {
      errors.push("Field must be an object");
      return { isValid: false, errors };
    }

    const typedField = field as { name: unknown; type: unknown; jsonTag: unknown };

    if (!typedField.name || typeof typedField.name !== "string") {
      errors.push("Field must have a valid name");
    }

    if (!typedField.type || typeof typedField.type !== "string") {
      errors.push("Field must have a valid type");
    }

    if (!typedField.jsonTag || typeof typedField.jsonTag !== "string") {
      errors.push("Field must have a valid jsonTag");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Entity transformation utilities
 */
export class EntityTransformation {
  /**
   * TypeSpec model to Go model name
   */
  static typeSpecToGoModel(typespecModel: string): ModelName {
    // Remove namespace, keep only the model name
    const parts = typespecModel.split(".");
    const modelName = parts[parts.length - 1];
    return Entities.createModelName(modelName);
  }

  /**
   * TypeSpec property to Go field name
   */
  static typeSpecToGoField(typespecProperty: string, isOptional = false): PropertyName {
    // Convert camelCase to PascalCase for Go exported fields
    const goFieldName = typespecProperty.charAt(0).toUpperCase() + typespecProperty.slice(1);
    return Entities.createPropertyName(goFieldName, isOptional);
  }

  /**
   * File path to FileName entity
   */
  static filePathToFileName(filePath: string): FileName {
    const parts = filePath.split("/");
    const fileName = parts[parts.length - 1];
    const path = parts.slice(0, -1).join("/");
    return Entities.createFileName(fileName, path);
  }

  /**
   * Go type to TypeSpec type mapping
   */
  static goToTypeSpecType(goType: string): {
    typeSpecType: string;
    confidence: "high" | "medium" | "low";
  } {
    const typeMappings: Record<
      string,
      { typeSpecType: string; confidence: "high" | "medium" | "low" }
    > = {
      string: { typeSpecType: "string", confidence: "high" },
      int32: { typeSpecType: "int32", confidence: "high" },
      int64: { typeSpecType: "int64", confidence: "high" },
      float64: { typeSpecType: "float64", confidence: "high" },
      bool: { typeSpecType: "boolean", confidence: "high" },
      "time.Time": { typeSpecType: "utcDateTime", confidence: "medium" },
      "[]byte": { typeSpecType: "bytes", confidence: "medium" },
    };

    return (
      typeMappings[goType] || {
        typeSpecType: "unknown",
        confidence: "low" as const,
      }
    );
  }
}

/**
 * Type guards for entities
 */
export const isEntity = {
  isTypeSpecId: (value: unknown): value is TypeSpecId =>
    typeof value === "object" && value !== null && (value as TypeSpecId)._tag === "typespec_id",

  isModelName: (value: unknown): value is ModelName =>
    typeof value === "object" && value !== null && (value as ModelName)._tag === "model_name",

  isPropertyName: (value: unknown): value is PropertyName =>
    typeof value === "object" && value !== null && (value as PropertyName)._tag === "property_name",

  isErrorId: (value: unknown): value is ErrorId =>
    typeof value === "object" && value !== null && (value as ErrorId)._tag === "error_id",

  isFileName: (value: unknown): value is FileName =>
    typeof value === "object" && value !== null && (value as FileName)._tag === "file_name",
};
