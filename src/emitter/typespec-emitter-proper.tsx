/**
 * TypeSpec Go Emitter - PROPER ALLOY-JS INTEGRATION
 *
 * ALLOY-JS FRAMEWORK: Uses @alloy-js/go components correctly
 * TYPESPEC APIS: Uses real TypeSpec compiler APIs
 * JSX COMPONENTS: Component-based Go generation
 */

import type { Program, EmitContext, Model, Type, ModelProperty, Scalar } from "@typespec/compiler";
import { navigateProgram } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";
import { Output } from "@typespec/emitter-framework";
import { ModuleDirectory, SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";

/**
 * Generate Go code from TypeSpec program using Alloy-JS
 * PROPER INTEGRATION: Correct component usage and APIs
 */
export async function $onEmit(context: EmitContext) {
  const { program } = context;
  
  // Extract all models from TypeSpec program
  const models = new Map<string, Model>();
  
  // Navigate TypeSpec program to find all models
  navigateProgram(program, {
    model(model) {
      models.set(model.name!, model);
    }
  });
  
  const result = (
    <Output program={program}>
      <ModuleDirectory name="api">
        <SourceFile path="models.go">
          {/* Generate Go structs for all models in program */}
          {Array.from(models.values()).map((model) => (
            <GoModelStruct model={model} />
          ))}
        </SourceFile>
      </ModuleDirectory>
    </Output>
  );
  
  return await writeOutput(
    context.program,
    result,
    context.emitterOutputDir,
  );
}

/**
 * Generate a Go struct from TypeSpec model using Alloy-JS Go components
 */
function GoModelStruct({ model }: { model: Model }) {
  return (
    <StructTypeDeclaration name={model.name}>
      {/* Generate struct fields for model properties */}
      {Array.from(model.properties?.values() || []).map((prop: ModelProperty) => (
        <StructMember 
          name={prop.name}
          type={mapTypeToGo(prop.type)}
          tag={`json:"${prop.name}"`}
        />
      ))}
    </StructTypeDeclaration>
  );
}

/**
 * Convert TypeSpec type to Go type string
 * Simplified mapping that avoids complex Alloy.js type components
 */
function mapTypeToGo(type: Type): string {
  // Handle scalar types
  if (type.kind === "String") {
    return "string";
  }
  
  if (type.kind === "Boolean") {
    return "bool";
  }
  
  if (type.kind === "Number") {
    return "int64";
  }
  
  // Handle scalar types
  if (type.kind === "Scalar") {
    const scalar = type as Scalar;
    const scalarName = scalar.name.toLowerCase();
    
    // Map TypeSpec scalars to Go types
    const scalarMappings: Record<string, string> = {
      "string": "string",
      "boolean": "bool",
      "bytes": "[]byte",
      "int8": "int8",
      "int16": "int16",
      "int32": "int32",
      "int64": "int64",
      "uint8": "uint8",
      "uint16": "uint16", 
      "uint32": "uint32",
      "uint64": "uint64",
      "float32": "float32",
      "float64": "float64",
      "plaindate": "time.Time",
      "plaintext": "string",
      "url": "string",
      "duration": "time.Duration",
      "offsetdatetime": "time.Time",
    };

    const goType = scalarMappings[scalarName] || "interface{}";
    return goType;
  }

  // Handle array types (TypeSpec arrays are models with indexer)
  if (type.kind === "Model") {
    const model = type as Model;
    if (model.indexer) {
      return `[]${mapTypeToGo(model.indexer.value)}`;
    }
    return model.name || "interface{}";
  }

  // Handle union types
  if (type.kind === "Union") {
    return "interface{}"; // Go doesn't have union types
  }

  // Default to interface{} for unknown types
  return "interface{}";
}

/**
 * TypeSpec Go Emitter Entry Point
 * This is the proper TypeSpec emitter integration using Alloy-JS
 */
export const TypeSpecGoEmitter = {
  $onEmit
};