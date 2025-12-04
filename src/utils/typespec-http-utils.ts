/**
 * TypeSpec HTTP Utilities
 * Extract HTTP metadata from TypeSpec operations and decorators
 */

import type { Program, Operation, ModelProperty, Type } from "@typespec/compiler";
import { getHttpOperation } from "@typespec/http";
import type { HttpOperation } from "@typespec/http";
import { mapTypeSpecTypeToGo } from "../domain/clean-type-mapper.js";

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
  const httpOpResult = getHttpOperation(program, operation);
  if (!httpOpResult) {
    return null;
  }
  const [httpOp] = httpOpResult;

  // Extract HTTP method
  const method = httpOp.verb || "POST";

  // Extract path
  const path = httpOp.path || "/";

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
  // Map TypeSpec type to Go type using unified type mapper
  const goType = mapTypeSpecTypeToGo(prop.type, name).goType;

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
    switch (decorator.decorator.name) {
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
  const path = httpOp.path || "";
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
 * Convert string to camelCase
 */
function toCamelCase(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
