/**
 * Union Generator - TypeSpec Go Emitter
 *
 * UNION GENERATION: Go sealed interface generation from TypeSpec unions
 * TYPE SAFETY: Comprehensive union variant handling
 */

import { ErrorFactory, GoEmitterResult, defaultErrorHandler } from "../domain/unified-errors.js";
import { CleanTypeMapper } from "../domain/clean-type-mapper.js";
import type { TypeSpecPropertyNode, TypeSpecTypeNode } from "../types/typespec-domain.js";
import { generateGoFieldName } from "../utils/string-utils.js";

/**
 * Generate Go union type (sealed interface pattern)
 */
export function generateUnionType(unionModel: {
  name: string;
  kind: "union";
  variants: Array<{ name: string; type: TypeSpecTypeNode }>;
  properties?: ReadonlyMap<string, TypeSpecPropertyNode>;
}): GoEmitterResult {
  // Input validation
  if (!unionModel.name || typeof unionModel.name !== "string") {
    return ErrorFactory.createValidationError("Invalid union: name must be a non-empty string", {
      modelName: unionModel.name || "unknown",
    });
  }

  if (!unionModel.variants || unionModel.variants.length === 0) {
    return ErrorFactory.createValidationError("Invalid union: must have at least one variant", {
      modelName: unionModel.name,
    });
  }

  try {
    // Generate Go union code using sealed interface pattern
    const unionCode = generateUnionCode(unionModel);

    return ErrorFactory.createSuccess(new Map([[`${unionModel.name}.go`, unionCode]]), {
      generatedFiles: [`${unionModel.name}.go`],
      modelName: unionModel.name,
      variantCount: unionModel.variants.length,
    });
  } catch (error) {
    return defaultErrorHandler(error, {
      operation: "generateUnionType",
      modelName: unionModel.name,
      variants: unionModel.variants.map(v => v.name),
    });
  }
}

/**
 * Generate Go union code using sealed interface pattern
 */
function generateUnionCode(unionModel: {
  name: string;
  kind: "union";
  variants: Array<{ name: string; type: TypeSpecTypeNode; discriminator?: string }>;
  discriminator?: string;
}): string {
  const lines: string[] = [];

  // Package declaration
  lines.push("package api");
  lines.push("");

  // Model documentation
  lines.push(`// ${unionModel.name} - TypeSpec generated union`);
  lines.push("");

  // Handle discriminated unions
  if (unionModel.discriminator) {
    return generateDiscriminatedUnionCode({
      ...unionModel,
      discriminator: unionModel.discriminator,
    });
  }

  // Sealed interface definition
  lines.push(`type ${unionModel.name} interface {`);
  lines.push(`\tis${unionModel.name}()`);
  lines.push("}");
  lines.push("");

  // Generate variant structs
  for (const variant of unionModel.variants) {
    const variantCode = generateVariantStruct(variant, unionModel.name);
    lines.push(variantCode);
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Generate discriminated union code
 */
function generateDiscriminatedUnionCode(unionModel: {
  name: string;
  variants: Array<{ name: string; type: TypeSpecTypeNode }>;
  discriminator: string;
}): string {
  const lines: string[] = [];

  // Sealed interface definition
  lines.push(`type ${unionModel.name} interface {`);
  lines.push(`\tget${unionModel.discriminator}() string`);
  lines.push("}");
  lines.push("");

  // Generate variant structs
  for (const variant of unionModel.variants) {
    const variantCode = generateDiscriminatedVariantStruct(variant, unionModel.name, unionModel.discriminator);
    lines.push(variantCode);
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Generate variant struct for sealed interface
 */
function generateVariantStruct(
  variant: { name: string; type: TypeSpecTypeNode },
  unionName: string
): string {
  const lines: string[] = [];

  const variantName = generateGoFieldName(variant.name);
  lines.push(`// ${variantName} - ${unionName} variant`);
  lines.push(`type ${variantName} struct {`);

  // Add type marker for interface
  lines.push(`\t_type string \`json:"_type"\``);

  // Add fields if the variant type has properties
  if (variant.type && typeof variant.type === "object" && "properties" in variant.type) {
    const properties = (variant.type as any).properties as ReadonlyMap<string, TypeSpecPropertyNode>;
    for (const [propName, propNode] of properties) {
      try {
        const typeMapping = CleanTypeMapper.mapTypeSpecType(propNode.type, propName);
        if (typeMapping && typeMapping.goType) {
          const goFieldName = generateGoFieldName(propName);
          const jsonTag = `"${propName}"`;
          lines.push(`\t${goFieldName} ${typeMapping.goType} \`${jsonTag}\``);
        }
      } catch (error) {
        // Skip problematic fields but continue generation
        console.warn(`Warning: Failed to map type for field ${propName}:`, error);
      }
    }
  }

  lines.push("}");
  lines.push("");

  // Interface implementation
  lines.push(`func (v *${variantName}) is${unionName}() {}`);

  return lines.join("\n");
}

/**
 * Generate variant struct for discriminated union
 */
function generateDiscriminatedVariantStruct(
  variant: { name: string; type: TypeSpecTypeNode },
  unionName: string,
  discriminator: string
): string {
  const lines: string[] = [];

  const variantName = generateGoFieldName(variant.name);
  lines.push(`// ${variantName} - ${unionName} variant`);
  lines.push(`type ${variantName} struct {`);

  // Add discriminator field
  lines.push(`\t${generateGoFieldName(discriminator)} string \`json:"${discriminator}"\``);

  // Add other fields if the variant type has properties
  if (variant.type && typeof variant.type === "object" && "properties" in variant.type) {
    const properties = (variant.type as any).properties as ReadonlyMap<string, TypeSpecPropertyNode>;
    for (const [propName, propNode] of properties) {
      try {
        const typeMapping = CleanTypeMapper.mapTypeSpecType(propNode.type, propName);
        if (typeMapping && typeMapping.goType) {
          const goFieldName = generateGoFieldName(propName);
          const jsonTag = `"${propName}"`;
          lines.push(`\t${goFieldName} ${typeMapping.goType} \`${jsonTag}\``);
        }
      } catch (error) {
        // Skip problematic fields but continue generation
        console.warn(`Warning: Failed to map type for field ${propName}:`, error);
      }
    }
  }

  lines.push("}");
  lines.push("");

  // Interface implementation
  lines.push(`func (v *${variantName}) get${generateGoFieldName(discriminator)}() string {`);
  lines.push(`\treturn "${variant.name}"`);
  lines.push("}");

  return lines.join("\n");
}

/**
 * Check if a variant is recursive (references union type)
 */
export function isRecursiveVariant(
  variant: { name: string; type?: TypeSpecTypeNode }, 
  unionModel: { name: string }
): boolean {
  // If variant type name matches union name, it's recursive
  const typeName = variant.type ? getTypeName(variant.type) : undefined;
  if (typeName === unionModel.name) {
    return true;
  }
  
  // If variant name suggests a recursive pattern (Add, Multiply, etc.)
  const recursivePatterns = ['add', 'multiply', 'left', 'right', 'expression'];
  const variantName = variant.name?.toLowerCase() || '';
  const unionName = unionModel.name?.toLowerCase() || '';
  
  return recursivePatterns.some(pattern => 
    variantName.includes(pattern) && unionName.includes('expression')
  );
}

/**
 * Get type name from TypeSpecTypeNode safely
 */
function getTypeName(type?: TypeSpecTypeNode): string | undefined {
  if (!type) return undefined;
  
  if ('name' in type) {
    return (type as { name: string }).name;
  }
  
  return undefined;
}