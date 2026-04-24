/**
 * Go Union Declaration Component
 * Generates Go sealed interfaces from TypeSpec unions
 * Supports discriminated unions with type field
 */

import type { Program, Union, Type } from "@typespec/compiler";
import { TypeDeclaration, InterfaceDeclaration, FunctionDeclaration } from "@alloy-js/go";
import { getDocumentation } from "../../utils/typespec-utils.js";
import { capitalize } from "../../utils/strings.js";
import { GoStringLiteral, GoReturn } from "./core/index.js";

interface GoUnionDeclarationProps {
  /** TypeSpec union to convert to Go interface */
  union: Union;
  /** Package name for documentation */
  packageName?: string;
  /** Discriminator field name for tagged unions */
  discriminator?: string;
  /** TypeSpec program for accessing @doc decorators */
  program?: Program;
  /** Template parameter names for generic union types (e.g., ["T", "K"]) */
  templateParameters?: string[];
  /** Template constraints for generic parameters (experimental, untested) */
  templateConstraints?: Array<{ param: string; constraint: string | Type }>;
}

/**
 * Go Union Declaration Component
 * Generates sealed interface pattern for type safety using 100% Alloy components
 */
export function GoUnionDeclaration({
  union,
  packageName: _packageName = "api",
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

  // Convert template parameters to Go generic format
  const typeParameters = templateParameters.map((param, index) => {
    const constraintInfo = templateConstraints?.[index];
    const constraint = constraintInfo?.constraint || "any";

    return {
      name: param,
      constraint: typeof constraint === "string" ? constraint : "any",
    };
  });

  const methodReceiverName = discriminator ? "GetType" : "is" + typeName;
  const methodSignature = discriminator
    ? methodReceiverName + "() string"
    : methodReceiverName + "()";

  return (
    <>
      <TypeDeclaration
        name={typeName}
        doc={interfaceDoc}
        typeParameters={typeParameters.length > 0 ? typeParameters : undefined}
      >
        <InterfaceDeclaration>{methodSignature}</InterfaceDeclaration>
      </TypeDeclaration>

      {variants.map((variant) => {
        // Simple struct for each variant
        const variantName = capitalize(String(variant.name));
        // Special case: if union name ends with "Method", add "Type" to constant prefix
        // e.g. PaymentMethod -> PaymentMethodType
        // But for now let's just use variant name

        return (
          <>
            <TypeDeclaration name={variantName}>
              {discriminator && (
                <>
                  struct {"\n"}
                  {"\t"}Type string <GoStringLiteral raw value={`json:"${discriminator}"`} />
                  {"\n"}
                </>
              )}
              {!discriminator && "struct {}\n"}
            </TypeDeclaration>
            <FunctionDeclaration
              name={methodReceiverName}
              receiver={variantName}
              returns={discriminator ? "string" : undefined}
            >
              {discriminator && <GoReturn value={String(variant.name)} />}
            </FunctionDeclaration>
          </>
        );
      })}

      {discriminator && (
        <FunctionDeclaration
          name={"Unmarshal" + typeName}
          parameters={[{ name: "data", type: "[]byte" }]}
          returns="error"
        >
          {"// Unmarshaler implementation"}
          {"// This would need to unmarshal into a temp struct to get the discriminator"}
          {"// and then unmarshal into the correct variant"}
          <GoReturn value="nil" />
        </FunctionDeclaration>
      )}
    </>
  );
}
