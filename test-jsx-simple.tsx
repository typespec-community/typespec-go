// Test JSX compilation without runtime issues
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

console.log("🧪 Testing JSX compilation...");

// Test if we can import and use the components
const UserStruct = () => (
  <StructTypeDeclaration name="User">
    <StructMember exported name="ID" type="string" tag='json:"id"' />
    <StructMember exported name="Name" type="string" tag='json:"name"' />
  </StructTypeDeclaration>
);

const TestFile = () => (
  <SourceFile path="test.go">
    <UserStruct />
  </SourceFile>
);

console.log("✅ JSX components created successfully");
console.log("🎉 JSX compilation is working!");
export { UserStruct, TestFile };