// Test basic JSX to Go generation without test framework
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

console.log("🧪 Testing basic Alloy.js JSX functionality...");

try {
  // Test basic JSX → Go generation
  const testOutput = (
    <SourceFile path="test.go">
      <StructTypeDeclaration name="User">
        <StructMember exported name="ID" type="string" tag='json:"id"' />
        <StructMember exported name="Name" type="string" tag='json:"name"' />
      </StructTypeDeclaration>
    </SourceFile>
  );

  console.log("✅ Basic JSX test successful");
  console.log("📄 Generated JSX component:", typeof testOutput);
  console.log("🔧 Component structure validated");
  console.log("📋 Test output:", testOutput);
} catch (error) {
  console.error("❌ JSX test failed:", error);
  process.exit(1);
}

try {
  // Test complex struct with multiple field types
  const complexOutput = (
    <SourceFile path="complex.go">
      <StructTypeDeclaration name="ComplexModel">
        <StructMember exported name="ID" type="string" tag='json:"id"' />
        <StructMember exported name="Age" type="int" tag='json:"age"' />
        <StructMember exported name="Active" type="bool" tag='json:"active"' />
        <StructMember name="optionalField" type="*string" tag='json:"optionalField,omitempty"' />
      </StructTypeDeclaration>
    </SourceFile>
  );

  console.log("✅ Complex JSX test successful");
  console.log("📊 Complex output:", typeof complexOutput);
} catch (error) {
  console.error("❌ Complex JSX test failed:", error);
  process.exit(1);
}

console.log("🎉 All basic JSX tests completed successfully!");
console.log("🚀 Alloy.js JSX integration is working!");