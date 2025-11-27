import { StandaloneGoGenerator } from "../standalone-generator.js";

const generator = new StandaloneGoGenerator();

// Simple test with extends
const testModel = {
  name: "User",
  extends: "BaseEntity",
  properties: new Map([
    ["username", { name: "username", type: { kind: "String" }, optional: false }],
    ["email", { name: "email", type: { kind: "String" }, optional: true }],
  ]),
};

console.log("Testing extends model...");
const result = generator.generateModel(testModel);

if (result._tag === "success") {
  console.log("✅ Success!");
  console.log(Array.from(result.data.values())[0]);
} else {
  console.log("❌ Error:", result.message);
  console.log("Details:", result.details);
}
