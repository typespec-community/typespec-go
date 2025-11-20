import type { Program, EmitContext, Model } from "@typespec/compiler";
import { emitFile } from "@typespec/compiler";

export async function $onEmit(context: EmitContext): Promise<void> {
  try {
    // ✅ CORRECT: Access models using v1.7.0 API
    const globalNamespace = context.program.getGlobalNamespaceType();
    const models = [...globalNamespace.models.values()];
    let goCode = "package api\n\n";
    
    for (const model of models) {
      goCode += `type ${model.name} struct {\n`;
      for (const [propName, prop] of model.properties || []) {
        const goType = mapTypeSpecToGo(prop.type);
        goCode += `\t${propName} ${goType} \`json:"${propName}"\`\n`;
      }
      goCode += "}\n\n";
    }
    
    // ✅ CORRECT: Use emitFile API with proper path
    await emitFile(context.program, {
      path: context.emitterOutputDir ? `${context.emitterOutputDir}/models.go` : "models.go",
      content: goCode,
    });
  } catch (error) {
    console.error("TypeSpec Go Emitter Error:", error);
    throw error;
  }
}

function mapTypeSpecToGo(type: any): string {
  switch (type.kind) {
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Number":
      return type.name || "int";
    case "Scalar":
      if (type.name === "string") return "string";
      if (type.name === "boolean") return "bool";
      if (type.name === "int32") return "int32";
      if (type.name === "int64") return "int64";
      if (type.name === "uint32") return "uint32";
      if (type.name === "uint64") return "uint64";
      if (type.name === "float32") return "float32";
      if (type.name === "float64") return "float64";
      return "interface{}";
    default:
      return "interface{}";
  }
}