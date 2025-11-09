import { fileURLToPath } from "node:url";
import { resolvePath } from "@typespec/compiler";
import {
	createTestLibrary,
	type TypeSpecTestLibrary,
} from "@typespec/compiler/testing";

export const TypespecGoTestLibrary: TypeSpecTestLibrary = createTestLibrary({
	name: "typespec-go",
	packageRoot: resolvePath(fileURLToPath(import.meta.url), "../../../../"),
});
