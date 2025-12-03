/**
 * TypeSpec Testing Utilities
 * Mock TypeSpec types and programs for testing
 */

import type {
  Program,
  Type,
  Model,
  Enum,
  Union,
  Namespace,
  Operation,
  ModelProperty,
  EnumMember,
  UnionVariant,
} from "@typespec/compiler";

/**
 * Mock namespace for testing
 */
interface MockNamespace {
  name: string;
}

/**
 * Create a mock TypeSpec program for testing
 */
export function createMockProgram(): Program {
  return {
    // Minimal program mock - extend as needed
  } as Program;
}

/**
 * Create a mock TypeSpec scalar type
 */
export function createMockScalar(name: string): Type {
  return {
    kind: "Scalar",
    name,
  } as Type;
}

/**
 * Create a mock TypeSpec property
 */
export function createMockProperty(
  name: string,
  type: Type,
  optional: boolean = false,
): ModelProperty {
  return {
    name,
    type,
    optional,
    kind: "ModelProperty",
    entityKind: "Type",
    isFinished: true,
    decorators: [],
  } as ModelProperty;
}

/**
 * Create a mock TypeSpec model
 */
export function createMockModel(name: string, properties: [string, Type, boolean?][]): Model {
  const propMap = new Map<string, ModelProperty>();

  properties.forEach(([propName, propType, optional = false]) => {
    propMap.set(propName, createMockProperty(propName, propType, optional));
  });

  return {
    kind: "Model",
    name,
    properties: propMap,
    namespace: { name: "TestNamespace" },
  } as unknown as Model;
}

/**
 * Create a mock TypeSpec enum
 */
export function createMockEnum(name: string, members: string[]): Enum {
  const memberMap = new Map<string, EnumMember>();

  const mockEnum: Enum = {
    kind: "Enum",
    name,
    members: memberMap,
    namespace: { name: "TestNamespace" } as MockNamespace,
  } as unknown as Enum;

  members.forEach((memberName) => {
    memberMap.set(memberName, {
      name: memberName,
      value: memberName,
      kind: "EnumMember",
      entityKind: "Type",
      isFinished: true,
      decorators: [],
      enum: mockEnum,
    } as unknown as EnumMember);
  });

  return {
    kind: "Enum",
    name,
    members: memberMap,
    namespace: { name: "TestNamespace" },
  } as unknown as Enum;
}

/**
 * Create a mock TypeSpec union
 */
export function createMockUnion(name: string, variants: string[]): Union {
  const variantMap = new Map<string, UnionVariant>();

  const mockUnion: Union = {
    kind: "Union",
    name,
    variants: variantMap,
    namespace: { name: "TestNamespace" } as MockNamespace,
  } as unknown as Union;

  variants.forEach((variantName) => {
    const variantModel = {
      kind: "Model",
      name: variantName,
      properties: new Map() as Map<string, ModelProperty>,
      derivedModels: [],
      sourceModels: [],
      entityKind: "Type",
      isFinished: true,
      decorators: [],
    } as unknown as Type;

    variantMap.set(variantName, {
      name: variantName,
      type: variantModel,
      kind: "UnionVariant",
      entityKind: "Type",
      isFinished: true,
      decorators: [],
      union: mockUnion,
    } as unknown as UnionVariant);
  });

  return {
    kind: "Union",
    name,
    variants: variantMap,
    namespace: { name: "TestNamespace" },
  } as unknown as Union;
}

/**
 * Create a mock TypeSpec operation
 */
export function createMockOperation(
  name: string,
  parameters: [string, Type, boolean?][] = [],
  returnType?: Type,
): Operation {
  const paramMap = new Map<string, ModelProperty>();

  parameters.forEach(([paramName, paramType, optional = false]) => {
    paramMap.set(paramName, createMockProperty(paramName, paramType, optional));
  });

  return {
    name,
    kind: "Operation",
    parameters: {
      properties: paramMap,
    },
    returnType: returnType || createMockScalar("void"),
    namespace: { name: "TestNamespace" },
  } as unknown as Operation;
}

/**
 * Create a mock TypeSpec namespace
 */
export function createMockNamespace(
  name: string,
  models: Model[] = [],
  enums: Enum[] = [],
  unions: Union[] = [],
  operations: Operation[] = [],
): Namespace {
  const modelMap = new Map<string, Model>();
  const enumMap = new Map<string, Enum>();
  const unionMap = new Map<string, Union>();
  const operationMap = new Map<string, Operation>();

  models.forEach((model) => modelMap.set(model.name, model));
  enums.forEach((enumType) => enumMap.set(enumType.name, enumType));
  unions.forEach((union) => unionMap.set(union.name || "Anonymous", union));
  operations.forEach((op) => operationMap.set(op.name, op));

  return {
    name,
    kind: "Namespace",
    models: modelMap,
    enums: enumMap,
    unions: unionMap,
    operations: operationMap,
    namespaces: new Map<string, Namespace>(),
  } as unknown as Namespace;
}
