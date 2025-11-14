import { findTestPackageRoot, createTestLibrary, } from "@typespec/compiler/testing";
export const TypespecGoTestLibrary = createTestLibrary({
    name: "@typespec-community/typespec-go", // Match package.json name
    packageRoot: await findTestPackageRoot(import.meta.url),
});
// Create a wrapper that loads async library
async function createLibraryWrapper() {
    const library = await TypespecGoTestLibrary;
    return library;
}
export { createLibraryWrapper };
