import { createTypeSpecLibrary, type JSONSchemaType } from "@typespec/compiler";

export interface EmitterOptions {
	"module-path": string;
}

const emitterOptionsSchema: JSONSchemaType<EmitterOptions> = {
	type: "object",
	additionalProperties: false,
	properties: {
		"module-path": { type: "string" },
	},
	required: ["module-path"],
};

export const $lib = createTypeSpecLibrary({
	name: "typespec-go",
	diagnostics: {},
	emitter: {
		options: emitterOptionsSchema,
	},
});

export const $decorators = {
	"TypeSpec.Go": {
		name: () => {},
		structTag: () => {},
		nullable: () => {},
		type: () => {},
		pkg: () => {},
		enumMode: () => {},
	},
};

export const { reportDiagnostic, createDiagnostic } = $lib;
