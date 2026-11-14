/**
 * Single source of truth for TypeSpec scalar → Go primitive type mapping.
 *
 * Consumers:
 * - `GoStructDeclaration` (JSX-aware component mapping)
 * - `CleanTypeMapper` (GoTypeMapping with pointer/import policy)
 * - `type-mapping.service` (GoPrimitiveType results)
 *
 * Keys are lower-cased TypeSpec scalar names; callers lower-case before
 * lookup. Values are Go type names, qualified where needed (`time.Time`).
 * Aliases that TypeSpec treats as integers/floats resolve to the valid Go
 * primitive instead of an invalid Go identifier.
 */

import { GoPrimitiveType } from "../types/emitter.types.js";

export const GO_SCALAR_PRIMITIVES: Record<string, string> = {
  // Strings
  string: "string",
  url: "string",
  uri: "string",
  email: "string",
  uuid: "string",
  ipaddress: "string",
  ipv4address: "string",
  ipv6address: "string",

  // Booleans
  boolean: "bool",
  bool: "bool",

  // Integers
  int8: "int8",
  int16: "int16",
  int32: "int32",
  int64: "int64",
  integer: "int64",
  safeint: "int64",
  uint8: "uint8",
  uint16: "uint16",
  uint32: "uint32",
  uint64: "uint64",

  // Floats
  float32: "float32",
  float64: "float64",
  float: "float64",
  numeric: "float64",
  decimal: "float64",
  decimal64: "float64",
  decimal128: "float64",

  // Binary
  bytes: "[]byte",

  // Date/time (require the time import)
  plaindate: "time.Time",
  plaintime: "time.Time",
  utcdatetime: "time.Time",
  offsetdatetime: "time.Time",
  zoneddatetime: "time.Time",
  duration: "time.Duration",
};

/** Look up the Go primitive for a TypeSpec scalar name (any case). */
export function lookupGoScalarPrimitive(scalarName: string): string | undefined {
  return GO_SCALAR_PRIMITIVES[scalarName.toLowerCase()];
}

const KNOWN_GO_PRIMITIVES = new Set<string>(Object.values(GO_SCALAR_PRIMITIVES));

/**
 * Look up the Go primitive as a `GoPrimitiveType` enum member, for services
 * that return enum-typed results. `undefined` when the scalar is unknown.
 */
export function lookupGoPrimitiveType(scalarName: string): GoPrimitiveType | undefined {
  const goType = lookupGoScalarPrimitive(scalarName);
  if (!goType || !KNOWN_GO_PRIMITIVES.has(goType)) return undefined;
  return goType as GoPrimitiveType;
}

/** Whether a mapped Go primitive requires the `time` import. */
export function goPrimitiveRequiresTimeImport(goType: string): boolean {
  return goType === "time.Time" || goType === "time.Duration";
}
