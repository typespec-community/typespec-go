/**
 * Go Struct Declaration Component
 * Professional Go struct generation with Alloy-JS Go components
 * Following Alloy-JS patterns with zero string-based logic
 */

import type { Model, ModelProperty, Type } from "@typespec/compiler";
import { TypeDeclaration, StructDeclaration, StructMember } from "@alloy-js/go";
import { For, refkey } from "@alloy-js/core";
import { capitalize } from "../../utils/strings.js";

interface GoStructDeclarationProps {
  /** TypeSpec model to convert to Go struct */
  model: Model;
  /** Optional struct documentation */
  documentation?: string;
  /** Package name for struct */
  packageName?: string;
}

/**
 * Go Struct Declaration Component
 * Generates complete Go struct with proper field declarations
 * Uses only Alloy-JS Go components, no string generation
 */
export function GoStructDeclaration({ 
  model, 
  documentation, 
  packageName = "api" 
}: GoStructDeclarationProps) {
  // Generate struct fields using Alloy-JS components with <For> iteration
  return (
    <TypeDeclaration 
      name={model.name}
      refkey={refkey(model)}
      doc={documentation || `Generated from TypeSpec model ${model.name}`}
    >
      <StructDeclaration>
        <For each={Array.from(model.properties?.values() || [])}>
          {(prop: ModelProperty) => {
            const fieldName = capitalize(prop.name);
            const goType = mapTypeSpecToGoType(prop.type);
            const jsonTag = prop.optional 
              ? {json: `${prop.name},omitempty`}
              : {json: prop.name};

            return (
              <StructMember
                name={fieldName}
                type={goType}
                tag={jsonTag}
              />
            );
          }}
        </For>
      </StructDeclaration>
    </TypeDeclaration>
  );
}

/**
 * Helper to safely get Type from template argument
 * Template args can be Type | Value | IndeterminateEntity
 */
function getTypeFromTemplateArg(arg: unknown): Type | undefined {
  if (arg && typeof arg === "object" && "kind" in arg) {
    const argObj = arg as { kind: string };
    // Check if it's a valid Type kind
    if (["Model", "Scalar", "Enum", "Union", "String", "Boolean", "Number", "Tuple"].includes(argObj.kind)) {
      return arg as Type;
    }
  }
  return undefined;
}

/**
 * TypeSpec to Go type mapping with proper type safety
 * Maps TypeSpec scalar types to Go equivalent types
 * Handles arrays, enums, models, and unions
 */
function mapTypeSpecToGoType(type: Type): string {
  switch (type.kind) {
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Number":
      return "float64"; // Default number type in Go
    
    case "Scalar":
      const scalarName = type.name?.toLowerCase() || "";
      const scalarMap: Record<string, string> = {
        int8: "int8",
        int16: "int16", 
        int32: "int32",
        int64: "int64",
        uint8: "uint8",
        uint16: "uint16",
        uint32: "uint32",
        uint64: "uint64",
        float32: "float32",
        float64: "float64",
        bytes: "[]byte",
        string: "string",
        boolean: "bool",
        plaindate: "time.Time",
        plaintime: "time.Time",
        utcdatetime: "time.Time",
        offsetdatetime: "time.Time",
        duration: "time.Duration",
        // Extended scalar types
        uuid: "string", // UUID as string, could use github.com/google/uuid
        url: "string",
        email: "string",
        decimal128: "float64", // Could use shopspring/decimal
        decimal64: "float64",  // Could use shopspring/decimal
      };
      return scalarMap[scalarName] || type.name || "interface{}";
    
    case "Model":
      // Handle TypeSpec's built-in Array model
      if (type.name === "Array" && type.templateMapper) {
        const elementType = getTypeFromTemplateArg(type.templateMapper.args?.[0]);
        if (elementType) {
          return `[]${mapTypeSpecToGoType(elementType)}`;
        }
        return "[]interface{}";
      }
      // Handle TypeSpec's built-in Record model
      if (type.name === "Record" && type.templateMapper) {
        const keyType = getTypeFromTemplateArg(type.templateMapper.args?.[0]);
        const valueType = getTypeFromTemplateArg(type.templateMapper.args?.[1]);
        const goKey = keyType ? mapTypeSpecToGoType(keyType) : "string";
        const goValue = valueType ? mapTypeSpecToGoType(valueType) : "interface{}";
        return `map[${goKey}]${goValue}`;
      }
      return type.name || "interface{}";
    
    case "Enum":
      // Use the enum name directly - it will be defined in enums.go
      return type.name || "interface{}";
    
    case "Union":
      // Use the union interface name if named, otherwise interface{}
      return type.name || "interface{}";
    
    case "Tuple":
      // Go doesn't have tuples, use slice
      return "[]interface{}";
    
    default:
      return "interface{}";
  }
}