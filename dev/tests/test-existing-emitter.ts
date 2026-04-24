// Test existing TypeSpec emitter with JSX
import { $onEmit } from "./src/emitter/typespec-emitter.js";
import { createTestProgram } from "./src/utils/test-utils.js";

console.log("🧪 Testing Existing TypeSpec Emitter with JSX");

try {
  // Create a simple test TypeSpec program
  const testProgram = createTestProgram({
    models: {
      User: {
        name: "User",
        properties: {
          id: { name: "id", type: { kind: "String" } },
          name: { name: "name", type: { kind: "String" } },
        },
      },
    },
  });

  console.log("✅ Test program created");
  console.log("📋 Program models:", Object.keys(testProgram.models));

  // Create mock emit context
  const mockContext = {
    program: testProgram,
    emitterOutputDir: "test-output",
  };

  console.log("🚀 Attempting TypeSpec emitter...");

  // Try to emit using the existing JSX-based emitter
  await $onEmit(mockContext);

  console.log("🎉 Existing TypeSpec emitter with JSX working!");
  console.log("✅ This means JSX integration is already functional");
  console.log("✅ The existing typespec-emitter.tsx should be working");
} catch (error) {
  console.error("❌ Existing TypeSpec emitter failed:", error);
  console.error("Error type:", error.constructor.name);
  console.error("Error message:", error.message);
  if (error.stack) {
    console.error("Stack trace (first 10 lines):");
    const stackLines = error.stack.split("\n").slice(0, 10);
    stackLines.forEach((line) => console.error("  ", line));
  }
  process.exit(1);
}
