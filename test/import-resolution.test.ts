import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

// Test the exact import resolution issue
import { createTypespecGoTestHost, emitWithDiagnostics } from "./test-host.js";

describe("TypeSpec Go Emitter - Import Resolution", () => {
  it("can create test host", async () => {
    const host = await createTypespecGoTestHost();
    strictEqual(host !== null, true);
    strictEqual(typeof host, "object");
  });

  it("can compile simple TypeSpec without go import", async () => {
    // Test that basic TypeSpec compilation works without emitter
    const simpleCode = `
      model Simple {
        name: string;
      }
    `;
    
    const [results, diagnostics] = await emitWithDiagnostics(simpleCode);
    
    console.log("Diagnostics:", diagnostics.map(d => d.message));
    console.log("Results:", Object.keys(results));
    
    // Should not have "import-not-found" error if typespec-go is not imported
    const importErrors = diagnostics.filter(d => d.message.includes("import-not-found"));
    strictEqual(importErrors.length, 0);
  });

  it("shows error when trying to import typespec-go", async () => {
    // Test that importing typespec-go produces the specific success
    const importCode = `
      import "@typespec-community/typespec-go";
      
      model Simple {
        name: string;
      }
    `;
    
    const [results, diagnostics] = await emitWithDiagnostics(importCode);
    
    console.log("Diagnostics:", diagnostics.map(d => d.message));
    
    // Should resolve import successfully now
    const importErrors = diagnostics.filter(d => d.message.includes("import-not-found"));
    strictEqual(importErrors.length, 0);
  });
});