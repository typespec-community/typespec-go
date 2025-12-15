import { describe, test, expect } from "vitest";
import { render, Output, code } from "@alloy-js/core";
import { SourceFile } from "@alloy-js/go";

describe("DEBUG - Minimal Component Test", () => {
  test("SourceFile without ModuleDirectory", () => {
    const result = render(
      <Output basePath="./test-output">
        <SourceFile path="test.go">
          {code`package main

func main() {
    fmt.Println("Hello, World!")
}`}
        </SourceFile>
      </Output>,
    );

    console.log("🔍 Minimal result:", JSON.stringify(result, null, 2));

    // Should have proper directory structure
    expect(result).toBeDefined();
    if (result && result.contents) {
      console.log("✅ Has contents array with length:", result.contents.length);
    } else {
      console.log("❌ Missing contents array");
    }
  });

  test("plain string in SourceFile", () => {
    const result = render(
      <Output basePath="./test-output">
        <SourceFile path="test.go">
          package main func main() {fmt.Println("Hello, World!")}
        </SourceFile>
      </Output>,
    );

    console.log("🔍 Plain string result:", JSON.stringify(result, null, 2));

    // Should have proper directory structure
    expect(result).toBeDefined();
  });
});
