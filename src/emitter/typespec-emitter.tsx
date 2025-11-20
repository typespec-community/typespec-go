/**
 * TypeSpec Go Emitter - Proper TypeSpec Integration
 *
 * Uses Alloy-JS JSX components for Go code generation
 * Integrates with TypeSpec's $onEmit pattern
 * Replaces fake GoEmitter class with proper TypeSpec integration
 */

import type { Program, EmitContext } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";
import { Output, useTsp } from "@typespec/emitter-framework";
import * as go from "@alloy-js/go";
import type { Type, Model, Namespace } from "@typespec/compiler";

/**
 * Main TypeSpec Go Emitter Output Component
 * Generates Go files from TypeSpec program using Alloy-JS components
 */
function GoEmitterOutput({ program }: { program: Program }) {
  const tsp = useTsp();
  
  return (
    <Output program={program}>
      <go.SourceFile path="models.go">
        <go.Package name="api" />
        
        {/* Generate Go structs for all models in the program */}
        {tsp.program.namespace?.models?.map((model: Model) => (
          <GoModelStruct key={model.name} model={model} />
        ))}
      </go.SourceFile>
    </Output>
  );
}

/**
 * Generate a Go struct from TypeSpec model using Alloy-JS Go components
 */
function GoModelStruct({ model }: { model: Model }) {
  return (
    <go.StructTypeDeclaration name={model.name}>
      {/* Generate struct fields for model properties */}
      {model.properties?.map((prop) => (
        <go.StructMember 
          key={prop.name}
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
function mapTypeSpecToGo(type: Type): string {
  switch (type.kind) {
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Int32":
      return "int32";
    case "Int64":
      return "int64";
    case "Uint32":
      return "uint32";
    case "Uint64":
      return "uint64";
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