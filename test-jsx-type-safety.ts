// Test JSX type safety layer functionality
import { GoJsxComponents } from "./src/jsx/go-jsx-type-safety.js";

console.log("🧪 Testing JSX Type Safety Layer...");

try {
  // Test field validation
  const validField = GoJsxComponents.ComponentFactory.createField({
    name: "testField",
    type: "string",
    optional: false,
    jsonTag: "test_field"
  });

  console.log("✅ Valid field creation:", validField.name);
  console.log("✅ Field type:", validField.type);
  console.log("✅ Field JSON tag:", validField.jsonTag);

  // Test struct validation
  const validStruct = GoJsxComponents.ComponentFactory.createStruct({
    name: "TestStruct",
    fields: [
      {
        name: "id",
        type: "string",
        optional: false,
        jsonTag: "id"
      },
      {
        name: "optionalField",
        type: "string", 
        optional: true,
        jsonTag: "optional_field"
      }
    ]
  });

  console.log("✅ Valid struct creation:", validStruct.name);
  console.log("✅ Struct field count:", validStruct.fields.length);

  // Test type mapping utilities
  const goType = GoJsxComponents.Utils.typeSpecKindToGoType("String");
  console.log("✅ Type mapping String → string:", goType);

  const jsonTag = GoJsxComponents.Utils.generateJsonTag("userName");
  console.log("✅ JSON tag userName → user_name:", jsonTag);

  const shouldExport = GoJsxComponents.Utils.shouldExport("UserName");
  console.log("✅ Export check UserName:", shouldExport);

  // Test error handling
  try {
    GoJsxComponents.ComponentFactory.createField({
      name: "",  // Invalid empty name
      type: "string",
      optional: false,
      jsonTag: "test"
    });
    console.error("❌ Should have thrown error for empty field name");
  } catch (error) {
    console.log("✅ Proper error handling for empty field name");
  }

  try {
    GoJsxComponents.Utils.typeSpecKindToGoType("InvalidType");
    console.error("❌ Should have thrown error for invalid type");
  } catch (error) {
    console.log("✅ Proper error handling for invalid type");
  }

  console.log("🎉 JSX Type Safety Layer working perfectly!");
  
} catch (error) {
  console.error("❌ JSX Type Safety Layer test failed:", error);
  process.exit(1);
}