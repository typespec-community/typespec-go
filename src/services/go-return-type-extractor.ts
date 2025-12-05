/**
 * Go Return Type Extractor
 * Extracts and maps TypeSpec operation return types to Go types
 * Handles various return type patterns (single, tuple, error, etc.)
 */

import type { Operation, Type } from "@typespec/compiler";
import { TypeExpression } from "../components/TypeExpression.js";

/**
 * Extract return type information from a TypeSpec operation
 */
export interface GoReturnType {
  /** Main return type */
  type: string;
  /** Whether operation returns error */
  returnsError: boolean;
  /** Complete function signature return part */
  signature: string;
  /** Full Go type declaration */
  goType: string;
}

/**
 * Extract return type from TypeSpec operation
 */
export function extractReturnType(operation: Operation): GoReturnType {
  if (!operation.returnType) {
    return {
      type: "void",
      returnsError: false,
      signature: "",
      goType: "",
    };
  }

  const returnType = operation.returnType;

  // Handle different return type patterns
  if (returnType.kind === "Tuple") {
    return extractTupleReturnType(returnType);
  }

  if (returnType.kind === "Union" && isErrorUnion(returnType)) {
    return extractErrorReturnType(returnType);
  }

  return extractSimpleReturnType(returnType);
}

/**
 * Extract tuple return type (multiple return values)
 */
function extractTupleReturnType(tupleType: Type): GoReturnType {
  const tupleTypeSpec = tupleType as { values?: Type[] };
  const elements = tupleTypeSpec.values || [];
  const mainType = elements.find((el: Type) => !isErrorType(el));
  const errorType = elements.find((el: Type) => isErrorType(el));

  const mainGoType = mainType ? TypeExpression({ type: mainType }) : "";
  const returnsError = !!errorType;

  const signature = returnsError ? `(${mainGoType}, error)` : mainGoType;
  const goType = returnsError ? `(${mainGoType}, error)` : mainGoType;

  return {
    type: mainGoType || "void",
    returnsError,
    signature,
    goType,
  };
}

/**
 * Extract error union return type
 */
function extractErrorReturnType(unionType: Type): GoReturnType {
  const unionTypeSpec = unionType as { options?: Type[] };
  const options = unionTypeSpec.options || [];
  const nonErrorTypes = options.filter((opt: Type) => !isErrorType(opt));
  const mainType = nonErrorTypes[0];

  if (!mainType) {
    return {
      type: "void",
      returnsError: true,
      signature: "error",
      goType: "error",
    };
  }

  const mainGoType = TypeExpression({ type: mainType });
  const signature = `(${mainGoType}, error)`;
  const goType = `(${mainGoType}, error)`;

  return {
    type: mainGoType,
    returnsError: true,
    signature,
    goType,
  };
}

/**
 * Extract simple return type (single value)
 */
function extractSimpleReturnType(returnType: Type): GoReturnType {
  const mainGoType = TypeExpression({ type: returnType });
  const signature = mainGoType;
  const goType = mainGoType;

  return {
    type: mainGoType,
    returnsError: false,
    signature,
    goType,
  };
}

/**
 * Check if type is an error type
 */
function isErrorType(type: Type): boolean {
  if (!type) return false;

  const typeSpec = type as { name?: string; kind?: string; decorators?: { name: string }[] };

  // Common TypeSpec error type patterns
  if (typeSpec.name && typeSpec.name.toLowerCase().includes("error")) {
    return true;
  }

  if (typeSpec.kind === "Model" && typeSpec.name === "Error") {
    return true;
  }

  // Check for @error decorator
  if (typeSpec.decorators) {
    return typeSpec.decorators.some(
      (dec: { name: string }) => dec.name === "error" || dec.name === "$error",
    );
  }

  return false;
}

/**
 * Check if union is primarily an error union
 */
function isErrorUnion(unionType: Type): boolean {
  const unionTypeSpec = unionType as { options?: Type[] };
  const options = unionTypeSpec.options;
  if (!options) return false;
  return options.some((opt: Type) => isErrorType(opt));
}
