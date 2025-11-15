import { findTestPackageRoot, createTestLibrary } from "@typespec/compiler/testing";

/**
 * TypeSpec Go Emitter Test Library
 * 
 * This creates a test library that can be used by the TypeSpec compiler
 * for testing purposes. It exports the library as a function that returns
 * a promise resolving to the TypeSpecTestLibrary object.
 */
export async function TypespecGoTestLibrary() {
  return createTestLibrary({
    name: "@typespec-community/typespec-go",
    packageRoot: await findTestPackageRoot(import.meta.url),
  });
}

// Export additional helper functions for testing
export { findTestPackageRoot, createTestLibrary };