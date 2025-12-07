/**
 * Go Component Testing Utilities
 * Provides reusable patterns for Alloy-JS Go component testing
 * Eliminates context setup complexity for future component development
 */

import { render, Output } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";

/**
 * Creates proper Go component context for testing
 * Follows verified pattern: ModuleDirectory → SourceDirectory → SourceFile
 * Eliminates 'Package Not in Scope' errors
 */
export function createGoTestContext(component: any, filename: string = "test.go") {
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
export function extractGoCode(output: any, filename: string = "test/test.go") {
  try {
    const moduleDir = output.contents[0];
    const sourceDir = moduleDir.contents[0];
    const sourceFile = sourceDir.contents[0];
    return sourceFile.contents;
  } catch (error) {
    console.log("Output structure:", JSON.stringify(output, null, 2));
    throw new Error(`Failed to extract Go code: ${error}`);
  }
}

/**
 * Test helper that combines context creation and code extraction
 * Simplifies component testing to one line
 */
export function testComponent(
  component: any,
  expectedContent: string[],
  filename: string = "test.go",
) {
  const output = createGoTestContext(component, filename);
  const code = extractGoCode(output, filename);

  expectedContent.forEach((expected) => {
    if (!code.includes(expected)) {
      console.log("Generated code:", code);
      throw new Error(`Expected content not found: ${expected}`);
    }
  });

  return code;
}
