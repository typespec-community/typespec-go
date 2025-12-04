import type { Program, EmitContext, Model, Scalar, Type, Node } from "@typespec/compiler";

/**
 * Factory for creating TypeSpec compiler mocks to test the emitter
 * without requiring the full compiler infrastructure.
 */
export class MockFactory {
  /**
   * Create a mock Scalar type
   */
  static createScalar(name: string, baseName: string = "String"): Scalar {
    const scalar: Scalar = {
      kind: "Scalar",
      name,
      baseScalar: { kind: "Scalar", name: baseName } as any,
      isFinished: true,
      node: {
        id: `mock-${name.toLowerCase()}-scalar`,
        kind: "Scalar",
        sym: Symbol(name) as any,
      } as Node,
      projections: [],
    };
    return scalar;
  }

  /**
   * Create a mock Model type
   */
  static createModel(name: string, properties: Record<string, Type> = {}): Model {
    const propsMap = new Map();

    Object.entries(properties).forEach(([propName, propType]) => {
      propsMap.set(propName, {
        name: propName,
        type: propType,
        optional: false,
      });
    });

    return {
      kind: "Model",
      name,
      properties: propsMap,
      isFinished: true,
      node: {
        id: `mock-${name.toLowerCase()}-model`,
        kind: "Model",
        sym: Symbol(name) as any,
      } as Node,
      projections: [],
    } as Model;
  }

  /**
   * Create a mock Program with minimal required interface for the emitter
   */
  static createProgram(models: Record<string, Model> = {}): Program {
    const stringScalar = this.createScalar("string");

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
      getGlobalNamespaceType: () => mockNamespace as any,
      checker: {
        getTypeName: (_type: Type) => "string",
        isString: (type: Type) => type.kind === "Scalar" && type.name === "string",
        isStdType: () => false,
      } as any,
      sourceFiles: new Map(),
      hasError: () => false,
      diagnostics: [],
      // Mock host for file writing
      host: {
        mkdirp: async () => {},
        writeFile: async () => {},
        readUrl: async () => ({ text: "" }) as any,
        readFile: async () => ({ text: "" }) as any,
        rm: async () => {},
        stat: async () => ({ isDirectory: () => false, isFile: () => true }) as any,
        realpath: async (path) => path,
      } as any,
      compilerOptions: { outputDir: "./test-output" },
      // Add other required Program properties as needed
      reportDiagnostic: () => {},
    } as unknown as Program;
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
      getAssetEmitter: () =>
        ({
          writeOutput: async () => {},
          getProgram: () => prog,
        }) as any,
    } as EmitContext;
  }
}
