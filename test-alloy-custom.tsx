import { createTestOutput } from "../utils/alloy-test-wrapper.js";
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

// Test basic Alloy.js JSX to Go generation
console.log("🧪 Testing custom Alloy.js JSX wrapper...");

try {
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

  console.log("✅ Custom wrapper test successful!");
  console.log("📄 Generated Go code:");
  console.log(output["test.go"]);
} catch (error: any) {
  console.error("❌ Error:", error.message);
  console.error("🔍 Stack:", error.stack);
}