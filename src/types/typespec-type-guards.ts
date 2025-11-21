/**
 * Type Guard System for TypeSpec Types
 * 
 * This file provides comprehensive type guards for all TypeSpec types.
 * Using these guards eliminates the need for 'as any' casts throughout the codebase.
 */

import type {
  Type,
  Model,
  Scalar,
  Union,
  Enum,
  Namespace,
  Program,
  Operation,
  Interface,
  UnionVariant,
} from "@typespec/compiler";

/**
 * TypeGuard: Model Type
 * 
 * Determines if a Type is a Model type with proper type safety.
 */
export function isModelType(type: Type): type is Model {
  return type.kind === "Model";
}

/**
 * TypeGuard: Scalar Type
 * 
 * Determines if a Type is a Scalar type with proper type safety.
 */
export function isScalarType(type: Type): type is Scalar {
  return type.kind === "Scalar";
}

/**
 * TypeGuard: Union Type
 * 
 * Determines if a Type is a Union type with proper type safety.
 */
export function isUnionType(type: Type): type is Union {
  return type.kind === "Union";
}

/**
 * TypeGuard: Enum Type
 * 
 * Determines if a Type is an Enum type with proper type safety.
 */
export function isEnumType(type: Type): type is Enum {
  return type.kind === "Enum";
}

/**
 * TypeGuard: Interface Type
 * 
 * Determines if a Type is an Interface type with proper type safety.
 */
export function isInterfaceType(type: Type): type is Interface {
  return type.kind === "Interface";
}

/**
 * TypeGuard: Array Type
 * 
 * Determines if a Model represents an array type (like string[]).
 * TypeSpec creates Model types for arrays with indexer properties.
 */
export function isArrayModel(model: Model): boolean {
  return model.name === "Array" && !!model.indexer?.value;
}

/**
 * TypeGuard: Template Model
 * 
 * Determines if a Model is a template model with type parameters.
 * Note: TypeSpec models may have template property, but it's not in core type
 */
export function isTemplateModel(model: Model): boolean {
  return "template" in model && !!(model as any).template;
}

/**
 * TypeGuard: Union Variant
 * 
 * Determines if an object is a union variant.
 */
export function isUnionVariant(variant: unknown): variant is UnionVariant {
  return typeof variant === "object" && variant !== null && "type" in variant;
}

/**
 * TypeGuard: Named Type
 * 
 * Determines if a type has a name property.
 */
export function isNamedType(type: Type): type is Type & { name: string } {
  return "name" in type && typeof (type as any).name === "string";
}

/**
 * TypeGuard: Type with Indexer
 * 
 * Determines if a Model has an indexer (for arrays, dictionaries).
 */
export function hasIndexer(model: Model): model is Model & { indexer: { value: Type } } {
  return !!model.indexer && "value" in model.indexer;
}

/**
 * TypeGuard: Operation with Parameters
 * 
 * Determines if an Operation has parameters.
 */
export function hasParameters(operation: Operation): operation is Operation & { parameters: any[] } {
  return "parameters" in operation && Array.isArray((operation as any).parameters);
}

/**
 * TypeGuard: Operation with Return Type
 * 
 * Determines if an Operation has a return type.
 */
export function hasReturnType(operation: Operation): operation is Operation & { returnType: Type } {
  return "returnType" in operation && !!operation.returnType;
}

/**
 * TypeGuard: Model with Properties
 * 
 * Determines if a Model has properties.
 */
export function hasProperties(model: Model): model is Model & { properties: Map<string, any> } {
  return !!model.properties && model.properties instanceof Map;
}

/**
 * TypeGuard: Model with Extends
 * 
 * Determines if a Model has inheritance (extends).
 */
export function hasExtends(model: Model): model is Model & { extends: Model | Model[] } {
  return "extends" in model && !!model.extends;
}

/**
 * TypeGuard: Enum with Members
 * 
 * Determines if an Enum has members.
 */
export function hasMembers(enumType: Enum): enumType is Enum & { members: any[] } {
  return "members" in enumType && Array.isArray((enumType as any).members);
}

/**
 * TypeGuard: Scalar with Name
 * 
 * Safely gets scalar name with fallback.
 */
export function getScalarName(scalar: Scalar): string {
  return scalar.name || "unknown";
}

/**
 * TypeGuard: Model Name
 * 
 * Safely gets model name with fallback.
 */
export function getModelName(model: Model): string {
  return model.name || "UnknownModel";
}

/**
 * TypeGuard: Union Name
 * 
 * Safely gets union name with fallback.
 */
export function getUnionName(union: Union): string {
  return union.name || "Union";
}

/**
 * TypeGuard: Enum Name
 * 
 * Safely gets enum name with fallback.
 */
export function getEnumName(enumType: Enum): string {
  return enumType.name || "Enum";
}

/**
 * TypeGuard: Template Parameters
 * 
 * Safely gets template parameters with fallback.
 */
export function getTemplateParameters(model: Model): string {
  if (!isTemplateModel(model)) return "";
  return ((model as any).template as string) || "T";
}

/**
 * TypeGuard: Array Element Type
 * 
 * Safely extracts element type from array model.
 */
export function getArrayElementType(model: Model): Type | undefined {
  if (!hasIndexer(model)) return undefined;
  return model.indexer.value;
}

/**
 * TypeGuard: Union Variants
 * 
 * Safely extracts union variants.
 */
export function getUnionVariants(union: Union): Array<{ type: Type }> | undefined {
  return (union as any).variants || [];
}

/**
 * TypeGuard: Model Properties
 * 
 * Safely extracts model properties.
 */
export function getModelProperties(model: Model): Map<string, any> {
  return model.properties || new Map();
}

/**
 * TypeGuard: Optional Property
 * 
 * Determines if a property is optional.
 */
export function isOptionalProperty(property: any): boolean {
  return property.optional === true;
}

/**
 * TypeGuard: Property Type
 * 
 * Safely extracts property type.
 */
export function getPropertyType(property: any): Type {
  return property.type;
}

/**
 * TypeGuard: Property Name
 * 
 * Safely extracts property name.
 */
export function getPropertyName(property: any): string {
  return property.name || "unknown";
}

/**
 * Safe TypeSpec Type Mapping
 * 
 * Provides safe access to TypeSpec type properties without 'as any'.
 */
export class TypeSpecTypeSafeAccess {
  /**
   * Get type name safely
   */
  static getTypeName(type: Type): string {
    if (isNamedType(type)) {
      return type.name;
    }
    
    if (isScalarType(type)) {
      return getScalarName(type);
    }
    
    if (isModelType(type)) {
      return getModelName(type);
    }
    
    if (isUnionType(type)) {
      return getUnionName(type);
    }
    
    if (isEnumType(type)) {
      return getEnumName(type);
    }
    
    return "unknown";
  }

  /**
   * Get type kind safely
   */
  static getTypeKind(type: Type): string {
    return type.kind;
  }

  /**
   * Check if type is builtin scalar
   */
  static isBuiltinScalar(type: Type): boolean {
    if (!isScalarType(type)) return false;
    
    const builtinScalars = [
      "string", "boolean", "int8", "int16", "int32", "int64",
      "uint8", "uint16", "uint32", "uint64", "float32", "float64",
      "bytes", "plainDate", "plainTime", "utcDateTime", "offsetDateTime",
      "duration", "url", "null"
    ];
    
    return builtinScalars.includes(getScalarName(type).toLowerCase());
  }

  /**
   * Get scalar type name safely
   */
  static getScalarTypeName(type: Type): string {
    if (!isScalarType(type)) return "unknown";
    return getScalarName(type);
  }
}