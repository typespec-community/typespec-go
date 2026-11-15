/**
 * Go Union Declaration Component
 * Generates Go sealed interfaces from TypeSpec unions
 * Supports discriminated unions with type field
 */

import type { Program, Union, Type } from "@typespec/compiler";
import {
  TypeDeclaration,
  InterfaceDeclaration,
  FunctionDeclaration,
  Reference,
  VariableDeclaration,
} from "@alloy-js/go";
import { refkey } from "@alloy-js/core";
import { getDocumentation } from "../../utils/typespec-utils.js";
import { capitalize } from "../../utils/strings.js";
import { GoReturn, GoStringLiteral, GoIf, GoSwitch, GoCase, GoDefault } from "./core/index.js";

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
        refkey={refkey(union)}
        doc={interfaceDoc}
        typeParameters={typeParameters.length > 0 ? typeParameters : undefined}
      >
        <InterfaceDeclaration>{methodSignature}</InterfaceDeclaration>
      </TypeDeclaration>
      {"\n"}

      {variants.map((variant) => {
        // Model-typed variants are generated as structs elsewhere (models.go);
        // re-declaring them here would produce duplicate Go types. The sealing
        // method is attached to the referenced type via its refkey instead.
        // Literal/primitive variants get a synthesized struct named after
        // the variant.
        const variantType = variant.type;
        const variantModel = variantType.kind === "Model" ? variantType : undefined;
        const variantStructName = capitalize(String(variant.name));

        if (variantModel) {
          return (
            <>
              {"\n"}
              <FunctionDeclaration
                name={methodReceiverName}
                receiver={<Reference refkey={refkey(variantModel)} />}
                returns={discriminator ? "string" : undefined}
              >
                {discriminator && <GoReturn value={`"${String(variant.name)}"`} />}
              </FunctionDeclaration>
            </>
          );
        }

        return (
          <>
            {"\n"}
            <TypeDeclaration name={variantStructName} refkey={refkey(variant)}>
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
              receiver={variantStructName}
              returns={discriminator ? "string" : undefined}
            >
              {discriminator && <GoReturn value={`"${String(variant.name)}"`} />}
            </FunctionDeclaration>
          </>
        );
      })}
      {"\n"}

      {discriminator && (
        <FunctionDeclaration
          name={"Unmarshal" + typeName}
          parameters={[{ name: "data", type: "[]byte" }]}
          returns="(any, error)"
        >
          <VariableDeclaration
            name="probe"
            type={
              <>
                {"struct {\n\t"}
                {"Type string "}
                <GoStringLiteral raw value={`json:"${discriminator}"`} />
                {"\n}"}
              </>
            }
          />
          {"\n"}
          <GoIf condition="err := json.Unmarshal(data, &probe); err != nil">
            <GoReturn value={`nil, fmt.Errorf("unmarshal ${typeName} discriminator: %w", err)`} />
          </GoIf>
          {"\n"}
          <GoSwitch value="probe.Type">
            {variants.map((variant) => {
              const variantType = variant.type;
              const variantModel = variantType.kind === "Model" ? variantType : undefined;
              const variantStructName = capitalize(String(variant.name));
              const variantTypeName = variantModel ? (
                <Reference refkey={refkey(variantModel)} />
              ) : (
                variantStructName
              );

              return (
                <>
                  <GoCase value={`"${String(variant.name)}"`}>
                    <VariableDeclaration name="v" type={variantTypeName} />
                    {"\n"}
                    <GoIf condition="err := json.Unmarshal(data, &v); err != nil">
                      <GoReturn
                        value={`nil, fmt.Errorf("unmarshal ${variantStructName}: %w", err)`}
                      />
                    </GoIf>
                    {"\n"}
                    <GoReturn value="v, nil" />
                  </GoCase>
                  {"\n"}
                </>
              );
            })}
            <GoDefault>
              <GoReturn
                value={`nil, fmt.Errorf("unknown ${typeName} discriminator %q", probe.Type)`}
              />
            </GoDefault>
          </GoSwitch>
        </FunctionDeclaration>
      )}
    </>
  );
}
