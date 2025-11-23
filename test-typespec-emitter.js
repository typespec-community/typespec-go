import { Program } from "@typespec/compiler";
import { readFileSync } from "fs";
import { compile } from "@typespec/compiler";

async function testEmission() {
  try {
    console.log("🧪 TESTING TYPESPEC GO EMITTER");
    
    // Create a simple TypeSpec program
    const source = `
      model User {
        id: int32;
        name: string;
        email?: string;
      }
      
      model Product {
        id: int32;
        title: string;
        price: float64;
      }
    `;
    
    // Compile TypeSpec
    const compiled = await compile(source, {
      noEmit: true,
      nostdlib: false
    });
    
    if (!compiled.program) {
      console.error("❌ Failed to compile TypeSpec program");
      return;
    }
    
    console.log("✅ TypeSpec compilation successful");
    
    // Import and test our main emitter
    const { $onEmit } = await import("./dist/src/emitter/main.js");
    
    // Create mock emit context
    const mockContext = {
      program: compiled.program,
      emitterOutputDir: "./output",
      options: {}
    };
    
    // Test our emitter
    await $onEmit(mockContext);
    
    console.log("✅ Emission completed successfully!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.error("Stack trace:", error.stack);
  }
}

testEmission();