/**
 * Go Union Declaration Component
 * Generates Go sealed interfaces from TypeSpec unions
 * Supports discriminated unions with type field
 */

import type { Union, UnionVariant, Program } from "@typespec/compiler";
import { For } from "@alloy-js/core";
import { capitalize } from "../../utils/strings.js";
import { 
  TypeDeclaration, 
  StructDeclaration, 
  StructMember,
  FunctionDeclaration,
  FunctionReceiver,
  SourceFile
} from "@alloy-js/go";
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
}: GoUnionDeclarationProps) {
  const typeName = union.name || "UnnamedUnion";
  const variants = Array.from(union.variants?.values() || []);

  // Get documentation from @doc decorator
  const doc = program ? getDocumentation(program, union) : undefined;
  const docComment = doc ? `${doc} ` : "";
  const interfaceDoc = `// ${typeName} is a sealed interface ${docComment}representing a union type`;

  return (
    <>
      {/* Sealed interface */}
      <TypeDeclaration name={typeName} doc={interfaceDoc}>
        <FunctionDeclaration name={`is${typeName}`} returns="">
          {/* This creates method signature for sealed interface */}
        </FunctionDeclaration>
        {discriminator && (
          <FunctionDeclaration name="GetType" returns="string">
            {/* This creates discriminator method signature */}
          </FunctionDeclaration>
        )}
      </TypeDeclaration>

      {/* Variant structs */}
      <For each={variants}>
        {(variant) => {
          const variantName = getVariantName(variant, typeName);
          const goType = getVariantGoType(variant);
          const variantDoc = `// ${variantName} implements ${typeName}`;

          return (
            <>
              <TypeDeclaration name={variantName} doc={variantDoc}>
                <StructDeclaration>
                  {discriminator && (
                    <StructMember 
                      name="Type" 
                      type="string" 
                      tag={{ json: discriminator }} 
                    />
                  )}
                  
                  {/* Add value field for simple unions */}
                  {goType !== "struct{}" && (
                    <StructMember 
                      name="Value" 
                      type={goType} 
                      tag={{ json: "value,omitempty" }} 
                    />
                  )}
                </StructDeclaration>
              </TypeDeclaration>

              {/* Implement sealed interface method */}
              <FunctionDeclaration 
                name={`is${typeName}`}
                returns=""
                receiver={<FunctionReceiver name={`_`} type={`${variantName}`} />}
              >
                {/* Empty method body - just return signature */}
              </FunctionDeclaration>

              {/* Implement discriminator method if needed */}
              {discriminator && (
                <FunctionDeclaration 
                  name="GetType"
                  returns="string"
                  receiver={<FunctionReceiver name="v" type={`${variantName}`} />}
                >
                  {`return "${String(variant.name)}"`}
                </FunctionDeclaration>
              )}
            </>
          );
        }}
      </For>

      {/* Unmarshalling helper for discriminated unions */}
      {discriminator && (
        <FunctionDeclaration 
          name={`Unmarshal${typeName}`}
          params={["data []byte"]}
          returns={[`${typeName}`, "error"]}
        >
          {`var base struct { Type string json:"${discriminator}" }`}
          {`if err := json.Unmarshal(data, &base); err != nil { return nil, err }`}
          {`switch base.Type {`}
          <For each={variants}>
            {(variant) => {
              const variantName = getVariantName(variant, typeName);
              const variantNameStr = String(variant.name);
              return (
                <>
                  {`case "${variantNameStr}":`}
                  {`var v ${variantName}`}
                  {`if err := json.Unmarshal(data, &v); err != nil { return nil, err }`}
                  {`return v, nil`}
                </>
              );
            }}
          </For>
          {`default:`}
          {`return nil, fmt.Errorf("unknown ${typeName} type: %s", base.Type)`}
          {`}`}
        </FunctionDeclaration>
      )}
    </>
  );
}

/**
 * Get variant name for Go struct
 */
function getVariantName(variant: UnionVariant, unionName: string): string {
  // Use variant type name if available, otherwise use variant name
  // This matches the behavior from union-generator.ts line 109-110
  const type = variant.type;
  let baseName = String(variant.name || "Variant");
  
  // If type is a Model and has a name, use the type name
  if (type && type.kind === "Model" && (type as { name?: string }).name) {
    baseName = (type as { name?: string }).name!;
  }
  
  return capitalize(baseName);
}

/**
 * Get Go type for variant
 */
function getVariantGoType(variant: UnionVariant): string {
  const type = variant.type;
  if (!type) return "interface{}";

  switch (type.kind) {
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Number":
      return "float64";
    case "Model":
      return (type as { name?: string }).name || "interface{}";
    default:
      return "interface{}";
  }
}