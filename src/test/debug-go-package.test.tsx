import { describe, test, expect } from "vitest";
import { render, Output, code } from "@alloy-js/core";
import { SourceFile, Package } from "@alloy-js/go";

describe("DEBUG - Go Package Context Test", () => {
  test("SourceFile with Go Package context", () => {
    const result = render(
      <Output basePath="./test-output">
        <SourceFile path="test.go">
          <Package name="main">
            {code`func main() {
    fmt.Println("Hello, World!")
}`}
          </Package>
        </SourceFile>
      </Output>,
    );

    console.log("🔍 Go package result:", JSON.stringify(result, null, 2));
    
    // Should have proper directory structure
    expect(result).toBeDefined();
    if (result && result.contents) {
      console.log("✅ Has contents array with length:", result.contents.length);
    } else {
      console.log("❌ Missing contents array");
    }
  });

  test("Package without SourceFile", () => {
    const result = render(
      <Output basePath="./test-output">
        <Package name="main">
          package main

func main() {
    fmt.Println("Hello, World!")
}
        </Package>
      </Output>,
    );

    console.log("🔍 Package-only result:", JSON.stringify(result, null, 2));
    
    // Should have proper directory structure
    expect(result).toBeDefined();
  });
});