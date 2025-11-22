// REAL JSX INTEGRATION TEST - With Proper Go Scope Context
import { SourceFile, StructTypeDeclaration, StructMember, createGoModuleScope, useModule } from "@alloy-js/go";
import { createTestWrapper, renderToString } from "@alloy-js/core/testing";

console.log("🚀 REAL JSX INTEGRATION TEST - With Go Scope Context");

try {
  // Create proper Go scope context for testing
  const moduleScope = createGoModuleScope("test-module");
  
  const testWrapper = createTestWrapper({
    filePath: "test.go",
    useScope: useModule,
    makeSymbol: (name, scope) => {
      console.log("Creating symbol:", name, "in scope:", scope.constructor.name);
      return { name, scope };
    },
    SourceFile: SourceFile
  });

  console.log("✅ Test wrapper created successfully");

  // Create JSX components within proper context
  const jsxStruct = StructTypeDeclaration({
    name: "User",
    children: [
      StructMember({
        exported: true,
        name: "ID",
        type: "string",
        tag: {json: "id"}
      }),
      StructMember({
        exported: true,
        name: "Name", 
        type: "string",
        tag: {json: "name"}
      }),
      StructMember({
        name: "OptionalField",
        type: "string",
        optional: true,
        tag: {json: "optionalField"}
      })
    ]
  });

  console.log("✅ JSX component created successfully");

  // Use test wrapper to render with proper scope
  const rendered = testWrapper.Wrapper({ children: jsxStruct });
  const goCode = renderToString(rendered);
  
  console.log("✅ JSX rendered to Go code!");
  console.log("📄 Generated Go code:");
  console.log("==================");
  console.log(goCode);
  console.log("==================");

  // Test complete file generation
  const jsxFile = SourceFile({
    path: "user.go",
    children: jsxStruct
  });

  const fileContent = renderToString(testWrapper.Wrapper({ children: jsxFile }));
  
  console.log("✅ JSX file rendered successfully!");
  console.log("📄 Generated file content:");
  console.log("==================");
  console.log(fileContent);
  console.log("==================");

  // Validate generated Go code
  const expectedPatterns = [
    /type User struct \{/,
    /ID string/,
    /Name string/,
    /OptionalField string/,
    /json:"id"/,
    /json:"name"/,
    /json:"optionalField"/
  ];

  const allPatternsMatch = expectedPatterns.every(pattern => pattern.test(goCode));
  
  if (allPatternsMatch) {
    console.log("🎉 REAL JSX INTEGRATION WORKING!");
    console.log("✅ All expected Go code patterns found");
    console.log("✅ Alloy.js JSX rendering functional");
    console.log("✅ Go scope context working");
    console.log("✅ Test wrapper approach successful");
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

} catch (error) {
  console.error("❌ Real JSX integration failed:", error);
  console.error("This indicates scope context setup issue");
  console.error("Trying alternative approach...");
  
  // Fallback: Try simple component creation without complex scope setup
  try {
    const simpleComponent = StructTypeDeclaration({
      name: "Test",
      children: []
    });
    console.log("✅ Simple component creation works:", typeof simpleComponent);
  } catch (fallbackError) {
    console.error("❌ Even simple component creation failed:", fallbackError);
  }
  
  process.exit(1);
}