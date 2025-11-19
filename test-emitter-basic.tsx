import { GoEmitter } from "./dist/src/emitter/index.js";
import type { Program } from "@typespec/compiler";

// Test basic emitter functionality
console.log("🧪 Testing TypeSpec Go Emitter...");

try {
  // Create emitter
  const emitter = new GoEmitter({
    "output-dir": "./generated",
    "go-package": "github.com/example/api"
  });

  // TODO: Create actual TypeSpec program
  // For now, test with mock program
  const mockProgram = {} as Program;

  // Test emission
  const result = await emitter.emit(mockProgram);
  
  // Handle discriminated result properly
  if (result._type === "success") {
    console.log("✅ Emitter test successful!");
    console.log("📄 Generated files:");
    for (const [filename, content] of result.data) {
      console.log(`📄 ${filename}:`);
      console.log(content);
    }
  } else {
    console.error("❌ Emitter failed with error:", result.error);
  }
} catch (error: any) {
  console.error("❌ Emitter test failed:", error.message);
  console.error("🔍 Stack:", error.stack);
}