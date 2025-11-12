import { Output } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import type { EmitContext, Namespace, Model } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";
import { GoTypeMapper } from "./utils/type-mapper.js";
import { PropertyTransformer } from "./utils/property-transformer.js";
import { EmitterConfigFactory, DEFAULT_EMITTER_CONFIG } from "./utils/config.js";
import { ErrorManager } from "./utils/errors.js";

export async function $onEmit(context: EmitContext) {
  try {
    // Create effective configuration
    const config = EmitterConfigFactory.createEffective(context.options);
    
    // Get global namespace from TypeSpec program
    const mainNamespace = context.program.getGlobalNamespaceType();
    
    // Generate Go code using new utilities
    await emitGoCode(context, mainNamespace, config);
    
  } catch (error) {
    // Handle any unexpected errors with our error system
    ErrorManager.handleUnexpectedError({
      message: `Emission failed: ${error instanceof Error ? error.message : String(error)}`,
      cause: error instanceof Error ? error : undefined,
      sourceLocation: {
        file: "emitter.tsx",
        function: "$onEmit",
        line: 0,
        column: 0,
      },
    });
    
    // Re-throw to halt compilation
    throw error;
  }
}

/**
 * Emit Go code using new utility architecture
 */
async function emitGoCode(
  context: EmitContext, 
  namespace: Namespace, 
  config: typeof DEFAULT_EMITTER_CONFIG
): Promise<void> {
  
  // Generate all models from namespace
  const generatedModels = generateAllModels(namespace, config);
  
  // Collect all required imports
  const allImports = collectImportsForModels(generatedModels);
  
  // Generate final Go code
  const goCode = generateGoFileContent(generatedModels, allImports, config);
  
  // Write output using Alloy.js
  await writeOutput(
    context.program,
    <Output>
      <ModuleDirectory name="example.com/output">
        <SourceDirectory path="api">
          <SourceFile path="models.go">{goCode}</SourceFile>
        </SourceDirectory>
      </ModuleDirectory>
    </Output>,
    context.emitterOutputDir,
  );
}

/**
 * Generate all models in namespace
 */
function generateAllModels(
  namespace: Namespace, 
  config: typeof DEFAULT_EMITTER_CONFIG
): GeneratedModel[] {
  
  const models: GeneratedModel[] = [];
  
  // Process all models in namespace
  for (const model of namespace.models.values()) {
    try {
      const generatedModel = generateSingleModel(model, config);
      if (generatedModel) {
        models.push(generatedModel);
      }
    } catch (error) {
      // Handle model generation error but continue with other models
      const shouldContinue = ErrorManager.handleModelGenerationError({
        message: `Failed to generate model '${model.name}': ${error instanceof Error ? error.message : String(error)}`,
        modelName: model.name,
        cause: error instanceof Error ? error : undefined,
        sourceLocation: {
          file: "unknown",
          line: 0,
          column: 0,
          function: "generateSingleModel",
        },
        resolution: "Check model structure and property definitions",
      });
      
      if (!shouldContinue) {
        break; // Stop processing models
      }
    }
  }
  
  return models;
}

/**
 * Generate a single model
 */
function generateSingleModel(
  model: Model, 
  config: typeof DEFAULT_EMITTER_CONFIG
): GeneratedModel | null {
  
  // Validate model
  if (!model.name || model.properties.size === 0) {
    // Skip models with no name or properties, but warn
    ErrorManager.handleModelGenerationError({
      message: `Skipping model '${model.name}': no name or properties`,
      modelName: model.name,
      sourceLocation: {
        file: "unknown",
        line: 0,
        column: 0,
        function: "generateSingleModel",
      },
      resolution: "Ensure model has at least one property",
    });
    return null;
  }
  
  // Transform all properties using new utility
  const properties = Array.from(model.properties.values());
  const transformedFields = PropertyTransformer.transformProperties(properties);
  
  // Collect imports needed for this model
  const modelImports = PropertyTransformer.collectImportsForFields(transformedFields);
  
  // Generate Go struct field lines
  const fieldLines = transformedFields.map(field => 
    PropertyTransformer.generateGoFieldLine(field)
  );
  
  return {
    name: model.name,
    fields: fieldLines,
    imports: modelImports,
    sourceLocation: {
      file: "unknown",
      line: 0,
      column: 0,
    },
  };
}

/**
 * Generated model information
 */
interface GeneratedModel {
  readonly name: string;
  readonly fields: readonly string[];
  readonly imports: ReadonlyMap<string, string>;
  readonly sourceLocation: {
    readonly file: string;
    readonly line: number;
    readonly column: number;
  };
}

/**
 * Collect all imports needed for generated models
 */
function collectImportsForModels(models: readonly GeneratedModel[]): ReadonlyMap<string, string> {
  const allImports = new Map<string, string>();
  
  for (const model of models) {
    for (const [importPath, _alias] of model.imports) {
      if (!allImports.has(importPath)) {
        allImports.set(importPath, importPath);
      }
    }
  }
  
  return allImports;
}

/**
 * Generate complete Go file content
 */
function generateGoFileContent(
  models: readonly GeneratedModel[],
  imports: ReadonlyMap<string, string>,
  config: typeof DEFAULT_EMITTER_CONFIG
): string {
  
  const lines: string[] = [];
  
  // Add package declaration
  lines.push(`package ${config.packageName}`);
  lines.push(""); // Empty line after package
  
  // Add imports if any
  if (imports.size > 0) {
    lines.push("import (");
    
    for (const [importPath] of imports) {
      lines.push(`\t"${importPath}"`);
    }
    
    lines.push(")");
    lines.push(""); // Empty line after imports
  }
  
  // Add generated warning if enabled
  if (config.includeGeneratedWarning) {
    lines.push("// Code generated by TypeSpec Go Emitter");
    lines.push("// DO NOT EDIT - Generated code");
    lines.push("// See: https://github.com/typespec-community/typespec-go");
    lines.push(""); // Empty line after warning
  }
  
  // Add all models
  for (const model of models) {
    if (model.fields.length > 0) {
      lines.push(`type ${model.name} struct {`);
      lines.push(...model.fields);
      lines.push("}");
      lines.push(""); // Empty line after struct
    }
  }
  
  return lines.join("\n");
}