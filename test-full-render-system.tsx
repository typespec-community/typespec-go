// REAL JSX INTEGRATION TEST - Using Full Render System
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";
import { render, renderToString } from "@alloy-js/core";

console.log("🚀 REAL JSX INTEGRATION TEST - Full Render System");

try {
  console.log("📋 Testing component creation without scope issues...");
  
  // Test 1: Try creating simple struct members first
  console.log("   Creating struct members...");
  const idMember = StructMember({
    exported: true,
    name: "ID",
    type: "string",
    tag: {json: "id"}
  });
  console.log("   ✅ ID member created");

  const nameMember = StructMember({
    exported: true,
    name: "Name",
    type: "string",
    tag: {json: "name"}
  });
  console.log("   ✅ Name member created");

  // Test 2: Try creating struct with members
  console.log("   Creating struct declaration...");
  const jsxStruct = StructTypeDeclaration({
    name: "User",
    children: [idMember, nameMember]
  });
  console.log("   ✅ Struct declaration created");

  // Test 3: Try using the main render function (not renderToString)
  console.log("   Rendering with full system...");
  const output = render(
    <SourceFile path="user.go">
      {jsxStruct}
    </SourceFile>
  );
  
  console.log("✅ Full render system working!");
  console.log("📂 Output structure:", output.kind);
  console.log("📄 Output contents:", output.contents.length, "files");

  if (output.contents.length > 0) {
    const file = output.contents[0];
    console.log("📝 File path:", file.path);
    console.log("📄 File content type:", file.filetype);
    
    if ('contents' in file) {
      console.log("📄 Generated Go code:");
      console.log("==================");
      console.log(file.contents);
      console.log("==================");
      
      // Validate generated Go code
      const goCode = file.contents;
      const expectedPatterns = [
        /package\s+\w+/,
        /type\s+User\s+struct\s*\{/,
        /ID\s+string/,
        /Name\s+string/,
        /json:"id"/,
        /json:"name"/
      ];

      const allPatternsMatch = expectedPatterns.every(pattern => pattern.test(goCode));
      
      if (allPatternsMatch) {
        console.log("🎉 REAL JSX INTEGRATION WORKING!");
        console.log("✅ All expected Go code patterns found");
        console.log("✅ Alloy.js full render system functional");
        console.log("✅ Go scope context properly handled");
        console.log("");
        console.log("🔥 CORE BREAKTHROUGH: We can now generate real Go code with JSX!");
        console.log("📋 Next Steps:");
        console.log("   1. Create JSX generators to replace string generators");
        console.log("   2. Add TypeSpec → JSX domain models");
        console.log("   3. Build comprehensive test suite");
        console.log("   4. Optimize performance and add features");
      } else {
        console.error("❌ Generated Go code doesn't match expected patterns");
        expectedPatterns.forEach((pattern, index) => {
          const matches = pattern.test(goCode);
          console.log(`   Pattern ${index + 1}: ${matches ? '✅' : '❌'} ${pattern}`);
        });
      }
    }
  }

} catch (error) {
  console.error("❌ Real JSX integration failed:", error);
  console.error("Stack trace:", error.stack);
  
  // Try even simpler approach
  console.log("\n🔄 Trying minimal component test...");
  try {
    const minimalStruct = StructTypeDeclaration({
      name: "Test",
      children: []
    });
    console.log("✅ Minimal struct creation works");
  } catch (minimalError) {
    console.error("❌ Even minimal struct creation failed:", minimalError);
  }
}