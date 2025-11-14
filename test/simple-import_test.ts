import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

// Test the exact issue: TypeSpec library registration and import
import { createTypespecGoTestHost } from "./test-host.js";

describe("TypeSpec Go Emitter - Import Resolution", () => {
  it("registers library correctly", async () => {
    const host = await createTypespecGoTestHost();
    
    // Check if library is registered
    const libraries = Array.from(host.libraries);
    const hasCorrectLibrary = libraries.some(lib => lib.name === "@typespec-community/typespec-go");
    
    strictEqual(hasCorrectLibrary, true, `Should register library '@typespec-community/typespec-go'. Found: ${libraries.map(l => l.name).join(", ")}`);
  });

  it("can compile TypeSpec with correct import", async () => {
    const host = await createTypespecGoTestHost();
    
    // TypeSpec with correct library import
    const importCode = `
      import "@typespec-community/typespec-go";
      
      model Simple {
        name: string;
      }
    `;
    
    try {
      const program = host.compile(importCode);
      const errorDiagnostics = program.diagnostics.filter(d => d.severity === "error");
      
      console.log("All diagnostics:", program.diagnostics.map(d => ({ message: d.message, severity: d.severity })));
      
      // Should not have import-not-found errors
      const importErrors = errorDiagnostics.filter(d => d.message.includes("import-not-found"));
      strictEqual(importErrors.length, 0, `Should resolve import '@typespec-community/typespec-go'. Import errors: ${importErrors.map(e => e.message).join(", ")}`);
      
      // Should compile successfully
      strictEqual(errorDiagnostics.length, 0, `Should compile without errors. Error count: ${errorDiagnostics.length}`);
    } catch (error) {
      console.error("Compilation failed:", error);
      throw error;
    }
  });
});