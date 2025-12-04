/**
 * Go Code Validation System
 * Runtime validation for generated Go code using Zod schemas
 * Validates syntax, imports, struct definitions, and compilation requirements
 */

import { z } from "zod";
import { Logger } from "./structured-logging";

/**
 * Go struct field validation schema
 */
const GoStructFieldSchema = z.object({
  name: z.string().min(1, "Struct field name cannot be empty"),
  type: z.string().min(1, "Struct field type cannot be empty"),
  tag: z.string().optional(),
  isPointer: z.boolean().optional(),
  isOptional: z.boolean().optional(),
});

/**
 * Go import statement validation schema
 */
const GoImportSchema = z.object({
  path: z.string().min(1, "Import path cannot be empty"),
  alias: z.string().optional(),
  isTypeImport: z.boolean().optional(),
});

/**
 * Go struct validation schema
 */
const GoStructSchema = z.object({
  name: z
    .string()
    .min(1, "Struct name cannot be empty")
    .regex(/^[A-Z][a-zA-Z0-9]*$/, "Struct name must be public (PascalCase)"),
  packageName: z
    .string()
    .min(1, "Package name cannot be empty")
    .regex(/^[a-z][a-z0-9]*$/, "Package name must be lowercase"),
  fields: z.array(GoStructFieldSchema),
  documentation: z.string().optional(),
  imports: z.array(GoImportSchema).default([]),
  extends: z.array(z.string()).optional(),
});

/**
 * Generated Go file validation schema
 */
const GeneratedGoFileSchema = z.object({
  filename: z
    .string()
    .min(1, "Filename cannot be empty")
    .regex(/^[A-Z][a-zA-Z0-9]*\.go$/, "Go filename must be PascalCase with .go extension"),
  packageName: z
    .string()
    .min(1, "Package name cannot be empty")
    .regex(/^[a-z][a-z0-9]*$/, "Package name must be lowercase"),
  content: z.string().min(1, "Go file content cannot be empty"),
  structs: z.array(GoStructSchema).default([]),
  imports: z.array(GoImportSchema).default([]),
});

/**
 * Complete generation result validation schema
 */
const GenerationResultSchema = z.object({
  files: z.array(GeneratedGoFileSchema).min(1, "At least one Go file must be generated"),
  metadata: z.object({
    modelName: z.string().optional(),
    generatedFiles: z.array(z.string()).default([]),
    generationTime: z.number().optional(),
  }),
});

/**
 * Go syntax validation patterns
 */
const GO_SYNTAX_PATTERNS = {
  // Valid Go identifiers
  validIdentifier: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
  // Valid package names
  validPackage: /^[a-z][a-z0-9]*$/,
  // Valid struct names (public)
  validStructName: /^[A-Z][a-zA-Z0-9]*$/,
  // Valid Go import path
  validImportPath: /^"[^"]+"$|^[a-zA-Z0-9/._-]+$/,
  // Valid struct tags
  validStructTag: /^`[^`]*`$/,
} as const;

/**
 * Validation context for tracking validation operations
 */
interface ValidationContext {
  operationId: string;
  modelName?: string;
  step: string;
  startTime: number;
}

/**
 * Go Code Validator class
 * Comprehensive runtime validation for generated Go code
 */
export class GoCodeValidator {
  private logger = Logger.withContext({ component: "GoCodeValidator" });

  /**
   * Validate complete generation result
   */
  validateGenerationResult(result: unknown): {
    success: boolean;
    errors: string[];
    warnings: string[];
  } {
    const ctx: ValidationContext = {
      operationId: crypto.randomUUID(),
      step: "generation-result",
      startTime: Date.now(),
    };

    this.logger.debug("Validating generation result", { operationId: ctx.operationId });

    const parseResult = GenerationResultSchema.safeParse(result);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      );

      this.logger.error("Generation result validation failed", {
        operationId: ctx.operationId,
        errors,
        duration: Date.now() - ctx.startTime,
      });

      return { success: false, errors, warnings: [] };
    }

    const syntaxErrors = this.validateGoSyntax(parseResult.data);
    const semanticErrors = this.validateGoSemantics(parseResult.data);

    const allErrors = [...syntaxErrors, ...semanticErrors];

    if (allErrors.length > 0) {
      this.logger.error("Generated Go code validation failed", {
        operationId: ctx.operationId,
        errors: allErrors,
        duration: Date.now() - ctx.startTime,
      });

      return { success: false, errors: allErrors, warnings: [] };
    }

    this.logger.info("Generation result validation passed", {
      operationId: ctx.operationId,
      fileCount: parseResult.data.files.length,
      duration: Date.now() - ctx.startTime,
    });

    return { success: true, errors: [], warnings: [] };
  }

  /**
   * Validate Go syntax rules
   */
  private validateGoSyntax(data: z.infer<typeof GenerationResultSchema>): string[] {
    const errors: string[] = [];

    for (const file of data.files) {
      // Validate Go syntax basics
      if (!file.content.includes("package " + file.packageName)) {
        errors.push(`File ${file.filename} missing package declaration`);
      }

      // Check for balanced braces
      const openBraces = (file.content.match(/{/g) || []).length;
      const closeBraces = (file.content.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push(
          `File ${file.filename} has unbalanced braces: ${openBraces} open, ${closeBraces} close`,
        );
      }

      // Validate struct definitions
      for (const struct of file.structs) {
        if (!file.content.includes(`type ${struct.name} struct`)) {
          errors.push(`Struct ${struct.name} not found in generated content`);
        }
      }
    }

    return errors;
  }

  /**
   * Validate Go semantic rules
   */
  private validateGoSemantics(data: z.infer<typeof GenerationResultSchema>): string[] {
    const errors: string[] = [];

    for (const file of data.files) {
      // Validate import uniqueness
      const importPaths = new Set<string>();
      for (const import_ of file.imports) {
        if (importPaths.has(import_.path)) {
          errors.push(`Duplicate import in ${file.filename}: ${import_.path}`);
        }
        importPaths.add(import_.path);
      }

      // Validate struct field names within each struct
      for (const struct of file.structs) {
        const fieldNames = new Set<string>();
        for (const field of struct.fields) {
          if (fieldNames.has(field.name)) {
            errors.push(`Duplicate field name in ${struct.name}: ${field.name}`);
          }
          fieldNames.add(field.name);

          // Validate Go naming conventions
          if (!GO_SYNTAX_PATTERNS.validIdentifier.test(field.name)) {
            errors.push(`Invalid field name in ${struct.name}: ${field.name}`);
          }
        }
      }
    }

    return errors;
  }

  /**
   * Validate single Go struct
   */
  validateStruct(struct: unknown): { success: boolean; errors: string[] } {
    const parseResult = GoStructSchema.safeParse(struct);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      );
      return { success: false, errors };
    }

    return { success: true, errors: [] };
  }

  /**
   * Validate Go import statement
   */
  validateImport(import_: unknown): { success: boolean; errors: string[] } {
    const parseResult = GoImportSchema.safeParse(import_);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      );
      return { success: false, errors };
    }

    return { success: true, errors: [] };
  }
}

/**
 * Singleton instance for easy usage
 */
export const goCodeValidator = new GoCodeValidator();

/**
 * Validation helper functions
 */
export const GoValidation = {
  /**
   * Quick validation helper for common use cases
   */
  quickValidate: (result: unknown) => goCodeValidator.validateGenerationResult(result),

  /**
   * Validate struct specifically
   */
  validateStruct: (struct: unknown) => goCodeValidator.validateStruct(struct),

  /**
   * Validate import specifically
   */
  validateImport: (import_: unknown) => goCodeValidator.validateImport(import_),

  /**
   * Check if string is valid Go identifier
   */
  isValidGoIdentifier: (name: string) => GO_SYNTAX_PATTERNS.validIdentifier.test(name),

  /**
   * Check if string is valid Go package name
   */
  isValidGoPackageName: (name: string) => GO_SYNTAX_PATTERNS.validPackage.test(name),

  /**
   * Check if string is valid Go struct name
   */
  isValidGoStructName: (name: string) => GO_SYNTAX_PATTERNS.validStructName.test(name),
};
