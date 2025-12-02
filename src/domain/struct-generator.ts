import {
  ErrorFactory,
  GoEmitterResult,
  defaultErrorHandler,
} from "./unified-errors.js";
import { CleanTypeMapper } from "./clean-type-mapper.js";
import type {
  TypeSpecPropertyNode,
} from "../types/typespec-domain.js";
import { GeneratorUtils } from "./generator-utils.js";

/**
 * Type-safe Struct Generator
 * Handles generation of Go structs from TypeSpec models
 */
export class StructGenerator {
  /**
   * Type-safe model generation
   * UNIFIED ERROR SYSTEM: Returns GoEmitterResult instead of throwing
   */
  generateModel(model: {
    name: string;
    properties: ReadonlyMap<string, TypeSpecPropertyNode>;
    template?: string; // Template definition like "<T>" or "PaginatedResponse<User>"
    extends?: string; // Support Go struct embedding
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
      });
    }

    try {
      // Generate Go struct code using CleanTypeMapper
      const structCode = this.generateStructCode(model);

      return ErrorFactory.createSuccess(new Map([[`${model.name}.go`, structCode]]), {
        generatedFiles: [`${model.name}.go`],
        modelName: model.name,
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
   * DELEGATES TO CLEAN TYPE MAPPER: No duplicate mapping logic
   */
  private generateStructCode(model: {
    name: string;
    properties: ReadonlyMap<string, TypeSpecPropertyNode>;
    template?: string;
    extends?: string;
    propertiesFromExtends?: ReadonlyMap<string, TypeSpecPropertyNode>;
  }): string {
    const lines: string[] = [];

    // Package declaration
    GeneratorUtils.addPackageDeclaration(lines);

    // Imports (could be enhanced to track actual usage)
    lines.push('import "encoding/json"');
    lines.push('import "time"');
    lines.push("");

    // Model documentation
    lines.push(`// ${model.name} - TypeSpec generated model`);
    if (model.template) {
      lines.push(`// Template: ${model.template}`);
    }
    lines.push("");

    // Handle template instantiation
    const allProperties = new Map<string, TypeSpecPropertyNode>();
    
    // If this is a template instantiation, add base template properties
    if (model.template && model.template.includes('<')) {
      const templateProperties = this.parseTemplateProperties(model.template);
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

    // Struct declaration
    lines.push(`type ${model.name} struct {`);

    // Handle struct embedding if extends is provided
    if (model.extends) {
      lines.push(`\t${model.extends}  // Embedded struct`);
    }

    // Add all properties
    for (const [propName, propNode] of allProperties) {
      const fieldCode = this.generateStructField(propName, propNode);
      if (fieldCode) {
        lines.push(`\t${fieldCode}`);
      }
    }

    lines.push("}");
    lines.push("");

    return lines.join("\n");
  }

  /**
   * Generate Go struct field using CleanTypeMapper
   * DELEGATION: No duplicate type mapping logic
   */
  private generateStructField(propName: string, propNode: TypeSpecPropertyNode): string | null {
    if (!propNode || !propNode.type) {
      return null;
    }

    // Delegate to CleanTypeMapper for type mapping with pointer support
    const mappedType = CleanTypeMapper.mapTypeSpecType(propNode.type, propName);
    
    if (!mappedType || !mappedType.goType) {
      return null;
    }

    // Generate Go field name (capitalize first letter for export)
    let goFieldName = propName.charAt(0).toUpperCase() + propName.slice(1);
    
    // Special case: 'id' -> 'ID' for Go naming conventions
    if (propName.toLowerCase() === 'id') {
      goFieldName = 'ID';
    }

    // Generate JSON tag
    const jsonTag = `json:"${propName}"`;

    // Add omitempty for optional fields
    const optionalTag = propNode.optional ? ",omitempty" : "";

    // Apply pointer for optional fields if configured
    let finalGoType = mappedType.goType;
    if (propNode.optional && mappedType.usePointerForOptional) {
      finalGoType = `*${finalGoType}`;
    }

    // Add comment for template types
    let templateComment = "";
    if (propNode.type && typeof propNode.type === "object" && "kind" in propNode.type && propNode.type.kind === "template") {
      templateComment = `  // Template type ${(propNode.type as { name: string }).name}`;
    }

    return `${goFieldName} ${finalGoType}${templateComment} \`${jsonTag}${optionalTag}\``;
  }

  /**
   * Parse template instantiation to extract base template properties
   */
  private parseTemplateProperties(template: string): ReadonlyMap<string, TypeSpecPropertyNode> {
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
   * Validate model before generation
   * CONSISTENT VALIDATION: Unified error system
   */
  validateModel(model: {
    name: string;
    properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  }): GoEmitterResult {
    if (!model.name) {
      return ErrorFactory.createValidationError("Model name is required", {
        modelName: model.name || "undefined",
      });
    }

    if (!model.properties || model.properties.size === 0) {
      return ErrorFactory.createValidationError("Model must have at least one property", {
        modelName: model.name,
      });
    }

    // Validate each property
    for (const [propName, propNode] of model.properties) {
      if (!propNode || !propNode.type) {
        return ErrorFactory.createValidationError(`Invalid property: ${propName}`, {
          modelName: model.name,
          propertyName: propName,
        });
      }

      // Validate type using CleanTypeMapper
      try {
        const mappedType = CleanTypeMapper.mapTypeSpecTypeLegacy(propNode.type, propName);
        if (!mappedType || !mappedType.goType) {
          return ErrorFactory.createValidationError(`Unsupported type for property: ${propName}`, {
            modelName: model.name,
            propertyName: propName,
            invalidValue:
              typeof propNode.type === "object" && propNode.type && "kind" in propNode.type
                ? propNode.type.kind
                : propNode.type,
          });
        }
      } catch (error) {
        return defaultErrorHandler(error, {
          operation: "validateProperty",
          modelName: model.name,
          propertyName: propName,
        });
      }
    }

    return ErrorFactory.createSuccess(new Map(), { validModel: true, modelName: model.name });
  }
}
