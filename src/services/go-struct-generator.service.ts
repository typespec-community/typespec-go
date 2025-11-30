/**
 * Domain-Driven Go Struct Generation Service
 *
 * COMPREHENSIVE ERROR HANDLING WITH DISCRIMINATED UNIONS
 * TYPE-SAFE STRUCT GENERATION
 * PURE FUNCTIONS ONLY
 */

import type { Program, Model, Type } from "@typespec/compiler";
import type {
  GoStructGenerationResult,
  GoStructField,
  GoGeneratorConfig,
  TypeMappingResult,
} from "../types/emitter.types.js";
import { createGoStructField } from "./type-mapping.service.js";

/**
 * Type mapping error interface with field tracking
 */
interface FieldTypeMappingError {
  fieldName: string;
  typeError: TypeMappingResult;
}

/**
 * Generate Go struct field code with proper formatting and validation
 */
function generateGoFieldCode(field: GoStructField): string {
  const optionalPointer = field.isOptional ? "*" : "";
  return `\t${field.name} ${optionalPointer}${field.goType} \`${field.jsonTag}\``;
}

/**
 * Validate Go struct name and field names
 */
function validateGoStruct(model: Model): readonly string[] {
  const errors: string[] = [];

  // Validate struct name
  if (!model.name || model.name.trim() === "") {
    errors.push("Struct name cannot be empty");
  }

  // Validate field names
  if (model.properties) {
    for (const [fieldName] of model.properties) {
      if (!fieldName || fieldName.trim() === "") {
        errors.push(`Field name cannot be empty in struct ${model.name}`);
      }

      // Check for invalid Go identifiers
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldName)) {
        errors.push(`Invalid Go field name: ${fieldName} in struct ${model.name}`);
      }
    }
  }

  return errors;
}

/**
 * Generate Go struct with comprehensive validation and error handling
 */
export function generateGoStruct(
  program: Program,
  model: Model,
  config: GoGeneratorConfig,
): GoStructGenerationResult {
  // Validate model first
  const validationErrors = validateGoStruct(model);
  if (validationErrors.length > 0) {
    return {
      _tag: "invalid-model",
      modelName: model.name || "<unnamed>",
      errors: validationErrors,
    };
  }

  try {
    // Generate struct fields with type safety
    const fields: GoStructField[] = [];
    const typeMappingErrors: FieldTypeMappingError[] = [];

    if (model.properties) {
      for (const [fieldName, prop] of model.properties) {
        try {
          const goField = createGoStructField(
            program,
            fieldName,
            prop.type,
            prop.optional || false,
          );

          fields.push(goField);

          // Track type mapping failures for later
          const typeMapping = mapTypeSpecType(program, prop.type);
          if (typeMapping._tag !== "success") {
            typeMappingErrors.push({
              fieldName,
              typeError: typeMapping,
            });
          }
        } catch (error) {
          return {
            _tag: "type-mapping-failure",
            fieldName,
            typeError: {
              _tag: "unsupported-type",
              type: prop.type,
              reason: error instanceof Error ? error.message : String(error),
            },
          };
        }
      }
    }

    // Return if we have type mapping failures
    if (typeMappingErrors.length > 0) {
      return {
        _tag: "type-mapping-failure",
        fieldName: typeMappingErrors[0].fieldName,
        typeError: typeMappingErrors[0].typeError,
      };
    }

    // Generate struct code
    const structCode = generateStructCode(model.name, fields, config);

    return {
      _tag: "success",
      structCode,
      fieldCount: fields.length,
    };
  } catch (error) {
    return {
      _tag: "invalid-model",
      modelName: model.name || "<unnamed>",
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

/**
 * Generate complete Go struct code with proper formatting
 */
function generateStructCode(
  structName: string,
  fields: GoStructField[],
  config: GoGeneratorConfig,
): string {
  if (fields.length === 0) {
    if (!config.omitEmpty) {
      return `type ${structName} struct {}\n`;
    }
    return "";
  }

  let code = `type ${structName} struct {\n`;

  for (const field of fields) {
    code += generateGoFieldCode(field) + "\n";
  }

  code += "}\n\n";

  return code;
}

/**
 * Import the type mapping function (needed to avoid circular imports)
 */
function mapTypeSpecType(program: Program, type: Type): TypeMappingResult {
  // This would be imported from type-mapping.service
  // For now, inline to avoid circular imports
  switch (type.kind) {
    case "String":
      return { _tag: "success", result: "string" };
    case "Boolean":
      return { _tag: "success", result: "bool" };
    case "Number":
      return { _tag: "success", result: "float64" };
    case "Scalar":
      return { _tag: "success", result: "interface{}" };
    case "Model":
      return { _tag: "success", result: (type as Model).name || "interface{}" };
    default:
      return { _tag: "success", result: "interface{}" };
  }
}

/**
 * Generate package header with proper imports
 */
export function generatePackageHeader(config: GoGeneratorConfig): string {
  let header = `package ${config.packageName}\n\n`;

  // Add time import if needed
  if (config.generateTimePackage) {
    header += `import "time"\n\n`;
  }

  return header;
}
