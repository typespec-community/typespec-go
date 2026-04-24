import { StandaloneGoGenerator } from "./src/standalone-generator.js";

const generator = new StandaloneGoGenerator();

// Test basic model (should work)
const basicModel = {
  name: "TestUser",
  properties: new Map([
    ["id", { name: "id", type: { kind: "String" }, optional: false }],
    ["name", { name: "name", type: { kind: "String" }, optional: false }],
  ]),
};

console.log("Testing basic model...");
try {
  const result1 = generator.generateModel(basicModel);
  console.log("Basic result:", result1._tag);
  if (result1._tag === "success") {
    console.log("✅ Basic model works!");
    console.log(Array.from(result1.data.values())[0]);
  } else {
    console.log("❌ Basic model failed:", result1.message);
    if (result1.details) {
      console.log("Details:", result1.details);
    }
  }
} catch (error) {
  console.log("❌ Basic model exception:", error.message);
}
