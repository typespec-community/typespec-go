/**
 * TypeSpec HTTP Utilities
 * Extract HTTP metadata from TypeSpec operations and decorators
 */

import type { Program, Operation, ModelProperty, Type } from "@typespec/compiler";
import { getHttpOperation, getRoutePath, getOperationVerb, HttpOperation } from "@typespec/http";

/**
 * HTTP operation metadata extracted from TypeSpec decorators
 */
export interface HttpOperationMetadata {
  /** HTTP method (GET, POST, PUT, PATCH, DELETE) */
  method: string;
  /** Route path template */
  path: string;
  /** Full route including base path */
  fullRoute: string;
  /** Parameters with their HTTP sources */
  parameters: HttpParameter[];
  /** TypeSpec operation reference */
  operation: Operation;
}

/**
 * HTTP parameter with source information
 */
export interface HttpParameter {
  /** Parameter name */
  name: string;
  /** Go type string */
  goType: string;
  /** Parameter source (path, query, body, header) */
  source: "path" | "query" | "body" | "header";
  /** TypeSpec property reference */
  property?: ModelProperty;
  /** Whether parameter is optional */
  optional: boolean;
}

/**
 * Extract HTTP metadata from TypeSpec operation
 */
export function extractHttpMetadata(
  operation: Operation,
  program: Program,
): HttpOperationMetadata | null {
  // Get HTTP operation using TypeSpec HTTP library
  const httpOp = getHttpOperation(program, operation);
  if (!httpOp) {
    return null;
  }

  // Extract HTTP method
  const method = getOperationVerb(httpOp) || "POST";

  // Extract path
  const path = getRoutePath(httpOp) || "/";

  // Extract parameters
  const parameters = extractHttpParameters(httpOp, operation);

  return {
    method: method.toUpperCase(),
    path,
    fullRoute: path,
    parameters,
    operation,
  };
}

/**
 * Extract HTTP parameters from TypeSpec HTTP operation
 */
function extractHttpParameters(httpOp: HttpOperation, operation: Operation): HttpParameter[] {
  const parameters: HttpParameter[] = [];

  // Add standard HTTP handler parameters (always present)
  parameters.push({
    name: "ctx",
    goType: "context.Context",
    source: "header", // context is like a header parameter
    optional: false,
  });

  parameters.push({
    name: "w",
    goType: "http.ResponseWriter",
    source: "header", // response writer is framework-provided
    optional: false,
  });

  parameters.push({
    name: "r",
    goType: "*http.Request",
    source: "header", // request is framework-provided
    optional: false,
  });

  // Extract operation parameters from TypeSpec operation
  if (operation.parameters) {
    for (const [name, prop] of operation.parameters.properties) {
      const httpParam = extractHttpParameter(name, prop, httpOp);
      if (httpParam) {
        parameters.push(httpParam);
      }
    }
  }

  return parameters;
}

/**
 * Extract individual HTTP parameter from TypeSpec property
 */
function extractHttpParameter(
  name: string,
  prop: ModelProperty,
  httpOp: HttpOperation,
): HttpParameter | null {
  // Map TypeSpec type to Go type (simplified version)
  const goType = mapTypeSpecToGo(prop.type);

  // Determine parameter source from HTTP operation
  const source = determineParameterSource(name, prop, httpOp);

  return {
    name: toCamelCase(name),
    goType,
    source,
    property: prop,
    optional: prop.optional || false,
  };
}

/**
 * Determine HTTP parameter source based on TypeSpec decorators and operation
 */
function determineParameterSource(
  name: string,
  prop: ModelProperty,
  httpOp: HttpOperation,
): "path" | "query" | "body" | "header" {
  // Check TypeSpec HTTP decorators on the property
  const decorators = prop.decorators || [];

  for (const decorator of decorators) {
    switch (decorator.name) {
      case "path":
        return "path";
      case "query":
        return "query";
      case "header":
        return "header";
      case "body":
        return "body";
      case "bodyRoot":
        return "body";
    }
  }

  // Check if parameter name appears in the path template
  const path = getRoutePath(httpOp) || "";
  if (path.includes(`{${name}}`)) {
    return "path";
  }

  // Default to query for simple scalar types
  if (prop.type.kind === "String" || prop.type.kind === "Boolean" || prop.type.kind === "Number") {
    return "query";
  }

  // Default to body for complex types
  return "body";
}

/**
 * Map TypeSpec type to Go type (simplified version)
 */
function mapTypeSpecToGo(type: Type): string {
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
      return type.name || "interface{}";
    case "Enum":
      return type.name || "string";
    default:
      return "interface{}";
  }
}

/**
 * Map scalar TypeSpec types to Go types
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
 * Convert string to camelCase
 */
function toCamelCase(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
