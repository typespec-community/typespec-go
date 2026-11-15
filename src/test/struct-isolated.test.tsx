/**
 * Test GoStructDeclaration in isolation
 */

import { expect, test } from "vitest";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";
import { createModelWithProps, createScalar } from "../testing/mock-factory.js";
import { renderGoContent } from "../testing/test-utils.js";

test("GoStructDeclaration isolation test", () => {
  const mockModel = createModelWithProps("TestUser", [
    { name: "id", type: createScalar("string") },
    { name: "name", type: createScalar("string") },
  ]);

  const result = renderGoContent(<GoStructDeclaration model={mockModel} />, "models.go");

  expect(result).toContain("type TestUser struct");
  expect(result).toContain('ID   string `json:"id"`');
  expect(result).toContain('Name string `json:"name"`');
});
