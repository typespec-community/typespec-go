// REAL JSX INTEGRATION TEST - Pure TypeScript (No JSX Syntax)
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";
import { render as coreRender, renderToString } from "@alloy-js/core";
import { renderToString as testingRenderToString } from "@alloy-js/core/testing";

console.log("🚀 REAL JSX INTEGRATION TEST - Pure TypeScript");

try {
  console.log("📋 Testing component creation without JSX syntax...");
  
  // Create components programmatically (avoid JSX syntax issues)
  console.log("   Creating struct members...");
  const idMember = StructMember({
    exported: true,
    name: "ID",
    type: "string",
    tag: {json: "id"}
  });
  console.log("   ✅ ID member created:", typeof idMember);

  const nameMember = StructMember({
    exported: true,
    name: "Name",
    type: "string",
    tag: {json: "name"}
  });
  console.log("   ✅ Name member created:", typeof nameMember);

  const optionalMember = StructMember({
    name: "OptionalField",
    type: "string",
    optional: true,
    tag: {json: "optionalField"}
  });
  console.log("   ✅ Optional member created:", typeof optionalMember);

  // Create struct declaration
  console.log("   Creating struct declaration...");
  const structDecl = StructTypeDeclaration({
    name: "User",
    children: [idMember, nameMember, optionalMember]
  });
  console.log("   ✅ Struct declaration created:", typeof structDecl);

  // Create source file
  console.log("   Creating source file...");
  const sourceFile = SourceFile({
    path: "user.go",
    children: structDecl
  });
  console.log("   ✅ Source file created:", typeof sourceFile);

  // Test renderToString from testing module
  console.log("   Testing renderToString from testing module...");
  try {
    const goCode1 = testingRenderToString(sourceFile);
    console.log("   ✅ renderToString from testing module worked");
    console.log("📄 Generated Go code:");
    console.log("==================");
    console.log(goCode1);
    console.log("==================");
  } catch (error1) {
    console.log("   ❌ renderToString from testing module failed:", error1.message);
  }

  // Test render from core module
  console.log("   Testing render from core module...");
  try {
    const output = coreRender(sourceFile);
    console.log("   ✅ render from core module worked");
    console.log("📂 Output structure:", output.kind);
    if (output.contents.length > 0) {
      const file = output.contents[0];
      console.log("   📝 File:", file.path);
      if ('contents' in file) {
        console.log("   📄 File content:");
        console.log("==================");
        console.log(file.contents);
        console.log("==================");
        
        // Validate generated Go code
        const goCode = file.contents;
        const expectedPatterns = [
          /package\s+\w+/,
          /type\s+User\s+struct\s*\{/,
          /ID\s+string.*json:"id"/,
          /Name\s+string.*json:"name"/,
          /OptionalField\s+\*string.*json:"optionalField"/
        ];

        console.log("   🔍 Validating Go code patterns...");
        const results = expectedPatterns.map((pattern, index) => {
          const matches = pattern.test(goCode);
          console.log(`      Pattern ${index + 1}: ${matches ? '✅' : '❌'}`);
          return matches;
        });

        const allPatternsMatch = results.every(Boolean);
        if (allPatternsMatch) {
          console.log("   🎉 REAL JSX INTEGRATION WORKING!");
          console.log("   ✅ All expected Go code patterns found");
          console.log("   ✅ Alloy.js full render system functional");
          console.log("   ✅ Go scope context properly handled");
          console.log("   ✅ Pure TypeScript approach successful");
          console.log("");
          console.log("   🔥 CORE BREAKTHROUGH: We can now generate real Go code with JSX!");
          console.log("   📋 Next Steps:");
          console.log("      1. Create JSX generators to replace string generators");
          console.log("      2. Add TypeSpec → JSX domain models");
          console.log("      3. Build comprehensive test suite");
          console.log("      4. Optimize performance and add features");
        } else {
          console.log("   ❌ Some Go code patterns missing");
        }
      }
    }
  } catch (error2) {
    console.log("   ❌ render from core module failed:", error2.message);
    console.log("   Stack:", error2.stack);
  }

} catch (error) {
  console.error("❌ Real JSX integration failed:", error);
  console.error("Stack trace:", error.stack);
  process.exit(1);
}