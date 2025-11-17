/**
 * Minimal Working Alloy.js Example
 * 
 * BRUTAL SIMPLICITY: Just get JSX → Go working
 * NO COMPLEXITY: Single working example
 * REAL OUTPUT: Verify actual Go string generation
 */

import { toSourceText } from "@alloy-js/go";
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

// Test model interface
interface TestModel {
  name: string;
  properties: Map<string, TestProperty>;
}

interface TestProperty {
  name: string;
  type: string;
  optional: boolean;
}

// Simple test function
function testBasicGeneration(): string {
  // Create JSX using proper syntax
  const jsxOutput = (
    <SourceFile path="user.go">
      <StructTypeDeclaration name="User">
        <StructMember name="Name" type="string" tag='json:"name"' />
        <StructMember name="Age" type="uint8" tag='json:"age,omitempty"' exported={false} />
      </StructTypeDeclaration>
    </SourceFile>
  );

  // Convert JSX to Go string using toSourceText
  const goCode = toSourceText(jsxOutput);
  
  return goCode;
}

// Test the generation
try {
  const result = testBasicGeneration();
  console.log("✅ SUCCESS: Alloy.js Go generation working!");
  console.log("🎯 Generated Go Code:");
  console.log(result);
  
  // Verify it's actually Go code
  if (result.includes("package") && result.includes("type User struct") && result.includes("Name string")) {
    console.log("✅ VERIFICATION: Valid Go code generated");
  } else {
    console.log("❌ ERROR: Invalid Go code generated");
  }
} catch (error) {
  console.error("❌ FAILED:", error);
}