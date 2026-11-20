/**
 * @go.pkg resolution failures: whatever fails inside the per-namespace
 * generation block — including file emission through an @go.pkg-derived
 * output path — must surface wrapped with namespace context and the
 * original error preserved as `cause`, never as a raw host error.
 */

import type { DecoratorContext, Namespace } from "@typespec/compiler";
import { describe, expect, test } from "vitest";
import { $pkg } from "../emitter/go-decorators.js";
import { $onEmit } from "../main.js";
import { createEmitContext, createModel, createProgram } from "../testing/mock-factory.js";

describe("Emitter @go.pkg error context", () => {
  test("a host write failure through the @go.pkg path surfaces with namespace context", async () => {
    const mockModel = createModel("TestUser");
    const mockProgram = createProgram({ TestUser: mockModel });
    const mockContext = createEmitContext(mockProgram);
    const globalNamespace: Namespace = mockProgram.getGlobalNamespaceType();

    const decoratorContext = {
      program: mockProgram,
      decoratorTarget: globalNamespace,
    } as unknown as DecoratorContext;
    $pkg(decoratorContext, globalNamespace, "example.com/acme/invalid");

    const rawWriteFailure = new Error("ENOTDIR: not a directory, open 'invalid/models.go'");
    mockProgram.host.writeFile = async () => {
      throw rawWriteFailure;
    };

    const rejection: unknown = await $onEmit(mockContext).then(
      () => null,
      (error: unknown) => error,
    );

    expect(rejection).toBeInstanceOf(Error);
    const error = rejection as Error;
    expect(error.message).toContain(
      "Failed to generate Go package for namespace 'global' (package 'global')",
    );
    expect(error.message).toContain("ENOTDIR");
    expect(error.cause).toBe(rawWriteFailure);
  });
});
