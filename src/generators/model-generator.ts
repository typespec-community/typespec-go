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
 * Parse template instantiation to extract base template properties
 */
function parseTemplateProperties(template: string): ReadonlyMap<string, TypeSpecPropertyNode> {
  const properties = new Map<string, TypeSpecPropertyNode>();
  
  // Parse template like "PaginatedResponse<User>"
  const match = template.match(/^(\w+)<(.+)>$/);
  if (match) {
    const [, baseTemplateName, templateArg] = match;
    
    // For now, we handle common template patterns
    if (baseTemplateName === "PaginatedResponse") {
      // PaginatedResponse has "data" property of type T
      properties.set("data", {
        name: "data",
        type: { kind: "model", name: templateArg },
        optional: false,
      });
      
      // Also has pagination property
      properties.set("pagination", {
        name: "pagination",
        type: { kind: "model", name: "PaginationInfo" },
        optional: false,
      });
    }
  }
  
  return properties;
}

/**
 * Generate Go struct model from TypeSpec model
 */
export function generateModel(model: {
  name: string;
  properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  extends?: string;
  template?: string; // Template definition like "<T>" or "PaginatedResponse<User>"
  propertiesFromExtends?: ReadonlyMap<string, TypeSpecPropertyNode>; // Support spread operator
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
  template?: string;
  propertiesFromExtends?: ReadonlyMap<string, TypeSpecPropertyNode>;
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
  if (model.template) {
    lines.push(`// Template: ${model.template}`);
  }
  lines.push("");

  // Handle template instantiation
  const allProperties = new Map<string, TypeSpecPropertyNode>();
  
  // If this is a template instantiation, add base template properties
  if (model.template && model.template.includes('<')) {
    const templateProperties = parseTemplateProperties(model.template);
    for (const [propName, propNode] of templateProperties) {
      allProperties.set(propName, propNode);
    }
  }
  
  // Add properties from extends (spread operator support)
  if (model.propertiesFromExtends) {
    for (const [propName, propNode] of model.propertiesFromExtends) {
      allProperties.set(propName, propNode);
    }
  }
  
  // Add main properties
  for (const [propName, propNode] of model.properties) {
    allProperties.set(propName, propNode);
  }

  // Struct definition
  lines.push(`type ${model.name} struct {`);

  // Handle struct embedding if extends is provided
  if (model.extends) {
    lines.push(`\t${model.extends}  // Embedded struct`);
  }

  // Generate fields
  const fields = generateModelFields(allProperties, model.name);
  lines.push(fields.join("\n"));

  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate struct fields from properties
 */
function generateModelFields(
  properties: ReadonlyMap<string, TypeSpecPropertyNode>,
  modelName?: string,
): string[] {
  const fields: string[] = [];

  for (const [propName, propNode] of properties) {
    try {
      // Map TypeSpec type to Go type
      const typeMapping = CleanTypeMapper.mapTypeSpecType(propNode.type, propName);
      
      if (!typeMapping || !typeMapping.goType) {
        throw new Error(`Unsupported type for property: ${propName}`);
      }

      // Generate Go field name (capitalize first letter for export)
      let goFieldName = generateGoFieldName(propName);
      
      // Special case: 'id' -> 'ID' for Go naming conventions
      if (propName.toLowerCase() === 'id') {
        goFieldName = 'ID';
      }

      // Generate JSON tag
      const jsonTag = `"${propName}"`;
      
      // Add omitempty for optional fields
      const optionalTag = propNode.optional ? ',omitempty' : '';

      // Handle optional fields with pointers
      let goType = typeMapping.goType;
      if (propNode.optional && typeMapping.usePointerForOptional) {
        goType = `*${goType}`;
      }

      // Handle cyclic dependencies with pointers
      if (propNode.type && typeof propNode.type === "object" && "name" in propNode.type) {
        const typeName = (propNode.type as { name: string }).name;
        if (modelName && (typeName === modelName || typeName === propName)) {
          // Self-reference or cyclic dependency, use pointer
          goType = `*${typeName}`;
        }
      }

      // Add comment for template types
      let templateComment = "";
      if (propNode.type && typeof propNode.type === "object" && "kind" in propNode.type && propNode.type.kind === "template") {
        templateComment = `  // Template type ${(propNode.type as { name: string }).name}`;
      }

      // Build field line
      const fieldLine = `\t${goFieldName} ${goType}${templateComment} \`${jsonTag}${optionalTag}\``;
      
      fields.push(fieldLine);
    } catch (error) {
      throw new Error(`Failed to generate field for ${propName}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return fields;
}