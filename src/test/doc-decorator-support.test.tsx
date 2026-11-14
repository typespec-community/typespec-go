/**
 * Tests for @doc decorator support in Go code generation
 */

import { describe, it, expect } from "vitest";
import { renderGoContent } from "../testing/test-utils.js";
import { MockFactory } from "../testing/mock-factory.js";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";
import { GoEnumDeclaration } from "../components/go/GoEnumDeclaration.js";
import { GoUnionDeclaration } from "../components/go/GoUnionDeclaration.js";

describe("@doc Decorator Support", () => {
  describe("GoStructDeclaration with explicit documentation", () => {
    it("should use provided documentation prop", () => {
      const mockModel = MockFactory.createModelWithProps("User", [
        { name: "id", type: MockFactory.createScalar("string") },
        { name: "name", type: MockFactory.createScalar("string") },
      ]);

      const result = renderGoContent(
        <GoStructDeclaration model={mockModel} documentation="A user in the system" />,
        "models.go",
      );

      expect(result).toBeDefined();
      expect(result).toContain("A user in the system");
    });

    it("should fall back to default documentation without program", () => {
      const mockModel = MockFactory.createModelWithProps("Task", [
        { name: "id", type: MockFactory.createScalar("string") },
      ]);

      const result = renderGoContent(
        <GoStructDeclaration model={mockModel} />,
        "models.go",
      );

      expect(result).toBeDefined();
    });
  });

  describe("GoEnumDeclaration with documentation", () => {
    it("should generate enum correctly", () => {
      const result = renderGoContent(
        <GoEnumDeclaration
          enum={MockFactory.createEnum("Status", [
            { name: "pending", value: "pending" },
            { name: "completed", value: "completed" },
          ])}
          packageName="api"
        />,
      );

      expect(result).toContain("type Status string");
      expect(result).toContain("StatusPending");
      expect(result).toContain("StatusCompleted");
    });
  });

  describe("GoUnionDeclaration with documentation", () => {
    it("should generate union interface comment", () => {
      const result = renderGoContent(
        <GoUnionDeclaration
          union={MockFactory.createUnion("Result", [
            { name: "success", type: MockFactory.createStringLiteral("success") },
            { name: "error", type: MockFactory.createStringLiteral("error") },
          ])}
          packageName="api"
        />,
      );

      expect(result).toContain("// Result is a sealed interface");
      expect(result).toContain("type Result interface");
    });
  });
});
