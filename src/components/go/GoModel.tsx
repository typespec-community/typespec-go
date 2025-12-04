/**
 * Go Model Component
 * Generates Go struct from TypeSpec model using Alloy-JS components
 * Follows guide's Single Responsibility Principle
 */

import { StructTypeDeclaration, StructMember } from "@alloy-js/go";
import type { Model, ModelProperty } from "@typespec/compiler";
import { refkey } from "@alloy-js/core";
import { TypeExpression } from "../TypeExpression";

/**
 * Go Model Component
 * Generates a complete Go struct from TypeSpec model
 * Follows guide's component composition pattern
 */
export function GoModel({ model }: { model: Model }) {
  const modelRefkey = refkey(model);

  return (
    <StructTypeDeclaration name={model.name} refkey={modelRefkey}>
      {/* Generate struct fields for each property */}
      {Array.from(model.properties?.values() || []).map((prop: ModelProperty) => {
        return (
          <StructMember
            name={prop.name}
            type={TypeExpression({ type: prop.type })}
            tag={{
              json: prop.name,
              ...(prop.optional && { omitempty: "" }),
            }}
          />
        );
      })}
    </StructTypeDeclaration>
  );
}
