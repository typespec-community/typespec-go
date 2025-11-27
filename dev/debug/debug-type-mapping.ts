/**
 * Debug Type Mapping Issue
 */

import { StandaloneGoGenerator } from "../standalone-generator.js";

console.log("=== DEBUGGING TYPE MAPPING ISSUE ===");

const userModel = {
  name: "User",
  properties: new Map([
    ["id", { name: "id", type: { kind: "String" }, optional: false }],
    ["username", { name: "username", type: { kind: "String" }, optional: false }],
    ["email", { name: "email", type: { kind: "String" }, optional: true }],
  ]),
};

console.log("1. Input model:", JSON.stringify(userModel, null, 2));

try {
  const result = StandaloneGoGenerator.generateModel(userModel);
  console.log("2. Generation result:", result);
} catch (error) {
  console.log("3. Error during generation:", error);
}
