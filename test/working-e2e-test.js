/**
 * End-to-End Test Using Working Infrastructure
 * 
 * Tests TypeSpec → Go generation with proven working test host
 * Avoids complex setup issues
 */
import { createTypespecGoTestRunner } from "./test-host.js";

console.log("🚀 Starting End-to-End Test with Working Infrastructure");

async function runTest() {
  try {
    console.log("📝 Creating test runner...");
    const runner = await createTypespecGoTestRunner();
    console.log("✅ Test runner created successfully");
    
    // Basic TypeSpec model
    const typeSpecCode = `
      import "@typespec-community/typespec-go";
      
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
    
    // Show diagnostics
    if (diagnostics.length > 0) {
      console.log("📋 All diagnostics:");
      diagnostics.forEach((d, i) => {
        console.log(`  ${i + 1}. [${d.severity}] ${d.message}`);
      });
    }
    
    // Check for errors
    const errorDiagnostics = diagnostics.filter(d => d.severity === "error");
    
    if (errorDiagnostics.length === 0) {
      console.log("✅ Compilation successful (no errors)");
      
      // Check generated files
      const generatedFiles = Object.keys(types);
      console.log("📄 Generated files:", generatedFiles);
      
      // Look for Go files
      const goFiles = generatedFiles.filter(file => file.endsWith(".go"));
      console.log(`🦫 Go files: ${goFiles.length}`);
      
      if (goFiles.length > 0) {
        console.log("🎉 SUCCESS: Go files generated!");
        
        // Show content of first Go file
        const firstGoFile = goFiles[0];
        const goContent = types[firstGoFile];
        
        console.log(`📄 Content of ${firstGoFile}:`);
        console.log(goContent);
        
        // Validate Go content
        const checks = {
          hasPackage: goContent.includes("package "),
          hasType: goContent.includes("type "),
          hasUser: goContent.includes("User"),
          hasNameField: goContent.includes("Name"),
          hasAgeField: goContent.includes("Age"),
          hasEmailField: goContent.includes("Email"),
          hasJsonTags: goContent.includes("json:"),
          hasPointer: goContent.includes("*string") // For optional email
        };
        
        console.log("🔍 Validation checks:");
        Object.entries(checks).forEach(([check, passed]) => {
          console.log(`  ${passed ? "✅" : "❌"} ${check}: ${passed}`);
        });
        
        const passedChecks = Object.values(checks).filter(Boolean).length;
        const totalChecks = Object.keys(checks).length;
        const successRate = (passedChecks / totalChecks) * 100;
        
        console.log(`📈 Success rate: ${successRate.toFixed(1)}% (${passedChecks}/${totalChecks})`);
        
        if (successRate >= 80) {
          console.log("🎉 MAJOR SUCCESS: TypeSpec → Go pipeline working!");
        } else if (successRate >= 60) {
          console.log("✅ PARTIAL SUCCESS: Go generation working but needs improvement");
        } else {
          console.log("⚠️ LIMITED SUCCESS: Go files generated but quality low");
        }
        
      } else {
        console.log("❌ ISSUE: No Go files generated");
      }
      
    } else {
      console.log("❌ COMPILATION FAILED:");
      errorDiagnostics.forEach((d, i) => {
        console.log(`  ${i + 1}. [${d.severity}] ${d.message}`);
        console.log(`     Location: ${d.location?.file}:${d.location?.line}:${d.location?.column}`);
      });
    }
    
  } catch (error) {
    console.error("💥 TEST CRASHED:", error);
    console.error("Stack trace:", error.stack);
  }
}

// Run the test
runTest().then(() => {
  console.log("🏁 End-to-End test completed");
}).catch((error) => {
  console.error("💥 Test execution failed:", error);
});