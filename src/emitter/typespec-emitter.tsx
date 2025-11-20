/**
 * TypeSpec Go Emitter - Proper TypeSpec Integration
 *
 * Uses Alloy-JS JSX components for Go code generation
 * Integrates with TypeSpec's $onEmit pattern
 * Replaces fake GoEmitter class with proper TypeSpec integration
 */

import type { Program, EmitContext, Model } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";
import { Output } from "@typespec/emitter-framework";
import * as go from "@alloy-js/go";

/**
 * Main TypeSpec Go Emitter Output Component
 * Generates Go files from TypeSpec program using Alloy-JS components
 */
function GoEmitterOutput({ program }: { program: Program }) {
  // Get all models from the TypeSpec program
  const models = program.globalNamespace?.models || [];
  
  return (
    <Output program={program}>
        <go.SourceFile path="models.go">
        
        {/* Generate Go structs for all models in the program */}
        {Array.from(models.values()).map((model: any) => (
          <GoModelStruct key={model.name} model={model} />
        ))}
      </go.SourceFile>
    </Output>
  );
}

/**
 * Generate a Go struct from TypeSpec model using Alloy-JS Go components
 */
function GoModelStruct({ model }: { model: any }) {
  return (
    <go.StructTypeDeclaration name={model.name}>
      {/* Generate struct fields for model properties */}
      {Array.from(model.properties?.values() || []).map((prop: any) => (
        <go.StructMember 
          name={prop.name}
          type={mapTypeSpecToGo(prop.type)}
          tag={`json:"${prop.name}"`}
        />
      ))}
    </go.StructTypeDeclaration>
  );
}

/**
 * Map TypeSpec types to Go types
 * TODO: Implement comprehensive type mapping
 */
function mapTypeSpecToGo(type: any): string {
  switch (type.kind) {
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Number":
      if (type.name === "int32") return "int32";
      if (type.name === "int64") return "int64";
      if (type.name === "uint32") return "uint32";
      if (type.name === "uint64") return "uint64";
      return "int";
    case "Float32":
      return "float32";
    case "Float64":
      return "float64";
    default:
      return "interface{}"; // Fallback for complex types
  }
}

/**
 * TypeSpec Go Emitter Entry Point
 * This is the proper TypeSpec emitter integration using Alloy-JS
 * 
 * Usage: tsp compile --emit-go my-spec.tsp
 */
export async function $onEmit(context: EmitContext) {
  try {
    await writeOutput(
      context.program,
      <GoEmitterOutput program={context.program} />,
      context.emitterOutputDir,
    );
  } catch (error) {
    console.error("TypeSpec Go Emitter Error:", error);
    throw error;
  }
}