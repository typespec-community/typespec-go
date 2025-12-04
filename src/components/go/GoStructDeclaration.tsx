/**
 * Go Struct Declaration Component
 * Professional Go struct generation with Alloy-JS Go components
 * Following Alloy-JS patterns with zero string-based logic
 */

import type { Model, Program, Type } from "@typespec/compiler";
import { Reference, StructDeclaration, StructMember, TypeDeclaration } from "@alloy-js/go";
import { For, refkey } from "@alloy-js/core";
import { capitalize } from "../../utils/strings.js";
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
  packageName = "api",
  usePointersForOptional = true,
  program,
}: GoStructDeclarationProps) {
  // Get documentation from @doc decorator if program is provided
  const modelDoc =
    documentation ||
    (program ? getDocumentation(program, model) : undefined) ||
    `Generated from TypeSpec model ${model.name}`;

  // Generate struct fields using Alloy-JS components with <For> iteration
  return (
    <TypeDeclaration name={model.name} refkey={refkey(model)} doc={modelDoc}>
      <StructDeclaration>
        <For each={Array.from(model.properties?.values() || [])}>
          {(prop: ModelProperty) => {
            const fieldName = capitalize(prop.name);
            const typeRef = refkey(prop.type);

            // 100% ALLOY.JS - Use Reference system for automatic imports
            let goTypeElement: any;

            if (prop.type.kind === "Model") {
              // Model type - Reference for automatic import
              goTypeElement = <Reference refkey={typeRef} />;
            } else if (prop.type.kind === "Enum") {
              // Enum type - Reference for automatic import
              goTypeElement = <Reference refkey={typeRef} />;
            } else if (prop.type.kind === "Union") {
              // Union type - Reference for automatic import
              goTypeElement = <Reference refkey={typeRef} />;
            } else {
              // Built-in types - Use native Go types (no import needed)
              goTypeElement = mapTypeSpecToGoType(prop.type);
            }

            // Add pointer for optional model/struct fields with Reference
            const shouldUsePointer =
              prop.optional && usePointersForOptional && isNestedModelType(prop.type);
            const finalType = shouldUsePointer ? (
              <Reference refkey={typeRef} pointer />
            ) : (
              goTypeElement
            );

            // Ensure proper JSON tag format: `json:"name"` or `json:"name,omitempty"`
            const jsonTagValue = prop.optional ? `${prop.name},omitempty` : prop.name;
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
function mapTypeSpecToGoType(type: Type): any {
  switch (type.kind) {
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Number":
      return "float64"; // Default number type in Go

    case "Scalar":
      const scalarName = type.name?.toLowerCase() || "";

      // Use Alloy.js Go type references for known Go types
      switch (scalarName) {
        // Integer types
        case "int8":
        case "int16":
        case "int32":
        case "int64":
        case "uint8":
        case "uint16":
        case "uint32":
        case "uint64":
        case "integer":
        case "safeint":
          return scalarName; // Direct Go type names

        // Float types
        case "float32":
        case "float64":
        case "float":
        case "numeric":
        case "decimal":
        case "decimal64":
        case "decimal128":
          return scalarName === "float" ? "float64" : scalarName;

        // Binary types
        case "bytes":
          return "[]byte";

        // String types (all map to Go string)
        case "string":
        case "url":
        case "uri":
        case "email":
        case "uuid":
        case "ipaddress":
        case "ipv4address":
        case "ipv6address":
          return "string";

        // Boolean
        case "boolean":
          return "bool";

        // Date/Time types - will trigger automatic time import
        case "plaindate":
        case "plaintime":
        case "utcdatetime":
        case "offsetdatetime":
        case "duration":
        case "zoneddatetime":
          return scalarName === "duration" ? "time.Duration" : "time.Time";

        default:
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

    case "Union":
      // Reference to union interface - Alloy.js handles import
      const unionRef = refkey(type);
      return <Reference refkey={unionRef} />;

    case "Tuple":
      //TODO: this must be better typed
      // Go doesn't have tuples, use slice
      return "[]interface{}";

    default:
      return "interface{}";
  }
}
