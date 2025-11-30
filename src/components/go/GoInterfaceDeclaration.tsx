/**
 * Go Interface Declaration Component
 * Generates Go interfaces from TypeSpec operations
 * Supports service interfaces with HTTP method mappings
 */

import type { Operation, Model, Type, Program } from "@typespec/compiler";
import { capitalize } from "../../utils/strings.js";
import { getDocumentation } from "../../utils/typespec-utils.js";

interface GoInterfaceDeclarationProps {
  /** Interface name */
  name: string;
  /** TypeSpec operations to convert to interface methods */
  operations: Operation[];
  /** Package name for documentation */
  packageName?: string;
  /** TypeSpec program for accessing @doc decorators */
  program?: Program;
}

interface GoMethodSignature {
  /** Method name (PascalCase) */
  name: string;
  /** Method parameters */
  parameters: GoParameter[];
  /** Return types */
  returns: GoReturnType[];
  /** Documentation comment */
  doc?: string;
}

interface GoParameter {
  /** Parameter name */
  name: string;
  /** Go type */
  type: string;
}

interface GoReturnType {
  /** Go type */
  type: string;
}

/**
 * Go Interface Declaration Component
 * Generates Go interface from TypeSpec operations
 */
export function GoInterfaceDeclaration({ 
  name, 
  operations,
  packageName = "api",
  program
}: GoInterfaceDeclarationProps): string {
  const methods = operations.map(op => operationToMethod(op, program));
  
  return generateInterfaceCode(name, methods);
}

/**
 * Convert TypeSpec Operation to Go method signature
 */
function operationToMethod(operation: Operation, program?: Program): GoMethodSignature {
  const methodName = capitalize(operation.name);
  const parameters = extractParameters(operation);
  const returns = extractReturns(operation);
  const doc = program ? getDocumentation(program, operation as any) : undefined;
  
  return {
    name: methodName,
    parameters,
    returns,
    doc
  };
}

/**
 * Extract parameters from operation
 */
function extractParameters(operation: Operation): GoParameter[] {
  const params: GoParameter[] = [];
  
  // Always include context as first parameter
  params.push({ name: "ctx", type: "context.Context" });
  
  // Add operation parameters
  if (operation.parameters) {
    for (const [name, prop] of operation.parameters.properties) {
      params.push({
        name: toCamelCase(name),
        type: mapTypeToGo(prop.type)
      });
    }
  }
  
  return params;
}

/**
 * Extract return types from operation
 */
function extractReturns(operation: Operation): GoReturnType[] {
  const returns: GoReturnType[] = [];
  
  // Map return type
  if (operation.returnType) {
    returns.push({ type: mapTypeToGo(operation.returnType) });
  }
  
  // Always return error
  returns.push({ type: "error" });
  
  return returns;
}

/**
 * Map TypeSpec type to Go type
 */
function mapTypeToGo(type: Type): string {
  switch (type.kind) {
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Number":
      return "float64";
    case "Scalar":
      return mapScalarToGo(type.name || "");
    case "Model":
      if (type.name === "void") return "";
      return type.name || "interface{}";
    case "Enum":
      return type.name || "string";
    case "Union":
      return type.name || "interface{}";
    default:
      return "interface{}";
  }
}

/**
 * Map scalar type to Go
 */
function mapScalarToGo(name: string): string {
  const scalarMap: Record<string, string> = {
    string: "string",
    int8: "int8",
    int16: "int16",
    int32: "int32",
    int64: "int64",
    uint8: "uint8",
    uint16: "uint16",
    uint32: "uint32",
    uint64: "uint64",
    integer: "int",
    float32: "float32",
    float64: "float64",
    boolean: "bool",
    bytes: "[]byte",
    utcDateTime: "time.Time",
    plainDate: "time.Time",
    plainTime: "time.Time",
    duration: "time.Duration",
  };
  
  return scalarMap[name.toLowerCase()] || "interface{}";
}

/**
 * Convert to camelCase
 */
function toCamelCase(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/**
 * Generate Go interface code
 */
function generateInterfaceCode(name: string, methods: GoMethodSignature[]): string {
  const lines: string[] = [];
  
  // Interface documentation
  lines.push(`// ${name} defines the service interface`);
  lines.push(`type ${name} interface {`);
  
  // Methods
  for (const method of methods) {
    if (method.doc) {
      lines.push(`\t// ${method.name} ${method.doc}`);
    }
    
    const params = method.parameters
      .map(p => `${p.name} ${p.type}`)
      .join(", ");
    
    const returns = method.returns
      .map(r => r.type)
      .filter(t => t !== "")
      .join(", ");
    
    const returnPart = method.returns.length > 1 ? `(${returns})` : returns;
    
    lines.push(`\t${method.name}(${params}) ${returnPart}`);
  }
  
  lines.push(`}`);
  
  return lines.join("\n");
}

/**
 * Parse operations from a TypeSpec namespace
 */
export function collectOperations(namespace: any): Operation[] {
  const operations: Operation[] = [];
  
  if (namespace.operations) {
    for (const op of namespace.operations.values()) {
      operations.push(op);
    }
  }
  
  return operations;
}
