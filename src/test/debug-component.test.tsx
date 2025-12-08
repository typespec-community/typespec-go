import { describe, test, expect } from "vitest";
import { render, Output, code } from "@alloy-js/core";
import * as go from "@alloy-js/go";
import { GoModFile } from "../components/go/GoModFile.js";
import { GoStringLiteral } from "../components/go/index.js";

const { FunctionDeclaration, SourceFile } = go;

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
    expect(result).toBe('"Hello"');
  });

  test("code template literal in Output", () => {
    const output = render(<Output>{code`"Hello"`}</Output>);
    console.log("Code template literal output:", output);
    expect(output).toBe('"Hello"');
  });

  test("JSX component directly in Output", () => {
    const output = render(<Output><GoStringLiteral value="Hello" /></Output>);
    console.log("Direct render output:", output);
    expect(output).toBe('"Hello"');
  });

  test("JSX component inside SourceFile", () => {
    const output = render(
      <Output>
        <SourceFile path="test.go">
          <FunctionDeclaration name="testFunc">
            {code`"Hello"`}
          </FunctionDeclaration>
        </SourceFile>
      </Output>
    );
    console.log("SourceFile render output:", output);
    expect(output).toContain("Hello");
  });
});