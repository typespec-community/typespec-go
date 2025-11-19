import { jsx } from "@alloy-js/core";
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

// Test basic Alloy.js JSX to Go generation
const testOutput = (
  <SourceFile path="test.go">
    <StructTypeDeclaration name="User">
      <StructMember name="ID" type="string" tag='json:"id"' />
      <StructMember name="Name" type="string" tag='json:"name"' />
    </StructTypeDeclaration>
  </SourceFile>
);

console.log("✅ Alloy.js JSX test successful");
console.log(testOutput);
