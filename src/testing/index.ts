import { fileURLToPath } from "node:url";
import {
	findTestPackageRoot,
	createTestLibrary,
	type TypeSpecTestLibrary,
} from "@typespec/compiler/testing";

export const TypespecGoTestLibrary: TypeSpecTestLibrary = createTestLibrary({
	name: "@typespec-community/typespec-go", // Match package.json name
	packageRoot: await findTestPackageRoot(import.meta.url),
});

// Create a wrapper that loads async library
async function createLibraryWrapper(): Promise<TypeSpecTestLibrary> {
	const library = await TypespecGoTestLibrary;
	return library;
}

export { createLibraryWrapper, TypespecGoTestLibrary };
