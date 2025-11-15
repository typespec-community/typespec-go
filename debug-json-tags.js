/**
 * Quick Debug Test
 */

import { EnhancedGoGenerator } from "./src/enhanced-generator.js";

const customerModel = {
  name: "UserProfile",
  properties: new Map([
    ["userId", {
      name: "userId",
      type: { kind: "Int64" },
      optional: false
    }],
    ["username", {
      name: "username",
      type: { kind: "String" },
      optional: false
    }],
    ["email", {
      name: "email",
      type: { kind: "String" },
      optional: true
    }]
  ])
};

const generator = new EnhancedGoGenerator();
const goCode = generator.generateModel(customerModel);

console.log("🔍 DEBUG: Generated Go code:");
console.log(goCode);
console.log("🔍 DEBUG: Contains userId JSON tag:", goCode.includes('json:"userId"'));
console.log("🔍 DEBUG: Contains email JSON tag:", goCode.includes('json:"email"'));
console.log("🔍 DEBUG: All JSON tags:", goCode.match(/json:"[^"]*"/g));