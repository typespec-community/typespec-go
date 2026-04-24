import { StandaloneGoGenerator } from "./src/standalone-generator.js";

const generator = new StandaloneGoGenerator();

// Test template model from test
const templateModel = {
  name: "PaginatedResponse",
  template: "<T>",
  properties: new Map([
    ["data", { name: "data", type: { kind: "Template", name: "T" }, optional: false }],
    [
      "pagination",
      { name: "pagination", type: { kind: "Model", name: "PaginationInfo" }, optional: false },
    ],
  ]),
};

console.log("Testing template model...");
console.log("Template:", templateModel.template);
console.log("Data field type:", templateModel.properties.get("data").type);

try {
  const result = generator.generateModel(templateModel);
  console.log("Template result:", result._tag);
  if (result._tag === "success") {
    console.log("✅ Template model works!");
    console.log(Array.from(result.data.values())[0]);
  } else {
    console.log("❌ Template model failed:", result.message);
    if (result.details) {
      console.log("Details:", result.details);
    }
  }
} catch (error) {
  console.log("❌ Template model exception:", error.message);
}
