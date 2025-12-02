/**
 * TypeSpec Context System
 * React-like context for passing data through component trees
 * Follows guide's "Context System" section
 */

import { Children, createContext, useContext } from "@alloy-js/core";
import { navigateProgram } from "@typespec/compiler";
import type { Program, Model, Type, Scalar, Union } from "@typespec/compiler";

/**
 * Generator configuration interface
 * Options and settings for code generation
 */
export interface GeneratorConfig {
  /** Package name for generated Go code */
  packageName: string;

  /** Go module path */
  modulePath: string;

  /** Include JSON tags in struct fields */
  includeJSONTags: boolean;

  /** Include validation tags for struct fields */
  includeValidationTags: boolean;

  /** Include documentation comments */
  includeDocumentation: boolean;

  /** Naming convention for struct fields */
  fieldNaming: "camelCase" | "PascalCase" | "snake_case";

  /** Include godoc comments */
  includeGoDoc: boolean;

  /** Generate test files */
  generateTests: boolean;

  /** Default export pattern */
  exportPattern: "default" | "named";
}

/**
 * Generator context interface
 * Data passed through component tree
 */
export interface GeneratorContext {
  /** TypeSpec program containing all models and types */
  program: Program;

  /** Generator configuration options */
  config: GeneratorConfig;

  /** Current file being generated */
  currentFile?: string;

  /** Current model being processed */
  currentModel?: Model;

  /** Helper to resolve type references */
  resolveReference: (ref: string) => Model | Type | undefined;

  /** Helper to check if type is already generated */
  isTypeGenerated: (typeName: string) => boolean;

  /** Register a type as generated */
  registerGeneratedType: (typeName: string) => void;

  /** Get all models from program */
  getAllModels: () => Model[];

  /** Get model by name */
  getModelByName: (name: string) => Model | undefined;
}

/**
 * Default generator configuration
 * Sensible defaults for Go code generation
 */
export const defaultConfig: GeneratorConfig = {
  packageName: "api",
  modulePath: "github.com/example/api",
  includeJSONTags: true,
  includeValidationTags: false,
  includeDocumentation: true,
  fieldNaming: "PascalCase",
  includeGoDoc: true,
  generateTests: false,
  exportPattern: "default",
};

/**
 * TypeSpec Generator Context
 * Context variable for passing data through component trees
 */
export const GeneratorContext = createContext<GeneratorContext>();

/**
 * Generator Provider Component
 * Provides context to child components
 */
export function GeneratorProvider({
  program,
  config = defaultConfig,
  children,
}: {
  program: Program;
  config?: GeneratorConfig;
  children: Children;
}) {
  // Internal state for tracking generated types
  const generatedTypes = new Set<string>();
  const allModels = new Map<string, Model>();

  // Extract all models from program
  const models: Model[] = [];
  navigateProgram(program, {
    model: (model) => {
      models.push(model);
      allModels.set(model.name || "unnamed", model);
    },
  });

  const context: GeneratorContext = {
    program,
    config: { ...defaultConfig, ...config },
    resolveReference: (ref: string) => {
      return allModels.get(ref);
    },
    isTypeGenerated: (typeName: string) => {
      return generatedTypes.has(typeName);
    },
    registerGeneratedType: (typeName: string) => {
      generatedTypes.add(typeName);
    },
    getAllModels: () => models,
    getModelByName: (name: string) => {
      return allModels.get(name);
    },
  };

  return <GeneratorContext.Provider value={context}>{children}</GeneratorContext.Provider>;
}

/**
 * Hook to use generator context
 * Returns current generator context
 */
export function useGenerator(): GeneratorContext {
  const context = useContext(GeneratorContext);

  if (!context) {
    throw new Error("useGenerator must be used within a GeneratorProvider");
  }

  return context;
}

/**
 * Hook to get generator configuration
 * Returns current generator configuration
 */
export function useGeneratorConfig(): GeneratorConfig {
  const { config } = useGenerator();
  return config;
}

/**
 * Hook to get TypeSpec program
 * Returns current TypeSpec program
 */
export function useProgram(): Program {
  const { program } = useGenerator();
  return program;
}

/**
 * Hook for model operations
 * Returns model-related helpers
 */
export function useModels() {
  const { getAllModels, getModelByName, registerGeneratedType, isTypeGenerated } = useGenerator();

  return {
    getAllModels,
    getModelByName,
    registerGeneratedType,
    isTypeGenerated,
  };
}
