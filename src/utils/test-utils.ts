// Test utilities for TypeSpec testing
import { createProgram, createScalar } from "@typespec/compiler";

export function createTestProgram(spec: any) {
  return createProgram({
    main: false,
    options: {},
    ref: null
  });
}

export function createTestModel(name: string, properties: any) {
  return {
    name,
    kind: "Model",
    properties: new Map(Object.entries(properties).map(([key, value]: [string, any]) => [
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