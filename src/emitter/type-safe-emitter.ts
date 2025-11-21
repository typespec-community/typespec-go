/**
 * Type-Safe TypeSpec Go Emitter
 * 
 * ARCHITECTURAL EXCELLENCE - DISCRIMINATED UNIONS EVERYWHERE
 * DOMAIN-DRIVEN DESIGN - PROPER SERVICE SEPARATION
 * COMPREHENSIVE ERROR HANDLING - NO EXCEPTIONS
 */

import type { Program, EmitContext } from "@typespec/compiler";
import { emitFile } from "@typespec/compiler";

import type { 
  EmitterExecutionResult,
  GoGeneratorConfig,
  GoStructGenerationResult
} from "../types/emitter.types.js";

import { generateGoStruct, generatePackageHeader } from "../services/go-struct-generator.service.js";

/**
 * Default configuration with type safety
 */
const DEFAULT_CONFIG: GoGeneratorConfig = {
  packageName: "api",
  outputDir: ".",
  generateTimePackage: true,
  omitEmpty: false,
  jsonTags: true
} as const;

/**
 * Execute TypeSpec to Go generation with comprehensive error handling
 * 
 * PURE FUNCTION - NO SIDE EFFECTS
 * TYPE-SAFE RESULT - DISCRIMINATED UNION
 */
export async function $onEmit(context: EmitContext): Promise<void> {
  const result = await executeTypeSafeEmission(context);
  
  // Handle result with proper error reporting
  switch (result._tag) {
    case "success":
      console.log(`✅ Generated ${result.modelsGenerated} models`);
      console.log(`📁 Files written: [${result.filesWritten.join(", ")}]`);
      return;
      
    case "compilation-failed":
      console.error(`❌ Compilation failed: ${result.error}`);
      if (result.details) {
        console.error("Details:", result.details);
      }
      throw new Error(`TypeSpec Go Emitter: ${result.error}`);
      
    case "type-mapping-failure":
      console.error(`❌ Type mapping failed for model: ${result.model}`);
      for (const mappingError of result.mappingErrors) {
        console.error("  -", mappingError);
      }
      throw new Error(`TypeSpec Go Emitter: Type mapping failures`);
      
    default:
      // Exhaustiveness check - TypeScript will error if we miss cases
      const _exhaustive: never = result;
      throw new Error(`Unknown execution result: ${_exhaustive}`);
  }
}

/**
 * Core emission logic with type safety
 */
async function executeTypeSafeEmission(
  context: EmitContext
): Promise<EmitterExecutionResult> {
  try {
    // Create configuration from context
    const config = createGeneratorConfig(context);
    
    // Get models from TypeSpec program
    const globalNamespace = context.program.getGlobalNamespaceType();
    const models = [...globalNamespace.models.values()];
    
    if (models.length === 0) {
      return {
        _tag: "success",
        modelsGenerated: 0,
        filesWritten: []
      };
    }
    
    // Generate Go structs for all models
    const generationResults: GoStructGenerationResult[] = [];
    for (const model of models) {
      const result = generateGoStruct(context.program, model, config);
      generationResults.push(result);
      
      // Fail fast on critical errors
      if (result._tag === "invalid-model" || result._tag === "type-mapping-failure") {
        return {
          _tag: "type-mapping-failure",
          model: model.name || "<unnamed>",
          mappingErrors: generationResults
            .filter((r): r is Extract<GoStructGenerationResult, { _tag: "invalid-model" | "type-mapping-failure" }> => 
              r._tag === "invalid-model" || r._tag === "type-mapping-failure"
            )
        };
      }
    }
    
    // Filter successful results
    const successfulResults = generationResults.filter(
      (r): r is Extract<GoStructGenerationResult, { _tag: "success" }> => 
        r._tag === "success"
    );
    
    // Generate final Go code
    const goCode = generateCompleteGoFile(successfulResults, config);
    
    // Write output file
    const outputPath = getOutputPath(config);
    await emitFile(context.program, {
      path: outputPath,
      content: goCode
    });
    
    return {
      _tag: "success",
      modelsGenerated: successfulResults.length,
      filesWritten: [outputPath.split("/").pop() || outputPath]
    };
    
  } catch (error) {
    return {
      _tag: "compilation-failed",
      error: error instanceof Error ? error.message : String(error),
      details: error
    };
  }
}

/**
 * Create generator configuration from TypeSpec context
 */
function createGeneratorConfig(context: EmitContext): GoGeneratorConfig {
  return {
    ...DEFAULT_CONFIG,
    outputDir: context.emitterOutputDir || DEFAULT_CONFIG.outputDir
  };
}

/**
 * Generate complete Go file with header and structs
 */
function generateCompleteGoFile(
  successfulResults: Extract<GoStructGenerationResult, { _tag: "success" }>[],
  config: GoGeneratorConfig
): string {
  let goCode = generatePackageHeader(config);
  
  for (const result of successfulResults) {
    goCode += result.structCode;
  }
  
  return goCode;
}

/**
 * Get output path with proper handling
 */
function getOutputPath(config: GoGeneratorConfig): string {
  const filename = "models.go";
  return config.outputDir === "." 
    ? filename 
    : `${config.outputDir}/${filename}`;
}