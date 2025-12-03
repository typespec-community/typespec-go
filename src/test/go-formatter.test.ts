/**
 * Tests for Go Formatter Utility
 */

import { describe, it, expect } from "vitest";
import { formatGoCode, isGofmtAvailable, formatGoCodeWithDetails } from "../utils/go-formatter.js";

describe("Go Formatter Utility", () => {
  describe("isGofmtAvailable", () => {
    it("should detect gofmt availability", () => {
      const available = isGofmtAvailable();
      // gofmt should be available in dev environment
      expect(typeof available).toBe("boolean");
    });
  });

  describe("formatGoCode", () => {
    it("should format valid Go code", () => {
      const input = `package main

type User struct{
Id string \`json:"id"\`
Name string \`json:"name"\`
}`;

      const formatted = formatGoCode(input);

      // gofmt adds proper indentation
      expect(formatted).toContain("type User struct");
      expect(formatted).toContain("Id");
      expect(formatted).toContain("Name");
    });

    it("should add proper indentation", () => {
      const input = `package api
type Task struct {
Id string
Status string
}`;

      const formatted = formatGoCode(input);

      // Should have proper indentation
      expect(formatted).toContain("\tId");
      expect(formatted).toContain("\tStatus");
    });

    it("should return original code on syntax error", () => {
      const invalidCode = `package main
type Invalid struct {
  missing closing brace`;

      const result = formatGoCode(invalidCode);

      // Should return original on error
      expect(result).toBe(invalidCode);
    });
  });

  describe("formatGoCodeWithDetails", () => {
    it("should return success for valid code", () => {
      const input = `package main

type User struct {
	Id   string
	Name string
}`;

      const result = formatGoCodeWithDetails(input);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.formatted).toContain("type User struct");
    });

    it("should return error details for invalid code", () => {
      const invalidCode = `package main
type Invalid struct {`;

      const result = formatGoCodeWithDetails(invalidCode);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
