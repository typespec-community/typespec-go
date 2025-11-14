/**
 * Simple Working Go String Generator
 * 
 * Uses perfect GoTypeMapper + string templates
 * Enables TypeSpec → Go pipeline with zero complexity
 */
import type { Model, ModelProperty } from "@typespec/compiler";
import { GoTypeMapper } from "../utils/type-mapper.js";

export interface SimpleStringGenerator {
  generateModel(model: Model): string;
  generateStruct(name: string, properties: ModelProperty[]): string;
  generateField(property: ModelProperty): string;
}

export class SimpleGoGenerator implements SimpleStringGenerator {
  generateModel(model: Model): string {
    const modelName = model.name;
    const properties = Array.from(model.properties.values());
    
    return this.generateStruct(modelName, properties);
  }

  generateStruct(name: string, properties: ModelProperty[]): string {
    const fields = properties.map(prop => this.generateField(prop)).join('\n');
    
    return `package api

type ${name} struct {
${fields}
}`;
  }

  generateField(property: ModelProperty): string {
    const mappedType = GoTypeMapper.mapTypeSpecType(property.type);
    const goType = GoTypeMapper.generateGoTypeString(mappedType);
    
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