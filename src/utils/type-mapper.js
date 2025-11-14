/**
 * Go Type Mapping Utilities
 *
 * Centralized TypeSpec to Go type conversion with no more 'any'
 * Type-safe, focused, minimal over-engineering
 *
 * @fileoverview TypeSpec → Go type mapping
 */
import { isArrayModelType } from "@typespec/compiler";
/**
 * TypeSpec to Go type mapper
 *
 * Handles conversion of TypeSpec scalar types to Go types
 * with proper import management and type safety
 */
export class GoTypeMapper {
    /**
     * Map TypeSpec type to Go type
     */
    static mapTypeSpecType(typeSpecType, program) {
        switch (typeSpecType.kind) {
            case "Scalar":
                return this.mapScalar(typeSpecType);
            case "Model":
                // Check if it's an array model
                if (program && isArrayModelType(program, typeSpecType)) {
                    return this.mapArray(typeSpecType);
                }
                return this.mapModel(typeSpecType);
            case "Enum":
                return this.mapEnum(typeSpecType);
            case "Union":
                return this.mapUnion(typeSpecType);
            default:
                return this.createFallbackType(typeSpecType);
        }
    }
    /**
     * Map TypeSpec scalar to Go type
     */
    static mapScalar(scalar) {
        const mapped = this.TYPE_MAP[scalar.name];
        if (mapped) {
            return Object.assign({ kind: "basic" }, mapped);
        }
        // Handle unknown scalars
        return this.createFallbackType(scalar);
    }
    /**
     * Map TypeSpec model to Go type (struct name)
     */
    static mapModel(model) {
        const modelName = String(model.name);
        return {
            kind: "struct",
            name: this.toPascalCase(modelName),
            requiresImport: false,
            usePointerForOptional: true,
        };
    }
    /**
     * Map TypeSpec enum to Go type
     */
    static mapEnum(enumType) {
        const enumName = String(enumType.name);
        return {
            kind: "enum",
            name: this.toPascalCase(enumName),
            requiresImport: false,
            usePointerForOptional: false,
        };
    }
    /**
     * Map TypeSpec union to Go interface
     */
    static mapUnion(unionType) {
        const unionName = String(unionType.name);
        return {
            kind: "union",
            name: this.toPascalCase(unionName),
            requiresImport: false,
            usePointerForOptional: false,
        };
    }
    /**
     * Map TypeSpec array to Go slice
     */
    static mapArray(arrayType) {
        const elementType = this.mapTypeSpecType(arrayType.indexer.value);
        return {
            kind: "slice",
            elementType,
            requiresImport: false,
            usePointerForOptional: false,
        };
    }
    /**
     * Create fallback type for unknown TypeSpec types
     * No more interface{} fallbacks - we throw errors for unknown types
     */
    static createFallbackType(unknownType) {
        const typeName = "name" in unknownType ? String(unknownType.name) : "unknown";
        const kind = unknownType.kind || "undefined";
        throw new TypeError(`Unsupported TypeSpec type '${typeName}' (${kind}). Supported types: Scalar, Model, Enum, Union, Array.`);
    }
    /**
     * Generate Go type string from MappedGoType
     */
    static generateGoTypeString(type) {
        switch (type.kind) {
            case "basic":
                return type.name || "interface{}";
            case "pointer":
                if (!type.baseType) {
                    return "interface{}";
                }
                return `*${this.generateGoTypeString(type.baseType)}`;
            case "slice":
                if (!type.elementType) {
                    return "[]interface{}";
                }
                return `[]${this.generateGoTypeString(type.elementType)}`;
            case "struct":
            case "enum":
            case "union":
                return type.name || "interface{}";
            case "array":
                if (!type.elementType) {
                    return "[0]interface{}";
                }
                return `[0]${this.generateGoTypeString(type.elementType)}`;
            default:
                return "interface{}";
        }
    }
    /**
     * Convert string to PascalCase (TypeSpec model name → Go struct name)
     */
    static toPascalCase(str) {
        return str
            .replace(/(?:^|[_-])([a-z])/g, (_, c) => c.toUpperCase())
            .replace(/([a-z])([A-Z])/g, (_, c1, c2) => `${c1}${c2.toLowerCase()}`);
    }
    /**
     * Get all imports needed for a set of mapped types
     */
    static getImportsForTypes(types) {
        const imports = new Map();
        const collectImports = (type) => {
            if (type.requiresImport && type.importPath) {
                if (!imports.has(type.importPath)) {
                    imports.set(type.importPath, type.importPath);
                }
            }
            // Recursively collect from base/element types
            if (type.baseType) {
                collectImports(type.baseType);
            }
            if (type.elementType) {
                collectImports(type.elementType);
            }
        };
        for (const type of types) {
            collectImports(type);
        }
        return imports;
    }
}
GoTypeMapper.TYPE_MAP = {
    // Integer types
    "int8": { name: "int8", requiresImport: false, usePointerForOptional: true },
    "int16": { name: "int16", requiresImport: false, usePointerForOptional: true },
    "int32": { name: "int32", requiresImport: false, usePointerForOptional: true },
    "int64": { name: "int64", requiresImport: false, usePointerForOptional: true },
    // Unsigned integer types  
    "uint8": { name: "uint8", requiresImport: false, usePointerForOptional: true },
    "uint16": { name: "uint16", requiresImport: false, usePointerForOptional: true },
    "uint32": { name: "uint32", requiresImport: false, usePointerForOptional: true },
    "uint64": { name: "uint64", requiresImport: false, usePointerForOptional: true },
    // Floating point types
    "float32": { name: "float32", requiresImport: false, usePointerForOptional: true },
    "float64": { name: "float64", requiresImport: false, usePointerForOptional: true },
    // Other built-in types
    "string": { name: "string", requiresImport: false, usePointerForOptional: true },
    "boolean": { name: "bool", requiresImport: false, usePointerForOptional: true },
    "bytes": { name: "[]byte", requiresImport: false, usePointerForOptional: true },
    "plainDate": { name: "string", requiresImport: false, usePointerForOptional: true },
    "plainTime": { name: "string", requiresImport: false, usePointerForOptional: true },
    "url": { name: "string", requiresImport: false, usePointerForOptional: true },
    // Time package types
    "utcDateTime": {
        name: "time.Time",
        requiresImport: true,
        importPath: "time",
        usePointerForOptional: true
    },
    "offsetDateTime": {
        name: "time.Time",
        requiresImport: true,
        importPath: "time",
        usePointerForOptional: true
    },
    "duration": {
        name: "time.Duration",
        requiresImport: true,
        importPath: "time",
        usePointerForOptional: true
    },
};
