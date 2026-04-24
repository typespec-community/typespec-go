import { describe, test, expect } from "vitest";
import { code } from "@alloy-js/core";
import { GoModFile } from "../components/go/GoModFile.js";
import { GoStringLiteral } from "../components/go/index.js";
import { renderGoContent } from "../testing/test-utils.js";

console.log("GoModFile component:", GoModFile);
console.log("GoStringLiteral component:", GoStringLiteral);

describe("DEBUG - Component Import Test", () => {
  test("known working component - GoModFile", () => {
    const result = GoModFile({
      modulePath: "github.com/test/api",
      goVersion: "1.21",
    });
    console.log("GoModFile result:", result);
    expect(result).toContain("module github.com/test/api");
  });

  test("GoStringLiteral as function call", () => {
    const result = GoStringLiteral({ value: "Hello" });
    console.log("Function call result:", result);
    // GoStringLiteral returns a code template literal which is an array structure
    expect(Array.isArray(result)).toBe(true);
    // Just verify it's a non-empty array with expected content type
    expect(result && Array.isArray(result) && result.length > 0).toBe(true);
  });

  test("code template literal in Output", () => {
    const output = renderGoContent(code`"Hello"`);
    console.log("Code template literal output:", output);
    // Should render as a complete Go file with package and content
    expect(output).toContain("package api");
    expect(output).toContain('"Hello"');
  });

  test("JSX component directly in Output", () => {
    const output = renderGoContent(<GoStringLiteral value="Hello" />);
    console.log("Direct render output:", output);
    // Should render as a complete Go file with package and content
    expect(output).toContain("package api");
    expect(output).toContain('"Hello"');
  });

  test("JSX component with proper context", () => {
    const output = renderGoContent(<GoStringLiteral value="Hello, World!" />);
    console.log("Context render output:", output);
    // Should render as a complete Go file with package and content
    expect(output).toContain("package api");
    expect(output).toContain('"Hello, World!"');
  });
});
