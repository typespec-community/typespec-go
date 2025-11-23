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
import { isNullType, isScalar, isUnion } from "@typespec/compiler";

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
      <go.ModuleDirectory name="github.com/example/project">
        <go.SourceDirectory path="models">
          <go.SourceFile path="models.go">
        
            {/* Generate Go structs for all models in program */}
            {Array.from(models.values()).map((model) => (
              <GoModelStruct model={model} />
            ))}
          </go.SourceFile>
        </go.SourceDirectory>
      </go.ModuleDirectory>
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
          tag={{json: prop.name}}
        />
      ))}
    </go.StructTypeDeclaration>
  );
}

/**
 * Map TypeSpec types to Go types
 * Uses proper TypeSpec type guards, ZERO 'as any' violations
 */
function mapTypeSpecToGo(type: Type): string {
  // Handle intrinsic types (null, void, etc.)
  if (type.kind === "Intrinsic") {
    if (type.name === "null") return "null";
    if (type.name === "void") return "void";
    if (type.name === "unknown") return "interface{}";
    return "interface{}"; // fallback for other intrinsic types
  }
  
  // Handle string types
  if (type.kind === "String") {
    return "string";
  }
  
  // Handle boolean types
  if (type.kind === "Boolean") {
    return "bool";
  }
  
  // Handle scalar types
  if (isScalar(type)) {
    const scalarName = type.name?.toLowerCase() || "";
    switch (scalarName) {
      case "int32": return "int32";
      case "int64": return "int64";
      case "uint32": return "uint32";
      case "uint64": return "uint64";
      case "float32": return "float32";
      case "float64": return "float64";
      case "string": return "string";
      case "bytes": return "[]byte";
      default: return "interface{}";
    }
  }
  
  // Handle model types (user-defined structs)
  if (type.kind === "Model") {
    return type.name || "interface{}";
  }
  
  // Handle union types (string | number | boolean)
  if (isUnion(type)) {
    // Check for optional types (T | null)
    const variants = Array.from(type.variants.values());
    if (variants.length === 2) {
      const hasNull = variants.some(v => isNullType(v.type));
      const nonNullVariant = variants.find(v => !isNullType(v.type));
      
      if (hasNull && nonNullVariant) {
        const innerType = mapTypeSpecToGo(nonNullVariant.type);
        return `*${innerType}`;
      }
    }
    
    // For complex unions, use interface{}
    return "interface{}";
  }
  
  // Handle number types with proper type checking
  if (type.kind === "Number") {
    // Use proper TypeSpec number API instead of 'as any'
    if ('name' in type && type.name) {
      const numberName = type.name.toLowerCase();
      switch (numberName) {
        case "int32": return "int32";
        case "int64": return "int64";
        case "uint32": return "uint32";
        case "uint64": return "uint64";
        case "float32": return "float32";
        case "float64": return "float64";
        default: return "int"; // fallback
      }
    }
    return "int"; // fallback
  }
  
  // Fallback for unknown types
  return "interface{}";
}

/**
 * TypeSpec Go Emitter Entry Point
 * This is proper TypeSpec emitter integration using Alloy-JS
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