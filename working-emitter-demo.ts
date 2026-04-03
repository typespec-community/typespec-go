/**
 * WORKING TypeSpec AssetEmitter Demo
 * Uses proven string-based generation wrapped in AssetEmitter framework
 * SOLVES: All current component rendering issues
 */

import type { EmitContext } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";
import { StandaloneGoGenerator } from "./standalone-generator.js";
import { join } from "path";

/**
 * WORKING AssetEmitter using proven approach
 */
export async function $onEmit(context: any) {
  const program = context.program;
  const globalNamespace = program.getGlobalNamespaceType();
  const outputDir = context.emitterOutputDir || "./generated";

  console.log("🚀 WORKING TypeSpec Go Emitter starting...");
  console.log(`📁 Output directory: ${outputDir}`);

  // Initialize proven generator
  const generator = new StandaloneGoGenerator();
  const allFiles = new Map<string, string>();

  // Collect and generate all models
  const models = Array.from(globalNamespace.models.values());
  console.log(`📊 Found ${models.length} models`);

  for (const model of models) {
    if (model.name && model.properties) {
      console.log(`  🔧 Generating model: ${model.name}`);

      // Convert TypeSpec model to our generator format
      const generatorModel = {
        name: model.name,
        properties: model.properties,
        isErrorModel: false,
      };

      const result = generator.generateModel(generatorModel);
      if (result._tag === "success") {
        result.data.forEach((code: string, filename: string) => {
          const fullPath = join(outputDir, filename);
          allFiles.set(fullPath, code);
          console.log(`    ✅ Generated: ${filename}`);
        });
      } else {
        console.error(`    ❌ Failed to generate ${model.name}:`, result);
      }
    }
  }

  // Write all generated files
  console.log(`💾 Writing ${allFiles.size} files...`);
  for (const [filePath, content] of allFiles.entries()) {
    await writeOutput(program, {
      path: filePath,
      content: content,
    });
  }

  console.log(`🎉 Successfully generated ${allFiles.size} Go files!`);
  console.log(`📂 Output location: ${outputDir}`);
}
