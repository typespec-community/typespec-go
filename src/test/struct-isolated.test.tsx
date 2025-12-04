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

  const result = GoStructDeclaration({
    model: mockModel,
    program: undefined,
  });

  console.log("✅ GoStructDeclaration render successful");
  console.log("Generated result:", result);

  expect(result).toContain("type TestUser struct");
  expect(result).toContain('ID string `json:"id"`');
  expect(result).toContain('Name string `json:"name"`');
});
