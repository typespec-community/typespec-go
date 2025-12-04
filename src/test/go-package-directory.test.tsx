import { describe, test, expect } from "vitest";
import { render } from "@alloy-js/core";
import { Output } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";

describe("GoPackageDirectory Component", () => {
  test("generates proper package structure", () => {
    const mockModel = {
      name: "User",
      kind: "Model" as const,
      properties: new Map([
        ["id", { name: "id", type: { kind: "Scalar", name: "string" }, optional: false }],
      ]),
    };

    const output = render(
      <Output>
        <GoPackageDirectory 
          models={[mockModel]}
          packageName="test"
        />
      </Output>
    );

    // Navigate the structure to get the models.go content
    const moduleDir = output.contents[0] as any;
    const sourceDir = moduleDir.contents[0] as any;
    const modelsFile = sourceDir.contents[0] as any;

    expect(modelsFile.contents).toContain("type User struct");
    expect(modelsFile.contents).toContain("ID string");
  });

  test("handles operations with handlers", () => {
    const mockOperation = {
      name: "GetUser",
      kind: "Operation" as const,
    };

    const output = render(
      <Output>
        <GoPackageDirectory 
          operations={[mockOperation]}
          packageName="test"
        />
      </Output>
    );

    // Check that output contains something
    expect(output.contents).toBeDefined();
    expect(output.contents.length).toBeGreaterThan(0);
  });
});