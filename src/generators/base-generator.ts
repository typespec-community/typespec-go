/**
 * TypeSpec to Go Generator Base
 *
 * Foundation for all TypeSpec to Go generators
 * Domain-driven design with type-safe abstractions
 */

import type { Program } from "@typespec/compiler";
import type { GoEmitterResult } from "../domain/unified-errors.js";
import { Entities } from "../domain/error-entities.js";

/**
 * Base generator interface
 * ZERO ANY TYPES: Professional type safety
 */
export interface Generator {
  readonly name: string;
  readonly description: string;
  generate(program: Program): Promise<GoEmitterResult>;
}

/**
 * Base generator abstract class
 * DOMAIN LOGIC: Common generation patterns
 */
export abstract class BaseGenerator implements Generator {
  abstract readonly name: string;
  abstract readonly description: string;

  abstract generate(program: Program): Promise<GoEmitterResult>;

  /**
   * Common validation for all generators
   * DOMAIN LOGIC: Input validation with proper error handling
   */
  protected validateInput(program: Program): GoEmitterResult | null {
    if (!program) {
      return {
        _tag: "SystemError",
        message: "Program is required",
        context: "Generator input validation",
        resolution: "Provide valid TypeSpec program",
        errorId: Entities.createErrorId("generator-no-program"),
      };
    }
    return null;
  }

  /**
   * Common file generation pattern
   * DOMAIN LOGIC: Clean file creation with proper handling
   */
  protected createFile(fileName: string, content: string): Map<string, string> {
    const files = new Map<string, string>();
    files.set(fileName, content);
    return files;
  }
}

/**
 * Generator registry for extensible architecture
 * DOMAIN LOGIC: Plugin-like generator management
 */
export class GeneratorRegistry {
  private static generators = new Map<string, Generator>();

  /**
   * Register a generator
   * TYPE SAFETY: Type-safe generator registration
   */
  static register(generator: Generator): void {
    this.generators.set(generator.name, generator);
  }

  /**
   * Get generator by name
   * TYPE SAFETY: Type-safe generator retrieval
   */
  static get(name: string): Generator | undefined {
    return this.generators.get(name);
  }

  /**
   * Get all registered generators
   * TYPE SAFETY: Type-safe generator listing
   */
  static getAll(): Generator[] {
    return Array.from(this.generators.values());
  }

  /**
   * Check if generator is registered
   * TYPE SAFETY: Type-safe generator existence check
   */
  static has(name: string): boolean {
    return this.generators.has(name);
  }
}
