/**
 * Go Struct Declaration Component
 * Professional Go struct generation with Alloy-JS Go components
 * Following Alloy-JS patterns with zero string-based logic
 */

import type { Model, ModelProperty, Program, Type, Union } from "@typespec/compiler";
import type { JSX } from "@alloy-js/core/jsx-runtime";
import { Reference, StructDeclaration, StructMember, TypeDeclaration } from "@alloy-js/go";
import { For, refkey } from "@alloy-js/core";
import { capitalize } from "../../utils/strings.js";
import { lookupGoScalarPrimitive } from "../../domain/go-primitive-types.js";
import { getDocumentation } from "../../utils/typespec-utils.js";

interface GoStructDeclarationProps {
  /** TypeSpec model to convert to Go struct */
  model: Model;
  /** Optional struct documentation (overrides @doc) */
  documentation?: string;
  /** Package name for struct */
  packageName?: string;
  /** Use pointers for optional model/struct fields (default: true) */
  usePointersForOptional?: boolean;
  /** TypeSpec program for accessing @doc decorators */
  program?: Program;
}

/**
 * Go Struct Declaration Component
 * Generates complete Go struct with proper field declarations
 * Uses only Alloy-JS Go components, no string generation
 */
export function GoStructDeclaration({
  model,
  documentation,
  packageName: _packageName = "api",
  usePointersForOptional = true,
  program,
}: GoStructDeclarationProps) {
  // Get documentation from @doc decorator if program is provided
  const modelDoc =
    documentation ||
    (program ? getDocumentation(program, model) : undefined) ||
    "Generated from TypeSpec model " + model.name;

  // Generate struct fields using Alloy-JS components with <For> iteration
  return (
    <TypeDeclaration name={model.name} refkey={refkey(model)} doc={modelDoc}>
      <StructDeclaration>
        <For each={Array.from(model.properties?.values() || [])}>
          {(prop: ModelProperty) => {
            const fieldName = capitalize(prop.name);
            const typeRef = refkey(prop.type);

            // 100% ALLOY.JS - Use Reference system for automatic imports
            let goTypeElement: string | JSX.Element;

            if (prop.type.kind === "Model") {
              // Model type - Reference for automatic import
              goTypeElement = <Reference refkey={typeRef} />;
            } else if (prop.type.kind === "Enum") {
              // Enum type - Reference for automatic import
              goTypeElement = <Reference refkey={typeRef} />;
            } else if (prop.type.kind === "Union") {
              // Inline literal unions map to primitives; named unions reference
              // the generated union interface.
              goTypeElement = mapTypeSpecToGoType(prop.type);
            } else {
              // Built-in types - Use native Go types (no import needed)
              goTypeElement = mapTypeSpecToGoType(prop.type);
            }

            // Add pointer for optional model/struct fields with Reference
            const shouldUsePointer =
              prop.optional && usePointersForOptional && isNestedModelType(prop.type);
            const finalType = shouldUsePointer ? (
              <>
                {"*"}
                <Reference refkey={typeRef} />
              </>
            ) : (
              goTypeElement
            );

            // Ensure proper JSON tag format: `json:"name"` or `json:"name,omitempty"`
            const jsonTagValue = prop.optional ? prop.name + ",omitempty" : prop.name;
            const jsonTag = { json: jsonTagValue };

            return <StructMember name={fieldName} type={finalType} tag={jsonTag} />;
          }}
        </For>
      </StructDeclaration>
    </TypeDeclaration>
  );
}

/**
 * Check if type is a nested model that should use pointer for optional fields
 * Returns true for Model types (excluding Array and Record)
 */
function isNestedModelType(type: Type): boolean {
  if (type.kind !== "Model") return false;
  // Don't use pointer for built-in collection types
  if (type.name === "Array" || type.name === "Record") return false;
  return true;
}

/**
 * Helper to safely get Type from template argument
 * Template args can be Type | Value | IndeterminateEntity
 */
function getTypeFromTemplateArg(arg: unknown): Type | undefined {
  if (arg && typeof arg === "object" && "kind" in arg) {
    const argObj = arg as { kind: string };
    // Check if it's a valid Type kind
    if (
      ["Model", "Scalar", "Enum", "Union", "String", "Boolean", "Number", "Tuple"].includes(
        argObj.kind,
      )
    ) {
      return arg as Type;
    }
  }
  return undefined;
}

/**
 * TypeSpec to Alloy.js Go type mapping with proper refkey support
 * Uses Alloy.js Reference system for automatic import management
 * Maps TypeSpec scalar types to native Go types
 */
function mapTypeSpecToGoType(type: Type): string | JSX.Element {
  switch (type.kind) {
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Number":
      return "float64"; // Default number type in Go

    case "Scalar": {
      const mapped = lookupGoScalarPrimitive(type.name ?? "");
      if (mapped) {
        return mapped;
      }
      return type.name || "interface{}";
    }

    case "Model":
      // Handle TypeSpec's built-in Array model with Alloy.js
      if (type.name === "Array" && type.templateMapper) {
        const elementType = getTypeFromTemplateArg(type.templateMapper.args?.[0]);
        if (elementType) {
          const elementTypeRef = mapTypeSpecToGoType(elementType);
          return `[]${elementTypeRef}`; // Template literal for slice types
        }
        return "[]interface{}";
      }

      // Handle TypeSpec's built-in Record model with Alloy.js
      if (type.name === "Record" && type.templateMapper) {
        const keyType = getTypeFromTemplateArg(type.templateMapper.args?.[0]);
        const valueType = getTypeFromTemplateArg(type.templateMapper.args?.[1]);
        const goKey = keyType ? mapTypeSpecToGoType(keyType) : "string";
        const goValue = valueType ? mapTypeSpecToGoType(valueType) : "interface{}";
        return `map[${goKey}]${goValue}`; // Template literal for map types
      }

      // Reference to other model - Alloy.js handles import
      const modelRef = refkey(type);
      return <Reference refkey={modelRef} />;

    case "Enum":
      // Reference to enum - Alloy.js handles import
      const enumRef = refkey(type);
      return <Reference refkey={enumRef} />;

    case "Union": {
      // Inline literal unions (e.g. "red" | "blue") have no generated Go type
      // of their own; map them to the closest primitive instead of emitting an
      // unresolved reference to a type that is never generated.
      const union = type;
      if (union.expression || union.variants.size === 0) {
        return primitiveForLiteralUnion(union);
      }
      // Named union - reference the generated union interface
      const unionRef = refkey(union);
      return <Reference refkey={unionRef} />;
    }

    case "Tuple":
      // TODO: Implement proper Go tuple type mapping with specific slice types
      // Go doesn't have tuples, use slice
      return "[]interface{}";

    default:
      return "interface{}";
  }
}

/**
 * Maps an inline (anonymous) union to the closest Go primitive based on its
 * variant kinds. Homogeneous string/number/boolean unions map to that
 * primitive; anything else falls back to interface{}.
 */
function primitiveForLiteralUnion(union: Union): string {
  const variantKinds = new Set(
    [...union.variants.values()].map((variant) => variant.type.kind),
  );
  if (variantKinds.size === 1) {
    switch (variantKinds.values().next().value) {
      case "String":
        return "string";
      case "Number":
        return "float64";
      case "Boolean":
        return "bool";
    }
  }
  return "interface{}";
}
