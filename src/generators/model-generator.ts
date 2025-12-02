/**
 * Model Generator - TypeSpec Go Emitter
 *
 * MODEL GENERATION: Go struct generation from TypeSpec models
 * TYPE SAFETY: Comprehensive type mapping and validation
 */

import { ErrorFactory, GoEmitterResult, defaultErrorHandler } from "../domain/unified-errors.js";
import { CleanTypeMapper } from "../domain/clean-type-mapper.js";
import type { TypeSpecPropertyNode } from "../types/typespec-domain.js";
import { generateGoFieldName } from "../utils/string-utils.js";

/**
 * Generate Go struct model from TypeSpec model
 */
export function generateModel(model: {
  name: string;
  properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  extends?: string;
}): GoEmitterResult {
  // Input validation
  if (!model.name || typeof model.name !== "string") {
    return ErrorFactory.createValidationError("Invalid model: name must be a non-empty string", {
      modelName: model.name || "unknown",
    });
  }

  if (!model.properties || model.properties.size === 0) {
    return ErrorFactory.createValidationError("Invalid model: must have at least one property", {
      modelName: model.name,
      invalidValue: "empty properties",
    });
  }

  try {
    // Generate Go struct code
    const modelCode = generateModelCode(model);

    return ErrorFactory.createSuccess(new Map([[`${model.name}.go`, modelCode]]), {
      generatedFiles: [`${model.name}.go`],
      modelName: model.name,
      propertyCount: model.properties.size,
    });
  } catch (error) {
    return defaultErrorHandler(error, {
      operation: "generateModel",
      modelName: model.name,
      properties: Array.from(model.properties.keys()),
    });
  }
}

/**
 * Generate Go struct code from model definition
 */
function generateModelCode(model: {
  name: string;
  properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  extends?: string;
}): string {
  const lines: string[] = [];

  // Package declaration
  lines.push("package api");
  lines.push("");

  // Imports
  lines.push('import "encoding/json"');
  lines.push('import "time"');
  lines.push("");

  // Model documentation
  if (model.extends) {
    lines.push(`// ${model.name} - TypeSpec generated model (extends ${model.extends})`);
  } else {
    lines.push(`// ${model.name} - TypeSpec generated model`);
  }
  lines.push("");

  // Struct definition
  lines.push(`type ${model.name} struct {`);

  // Generate fields
  const fields = generateModelFields(model);
  lines.push(fields.join("\n"));

  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate struct fields from properties
 */
function generateModelFields(model: {
  properties: ReadonlyMap<string, TypeSpecPropertyNode>;
}): string[] {
  const fields: string[] = [];

  for (const [propName, propNode] of model.properties) {
    try {
      // Map TypeSpec type to Go type
      const typeMapping = CleanTypeMapper.mapTypeSpecType(propNode.type, propName);
      
      if (!typeMapping || !typeMapping.goType) {
        throw new Error(`Unsupported type for property: ${propName}`);
      }

      // Generate Go field name (capitalize first letter for export)
      const goFieldName = generateGoFieldName(propName);
      
      // Generate JSON tag
      const jsonTag = `"${propName}"`;
      
      // Handle optional fields with pointers
      let goType = typeMapping.goType;
      if (propNode.optional && typeMapping.usePointerForOptional) {
        goType = `*${goType}`;
      }

      // Build field line
      const fieldLine = `\t${goFieldName} ${goType} \`${jsonTag}\``;
      
      fields.push(fieldLine);
    } catch (error) {
      throw new Error(`Failed to generate field for ${propName}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return fields;
}