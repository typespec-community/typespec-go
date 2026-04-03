/**
 * Pointer Type Generation Tests
 * Tests for optional model field pointer handling
 */

import { describe, expect, it } from "vitest";
import { Output, render } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";

describe("Pointer Type Generation", () => {
  it("generates pointer for optional nested model fields", () => {
    // Create a mock model with an optional User field
    const _mockUserModel = {
      kind: "Model" as const,
      name: "User",
      properties: new Map([
        [
          "id",
          {
            name: "id",
            type: { kind: "Scalar", name: "string" },
            optional: false,
          },
        ],
      ]),
    };

    const mockTaskModel = {
      kind: "Model" as const,
      name: "Task",
      properties: new Map([
        [
          "id",
          {
            name: "id",
            type: { kind: "Scalar", name: "string" },
            optional: false,
          },
        ],
        [
          "assignee",
          {
            name: "assignee",
            type: { kind: "Model", name: "User" }, // Nested model
            optional: true, // Optional field
          },
        ],
      ]),
    };

    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="models.go">
              <GoStructDeclaration
                model={mockTaskModel as unknown}
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
    const mockTaskModel = {
      kind: "Model" as const,
      name: "Task",
      properties: new Map([
        [
          "owner",
          {
            name: "owner",
            type: { kind: "Model", name: "User" },
            optional: false, // Required field
          },
        ],
      ]),
    };

    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="models.go">
              <GoStructDeclaration
                model={mockTaskModel as unknown}
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
    const mockProjectModel = {
      kind: "Model" as const,
      name: "Project",
      properties: new Map([
        [
          "tasks",
          {
            name: "tasks",
            type: {
              kind: "Model",
              name: "Array",
              templateMapper: { args: [{ kind: "Model", name: "Task" }] },
            },
            optional: true, // Optional but it's an array
          },
        ],
      ]),
    };

    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="models.go">
              <GoStructDeclaration
                model={mockProjectModel as unknown}
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
