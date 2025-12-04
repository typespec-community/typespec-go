/**
 * Go Return Type Extractor
 * Extracts and maps TypeSpec operation return types to Go types
 * Handles various return type patterns (single, tuple, error, etc.)
 */

import type { Operation, Program, Type } from "@typespec/compiler";
import { mapTypeSpecTypeToGo } from "../domain/clean-type-mapper.js";

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
export function extractReturnType(operation: Operation, program: Program): GoReturnType {
  if (!operation.returnType) {
    return {
      type: "void",
      returnsError: false,
      signature: "",
      goType: ""
    };
  }

  const returnType = operation.returnType;
  
  // Handle different return type patterns
  if (returnType.kind === "Tuple") {
    return extractTupleReturnType(returnType, program);
  }
  
  if (returnType.kind === "Union" && isErrorUnion(returnType)) {
    return extractErrorReturnType(returnType, program);
  }
  
  return extractSimpleReturnType(returnType, program);
}

/**
 * Extract tuple return type (multiple return values)
 */
function extractTupleReturnType(tupleType: any, program: Program): GoReturnType {
  const elements = tupleType.values || [];
  const mainType = elements.find((el: any) => !isErrorType(el));
  const errorType = elements.find((el: any) => isErrorType(el));
  
  const mainGoType = mainType ? mapTypeSpecTypeToGo(mainType, program) : "";
  const returnsError = !!errorType;
  
  const signature = returnsError ? `(${mainGoType}, error)` : mainGoType;
  const goType = returnsError ? `(${mainGoType}, error)` : mainGoType;
  
  return {
    type: mainGoType || "void",
    returnsError,
    signature,
    goType
  };
}

/**
 * Extract error union return type
 */
function extractErrorReturnType(unionType: any, program: Program): GoReturnType {
  const nonErrorTypes = unionType.options?.filter((opt: any) => !isErrorType(opt)) || [];
  const mainType = nonErrorTypes[0];
  
  if (!mainType) {
    return {
      type: "void",
      returnsError: true,
      signature: "error",
      goType: "error"
    };
  }
  
  const mainGoType = mapTypeSpecTypeToGo(mainType, program);
  const signature = `(${mainGoType}, error)`;
  const goType = `(${mainGoType}, error)`;
  
  return {
    type: mainGoType,
    returnsError: true,
    signature,
    goType
  };
}

/**
 * Extract simple return type (single value)
 */
function extractSimpleReturnType(returnType: Type, program: Program): GoReturnType {
  const mainGoType = mapTypeSpecTypeToGo(returnType, program);
  const signature = mainGoType;
  const goType = mainGoType;
  
  return {
    type: mainGoType,
    returnsError: false,
    signature,
    goType
  };
}

/**
 * Check if type is an error type
 */
function isErrorType(type: any): boolean {
  if (!type) return false;
  
  // Common TypeSpec error type patterns
  if (type.name && type.name.toLowerCase().includes('error')) {
    return true;
  }
  
  if (type.kind === "Model" && type.name === "Error") {
    return true;
  }
  
  // Check for @error decorator
  if (type.decorators) {
    return type.decorators.some((dec: any) => 
      dec.name === "error" || dec.name === "$error"
    );
  }
  
  return false;
}

/**
 * Check if union is primarily an error union
 */
function isErrorUnion(unionType: any): boolean {
  if (!unionType.options) return false;
  return unionType.options.some((opt: any) => isErrorType(opt));
}