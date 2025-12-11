import { describe, test, expect } from "vitest";
import { render, Output, code } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import { GoPackage } from "../components/go/index.js";

describe("DEBUG - Fixed Component Test", () => {
  test("SourceFile with custom GoPackage", () => {
    const result = render(
      <Output basePath="./test-output">
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="test.go">
              <GoPackage name="main">
                {code`import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`}
              </GoPackage>
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    console.log("🔍 Fixed result:", JSON.stringify(result, null, 2));
    
    // Should have proper directory structure
    expect(result).toBeDefined();
    expect(result.kind).toBe("directory");
    
    if (result && result.contents && result.contents.length > 0) {
      console.log("✅ SUCCESS: Generated content structure");
      const moduleDir = result.contents[0];
      const sourceDir = moduleDir.contents[0];
      const sourceFile = sourceDir.contents[0];
      console.log("🔍 File content:", sourceFile.contents);
      expect(sourceFile.contents).toContain("package main");
      expect(sourceFile.contents).toContain("fmt.Println");
    } else {
      console.log("❌ FAILED: Still empty directory");
    }
  });

  test("simple GoPackage", () => {
    const result = render(
      <Output basePath="./test-output">
        <SourceFile path="simple.go">
          <GoPackage name="test">
            {code`func test() string {
    return "Hello"
}`}
          </GoPackage>
        </SourceFile>
      </Output>,
    );

    console.log("🔍 Simple package result:", JSON.stringify(result, null, 2));
    
    // Should have proper directory structure
    expect(result).toBeDefined();
    expect(result.kind).toBe("directory");
  });
});