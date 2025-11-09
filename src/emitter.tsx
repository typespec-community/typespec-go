import { Output } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import type { EmitContext } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";

export async function $onEmit(context: EmitContext) {
	const modPath = context.options["module-path"];

	await writeOutput(
		context.program,
		<Output>
			<ModuleDirectory name={modPath}>
				<SourceDirectory path="foo">
					<SourceFile path="main.go"></SourceFile>
				</SourceDirectory>
			</ModuleDirectory>
		</Output>,
		context.emitterOutputDir,
	);
}
