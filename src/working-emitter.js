/**
 * Minimal type mapper based on working GoTypeMapper tests
 * Inline implementation to avoid compilation issues
 */
class MinimalTypeMapper {
    static mapTypeSpecType(type) {
        // Handle scalar types based on working tests
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
            default:
                return { goType: "interface{}", usePointerForOptional: false };
        }
    }
}
/**
 * Simple working Go generator
 * Uses string templates for maximum compatibility
 */
class SimpleGoGenerator {
    static generateModel(model) {
        const modelName = model.name;
        const properties = Array.from(model.properties.values());
        return this.generateStruct(modelName, properties);
    }
    static generateStruct(name, properties) {
        const fields = properties.map(prop => this.generateField(prop)).join('\n');
        return `package api

type ${name} struct {
${fields}
}`;
    }
    static generateField(property) {
        const mappedType = MinimalTypeMapper.mapTypeSpecType(property.type);
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
/**
 * Simple working emitter function
 * Uses proven patterns from working tests
 */
export async function $onEmit(context) {
    const { program } = context;
    console.log("🚀 Minimal String-Based Emitter Started");
    const results = {};
    // Use proper TypeSpec API to get models
    const models = new Map();
    // Iterate through all namespaces and collect models
    for (const namespace of program.namespaces.values()) {
        if (namespace.models) {
            for (const model of namespace.models) {
                models.set(namespace.name + "/" + model.name, model);
                console.log(`🏗️  Found model: ${namespace.name}/${model.name}`);
            }
        }
    }
    // Generate Go code for each model
    for (const [fullPath, model] of models) {
        console.log(`🏗️  Generating Go for model: ${model.name}`);
        try {
            const goCode = SimpleGoGenerator.generateModel(model);
            const fileName = `${fullPath.toLowerCase()}.go`;
            results[fileName] = goCode;
            console.log(`✅ Generated: ${fileName}`);
        }
        catch (error) {
            console.error(`❌ Failed to generate ${model.name}:`, error);
            // Continue with other models instead of failing completely
        }
    }
    console.log(`📦 Generated ${Object.keys(results).length} Go files`);
    return results;
}
