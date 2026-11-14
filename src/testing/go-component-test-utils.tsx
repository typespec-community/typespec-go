/**
 * Go Component Testing Utilities
 * Provides reusable patterns for Alloy-JS Go component testing
 * Eliminates context setup complexity for future component development
 */

import { render, Output } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import type { Children } from "@alloy-js/core";

type RenderResult = ReturnType<typeof render>;

/**
 * Creates proper Go component context for testing
 * Follows verified pattern: ModuleDirectory → SourceDirectory → SourceFile
 * Eliminates 'Package Not in Scope' errors
 */
export function createGoTestContext(component: Children, filename: string = "test.go") {
  return render(
    <Output>
      <ModuleDirectory name="github.com/test/test">
        <SourceDirectory path="test">
          <SourceFile path={filename} package="test">
            {component}
          </SourceFile>
        </SourceDirectory>
      </ModuleDirectory>
    </Output>,
  );
}

/**
 * Extracts generated Go code from component output
 * Handles nested output structure safely
 * Returns string content for assertion testing
 */
export function extractGoCode(output: RenderResult): string {
  const moduleDir = output.contents[0];
  if (typeof moduleDir === "string" || !("contents" in moduleDir)) {
    throw new Error("Expected module directory with contents");
  }
  const sourceDir = moduleDir.contents[0];
  if (typeof sourceDir === "string" || !("contents" in sourceDir)) {
    throw new Error("Expected source directory with contents");
  }
  const sourceFile = sourceDir.contents[0];
  if (typeof sourceFile === "string" || !("contents" in sourceFile)) {
    throw new Error("Expected source file with contents");
  }
  if (typeof sourceFile.contents !== "string") {
    throw new Error("Expected string file contents");
  }
  return sourceFile.contents;
}

/**
 * Test helper that combines context creation and code extraction
 * Simplifies component testing to one line
 */

export function testComponent(
  component: Children,
  expectedContent: string[],
  filename: string = "test.go",
) {
  const output = createGoTestContext(component, filename);
  const code = extractGoCode(output);

  expectedContent.forEach((expected) => {
    if (!code.includes(expected)) {
      console.log("Generated code:", code);
      throw new Error(`Expected content not found: ${expected}`);
    }
  });

  return code;
}
