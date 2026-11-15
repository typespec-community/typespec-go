/**
 * Package file-layout builder: decides which files a generated Go package
 * contains, which imports they need, and the Service/API identifiers.
 */

import { describe, expect, test } from "vitest";
import type { Operation, Union } from "@typespec/compiler";
import { buildPackageFileLayout } from "../domain/package-layout.js";
import {
  createEnum,
  createModel,
  createModelWithProps,
  createScalar,
} from "../testing/mock-factory.js";

describe("buildPackageFileLayout", () => {
  test("full package: all files, Service/API names, placeholder module root", () => {
    const layout = buildPackageFileLayout({
      packageName: "crud",
      models: [createModel("Widget")],
      enums: [createEnum("Status", [{ name: "Pending", value: "pending" }])],
      unions: [],
      operations: [createOperationStub()],
    });

    expect(layout.moduleDirectory).toBe("github.com/yourcompany/crud");
    expect(layout.serviceName).toBe("CrudService");
    expect(layout.apiInterfaceName).toBe("CrudAPI");
    expect(layout.files.enums).toBe(true);
    expect(layout.files.handlers).toBe(true);
    expect(layout.files.interfaces).toBe(true);
    expect(layout.files.unions).toBe(false);
    expect(layout.imports.modelsTime).toBe(false);
    expect(layout.imports.unionsJsonFmt).toBe(false);
  });

  test("explicit modulePath overrides the placeholder root", () => {
    const layout = buildPackageFileLayout({
      packageName: "orders",
      modulePath: "github.com/acme/orders/api/orders",
      models: [],
      enums: [],
      unions: [createUnionStub()],
      operations: [],
    });

    expect(layout.moduleDirectory).toBe("github.com/acme/orders/api/orders");
    expect(layout.serviceName).toBe("OrdersService");
    expect(layout.apiInterfaceName).toBe("OrdersAPI");
    expect(layout.files.handlers).toBe(false);
    expect(layout.files.interfaces).toBe(false);
    expect(layout.files.enums).toBe(false);
    expect(layout.files.unions).toBe(true);
    expect(layout.imports.unionsJsonFmt).toBe(true);
  });

  test("time-typed model property requires the time import", () => {
    const timeModel = createModelWithProps("Stamped", [
      { name: "createdAt", type: createScalar("utcDateTime") },
    ]);
    const layout = buildPackageFileLayout({
      packageName: "api",
      models: [timeModel],
      enums: [],
      unions: [],
      operations: [],
    });

    expect(layout.imports.modelsTime).toBe(true);
  });

  test("non-time scalars do not require the time import", () => {
    const plainModel = createModelWithProps("Widget", [
      { name: "id", type: createScalar("string") },
    ]);
    const layout = buildPackageFileLayout({
      packageName: "api",
      models: [plainModel],
      enums: [],
      unions: [],
      operations: [],
    });

    expect(layout.imports.modelsTime).toBe(false);
  });
});

function createOperationStub(): Operation {
  return {
    kind: "Operation",
    name: "getWidget",
    parameters: { kind: "Model", name: "parameters", properties: new Map() },
    returnType: createScalar("string"),
  } as unknown as Operation;
}

function createUnionStub(): Union {
  return {
    kind: "Union",
    name: "Result",
    variants: new Map(),
    expression: false,
  } as unknown as Union;
}
