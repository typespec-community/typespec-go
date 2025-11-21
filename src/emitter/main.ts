import type { Program, EmitContext, Model, Type, Scalar, ArrayType, ModelType, UnionType, EnumType } from "@typespec/compiler";
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

function mapTypeSpecToGo(type: Type): string {
  switch (type.kind) {
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Scalar":
      const scalar = type as Scalar;
      if (scalar.name === "string") return "string";
      if (scalar.name === "boolean") return "bool";
      if (scalar.name === "int8") return "int8";
      if (scalar.name === "int16") return "int16";
      if (scalar.name === "int32") return "int32";
      if (scalar.name === "int64") return "int64";
      if (scalar.name === "uint8") return "uint8";
      if (scalar.name === "uint16") return "uint16";
      if (scalar.name === "uint32") return "uint32";
      if (scalar.name === "uint64") return "uint64";
      if (scalar.name === "float32") return "float32";
      if (scalar.name === "float64") return "float64";
      if (scalar.name === "bytes") return "[]byte";
      if (scalar.name === "plainDate") return "time.Time";
      if (scalar.name === "utcDateTime") return "time.Time";
      if (scalar.name === "duration") return "time.Duration";
      return "interface{}";
    case "Array":
      const arrayType = type as ArrayType;
      const elementType = mapTypeSpecToGo(arrayType.elementType);
      return `[]${elementType}`;
    case "Model":
      const modelType = type as ModelType;
      // Special case: TypeSpec creates Model for arrays like string[]
      if (modelType.name === "Array" && modelType.indexer?.value) {
        const element = mapTypeSpecToGo(modelType.indexer.value);
        return `[]${element}`;
      }
      return modelType.name || "interface{}";
    case "Union":
      const unionType = type as UnionType;
      if (unionType.variants?.every((v) => v.type?.kind === "String")) {
        return "string";
      }
      return "interface{}";
    case "Enum":
      const enumType = type as EnumType;
      return enumType.name || "string";
    default:
      return "interface{}";
  }
}