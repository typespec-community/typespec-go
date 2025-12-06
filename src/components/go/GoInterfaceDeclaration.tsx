/**
 * Go Interface Declaration Component
 * Generates Go interfaces from TypeSpec operations using 100% Alloy-JS components
 * Supports service interfaces with HTTP method mappings
 */

import type { Operation, Model, Type, Program, Namespace } from "@typespec/compiler";
import { capitalize } from "../../utils/strings.js";
import { getDocumentation } from "../../utils/typespec-utils.js";
import { TypeExpression } from "../TypeExpression.js";
import { refkey } from "@alloy-js/core";
import * as go from "@alloy-js/go";
const { InterfaceDeclaration, InterfaceFunction } = go;

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
 * Generates Go interface from TypeSpec operations using Alloy-JS components
 */
export function GoInterfaceDeclaration({
  name,
  operations,
  packageName = "api",
  program,
}: GoInterfaceDeclarationProps) {
  // Convert operations to method signatures
  const methods = operations.map((op) => operationToMethod(op, program));

  // Build interface documentation
  const interfaceDoc = name + " defines the service interface";

  return (
    <go.TypeDeclaration name={name} doc={interfaceDoc}>
      <InterfaceDeclaration>
        {methods.map((method) => (
          <InterfaceFunction 
            name={method.name}
            parameters={method.parameters}
            returns={buildGoSignature(method.returns)}
            doc={method.doc}
          />
        ))}
      </InterfaceDeclaration>
    </go.TypeDeclaration>
  );
}

/**
 * Build Go return signature string from return types
 */
function buildGoSignature(returns: GoReturnType[]): string {
  const returnTypes = returns
    .map((r) => r.type)
    .filter((t) => t !== "")
    .join(", ");
  
  return returns.length > 1 ? "(" + returnTypes + ")" : returnTypes;
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
        type: TypeExpression({ type: prop.type }),
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
    returns.push({ type: TypeExpression({ type: operation.returnType }) });
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