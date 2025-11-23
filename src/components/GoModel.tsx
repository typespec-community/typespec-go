/**
 * Go Model Component
 * Generates Go struct from TypeSpec model using Alloy-JS components
 * Follows guide's Single Responsibility Principle
 */

import { StructTypeDeclaration, StructMember } from "@alloy-js/go";
import type { Model, ModelProperty, Decorator } from "@typespec/compiler";
import { refkey } from "@alloy-js/core";
import { TypeExpression } from './TypeExpression';

/**
 * Extract JSON tag from ModelProperty
 * Handles TypeSpec decorators and field options
 */
function getJSONTags(prop: ModelProperty): string {
  const tags: string[] = [];
  
  // Default JSON tag with field name
  tags.push(`json:"${prop.name}"`);
  
  // Add omitempty for optional properties
  if (prop.optional) {
    tags.push(`omitempty`);
  }
  
  return tags.join(",");
}

/**
 * Extract validation tags from decorators
 * Common validation patterns for Go struct tags
 */
function getValidationTags(prop: ModelProperty): string | null {
  const tags: string[] = [];
  
  // Extract decorators (simplified for working example)
  if (prop.decorators) {
    for (const decorator of prop.decorators) {
      switch (decorator.name) {
        case "maxLength":
          if (decorator.args?.length) {
            tags.push(`max=${decorator.args[0].value}`);
          }
          break;
        case "minLength":
          if (decorator.args?.length) {
            tags.push(`min=${decorator.args[0].value}`);
          }
          break;
        case "pattern":
          if (decorator.args?.length) {
            tags.push(`pattern=${decorator.args[0].value}`);
          }
          break;
      }
    }
  }
  
  return tags.length > 0 ? tags.join(",") : null;
}

/**
 * Generate struct field comments from TypeSpec documentation
 */
function getComment(prop: ModelProperty): string | null {
  // Extract documentation from TypeSpec model property (simplified)
  if ((prop as any).doc) {
    return (prop as any).doc;
  }
  
  return null;
}

/**
 * Go Model Component
 * Generates a complete Go struct from TypeSpec model
 * Follows guide's component composition pattern
 */
export function GoModel({ model }: { model: Model }) {
  const modelRefkey = refkey(model);
  
  return (
    <StructTypeDeclaration 
      name={model.name} 
      refkey={modelRefkey}
    >
      {/* Generate struct fields for each property */}
      {Array.from(model.properties?.values() || []).map((prop: ModelProperty) => {
        const jsonTag = getJSONTags(prop);
        const validationTag = getValidationTags(prop);
        const comment = getComment(prop);
        
        // Combine all tags
        const allTags = [jsonTag];
        if (validationTag) {
          allTags.push(`validate:"${validationTag}"`);
        }
        const finalTag = allTags.join(" ");
        
        return (
          <StructMember 
            key={prop.name}
            name={capitalize(prop.name)}
            type={TypeExpression({ type: prop.type })}
            tag={finalTag}
          />
        );
      })}
    </StructTypeDeclaration>
  );
}

/**
 * Capitalize first letter of field name for Go naming convention
 * Follows Go struct field naming conventions
 */
function capitalize(name: string): string {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}