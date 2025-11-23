import { compile } from "@typespec/compiler";

export async function createTestProgram(source: string) {
  const compiled = await compile(source, {
    noEmit: true,
    nostdlib: false
  });
  
  if (!compiled.program) {
    throw new Error("Failed to compile test TypeSpec program");
  }
  
  return compiled.program;
}