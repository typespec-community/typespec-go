import { findTestPackageRoot, createTestLibrary } from "@typespec/compiler/testing";

/**
 * TypeSpec Go Emitter Test Library Factory
 * 
 * This creates a test library factory function that returns
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