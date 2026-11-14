/**
 * Tests for built-in TypeSpec-namespace filtering in collectTypesByNamespace.
 * The emitter must never generate Go packages for the compiler's own
 * library namespaces (TypeSpec.Http, TypeSpec.Rest, ...).
 */

import { describe, expect, test } from "vitest";
import type { Namespace } from "@typespec/compiler";
import { collectTypesByNamespace } from "../emitter/typespec-go-emitter.js";
import { MockFactory } from "../testing/mock-factory.js";

function attachNamespaces(parent: Namespace, children: Namespace[]): Namespace {
  parent.namespaces = new Map(children.map((child) => [child.name ?? "", child]));
  return parent;
}

describe("collectTypesByNamespace namespace filtering", () => {
  test("filters built-in TypeSpec library namespace", () => {
    const typeSpecNs = MockFactory.createNamespace("TypeSpec", {
      models: { HttpOperationResponse: MockFactory.createModel("HttpOperationResponse") },
    });
    const httpNs = MockFactory.createNamespace("Http", {
      models: { HttpOperation: MockFactory.createModel("HttpOperation") },
    });
    attachNamespaces(typeSpecNs, [httpNs]);

    const userNs = MockFactory.createNamespace("PetStore", {
      models: { Pet: MockFactory.createModel("Pet") },
    });

    const globalNamespace = MockFactory.createNamespace("");
    attachNamespaces(globalNamespace, [typeSpecNs, userNs]);

    const groups = collectTypesByNamespace(globalNamespace);

    expect(groups.has("TypeSpec")).toBe(false);
    expect(groups.has("Http")).toBe(false);
    expect(groups.has("PetStore")).toBe(true);
  });

  test("user namespaces survive filtering", () => {
    const modelsNs = MockFactory.createNamespace("Models", {
      models: { User: MockFactory.createModel("User") },
    });
    const enumsNs = MockFactory.createNamespace("Enums", {
      enums: { Status: MockFactory.createEnum("Status", [{ name: "active", value: "active" }]) },
    });

    const globalNamespace = MockFactory.createNamespace("");
    attachNamespaces(globalNamespace, [modelsNs, enumsNs]);

    const groups = collectTypesByNamespace(globalNamespace);

    expect(groups.size).toBe(2);
    expect(groups.get("Models")?.models.map((m) => m.name)).toEqual(["User"]);
    expect(groups.get("Enums")?.enums.map((e) => e.name)).toEqual(["Status"]);
  });

  test("global-namespace types still group under 'global'", () => {
    const globalNamespace = MockFactory.createNamespace("");
    globalNamespace.models = new Map([["Pet", MockFactory.createModel("Pet")]]);

    const groups = collectTypesByNamespace(globalNamespace);

    expect(groups.has("global")).toBe(true);
    expect(groups.get("global")?.models.map((m) => m.name)).toEqual(["Pet"]);
  });
});
