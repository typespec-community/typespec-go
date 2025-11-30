/**
 * TypeSpec Go Emitter - Modern Alloy-JS Implementation
 * Following TypeSpec v1.7.0 official patterns with Alloy-JS components
 * Zero string-based logic - 100% component-based generation
 */

import type { EmitContext, Program, Model } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";
import { Output } from "@alloy-js/core";
import { GoPackageDirectory } from "../components/go/index.js";

/**
 * Main TypeSpec emitter entry point
 * Implements official TypeSpec AssetEmitter pattern using modern Alloy JSX components
 * Replaces all string-based logic with professional component architecture
 */
export async function $onEmit(context: EmitContext): Promise<void> {
  try {
    const program = context.program;
    const globalNamespace = program.getGlobalNamespaceType();
    const models = [...globalNamespace.models.values()];

    if (models.length === 0) {
      console.log("No models found in TypeSpec program");
      return;
    }

    console.log(`Generating Go code for ${models.length} models using Alloy-JS components`);

    // Generate JSX Output using professional component architecture
    await writeOutput(
      context.program,
      <Output>
        <GoPackageDirectory 
          models={models}
          packageName="api"
          packageDocumentation="Generated Go types from TypeSpec definitions"
        />
      </Output>,
      context.emitterOutputDir,
    );

    console.log("✅ TypeSpec Go emission completed successfully with Alloy-JS components");
  } catch (error) {
    console.error("❌ TypeSpec Go emission failed:", error);
    throw error;
  }
}
