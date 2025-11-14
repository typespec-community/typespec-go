/**
 * Manual End-to-End Test
 * 
 * Tests TypeSpec → Go generation without TypeScript compilation
 * Uses existing working infrastructure
 */
import { createTypespecGoTestRunner } from "./test-host.js";

console.log("🚀 Starting Manual End-to-End Test");

async function runTest() {
  try {
    const runner = await createTypespecGoTestRunner();
    console.log("✅ Test runner created");
    
    // Basic TypeSpec model
    const typeSpecCode = `
      model User {
        name: string;
        age: int32;
        email?: string;
      }
    `;
    
    console.log("🏗️ Compiling TypeSpec...");
    
    // Compile TypeSpec and emit Go
    const [types, diagnostics] = await runner.compileAndDiagnose(typeSpecCode, {
      outputDir: "tsp-output",
    });
    
    console.log(`📊 Diagnostics: ${diagnostics.length}`);
    console.log(`📁 Files generated: ${Object.keys(types).length}`);
    
    // Check results
    const generatedFiles = Object.keys(types);
    console.log("📄 Generated files:", generatedFiles);
    
    // Check for Go files
    const goFiles = generatedFiles.filter(file => file.includes(".go"));
    console.log(`🦫 Go files: ${goFiles.length}`);
    
    if (goFiles.length > 0) {
      console.log("✅ SUCCESS: Go files generated!");
      
      // Show first Go file content
      const firstGoFile = goFiles[0];
      const goContent = types[firstGoFile];
      
      console.log(`📄 Content of ${firstGoFile}:`);
      console.log(goContent);
      
      // Basic validation
      const hasPackage = goContent.includes("package ");
      const hasType = goContent.includes("type ");
      const hasUser = goContent.includes("User");
      
      console.log(`📦 Has package: ${hasPackage}`);
      console.log(`🏗️ Has type: ${hasType}`);
      console.log(`👤 Has User: ${hasUser}`);
      
      if (hasPackage && hasType && hasUser) {
        console.log("🎉 COMPLETE SUCCESS: TypeSpec → Go working!");
      } else {
        console.log("⚠️ PARTIAL SUCCESS: Go file generated but content incomplete");
      }
    } else {
      console.log("❌ FAILED: No Go files generated");
    }
    
  } catch (error) {
    console.error("❌ TEST FAILED:", error);
    console.error("Error details:", error.message);
  }
}

// Run the test
runTest().then(() => {
  console.log("🏁 Test execution completed");
}).catch((error) => {
  console.error("💥 Test execution failed:", error);
});