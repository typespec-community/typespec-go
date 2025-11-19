/**
 * TypeSpec Scalar Type Mappings - TypeSpec Go Emitter
 *
 * SCALAR MAPPINGS: TypeSpec scalar → Go type conversions
 * ZERO ANY TYPES: Professional type safety
 * FOCUSED MODULES: Single responsibility for scalar mappings
 */

import type { BasicMappedType } from "./type-interfaces.js";

/**
 * TypeSpec scalar to Go type mappings
 * COMPREHENSIVE COVERAGE: All scalar types with proper Go equivalents
 */
export const SCALAR_TYPE_MAPPINGS: Record<string, BasicMappedType> = {
  // Integer types
  int8: { name: "int8", requiresImport: false, usePointerForOptional: true },
  int16: {
    name: "int16",
    requiresImport: false,
    usePointerForOptional: true,
  },
  int32: {
    name: "int32",
    requiresImport: false,
    usePointerForOptional: true,
  },
  int64: {
    name: "int64",
    requiresImport: false,
    usePointerForOptional: true,
  },
  // Unsigned integer types (uints for never-negative values)
  uint8: { name: "uint8", requiresImport: false, usePointerForOptional: true },
  uint16: {
    name: "uint16",
    requiresImport: false,
    usePointerForOptional: true,
  },
  uint32: {
    name: "uint32",
    requiresImport: false,
    usePointerForOptional: true,
  },
  uint64: {
    name: "uint64",
    requiresImport: false,
    usePointerForOptional: true,
  },
  // Floating point types
  float32: {
    name: "float32",
    requiresImport: false,
    usePointerForOptional: true,
  },
  float64: {
    name: "float64",
    requiresImport: false,
    usePointerForOptional: true,
  },
  // Special types
  string: { name: "string", requiresImport: false, usePointerForOptional: true },
  bool: { name: "bool", requiresImport: false, usePointerForOptional: true },
  bytes: { name: "[]byte", requiresImport: false, usePointerForOptional: false },
};