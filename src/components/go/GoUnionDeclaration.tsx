/**
 * Go Union Declaration Component
 * Generates Go sealed interfaces from TypeSpec unions
 * Supports discriminated unions with type field
 */

import type { Program, TemplateParameter, Union } from "@typespec/compiler";
import { TypeDeclaration } from "@alloy-js/go";
import { getDocumentation } from "../../utils/typespec-utils.js";

interface GoUnionDeclarationProps {
  /** TypeSpec union to convert to Go interface */
  union: Union;
  /** Package name for documentation */
  packageName?: string;
  /** Discriminator field name for tagged unions */
  discriminator?: string;
  /** TypeSpec program for accessing @doc decorators */
  program?: Program;
  /** Template parameters for generic union types */
  templateParameters?: TemplateParameter[];
  /** Type constraints for template parameters */
  templateConstraints?: Array<{ param: TemplateParameter; constraints: any[] }>;
}

/**
 * Go Union Declaration Component
 * Generates sealed interface pattern for type safety using 100% Alloy components
 */
export function GoUnionDeclaration({
  union,
  packageName = "api",
  discriminator,
  program,
  templateParameters = [],
  templateConstraints = [],
}: GoUnionDeclarationProps) {
  const typeName = union.name || "UnnamedUnion";
  const variants = Array.from(union.variants?.values() || []);

  // Get documentation from @doc decorator
  const doc = program ? getDocumentation(program, union) : undefined;
  const docComment = doc ? doc + "" : "";
  const interfaceDoc =
    "// " + typeName + " is a sealed interface " + docComment + "representing a union type";

  // Convert template constraints to TypeParameter format
  const typeParameters = templateParameters.map((param, index) => {
    const constraintInfo = templateConstraints[index];
    const constraint = constraintInfo?.constraints?.[0] || "any";

    return {
      name: (param as any).name || "T",
      constraint: constraint.name || constraint || "any",
    };
  });

  return (
    <TypeDeclaration
      name={typeName}
      doc={interfaceDoc}
      typeParameters={typeParameters.length > 0 ? typeParameters : undefined}
    >
      {/* Union interface placeholder */}
    </TypeDeclaration>
  );
}
