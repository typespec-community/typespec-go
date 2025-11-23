import { Program } from "@typespec/compiler";
import { $onEmit } from "./src/emitter/typespec-emitter.js";
import { readFileSync } from "fs";
import { compile } from "@typespec/compiler";

async function testEmission() {
  try {
    console.log("🧪 TESTING ALLOY-JS EMITTER WITH TYPESPEC");
    
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
    
    // Compile the TypeSpec
    const compiled = await compile(source, {
      noEmit: true,
      nostdlib: false
    });
    
    if (!compiled.program) {
      console.error("❌ Failed to compile TypeSpec program");
      return;
    }
    
    console.log("✅ TypeSpec compilation successful");
    
    // Create mock emit context
    const mockContext = {
      program: compiled.program,
      emitterOutputDir: "./output"
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