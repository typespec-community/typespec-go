import { describe, test, expect } from "vitest";
import { render, Output, code } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";

describe("DEBUG - Working Component Test", () => {
  test("SourceFile with valid Go syntax", () => {
    const result = render(
      <Output basePath="./test-output">
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="test.go">
              {code`package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`}
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    console.log("🔍 Working result:", JSON.stringify(result, null, 2));

    // Should have proper directory structure
    expect(result).toBeDefined();
    expect(result.kind).toBe("directory");

    if (result && result.contents && result.contents.length > 0) {
      console.log("✅ SUCCESS: Generated content structure");
    } else {
      console.log("❌ FAILED: Still empty directory");
    }
  });
});
