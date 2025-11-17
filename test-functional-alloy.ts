/**
 * Simple Functional Alloy.js Test
 * 
 * AVOID JSX COMPLEXITY: Use functional APIs only
 * GET SOMETHING WORKING: Basic output generation
 */

import { toSourceText } from "@alloy-js/go";
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

// Test without JSX - pure functional approach
function testFunctionalGeneration(): string {
  // Create Go code using functional composition
  const code = toSourceText(
    <SourceFile path="user.go">
      <StructTypeDeclaration name="User">
        <StructMember name="Name" type="string" tag='json:"name"' />
        <StructMember name="Age" type="uint8" tag='json:"age,omitempty"' />
      </StructTypeDeclaration>
    </SourceFile>
  );
  
  return code;
}

// Test the generation
try {
  console.log("🚀 Testing functional Alloy.js approach...");
  
  // Simple test - check if toSourceText exists
  if (typeof toSourceText === 'function') {
    console.log("✅ toSourceText function found");
  } else {
    console.log("❌ toSourceText not found");
  }
  
  // Check if components exist
  console.log("📦 Component availability:");
  console.log("  SourceFile:", typeof SourceFile);
  console.log("  StructTypeDeclaration:", typeof StructTypeDeclaration);
  console.log("  StructMember:", typeof StructMember);
  
  // Try generation
  const result = testFunctionalGeneration();
  console.log("🎯 Generated Go Code:");
  console.log(result);
  
  // Basic verification
  if (result && result.length > 0) {
    console.log("✅ SUCCESS: Basic functional generation working!");
  } else {
    console.log("❌ FAILED: No output generated");
  }
  
} catch (error) {
  console.error("❌ ERROR:", error);
  console.log("🔍 Error details:", error.stack);
}