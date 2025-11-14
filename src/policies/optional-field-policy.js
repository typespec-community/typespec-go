/**
 * Optional Field Policy - Unified Optional Handling
 *
 * ELIMINATES SPLIT BRAIN
 * Single source of truth for optional field generation
 * No scattered pointer + JSON tag logic
 */
import { OptionalHandlingStrategy } from "../types/type-spec-types.js";
/**
 * Type-safe mapper implementation
 * Temporary inline implementation to avoid circular imports
 */
class InlineTypeMapper {
    static mapTypeSpecType(type) {
        const mappings = {
            String: { goType: "string", usePointerForOptional: true },
            Int8: { goType: "int8", usePointerForOptional: true },
            Int16: { goType: "int16", usePointerForOptional: true },
            Int32: { goType: "int32", usePointerForOptional: true },
            Int64: { goType: "int64", usePointerForOptional: true },
            Uint8: { goType: "uint8", usePointerForOptional: true },
            Uint16: { goType: "uint16", usePointerForOptional: true },
            Uint32: { goType: "uint32", usePointerForOptional: true },
            Uint64: { goType: "uint64", usePointerForOptional: true },
            Float32: { goType: "float32", usePointerForOptional: true },
            Float64: { goType: "float64", usePointerForOptional: true },
            Boolean: { goType: "bool", usePointerForOptional: true },
            Bytes: { goType: "[]byte", usePointerForOptional: true },
        };
        const mapping = mappings[type.kind];
        if (!mapping) {
            throw new Error(`Unsupported TypeSpec type: ${type.kind}`);
        }
        return mapping;
    }
    static generateValidationRules(type) {
        switch (type.kind) {
            case "Array":
                return [{ type: "min", value: 0, message: "Array cannot be null" }];
            case "String":
                return [{ type: "min", value: 0, message: "String cannot be null" }];
            default:
                return [];
        }
    }
}
/**
 * Unified optional field generation policy
 * ELIMINATES SPLIT BRAIN - single responsibility for optional handling
 */
export class OptionalFieldPolicy {
    /**
     * Generate Go field with unified optional handling
     * NO SPLIT BRAIN - pointer and JSON logic handled together
     */
    static generateField(property) {
        if (!property.optional) {
            return this.createRequiredField(property);
        }
        const strategy = this.determineStrategy(property.type);
        const baseGoType = InlineTypeMapper.mapTypeSpecType(property.type);
        switch (strategy) {
            case OptionalHandlingStrategy.Pointer:
                return this.createPointerField(property, baseGoType);
            case OptionalHandlingStrategy.DefaultValue:
                return this.createDefaultField(property, baseGoType);
            case OptionalHandlingStrategy.NullObject:
                return this.createNullObjectField(property, baseGoType);
            case OptionalHandlingStrategy.Validation:
                return this.createValidationField(property, baseGoType);
            default:
                // Use direct type check instead of type assertion
                throw new Error(`Unsupported optional strategy: ${strategy}`);
        }
    }
    /**
     * Determine optimal strategy for optional handling
     * NO SPLIT BRAIN - strategic decision point
     */
    static determineStrategy(type) {
        // Non-optional fields get required handling
        if (!type) {
            return OptionalHandlingStrategy.Validation; // Use validation for required
        }
        // Get type-mapper's recommendation
        const mapping = InlineTypeMapper.mapTypeSpecType(type);
        // If type mapper recommends pointer, use pointer strategy
        if (mapping.usePointerForOptional) {
            return OptionalHandlingStrategy.Pointer;
        }
        // For complex types, use validation strategy
        const complexTypes = ["Array", "Model", "Union", "Enum"];
        const isComplexType = complexTypes.includes(type.kind);
        if (isComplexType) {
            return OptionalHandlingStrategy.Validation;
        }
        // Default to pointer strategy for primitives
        return OptionalHandlingStrategy.Pointer;
    }
    /**
     * Create required field (non-optional)
     */
    static createRequiredField(property) {
        const goName = this.capitalizeFieldName(property.name);
        const baseGoType = InlineTypeMapper.mapTypeSpecType(property.type);
        const jsonTag = `json:"${property.name}"`;
        return {
            name: goName,
            type: baseGoType.goType,
            jsonTag,
            documentation: property.documentation
        };
    }
    /**
     * Create pointer field for optional properties
     * NO SPLIT BRAIN - pointer + JSON handled together
     */
    static createPointerField(property, baseType) {
        const goName = this.capitalizeFieldName(property.name);
        const pointerType = `*${baseType.goType}`;
        const jsonTag = `json:"${property.name},omitempty"`;
        return {
            name: goName,
            type: pointerType,
            jsonTag,
            documentation: property.documentation
        };
    }
    /**
     * Create default value field for optional properties
     */
    static createDefaultField(property, baseType) {
        const goName = this.capitalizeFieldName(property.name);
        const jsonTag = `json:"${property.name},omitempty"`;
        // Add default value based on type
        const defaultValue = this.getDefaultValue(baseType.goType);
        const fieldWithDefault = `${goName} ${baseType.goType} = ${defaultValue}`;
        return {
            name: goName,
            type: fieldWithDefault,
            jsonTag,
            documentation: property.documentation
        };
    }
    /**
     * Create null object field for optional properties
     */
    static createNullObjectField(property, baseType) {
        const goName = this.capitalizeFieldName(property.name);
        const jsonTag = `json:"${property.name},omitempty"`;
        return {
            name: goName,
            type: baseType.goType,
            jsonTag,
            documentation: property.documentation
        };
    }
    /**
     * Create validation field for optional properties
     */
    static createValidationField(property, baseType) {
        const goName = this.capitalizeFieldName(property.name);
        const jsonTag = `json:"${property.name},omitempty"`;
        const validationRules = InlineTypeMapper.generateValidationRules(property.type);
        return {
            name: goName,
            type: baseType.goType,
            jsonTag,
            validation: validationRules,
            documentation: property.documentation
        };
    }
    /**
     * Capitalize field name for Go naming conventions
     */
    static capitalizeFieldName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    /**
     * Get default value based on Go type
     */
    static getDefaultValue(goType) {
        switch (goType) {
            case "string":
                return '""';
            case "bool":
                return "false";
            case "int8":
            case "int16":
            case "int32":
            case "int64":
            case "uint8":
            case "uint16":
            case "uint32":
            case "uint64":
                return "0";
            case "float32":
            case "float64":
                return "0.0";
            default:
                return 'nil'; // For slices, maps, etc.
        }
    }
}
