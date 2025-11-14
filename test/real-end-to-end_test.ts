import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

// Test to verify working TypeSpec → Go pipeline
import { createTypespecGoTestRunner } from "./test-host.js";

describe("TypeSpec Go Emitter - Real End-to-End", () => {
  it("generates basic Go from TypeSpec", async () => {
    const runner = await createTypespecGoTestRunner();
    
    // Very basic TypeSpec model
    const typeSpecCode = `
      import "@typespec-community/typespec-go";
      
      model User {
        name: string;
      }
    `;
    
    try {
      // Compile TypeSpec and emit Go
      const [types, diagnostics] = await runner.compileAndDiagnose(typeSpecCode, {
        outputDir: "tsp-output",
      });
      
      // Check compilation succeeded
      const errorDiagnostics = diagnostics.filter(d => d.severity === "error");
      strictEqual(errorDiagnostics.length, 0, `Should compile without errors. Error count: ${errorDiagnostics.length}`);
      
      // Check Go files were generated
      const generatedFiles = Object.keys(types);
      console.log("Generated files:", generatedFiles);
      
      // Basic check - should generate at least one file
      strictEqual(generatedFiles.length > 0, true, `Should generate files. Count: ${generatedFiles.length}`);
      
      // Basic check - should generate .go files
      const hasGoFiles = generatedFiles.some(file => file.includes(".go"));
      strictEqual(hasGoFiles, true, `Should generate Go files. Files: ${generatedFiles.join(", ")}`);
      
    } catch (error) {
      console.error("TypeSpec → Go pipeline failed:", error);
      throw error;
    }
  });
});