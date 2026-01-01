import { describe, test, expect } from "vitest";
import { render, Output, code } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";

describe("DEBUG - @alloy-js/go Components", () => {
  test("ModuleDirectory with SourceDirectory and SourceFile", () => {
    const result = render(
      <Output basePath="./test-output">
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="test.go">
              {code`func main() {
    fmt.Println("Hello, World!")
}`}
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );
    console.log("Go components result:", JSON.stringify(result, null, 2));
    expect(result).toBeDefined();
    expect(result.kind).toBe("directory");
    if (result.contents && result.contents.length > 0) {
      const moduleDir = result.contents[0];
      if (moduleDir && moduleDir.kind === "directory" && moduleDir.contents) {
        const sourceDir = moduleDir.contents[0];
        if (sourceDir && sourceDir.kind === "directory" && sourceDir.contents) {
          const sourceFile = sourceDir.contents[0];
          if (sourceFile && sourceFile.kind === "file" && "contents" in sourceFile) {
            console.log("✅ SUCCESS: Generated Go code!");
            console.log("🔍 File content:", sourceFile.contents);
            expect(sourceFile.contents).toContain("package api");
            expect(sourceFile.contents).toContain("fmt.Println");
          }
        }
      }
    } else {
      console.log("❌ FAILED: Empty contents");
    }
  });
});
