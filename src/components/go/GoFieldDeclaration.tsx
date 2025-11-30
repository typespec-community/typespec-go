/**
 * Go Field Declaration Component
 * Professional Go field generation with type safety and proper JSON tags
 * Following guide's component patterns and type safety principles
 */

import type { ModelProperty, Type } from "@typespec/compiler";
import { StructMember } from "@alloy-js/go";
import { TypeExpression } from "./TypeExpression.js";

interface GoFieldDeclarationProps {
  /** TypeSpec property to convert to Go field */
  property: ModelProperty;
  /** Refkey to the parent model for import tracking */
  modelRefkey?: any;
}

/**
 * Go Field Declaration Component
 * Generates individual Go struct fields with proper:
 * - Field naming (capitalized for export)
 * - Type mapping with pointers for optional fields
 * - JSON tags with omitempty for optional fields
 * - Reference tracking for import management
 */
export function GoFieldDeclaration({ property, modelRefkey }: GoFieldDeclarationProps) {
  // Capitalize field name for Go export convention
  const fieldName = capitalize(property.name);
  
  // Generate JSON tag with optional omitempty
  const jsonTag = property.optional 
    ? `json:"${property.name},omitempty"`
    : `json:"${property.name}"`;

  return (
    <StructMember
      name={fieldName}
      type={<TypeExpression type={property.type} />}
      tag={jsonTag}
      refkey={modelRefkey ? `${modelRefkey}.${property.name}` : undefined}
    />
  );
}

/**
 * Capitalize first letter for Go field names (export convention)
 * Following guide's naming convention patterns
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}