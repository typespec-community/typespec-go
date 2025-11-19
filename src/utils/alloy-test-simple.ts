import { createTestWrapper, renderToString } from "@alloy-js/core/testing";
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

/**
 * Simple test function that works with available Alloy.js APIs
 * Uses createTestWrapper + renderToString for basic functionality
 */
export function testAlloyJsJsx() {
  try {
    console.log("🧪 Testing Alloy.js JSX with available APIs...");
    
    // Create test wrapper
    const testWrapper = createTestWrapper({
      filePath: "test.go",
      useScope: () => {
        // Create a minimal mock scope
        return {
          symbol: () => ({ id: 0, name: "test" }),
          createSymbol: () => ({ id: 1, name: "symbol" })
        };
      },
      makeSymbol: (nk: any, scope: any) => ({
        id: Math.random(),
        name: nk.name,
        scope,
        private: false
      }),
      SourceFile
    });
    
    // Create simple JSX content
    const jsxContent = (
      <SourceFile path="test.go">
        <StructTypeDeclaration name="User">
          <StructMember name="ID" type="string" tag='json:"id"' />
          <StructMember name="Name" type="string" tag='json:"name"' />
        </StructTypeDeclaration>
      </SourceFile>
    );
    
    // Render it
    const rendered = testWrapper.Wrapper({ children: jsxContent });
    const goCode = renderToString(rendered);
    
    console.log("✅ Alloy.js JSX test successful!");
    console.log("📄 Generated Go code:");
    console.log(goCode);
    
    return goCode;
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.error("🔍 Stack:", error.stack);
    return null;
  }
}