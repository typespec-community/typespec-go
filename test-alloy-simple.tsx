import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

// Test basic Alloy.js to Go generation without JSX
console.log("🧪 Testing Alloy.js core functionality...");

try {
  // Simple JSX without createTestOutput
  const jsxOutput = (
    <SourceFile path="test.go">
      <StructTypeDeclaration name="User">
        <StructMember name="ID" type="string" tag='json:"id"' />
        <StructMember name="Name" type="string" tag='json:"name"' />
      </StructTypeDeclaration>
    </SourceFile>
  );

  console.log("✅ Alloy.js JSX test successful!");
  console.log("📄 Generated JSX output:");
  console.log(String(jsxOutput));
} catch (error: any) {
  console.error("❌ Error:", error.message);
  console.error("🔍 Stack:", error.stack);
}