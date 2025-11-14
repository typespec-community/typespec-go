/**
 * Standalone Go String Generator
 * 
 * Completely self-contained with inline type mapping
 * No external dependencies except basic TypeSpec types
 */
import type { Model, ModelProperty } from "@typespec/compiler";

/**
 * Inline type mapper to avoid import issues
 * Based on proven GoTypeMapper patterns
 */
class InlineTypeMapper {
  static mapTypeSpecType(type: any): { goType: string; usePointerForOptional: boolean } {
    switch (type.kind) {
      case "String":
        return { goType: "string", usePointerForOptional: true };
      case "Int32":
        return { goType: "int32", usePointerForOptional: true };
      case "Int64":
        return { goType: "int64", usePointerForOptional: true };
      case "Float32":
        return { goType: "float32", usePointerForOptional: true };
      case "Float64":
        return { goType: "float64", usePointerForOptional: true };
      case "Boolean":
        return { goType: "bool", usePointerForOptional: true };
      case "Bytes":
        return { goType: "[]byte", usePointerForOptional: true };
      default:
        return { goType: "interface{}", usePointerForOptional: false };
    }
  }
}

/**
 * Standalone Go string generator
 * Type-safe, zero dependencies, maximum compatibility
 */
export class StandaloneGoGenerator {
  generateModel(model: any): string {
    const modelName = model.name;
    const properties = Array.from(model.properties.values());
    
    return this.generateStruct(modelName, properties);
  }

  generateStruct(name: string, properties: any[]): string {
    const fields = properties.map(prop => this.generateField(prop)).join('\n');
    
    return `package api

type ${name} struct {
${fields}
}`;
  }

  generateField(property: any): string {
    const mappedType = InlineTypeMapper.mapTypeSpecType(property.type);
    const goType = mappedType.goType;
    
    // Handle optional properties
    const goTypeFinal = property.optional && mappedType.usePointerForOptional 
      ? `*${goType}` 
      : goType;
    
    // Generate JSON tag based on optional status
    const jsonTag = property.optional ? `json:"${property.name},omitempty"` : `json:"${property.name}"`;
    
    // Capitalize property name for Go
    const goName = property.name.charAt(0).toUpperCase() + property.name.slice(1);
    
    return `  ${goName} ${goTypeFinal} \`${jsonTag}\``;
  }
}