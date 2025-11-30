import { test, expect } from "vitest";
import { createTestRunner } from "@typespec/compiler/testing";
import type { EmitContext } from "@typespec/compiler";
import { $onEmit } from "../emitter/typespec-go-emitter.js";

/**
 * Test our new AssetEmitter integration with real TypeSpec compilation
 */
test("TypeSpec AssetEmitter Integration - Real Compilation", async () => {
  // Create a real TypeSpec program
  const runner = await createTestRunner();
  
  const code = `
    namespace TestNamespace {
      model User {
        id: string;
        name: string;
        age?: uint8;
      }
    }
  `;
  
  // Compile the TypeSpec code
  const { program } = await runner.compile(code);
  const globalNamespace = program.getGlobalNamespaceType();
  
  console.log("✅ TypeSpec compilation successful");
  console.log("📋 Global namespace models:", [...globalNamespace.models.keys()]);
  
  // Create a mock context
  const mockContext: EmitContext = {
    program,
    emitterOutputDir: "./test-output",
    compilerOptions: {},
    dipoleServices: {},
  };
  
  // Test our AssetEmitter
  try {
    await $onEmit(mockContext);
    console.log("✅ AssetEmitter execution successful");
    
    // For now, just test that it doesn't crash
    expect(true).toBe(true);
  } catch (error) {
    console.log("❌ AssetEmitter failed:", error);
    throw error;
  }
});