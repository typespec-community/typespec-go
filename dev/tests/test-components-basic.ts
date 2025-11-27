// Test imports and basic component availability
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

console.log("🧪 Testing imports and basic component availability...");

try {
  console.log("✅ Successfully imported SourceFile:", typeof SourceFile);
  console.log("✅ Successfully imported StructTypeDeclaration:", typeof StructTypeDeclaration);
  console.log("✅ Successfully imported StructMember:", typeof StructMember);

  // Test if components can be called (without JSX for now)
  const sourceFileComponent = SourceFile({ path: "test.go", children: [] });
  console.log("✅ SourceFile component callable:", typeof sourceFileComponent);

  const structComponent = StructTypeDeclaration({ name: "Test", children: [] });
  console.log("✅ StructTypeDeclaration component callable:", typeof structComponent);

  const memberComponent = StructMember({ name: "test", type: "string", exported: true });
  console.log("✅ StructMember component callable:", typeof memberComponent);

  console.log("🎉 All imports and basic components working!");
} catch (error) {
  console.error("❌ Import/component test failed:", error);
  process.exit(1);
}
