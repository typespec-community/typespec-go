import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";
import { createTestOutput } from "@alloy-js/core/testing";

// Test basic Alloy.js JSX to Go generation
console.log("🧪 Testing Alloy.js core functionality...");

try {
  // Use the API directly - let Alloy.js handle JSX internally
  const output = createTestOutput({
    "test.go": (
      <SourceFile path="test.go">
        <StructTypeDeclaration name="User">
          <StructMember name="ID" type="string" tag='json:"id"' />
          <StructMember name="Name" type="string" tag='json:"name"' />
        </StructTypeDeclaration>
      </SourceFile>
    )
  });

  console.log("✅ Alloy.js test successful!");
  console.log("📄 Generated Go code:");
  console.log(output["test.go"]);
} catch (error: any) {
  console.error("❌ Error:", error.message);
  console.error("🔍 Stack:", error.stack);
}