import type {
  Model,
  Type,
  Operation,
  Namespace,
  Scalar,
  Program,
  EmitContext,
} from "@typespec/compiler";

/**
 * Factory for creating TypeSpec compiler mocks to test the emitter
 * without requiring the full compiler infrastructure.
 */
export class MockFactory {
  /**
   * Create a properties map from a record of properties
   * ELIMINATES DUPLICATION: Shared logic for properties map creation
   */
  private static createPropertiesMap(properties: Record<string, Type>) {
    const propsMap = new Map() as {
      set(key: string, value: any): void;
      has(key: string): boolean;
      get(key: string): any;
      rekey?: () => void;
    };

    Object.entries(properties).forEach(([propName, propType]) => {
      propsMap.set(propName, {
        name: propName,
        type: propType,
        optional: false,
      });
    });

    return propsMap;
  }
  /**
   * Create a mock Scalar type
   */
  static createScalar(name: string): Scalar {
    return {
      kind: "Scalar",
      name,
    } as Scalar;
  }

  /**
   * Create a mock Model type
   */
  static createModel(name: string, properties: Record<string, Type> = {}): Model {
    const propsMap = this.createPropertiesMap(properties);

    return {
      kind: "Model",
      name,
      properties: propsMap as any,
      derivedModels: [],
      sourceModels: [],
      entityKind: "Type" as any,
      isFinished: true,
      decorators: [],
    } as unknown as Model;
  }

  /**
   * Create a mock Program with minimal required interface for the emitter
   */
  static createProgram(models: Record<string, Model> = {}): Program {
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

    return {
      getGlobalNamespaceType: () => mockNamespace as unknown as Namespace,
      checker: {
        getTypeName: (_type: Type) => "string",
        isString: (type: Type) => type.kind === "Scalar" && type.name === "string",
        isStdType: () => false,
      },
      sourceFiles: new Map(),
      jsSourceFiles: new Map(),
      tracer: {} as any,
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
      compilerOptions: { outputDir: "./test-output" } as any,
      stateSet: {} as any,
      stateMap: new Map(),
      reportDiagnostics: () => {},
      resolveTypeReference: () => ({}) as any,
      resolveType: () => ({}) as any,
    } as unknown as Program;
  }

  /**
   * Create a mock Operation with complete required properties
   */
  static createOperation(
    name: string,
    options: {
      returnType?: Type;
      parameters?: Record<string, Type>;
    } = {},
  ): Operation {
    const propsMap = this.createPropertiesMap(options.parameters || {});

    return {
      name,
      kind: "Operation",
      parameters: {
        properties: propsMap as any,
        kind: "Model",
        name: "parameters",
        derivedModels: [],
        sourceModels: [],
        entityKind: "Type" as any,
        isFinished: true,
        decorators: [],
      } as unknown as Model,
      returnType: options.returnType,
      entityKind: "Type" as any,
      isFinished: true,
      decorators: [],
    } as unknown as Operation;
  }

  /**
   * Create a mock Namespace with complete required properties
   */
  static createNamespace(
    name: string,
    options: {
      operations?: Record<string, Operation>;
      models?: Record<string, Model>;
    } = {},
  ): Namespace {
    const opsMap = new Map<string, Operation>();
    const modelsMap = new Map<string, Model>();

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

    return {
      kind: "Namespace",
      name,
      operations: opsMap,
      models: modelsMap,
      scalars: new Map(),
      enums: new Map(),
      unions: new Map(),
      interfaces: new Map(),
      strings: new Map(),
      templates: new Map(),
      decorators: [],
      entityKind: "Type" as any, // Cast to satisfy Type compatibility
      isFinished: true,
      namespaces: new Map(),
      decoratorDeclarations: new Map(),
    } as Namespace;
  }

  /**
   * Create a mock EmitContext
   */
  static createEmitContext(program?: Program): EmitContext {
    const prog = program || this.createProgram();

    return {
      program: prog,
      emitterOutputDir: "./test-output",
      options: {},
      getAssetEmitter: () => ({
        writeOutput: async () => {},
        getProgram: () => prog,
      }),
    } as EmitContext;
  }
}
