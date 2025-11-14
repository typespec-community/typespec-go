import { GoTypeMapper } from "../utils/type-mapper.js";
export class SimpleGoGenerator {
    generateModel(model) {
        const modelName = model.name;
        const properties = Array.from(model.properties.values());
        return this.generateStruct(modelName, properties);
    }
    generateStruct(name, properties) {
        const fields = properties.map(prop => this.generateField(prop)).join('\n');
        return `package api

type ${name} struct {
${fields}
}`;
    }
    generateField(property) {
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
