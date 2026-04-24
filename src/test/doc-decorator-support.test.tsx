/**
 * Tests for @doc decorator support in Go code generation
 */

import { describe, it, expect } from "vitest";
import { renderGoContent } from "../testing/test-utils.js";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";
import { GoEnumDeclaration } from "../components/go/GoEnumDeclaration.js";
import { GoUnionDeclaration } from "../components/go/GoUnionDeclaration.js";

describe("@doc Decorator Support", () => {
  describe("GoStructDeclaration with explicit documentation", () => {
    it("should use provided documentation prop", () => {
      const mockModel = {
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

      const result = renderGoContent(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <GoStructDeclaration model={mockModel as unknown} documentation="A user in the system" />,
        "models.go",
      );

      expect(result).toBeDefined();
      expect(result).toContain("A user in the system");
    });

    it("should fall back to default documentation without program", () => {
      const mockModel = {
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
        ]),
      };

      const result = renderGoContent(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <GoStructDeclaration model={mockModel as unknown} />,
        "models.go",
      );

      expect(result).toBeDefined();
    });
  });

  describe("GoEnumDeclaration with documentation", () => {
    it("should generate enum correctly", () => {
      const result = renderGoContent(
        <GoEnumDeclaration
          enum={
            {
              kind: "Enum",
              name: "Status",
              members: new Map([
                ["pending", { kind: "EnumMember", name: "pending", value: "pending" }],
                ["completed", { kind: "EnumMember", name: "completed", value: "completed" }],
              ]),
            } as any
          }
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
          union={
            {
              kind: "Union",
              name: "Result",
              variants: new Map([
                ["success", { kind: "UnionVariant", name: "success", type: { kind: "String" } }],
                ["error", { kind: "UnionVariant", name: "error", type: { kind: "String" } }],
              ]),
            } as any
          }
          packageName="api"
        />,
      );

      expect(result).toContain("// Result is a sealed interface");
      expect(result).toContain("type Result interface");
    });
  });
});
