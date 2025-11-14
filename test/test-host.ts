import { Diagnostic, resolvePath } from "@typespec/compiler";
import {
  createTestHost,
  createTestWrapper,
  expectDiagnosticEmpty,
} from "@typespec/compiler/testing";
import { TypespecGoTestLibrary } from "../src/testing/index.js";

export async function createTypespecGoTestHost() {
  return createTestHost({
    libraries: [TypespecGoTestLibrary],
  });
}

export async function createTypespecGoTestRunner() {
  const host = await createTypespecGoTestHost();

  return createTestWrapper(host, {
    compilerOptions: {
      noEmit: false,
      emit: ["@typespec-community/typespec-go"],
    },
    // Add proper file resolution
    mainFile: "main.tsp",
  });
}

export async function emitWithDiagnostics(
  code: string
): Promise<[Record<string, string>, readonly Diagnostic[]]> {
  const runner = await createTypespecGoTestRunner();
  await runner.compileAndDiagnose(code, {
    outputDir: "tsp-output",
  });
  
  // Try to find any files that were created
  try {
    const rootFiles = await runner.program.host.readDir("./tsp-output");
    console.log("Root output files:", rootFiles);
    
    const result: Record<string, string> = {};
    
    // Recursively search for files
    async function collectFiles(dir: string, prefix: string = "") {
      try {
        const files = await runner.program.host.readDir(dir);
        for (const file of files) {
          const fullPath = `${dir}/${file}`;
          const relativePath = prefix ? `${prefix}/${file}` : file;
          
          try {
            // Try to read as file
            const content = await runner.program.host.readFile(fullPath);
            result[relativePath] = content.text;
          } catch {
            // It's a directory, recurse
            await collectFiles(fullPath, relativePath);
          }
        }
      } catch (error) {
        console.log(`Could not read directory ${dir}:`, error);
      }
    }
    
    await collectFiles("./tsp-output");
    return [result, runner.program.diagnostics];
  } catch (error: any) {
    console.log("Directory read error:", error.message);
    return [{}, runner.program.diagnostics];
  }
}

export async function emit(code: string): Promise<Record<string, string>> {
  const [result, diagnostics] = await emitWithDiagnostics(code);
  expectDiagnosticEmpty(diagnostics);
  return result;
}