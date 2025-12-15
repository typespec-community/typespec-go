import { describe, test, expect } from "vitest";
import { render, Output, code } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";

describe("DEBUG - SourceFile Test", () => {
  test("direct string content in SourceFile", () => {
    const result = render(
      <Output basePath="./">
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="test.go">
              {code`package main

func main() {
    fmt.Println("Hello, World!")
}`}
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    console.log("🔍 SourceFile result:", JSON.stringify(result, null, 2));

    // Should have proper directory structure
    expect(result).toBeDefined();
    expect(result.kind).toBe("directory");
  });

  test("simple string content in SourceFile", () => {
    const result = render(
      <Output basePath="./">
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="test.go">
              {`package main

func main() {
    fmt.Println("Hello, World!")
}`}
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    console.log("🔍 Simple string result:", JSON.stringify(result, null, 2));

    // Should have proper directory structure
    expect(result).toBeDefined();
    expect(result.kind).toBe("directory");
  });
});
