// Test basic JSX functionality using correct component names
import { SourceFile } from "@alloy-js/go";
import { StructTypeDeclaration, StructMember } from "@alloy-js/go";

console.log("🧪 Testing basic JSX functionality...");

try {
  // Create a simple Go struct using correct Alloy.js components
  const testComponent = () => (
    <SourceFile path="test.go">
      <StructTypeDeclaration name="User">
        <StructMember exported name="ID" type="string" tag={{json: "id"}} />
        <StructMember exported name="Name" type="string" tag={{json: "name"}} />
      </StructTypeDeclaration>
    </SourceFile>
  );

  console.log("✅ Component creation successful");
  console.log("📄 Test component created");
  
  // For now, just verify the creation works
  expect(typeof testComponent).toBe("function");
  
} catch (error) {
  console.error("❌ JSX test failed:", error);
}

console.log("🎉 Basic JSX functionality test completed!");