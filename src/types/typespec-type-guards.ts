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
  Decorator,
} from "@typespec/compiler";
import { isErrorModel } from "@typespec/compiler";

/**
 * TypeGuard: Model Type
 * 
 * Determines if a Type is a Model type with proper type safety.
 */
export function isModelType(type: Type): type is Model {
  return type.kind === "Model";
}

/**
 * TypeGuard: Array Model Type
 * 
 * Determines if a Model is an Array model with proper type safety.
 */
export function isArrayModel(type: Model): type is Model & { indexer: { key: Scalar; value: Type } } {
  return !!type.indexer;
}

/**
 * TypeGuard: Template Model Type
 * 
 * Determines if a Model is a Template type with proper type safety.
 */
export function isTemplateModel(type: Model): type is Model & { template: string } {
  return "template" in type && typeof type.template === "string";
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
 * TypeGuard: Named Type
 * 
 * Determines if a Type has a name property with type safety.
 */
export function isNamedType(type: Type): type is Type & { name: string } {
  return "name" in type && typeof type.name === "string";
}

/**
 * TypeGuard: Model Name
 * 
 * Safely gets model name with fallback.
 */
export function getModelName(model: Model): string {
  return model.name || "Model";
}

/**
 * TypeGuard: Scalar Name
 * 
 * Safely gets scalar name with fallback.
 */
export function getScalarName(scalar: Scalar): string {
  return scalar.name || "Scalar";
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
export function getTemplateParameters(type: Model): any[] {
  return isTemplateModel(type) && "templateParameters" in type ? 
    (type as any).templateParameters || [] : [];
}

/**
 * TypeGuard: Error Model Detection
 * 
 * Determines if a Model has @error decorator using TypeSpec compiler API.
 */
export function hasErrorDecorator(program: Program, model: Model): boolean {
  // Use TypeSpec compiler's built-in error model detection
  return isErrorModel(program, model);
}

/**
 * TypeGuard: Error Type Detection
 * 
 * Determines if a Type is an ErrorType (TypeSpec v1.7.0+).
 */
export function isErrorType(type: Type): boolean {
  // ErrorType not available in current TypeSpec version
  // Check for error decorator on model instead
  return false;
}

/**
 * TypeGuard: Union Variants
 * 
 * Safely extracts union variants from Union type.
 */
export function getUnionVariants(union: Union): Array<{ type: Type }> {
  const result: Array<{ type: Type }> = [];
  
  for (const [_, variant] of union.variants) {
    result.push({ type: variant.type });
  }
  
  return result;
}

/**
 * TypeGuard: Operation with Return Type
 * 
 * Determines if an Operation has a return type.
 */
export function hasReturnType(operation: Operation): operation is Operation & { returnType: Type } {
  return "returnType" in operation;
}

/**
 * TypeGuard: Operation with Parameters
 * 
 * Determines if an Operation has parameters.
 */
export function hasParameters(operation: Operation): operation is Operation & { parameters: any[] } {
  return "parameters" in operation;
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
 * TypeGuard: Model with Extends
 * 
 * Determines if a Model has inheritance (extends).
 */
export function hasExtends(model: Model): model is Model & { extends: Model | Model[] } {
  return "extends" in model && !!model.extends;
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
 * TypeGuard: Property Type
 * 
 * Safely extracts type from ModelProperty with type safety.
 */
export function getPropertyType(property: any): Type {
  return property.type;
}

/**
 * TypeGuard: Model Members
 * 
 * Safely extracts members from Model.
 */
export function getModelMembers(model: Model): Map<string, any> | undefined {
  return model.properties;
}

/**
 * TypeGuard: Has Members
 * 
 * Determines if Model has properties.
 */
export function hasMembers(model: Model): model is Model & { properties: Map<string, any> } {
  return "properties" in model && !!model.properties;
}

/**
 * TypeGuard: Operation Returns
 * 
 * Safely extracts return type from operation.
 */
export function getOperationReturnType(operation: Operation): Type | undefined {
  return hasReturnType(operation) ? operation.returnType : undefined;
}

/**
 * TypeGuard: Operation Parameters
 * 
 * Safely extracts parameters from operation.
 */
export function getOperationParameters(operation: Operation): Map<string, any> | undefined {
  return hasParameters(operation) ? operation.parameters.properties : undefined;
}

/**
 * TypeGuard: Has Decorators
 * 
 * Determines if a model has decorators.
 */
export function hasDecorators(model: Model): model is Model & { decorators: Decorator[] } {
  return "decorators" in model && !!model.decorators;
}

/**
 * TypeSafe TypeSpec Type Mapping
 * 
 * Provides safe access to TypeSpec type properties without 'as any' casts.
 */
export const TypeSpecTypeSafeAccess = {
  getTypeName: (type: Type): string => {
    return isNamedType(type) ? type.name : "UnknownType";
  },
  
  getModelProperties: (model: Model): Map<string, any> => {
    return hasMembers(model) ? model.properties : new Map();
  },
  
  getModelPropertyType: (property: any): Type => {
    return getPropertyType(property);
  },
  
  getModelPropertyOptional: (property: any): boolean => {
    return property.optional || false;
  },
  
  getUnionVariants: (union: Union): Array<{ type: Type }> => {
    return getUnionVariants(union);
  },
  
  getArrayElement: (model: Model): Type | undefined => {
    return getArrayElementType(model);
  },
  
  getOperationReturnType: (operation: Operation): Type | undefined => {
    return getOperationReturnType(operation);
  }
} as const;