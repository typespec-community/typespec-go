/**
 * TypeSpec Go Emitter - Proper TypeSpec Integration
 *
 * Uses Alloy-JS JSX components for Go code generation
 * Integrates with TypeSpec's $onEmit pattern
 * Replaces fake GoEmitter class with proper TypeSpec integration
 */

import type { Program, EmitContext, Model, Type, ModelProperty } from "@typespec/compiler";
import type { SemanticNodeListener } from "@typespec/compiler";
import { navigateProgram } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";
import { Output } from "@typespec/emitter-framework";
import * as go from "@alloy-js/go";

/**
 * Main TypeSpec Go Emitter Output Component
 * Generates Go files from TypeSpec program using Alloy-JS components
 */
function GoEmitterOutput({ program }: { program: Program }) {
  // Get all models from TypeSpec program using navigateProgram
  const models = new Map();
  
  navigateProgram(program, {
    model: (model: Model) => {
      models.set(model.name || "unnamed", model);
    }
  });
  
  return (
    <Output program={program}>
        <go.SourceFile path="models.go">
        
        {/* Generate Go structs for all models in the program */}
        {Array.from(models.values()).map((model) => (
          <GoModelStruct model={model} />
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
      {Array.from(model.properties?.values() || []).map((prop: ModelProperty) => (
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
function mapTypeSpecToGo(type: Type): string {
  switch (type.kind) {
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Number":
      const numberType = type as any; // TODO: Fix with proper TypeSpec number API
      if (numberType.name === "int32") return "int32";
      if (numberType.name === "int64") return "int64";
      if (numberType.name === "uint32") return "uint32";
      if (numberType.name === "uint64") return "uint64";
      return "int";
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