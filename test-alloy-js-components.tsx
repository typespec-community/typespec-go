/**
 * Basic test for Alloy-JS Go components
 * Tests the corrected component interfaces
 */

import { render } from "@alloy-js/core";
import { SourceFile } from "@alloy-js/go";
import { GoModel } from "./src/components/GoModel.js";

// Mock TypeSpec model for testing
const mockModel = {
  name: "User",
  kind: "Model",
  properties: new Map([
    ["id", { 
      name: "id", 
      type: { kind: "Scalar", name: "string" },
      optional: false 
    }],
    ["name", { 
      name: "name", 
      type: { kind: "Scalar", name: "string" },
      optional: true 
    }],
    ["email", { 
      name: "email", 
      type: { kind: "Scalar", name: "string" },
      optional: true 
    }]
  ])
};

console.log("Testing Alloy-JS Go components...");

try {
  const output = render(
    <SourceFile path="models/user.go" package="models">
      <GoModel model={mockModel} />
    </SourceFile>
  );
  
  console.log("✅ SUCCESS: Generated Go code:");
  console.log(output[0]?.contents || "No output");
} catch (error) {
  console.error("❌ FAILED: Error generating Go code:");
  console.error(error);
}