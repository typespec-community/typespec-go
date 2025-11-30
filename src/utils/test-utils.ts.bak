// Test utilities for TypeSpec testing
import { createTestHost } from "@typespec/compiler";

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

export async function createTestProgram(spec: TestProgramSpec) {
  const host = createTestHost();
  return host.createProgram({
    main: false,
    options: {},
    ref: null,
  });
}

export function createTestModel(name: string, properties: Record<string, TestModelProperty>) {
  return {
    name,
    kind: "Model",
    properties: new Map(
      Object.entries(properties).map(([key, value]: [string, TestModelProperty]) => [
        key,
        { ...value, name: key },
      ]),
    ),
  };
}

export function createTestType(kind: string, name?: string) {
  return {
    kind,
    name: name || kind.toLowerCase(),
  };
}
