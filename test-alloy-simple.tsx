import { createTestOutput } from "@alloy-js/core/testing";
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

// Test basic Alloy.js to Go generation without JSX
console.log("🧪 Testing Alloy.js core functionality...");

try {
  // Use createTestOutput to handle the JSX transformation
  const output = createTestOutput({
    "test.go": (
      <SourceFile path="test.go">
        <StructTypeDeclaration name="User">
          <StructMember name="ID" type="string" tag='json:"id"' />
          <StructMember name="Name" type="string" tag='json:"name"' />
        </StructTypeDeclaration>
      </SourceFile>
    ),
  });

  console.log("✅ Alloy.js test successful!");
  console.log("📄 Generated Go code:");
  console.log(output["test.go"]);
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("🔍 Stack:", error.stack);
}
