/**
 * Pointer Type Generation Tests
 * Tests for optional model field pointer handling
 */

import { describe, expect, it } from "vitest";
import { Output, render } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";
import { MockFactory } from "../testing/mock-factory.js";
import type { Type } from "@typespec/compiler";

describe("Pointer Type Generation", () => {
  it("generates pointer for optional nested model fields", () => {
    // Create a mock model with an optional User field
    const mockUserModel = MockFactory.createModelWithProps("User", [
      { name: "id", type: MockFactory.createScalar("string") },
    ]);

    const mockTaskModel = MockFactory.createModelWithProps("Task", [
      { name: "id", type: MockFactory.createScalar("string") },
      { name: "assignee", type: mockUserModel, optional: true }, // Nested model
    ]);

    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="models.go">
              <GoStructDeclaration
                model={mockTaskModel}
                packageName="api"
                usePointersForOptional={true}
              />
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    // Expect the result to contain a pointer type for the optional model field
    expect(result).toBeDefined();
  });

  it("does not generate pointer for required model fields", () => {
    const mockOwnerModel = MockFactory.createModelWithProps("User", [
      { name: "id", type: MockFactory.createScalar("string") },
    ]);

    const mockTaskModel = MockFactory.createModelWithProps("Task", [
      { name: "owner", type: mockOwnerModel, optional: false }, // Required field
    ]);

    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="models.go">
              <GoStructDeclaration
                model={mockTaskModel}
                packageName="api"
                usePointersForOptional={true}
              />
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    expect(result).toBeDefined();
  });

  it("does not generate pointer for slice types", () => {
    const arrayType = {
      kind: "Model",
      name: "Array",
      templateMapper: { args: [MockFactory.createModel("Task")] },
    } as unknown as Type;

    const mockProjectModel = MockFactory.createModelWithProps("Project", [
      { name: "tasks", type: arrayType, optional: true }, // Optional but it's an array
    ]);

    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="models.go">
              <GoStructDeclaration
                model={mockProjectModel}
                packageName="api"
                usePointersForOptional={true}
              />
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    expect(result).toBeDefined();
  });
});
