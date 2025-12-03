/**
 * Go Union Declaration Component
 * Generates Go sealed interfaces from TypeSpec unions
 * Supports discriminated unions with type field
 */

import type { Union, UnionVariant, Program } from "@typespec/compiler";
import { capitalize } from "../../utils/strings.js";
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
 * Generates sealed interface pattern for type safety
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

  return generateUnionCode(typeName, variants, discriminator, doc);
}

/**
 * Generate Go union code using sealed interface pattern
 */
function generateUnionCode(
  typeName: string,
  variants: UnionVariant[],
  discriminator?: string,
  doc?: string,
): string {
  const lines: string[] = [];

  // Sealed interface with documentation
  const docComment = doc ? `${doc} ` : "";
  lines.push(`// ${typeName} is a sealed interface ${docComment}representing a union type`);
  lines.push(`type ${typeName} interface {`);
  lines.push(`\tis${typeName}()`);
  if (discriminator) {
    lines.push(`\tGetType() string`);
  }
  lines.push(`}`);
  lines.push("");

  // Generate variant structs
  for (const variant of variants) {
    const variantName = getVariantName(variant, typeName);

    lines.push(`// ${variantName} implements ${typeName}`);
    lines.push(`type ${variantName} struct {`);

    if (discriminator) {
      lines.push(`\tType string \`json:"${discriminator}"\``);
    }

    // Add value field for simple unions
    const goType = getVariantGoType(variant);
    if (goType !== "struct{}") {
      lines.push(`\tValue ${goType} \`json:"value,omitempty"\``);
    }

    lines.push(`}`);
    lines.push("");

    // Implement sealed interface
    lines.push(`func (${variantName}) is${typeName}() {}`);

    if (discriminator) {
      const variantNameStr = String(variant.name);
      lines.push(`func (v ${variantName}) GetType() string { return "${variantNameStr}" }`);
    }
    lines.push("");
  }

  // Add unmarshalling helper for discriminated unions
  if (discriminator) {
    lines.push(`// Unmarshal${typeName} unmarshals JSON into the appropriate variant`);
    lines.push(`func Unmarshal${typeName}(data []byte) (${typeName}, error) {`);
    lines.push(`\tvar base struct { Type string \`json:"${discriminator}"\` }`);
    lines.push(`\tif err := json.Unmarshal(data, &base); err != nil {`);
    lines.push(`\t\treturn nil, err`);
    lines.push(`\t}`);
    lines.push(`\t`);
    lines.push(`\tswitch base.Type {`);

    for (const variant of variants) {
      const variantName = getVariantName(variant, typeName);
      const variantNameStr = String(variant.name);
      lines.push(`\tcase "${variantNameStr}":`);
      lines.push(`\t\tvar v ${variantName}`);
      lines.push(`\t\tif err := json.Unmarshal(data, &v); err != nil {`);
      lines.push(`\t\t\treturn nil, err`);
      lines.push(`\t\t}`);
      lines.push(`\t\treturn v, nil`);
    }

    lines.push(`\tdefault:`);
    lines.push(`\t\treturn nil, fmt.Errorf("unknown ${typeName} type: %s", base.Type)`);
    lines.push(`\t}`);
    lines.push(`}`);
  }

  return lines.join("\n");
}

/**
 * Get variant name for Go struct
 */
function getVariantName(variant: UnionVariant, unionName: string): string {
  // Use variant type name if available, otherwise use variant name
  const baseName = String(variant.name || "Variant");
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
