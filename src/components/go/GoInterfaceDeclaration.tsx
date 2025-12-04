/**
 * Go Interface Declaration Component
 * Generates Go interfaces from TypeSpec operations
 * Supports service interfaces with HTTP method mappings
 */

import type { Operation, Model, Type, Program, Namespace } from "@typespec/compiler";
import { capitalize } from "../../utils/strings.js";
import { getDocumentation } from "../../utils/typespec-utils.js";
import { mapTypeSpecTypeToGo } from "../../domain/clean-type-mapper.js";

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
  program,
}: GoInterfaceDeclarationProps): string {
  const methods = operations.map((op) => operationToMethod(op, program));

  return generateInterfaceCode(name, methods);
}

/**
 * Convert TypeSpec Operation to Go method signature
 */
function operationToMethod(operation: Operation, program?: Program): GoMethodSignature {
  const methodName = capitalize(operation.name);
  const parameters = extractParameters(operation, program);
  const returns = extractReturns(operation, program);
  const doc = program ? getDocumentation(program, operation) : undefined;

  return {
    name: methodName,
    parameters,
    returns,
    doc,
  };
}

/**
 * Extract parameters from operation
 */
function extractParameters(operation: Operation, program?: Program): GoParameter[] {
  const params: GoParameter[] = [];

  // Always include context as first parameter
  params.push({ name: "ctx", type: "context.Context" });

  // Add operation parameters
  if (operation.parameters) {
    for (const [name, prop] of operation.parameters.properties) {
      params.push({
        name: toCamelCase(name),
        type: mapTypeSpecTypeToGo(prop.type, program).goType,
      });
    }
  }

  return params;
}

/**
 * Extract return types from operation
 */
function extractReturns(operation: Operation, program?: Program): GoReturnType[] {
  const returns: GoReturnType[] = [];

  // Map return type
  if (operation.returnType) {
    returns.push({ type: mapTypeSpecTypeToGo(operation.returnType, program).goType });
  }

  // Always return error
  returns.push({ type: "error" });

  return returns;
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

    const params = method.parameters.map((p) => `${p.name} ${p.type}`).join(", ");

    const returns = method.returns
      .map((r) => r.type)
      .filter((t) => t !== "")
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
export function collectOperations(namespace: Namespace): Operation[] {
  const operations: Operation[] = [];

  if (namespace.operations) {
    for (const op of namespace.operations.values()) {
      operations.push(op);
    }
  }

  return operations;
}
