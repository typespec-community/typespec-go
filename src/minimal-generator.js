/**
 * Minimal type mapping based on working GoTypeMapper logic
 * Inline to avoid compilation issues with complex imports
 */
class TypeMapper {
    static mapTypeSpecType(type) {
        // Handle scalar types based on working GoTypeMapper tests
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
 * Simple string-based Go generator
 * Focused on working TypeSpec → Go pipeline
 */
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
        const mappedType = TypeMapper.mapTypeSpecType(property.type);
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
