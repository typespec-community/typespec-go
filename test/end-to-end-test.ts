import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

// Test to verify working TypeSpec → Go pipeline
import { createTypespecGoTestRunner } from "./test-host.js";

describe("TypeSpec Go Emitter - End-to-End Pipeline", () => {
  it("generates Go file from TypeSpec model", async () => {
    const runner = await createTypespecGoTestRunner();
    
    // Simple TypeSpec model to test
    const typeSpecCode = `
      import "@typespec-community/typespec-go";
      
      model User {
        name: string;
        age: int32;
        active: boolean;
        email?: string;
      }
    `;
    
    try {
      // Compile TypeSpec and emit Go
      const [types, diagnostics] = await runner.compileAndDiagnose(typeSpecCode, {
        outputDir: "tsp-output",
      });
      
      // Check compilation succeeded
      const errorDiagnostics = diagnostics.filter(d => d.severity === "error");
      strictEqual(errorDiagnostics.length, 0, `Should compile without errors. Found: ${errorDiagnostics.map(d => d.message).join(", ")}`);
      
      // Check Go file was generated
      const generatedFiles = Object.keys(types);
      console.log("Generated files:", generatedFiles);
      
      const hasModelsGo = generatedFiles.some(file => file.includes(".go") && file.includes("models"));
      strictEqual(hasModelsGo, true, `Should generate Go files. Found: ${generatedFiles.join(", ")}`);
      
      if (hasModelsGo) {
        // Check generated Go content has User struct
        const modelsGoFiles = generatedFiles.filter(file => file.includes(".go"));
        console.log("Go files content:", modelsGoFiles.map(file => ({ file, content: types[file].substring(0, 200) })));
        
        const someFileHasUser = modelsGoFiles.some(file => types[file] && types[file].includes("type User struct"));
        strictEqual(someFileHasUser, true, `Should generate User struct in Go files. Files: ${modelsGoFiles.join(", ")}`);
      }
      
    } catch (error) {
      console.error("TypeSpec → Go pipeline failed:", error);
      throw error;
    }
  });
});