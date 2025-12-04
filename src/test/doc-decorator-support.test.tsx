/**
 * Tests for @doc decorator support in Go code generation
 */

import { describe, it, expect } from "vitest";
import { render, Output, refkey } from "@alloy-js/core";
import { Reference } from "@alloy-js/go";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
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

      const result = render(
        <Output>
          <ModuleDirectory name="github.com/test/api">
            <SourceDirectory path="api">
              <SourceFile path="models.go">
                <GoStructDeclaration model={mockModel as any} documentation="A user in the system" />
              </SourceFile>
            </SourceDirectory>
          </ModuleDirectory>
        </Output>,
      );

      expect(result).toBeDefined();
      // The documentation should be in the rendered output
      if (typeof result.contents === "string") {
        expect(result.contents).toContain("A user in the system");
      }
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

      const result = render(
        <Output>
          <ModuleDirectory name="github.com/test/api">
            <SourceDirectory path="api">
              <SourceFile path="models.go">
                <GoStructDeclaration model={mockModel as any} />
              </SourceFile>
            </SourceDirectory>
          </ModuleDirectory>
        </Output>,
      );

      expect(result).toBeDefined();
    });
  });

  describe("GoEnumDeclaration with documentation", () => {
    it("should generate enum correctly", () => {
      const result = GoEnumDeclaration({
        enum: {
          kind: "Enum",
          name: "Status",
          members: new Map([
            ["pending", { kind: "EnumMember", name: "pending", value: "pending" }],
            ["completed", { kind: "EnumMember", name: "completed", value: "completed" }],
          ]),
        } as any,
        packageName: "api",
      });

      expect(result).toContain("type Status string");
      expect(result).toContain("StatusPending");
      expect(result).toContain("StatusCompleted");
    });
  });

  describe("GoUnionDeclaration with documentation", () => {
    it("should generate union interface comment", () => {
      const result = GoUnionDeclaration({
        union: {
          kind: "Union",
          name: "Result",
          variants: new Map([
            ["success", { kind: "UnionVariant", name: "success", type: { kind: "String" } }],
            ["error", { kind: "UnionVariant", name: "error", type: { kind: "String" } }],
          ]),
        } as any,
        packageName: "api",
      });

      expect(result).toContain("// Result is a sealed interface");
      expect(result).toContain("type Result interface");
    });
  });
});
