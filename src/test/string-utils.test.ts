/**
 * Type Guard and Type Safety Tests
 * Tests for proper type-safe TypeSpec handling
 */

import { describe, it, expect } from "vitest";
import {
  capitalize,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toGoPublicName,
  toGoPrivateName,
} from "../utils/strings.js";

describe("String Utilities", () => {
  describe("capitalize", () => {
    it("capitalizes first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("world")).toBe("World");
      expect(capitalize("id")).toBe("Id");
    });

    it("handles already capitalized", () => {
      expect(capitalize("Hello")).toBe("Hello");
    });

    it("handles empty string", () => {
      expect(capitalize("")).toBe("");
    });

    it("handles single character", () => {
      expect(capitalize("a")).toBe("A");
    });
  });

  describe("toCamelCase", () => {
    it("converts kebab-case", () => {
      expect(toCamelCase("hello-world")).toBe("helloWorld");
    });

    it("converts snake_case", () => {
      expect(toCamelCase("hello_world")).toBe("helloWorld");
    });

    it("converts space separated", () => {
      expect(toCamelCase("hello world")).toBe("helloWorld");
    });
  });

  describe("toPascalCase", () => {
    it("converts kebab-case", () => {
      expect(toPascalCase("hello-world")).toBe("HelloWorld");
    });

    it("converts snake_case", () => {
      expect(toPascalCase("hello_world")).toBe("HelloWorld");
    });
  });

  describe("toSnakeCase", () => {
    it("converts camelCase", () => {
      expect(toSnakeCase("helloWorld")).toBe("hello_world");
    });

    it("converts PascalCase", () => {
      expect(toSnakeCase("HelloWorld")).toBe("hello_world");
    });
  });

  describe("toGoPublicName", () => {
    it("creates Go public name", () => {
      expect(toGoPublicName("hello_world")).toBe("HelloWorld");
      expect(toGoPublicName("user-id")).toBe("UserId");
    });
  });

  describe("toGoPrivateName", () => {
    it("creates Go private name", () => {
      expect(toGoPrivateName("hello_world")).toBe("helloWorld");
      expect(toGoPrivateName("user-id")).toBe("userId");
    });
  });
});
