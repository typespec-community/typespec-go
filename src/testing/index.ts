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
