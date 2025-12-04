/**
 * Test GoStructDeclaration in isolation
 */

import { test, expect } from "vitest";
import { render, Output, refkey } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";

test("GoStructDeclaration isolation test", () => {
  const mockModel = {
    kind: "Model" as const,
    name: "TestUser",
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
        "name",
        {
          name: "name", 
          type: { kind: "Scalar", name: "string" },
          optional: false,
        },
      ],
    ]),
  };

  expect(() => {
    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="models">
            <SourceFile path="user.go">
              <GoStructDeclaration model={mockModel} />
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>
    );
    console.log("✅ GoStructDeclaration render successful");
  }).not.toThrow();
});