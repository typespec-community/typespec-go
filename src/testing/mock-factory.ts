import type {
  Model,
  Type,
  Operation,
  Namespace,
  Scalar,
  Program,
  EmitContext,
  ModelProperty,
  FunctionValue,
  Enum,
  EnumMember,
  Union,
  UnionVariant,
} from "@typespec/compiler";

/**
 * Minimal PerfReporter interface for test mocking
 * (Not exported from @typespec/compiler)
 */
interface MockPerfReporter {
  startTimer(label: string): Timer;
  time<T>(label: string, callback: () => T): T;
  timeAsync<T>(label: string, callback: () => Promise<T>): Promise<T>;
  report(label: string, duration: number): void;
  getDuration(label: string): number;
  toJSON(): Record<string, unknown>;
}

interface Timer {
  end(): number;
}

/**
 * Mock ModelProperty interface for test purposes
 */
interface MockModelProperty {
  name: string;
  type: Type;
  optional: boolean;
  kind: string;
  entityKind: string;
  isFinished: boolean;
  decorators: unknown[];
}

/**
 * Type-safe property map interface for TypeSpec models
 */
interface MockPropertiesMap {
  set(key: string, value: MockModelProperty): void;
  has(key: string): boolean;
  get(key: string): MockModelProperty | undefined;
  rekey?: () => void;
}

/**
 * Type-safe tracer interface for TypeSpec program
 */
interface MockTracer {
  enabled: boolean;
  track: (name: string, fn: () => void) => void;
  span: (name: string) => { finish: () => void };
}

/**
 * Type-safe compiler options interface
 */
interface MockCompilerOptions {
  outputDir: string;
  [key: string]: unknown;
}

/**
 * Type-safe state set interface
 */
interface MockStateSet {
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  has(key: string): boolean;
}

/**
 * Type-safe resolved type interface
 */
interface MockResolvedType {
  type: Type;
  node: unknown;
}

/**
 * Factory for creating TypeSpec compiler mocks to test the emitter
 * without requiring full compiler infrastructure.
 */
/**
 * Create a properties map from a record of properties
 * ELIMINATES DUPLICATION: Shared logic for properties map creation
 */
function createPropertiesMap(properties: Record<string, Type>): MockPropertiesMap {
  const propsMap = new Map() as MockPropertiesMap;

  Object.entries(properties).forEach(([propName, propType]) => {
    propsMap.set(propName, {
      name: propName,
      type: propType,
      optional: false,
      kind: "ModelProperty",
      entityKind: "ModelProperty",
      isFinished: true,
      decorators: [],
    } as MockModelProperty);
  });

  return propsMap;
}

/**
 * Create a mock Scalar type
 */
export function createScalar(name: string): Scalar {
  return {
    kind: "Scalar",
    name,
  } as Scalar;
}

/**
 * Create a mock Model type
 */
export function createModel(name: string, properties: Record<string, Type> = {}): Model {
  const propsMap = createPropertiesMap(properties);

  return {
    kind: "Model",
    name,
    properties: propsMap as unknown as Map<string, ModelProperty>,
    derivedModels: [],
    sourceModels: [],
    entityKind: "Type" as const,
    isFinished: true,
    decorators: [],
  } as unknown as Model;
}

/**
 * Create a mock Model with typed property descriptors (supports optional and nested types)
 */
export function createModelWithProps(
  name: string,
  properties: Array<{ name: string; type: Type; optional?: boolean }>,
): Model {
  const propsMap = new Map<string, ModelProperty>();

  properties.forEach((prop) => {
    propsMap.set(prop.name, {
      kind: "ModelProperty",
      name: prop.name,
      type: prop.type,
      optional: prop.optional ?? false,
      decorators: [],
    } as unknown as ModelProperty);
  });

  return {
    kind: "Model",
    name,
    properties: propsMap,
    derivedModels: [],
    sourceModels: [],
    entityKind: "Type" as const,
    isFinished: true,
    decorators: [],
  } as unknown as Model;
}

/**
 * Create a mock Enum with typed members
 */
export function createEnum(
  name: string,
  members: Array<{ name: string; value: string | number }>,
): Enum {
  const membersMap = new Map<string, EnumMember>();

  members.forEach((member) => {
    membersMap.set(member.name, {
      kind: "EnumMember",
      name: member.name,
      value: member.value,
      entityKind: "Type" as const,
      isFinished: true,
      decorators: [],
    } as unknown as EnumMember);
  });

  return {
    kind: "Enum",
    name,
    members: membersMap,
    entityKind: "Type" as const,
    isFinished: true,
    decorators: [],
  } as unknown as Enum;
}

/**
 * Create a mock string literal type (union variant of strings)
 */
export function createStringLiteral(value: string): Type {
  return {
    kind: "String",
    value,
    entityKind: "Type" as const,
    isFinished: true,
  } as unknown as Type;
}

/**
 * Create a mock Union with typed variants
 */
export function createUnion(name: string, variants: Array<{ name: string; type: Type }>): Union {
  const variantsMap = new Map<string, UnionVariant>();

  variants.forEach((variant) => {
    variantsMap.set(variant.name, {
      kind: "UnionVariant",
      name: variant.name,
      type: variant.type,
      entityKind: "Type" as const,
      isFinished: true,
      decorators: [],
    } as unknown as UnionVariant);
  });

  return {
    kind: "Union",
    name,
    variants: variantsMap,
    expression: false,
    entityKind: "Type" as const,
    isFinished: true,
    decorators: [],
  } as unknown as Union;
}

/**
 * Create a mock Program with minimal required interface for emitter
 */
export function createProgram(models: Record<string, Model> = {}): Program {
  // Create models map
  const modelsMap = new Map<string, Model>(Object.entries(models));

  // Create mock namespace
  const mockNamespace = {
    models: modelsMap,
    namespaces: new Map(),
    enums: new Map(),
    unions: new Map(),
    operations: new Map(),
  };

  const stateMaps = new Map<symbol, Map<unknown, unknown>>();

  return {
    getGlobalNamespaceType: () => mockNamespace as unknown as Namespace,
    checker: {
      getTypeName: () => "string",
      isString: (type: Type) => type.kind === "Scalar" && type.name === "string",
      isStdType: () => false,
    },
    sourceFiles: new Map(),
    jsSourceFiles: new Map(),
    tracer: {} as MockTracer,
    trace: () => {},
    emitters: new Map(),
    hasError: () => false,
    diagnostics: [],
    host: {
      mkdirp: async () => {},
      writeFile: async () => {},
      readUrl: async () => ({ text: "" }),
      readFile: async () => ({ text: "" }),
      rm: async () => {},
      stat: async () => ({ isDirectory: () => false, isFile: () => true }),
      realpath: async (path: string) => path,
    },
    compilerOptions: { outputDir: "./test-output" } as MockCompilerOptions,
    stateSet: {} as MockStateSet,
    stateMap: (key: symbol): Map<unknown, unknown> => {
      const existing = stateMaps.get(key);
      if (existing) return existing;
      const created = new Map<unknown, unknown>();
      stateMaps.set(key, created);
      return created;
    },
    reportDiagnostics: () => {},
    resolveTypeReference: () => ({}) as MockResolvedType,
    resolveType: () => ({}) as MockResolvedType,
  } as unknown as Program;
}

/**
 * Create a mock Operation with complete required properties
 */
export function createOperation(
  name: string,
  options: {
    returnType?: Type;
    parameters?: Record<string, Type>;
  } = {},
): Operation {
  const propsMap = createPropertiesMap(options.parameters || {});

  return {
    name,
    kind: "Operation",
    parameters: {
      properties: propsMap as unknown as Map<string, ModelProperty>,
      kind: "Model",
      name: "parameters",
      derivedModels: [],
      sourceModels: [],
      entityKind: "Type" as const,
      isFinished: true,
      decorators: [],
    } as unknown as Model,
    returnType: options.returnType,
    entityKind: "Type" as const,
    isFinished: true,
    decorators: [],
  } as unknown as Operation;
}

/**
 * Create a mock Namespace with complete required properties
 */
export function createNamespace(
  name: string,
  options: {
    operations?: Record<string, Operation>;
    models?: Record<string, Model>;
    enums?: Record<string, Enum>;
    unions?: Record<string, Union>;
  } = {},
): Namespace {
  const opsMap = new Map<string, Operation>();
  const modelsMap = new Map<string, Model>();
  const enumsMap = new Map<string, Enum>();
  const unionsMap = new Map<string, Union>();

  if (options.operations) {
    Object.entries(options.operations).forEach(([opName, operation]) => {
      opsMap.set(opName, operation);
    });
  }

  if (options.models) {
    Object.entries(options.models).forEach(([modelName, model]) => {
      modelsMap.set(modelName, model);
    });
  }

  if (options.enums) {
    Object.entries(options.enums).forEach(([enumName, enumType]) => {
      enumsMap.set(enumName, enumType);
    });
  }

  if (options.unions) {
    Object.entries(options.unions).forEach(([unionName, unionType]) => {
      unionsMap.set(unionName, unionType);
    });
  }

  return {
    kind: "Namespace",
    name,
    operations: opsMap,
    models: modelsMap,
    scalars: new Map(),
    enums: enumsMap,
    unions: unionsMap,
    interfaces: new Map(),
    strings: new Map(),
    templates: new Map(),
    decorators: [],
    entityKind: "Type" as const, // Type-safe entity kind
    isFinished: true,
    namespaces: new Map(),
    decoratorDeclarations: new Map(),
    functionDeclarations: new Map<string, FunctionValue>(),
  } as Namespace;
}

/**
 * Create a mock EmitContext
 */
export function createEmitContext(program?: Program): EmitContext {
  const prog = program || createProgram();

  // Minimal mock PerfReporter; non-generic arrows (contextual typing from
  // MockPerfReporter) because the babel-8 parser under `alloy build` reads
  // expression-position `<T>` in a .ts file as JSX.
  const mockPerf: MockPerfReporter = {
    startTimer: () => ({ end: () => 0 }),
    time: (_, fn) => fn(),
    timeAsync: (_, fn) => fn(),
    report: () => {},
    getDuration: () => 0,
    toJSON: () => ({}),
  };

  return {
    program: prog,
    emitterOutputDir: "./test-output",
    options: {},
    perf: mockPerf,
    getAssetEmitter: () => ({
      writeOutput: async () => {},
      getProgram: () => prog,
    }),
  } as EmitContext;
}
