// Test utilities for TypeSpec testing
import { createProgram, createScalar } from "@typespec/compiler";

/**
 * Test Program Specification
 * Type-safe test program specification
 */
interface TestProgramSpec {
  [key: string]: unknown;
}

/**
 * Test Model Property
 * Type-safe test model property
 */
interface TestModelProperty {
  kind?: string;
  name?: string;
  type?: unknown;
  optional?: boolean;
  [key: string]: unknown;
}

export function createTestProgram(spec: TestProgramSpec) {
  return createProgram({
    main: false,
    options: {},
    ref: null
  });
}

export function createTestModel(name: string, properties: Record<string, TestModelProperty>) {
  return {
    name,
    kind: "Model",
    properties: new Map(Object.entries(properties).map(([key, value]: [string, TestModelProperty]) => [
      key,
      { ...value, name: key }
    ]))
  };
}

export function createTestType(kind: string, name?: string) {
  return {
    kind,
    name: name || kind.toLowerCase()
  };
}