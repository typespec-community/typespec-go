import { describe, test, expect } from "vitest";
import { render } from "@alloy-js/core";
import { Output } from "@alloy-js/core";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";
import { MockFactory } from "../testing/mock-factory.js";

describe("GoPackageDirectory Component", () => {
  test("generates proper package structure", () => {
    const mockModel = MockFactory.createModel("User", {
      id: MockFactory.createScalar("string"),
    });

    const output = render(
      <Output>
        <GoPackageDirectory models={[mockModel]} packageName="test" />
      </Output>,
    );

    // Navigate the structure to get the models.go content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moduleDir = output.contents[0] as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sourceDir = moduleDir.contents[0] as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelsFile = sourceDir.contents[0] as any;

    expect(modelsFile.contents).toContain("type User struct");
    expect(modelsFile.contents).toContain("ID string");
  });

  test("handles operations with handlers", () => {
    const mockOperation = MockFactory.createOperation("GetUser");

    const output = render(
      <Output>
        <GoPackageDirectory operations={[mockOperation]} models={[]} packageName="test" />
      </Output>,
    );

    // Check that output contains something
    expect(output.contents).toBeDefined();
    expect(output.contents.length).toBeGreaterThan(0);
  });
});
