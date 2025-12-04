import type { Program, EmitContext, Model, Scalar, Type } from "@typespec/compiler";

/**
 * Factory for creating TypeSpec compiler mocks to test the emitter
 * without requiring the full compiler infrastructure.
 */
export class MockFactory {
  /**
   * Create a mock Scalar type
   */
  static createScalar(name: string): any {
    return {
      kind: "Scalar",
      name,
    };
  }

  /**
   * Create a mock Model type
   */
  static createModel(name: string, properties: Record<string, Type> = {}): any {
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
    };
  }

  /**
   * Create a mock Program with minimal required interface for the emitter
   */
  static createProgram(models: Record<string, Model> = {}): any {
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
      getGlobalNamespaceType: () => mockNamespace,
      checker: {
        getTypeName: (_type: Type) => "string",
        isString: (type: Type) => type.kind === "Scalar" && type.name === "string",
        isStdType: () => false,
      },
      sourceFiles: new Map(),
      hasError: () => false,
      diagnostics: [],
      // Mock host for file writing
      host: {
        mkdirp: async () => {},
        writeFile: async () => {},
        readUrl: async () => ({ text: "" }),
        readFile: async () => ({ text: "" }),
        rm: async () => {},
        stat: async () => ({ isDirectory: () => false, isFile: () => true }),
        realpath: async (path: string) => path,
      },
      compilerOptions: { outputDir: "./test-output" },
      // Add other required Program properties as needed
      reportDiagnostic: () => {},
    };
  }

  /**
   * Create a mock EmitContext
   */
  static createEmitContext(program?: any): any {
    const prog = program || this.createProgram();

    return {
      program: prog,
      emitterOutputDir: "./test-output",
      options: {},
      getAssetEmitter: () => ({
        writeOutput: async () => {},
        getProgram: () => prog,
      }),
    };
  }
}
