import { StandaloneGoGenerator } from "./src/standalone-generator.js";

const generator = new StandaloneGoGenerator();

// Test template instantiation from test
const instantiatedModel = {
  name: "UserList",
  template: "PaginatedResponse<User>",
  properties: new Map([["total", { name: "total", type: { kind: "Int32" }, optional: false }]]),
};

console.log("Testing template instantiation...");
console.log("Template:", instantiatedModel.template);

try {
  const result = generator.generateModel(instantiatedModel);
  console.log("Template instantiation result:", result._tag);
  if (result._tag === "success") {
    console.log("✅ Template instantiation works!");
    console.log(Array.from(result.data.values())[0]);
  } else {
    console.log("❌ Template instantiation failed:", result.message);
    if (result.details) {
      console.log("Details:", result.details);
    }
  }
} catch (error) {
  console.log("❌ Template instantiation exception:", error.message);
}
