import { createTestWrapper } from "@alloy-js/core/testing";
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";
import { renderToString } from "@alloy-js/core/testing";

/**
 * Custom test output creator that works with available Alloy.js APIs
 * Uses createTestWrapper + renderToString instead of missing createTestOutput
 */
export function createTestOutput(files: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Create test wrapper for each file
  const testWrapper = createTestWrapper({
    useScope: () => {
      // Create a mock scope for testing
      return {
        symbol: () => ({ id: 0 }),
        createSymbol: () => ({ id: 1 })
      };
    },
    makeSymbol: (name: any, scope: any) => ({ name, scope }),
  });
  
  // Render each file's JSX content
  for (const [filename, jsxContent] of Object.entries(files)) {
    try {
      // Use the wrapper's render method
      const rendered = testWrapper.Wrapper({ children: jsxContent });
      result[filename] = renderToString(rendered);
    } catch (error: any) {
      result[filename] = `// ERROR: ${error.message}\n// JSX: ${JSON.stringify(jsxContent)}`;
    }
  }
  
  return result;
}