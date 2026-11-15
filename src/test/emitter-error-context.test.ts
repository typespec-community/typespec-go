/**
 * Per-namespace error context: when generation of one namespace's package
 * fails, the emitter must rethrow with the namespace and Go package names
 * (and preserve the original error as `cause`) instead of surfacing an
 * unattributed failure.
 */

import { describe, expect, test, vi } from "vitest";
import { $onEmit } from "../main.js";
import { createEmitContext, createModel, createProgram } from "../testing/mock-factory.js";

const { componentFailure } = vi.hoisted(() => ({
  componentFailure: new Error("component exploded"),
}));

vi.mock("../components/go/GoPackageDirectory.js", () => ({
  GoPackageDirectory: () => {
    throw componentFailure;
  },
}));

describe("Emitter per-namespace error context", () => {
  test("names the namespace and package and preserves the cause", async () => {
    const mockModel = createModel("TestUser");
    const mockProgram = createProgram({ TestUser: mockModel });
    const mockContext = createEmitContext(mockProgram);

    const rejection: unknown = await $onEmit(mockContext).then(
      () => null,
      (error: unknown) => error,
    );

    expect(rejection).toBeInstanceOf(Error);
    const error = rejection as Error;
    expect(error.message).toContain(
      "Failed to generate Go package for namespace 'global' (package 'global')",
    );
    expect(error.message).toContain("component exploded");
    expect(error.cause).toBe(componentFailure);
  });
});
