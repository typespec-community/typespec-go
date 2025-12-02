/**
 * Go Struct Declaration Component
 * Professional Go struct generation with Alloy-JS Go components
 * Following Alloy-JS patterns with zero string-based logic
 */

import type { Model, ModelProperty, Type, Program } from "@typespec/compiler";
import { TypeSpecModel } from "../../types/typespec-domain.js";
import { TypeDeclaration, StructDeclaration, StructMember } from "@alloy-js/go";
import { For, refkey } from "@alloy-js/core";
import { capitalize } from "../../utils/strings.js";
import { getDocumentation } from "../../utils/typespec-utils.js";

interface GoStructDeclarationProps {
  /** TypeSpec model to convert to Go struct */
  model: TypeSpecModel;
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
  program
}: GoStructDeclarationProps) {
  // Get documentation from @doc decorator if program is provided
  const modelDoc = documentation || 
    (program ? getDocumentation(program, model) : undefined) ||
    `Generated from TypeSpec model ${model.name}`;

  // Generate struct fields using Alloy-JS components with <For> iteration
  return (
    <TypeDeclaration 
      name={model.name}
      refkey={refkey(model)}
      doc={modelDoc}
    >
      <StructDeclaration>
        <For each={Array.from(model.properties?.values() || [])}>
          {(prop: ModelProperty) => {
            const fieldName = capitalize(prop.name);
            let goType = mapTypeSpecToGoType(prop.type);
            
            // Add pointer for optional model/struct fields
            if (prop.optional && usePointersForOptional && isNestedModelType(prop.type)) {
              goType = `*${goType}`;
            }
            
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
        // Integer types
        int8: "int8",
        int16: "int16", 
        int32: "int32",
        int64: "int64",
        uint8: "uint8",
        uint16: "uint16",
        uint32: "uint32",
        uint64: "uint64",
        integer: "int",
        safeint: "int64",
        
        // Float types
        float32: "float32",
        float64: "float64",
        float: "float64",
        numeric: "float64",
        decimal: "float64",
        decimal64: "float64",
        decimal128: "float64",
        
        // Binary types
        bytes: "[]byte",
        
        // String types
        string: "string",
        url: "string",
        uri: "string",
        email: "string",
        uuid: "string",
        
        // Boolean
        boolean: "bool",
        
        // Date/Time types
        plaindate: "time.Time",
        plaintime: "time.Time",
        utcdatetime: "time.Time",
        offsetdatetime: "time.Time",
        duration: "time.Duration",
        zoneddatetime: "time.Time",
        
        // Network types
        ipaddress: "string",
        ipv4address: "string",
        ipv6address: "string",
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