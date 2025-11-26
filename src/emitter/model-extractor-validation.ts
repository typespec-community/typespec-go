/**
 * TypeSpec Model Extractor - Validation Module
 *
 * Validation utilities and cyclic dependency handling for TypeSpec models
 * Clean separation of concerns for emitter architecture
 */

import type { Model as TypeSpecModelType, Union, Program } from "@typespec/compiler";
import type { ExtractedModel, ExtractedUnion } from "./model-extractor-core.js";
import { getEffectiveModelType } from "@typespec/compiler";
import { Logger, LogContext } from "../domain/structured-logging.js";

/**
 * Model validation utilities
 */
export class ModelValidationExtractor {
  /**
   * Detect cyclic dependencies in model inheritance
   * Domain logic: Prevent infinite loops in inheritance processing
   */
  static detectCyclicDependency(
    model: TypeSpecModelType,
    visited: Set<string>,
    processing: Set<string> = new Set(),
    program?: Program
  ): boolean {
    if (!model.name) return false;

    if (processing.has(model.name)) {
      return true; // Cycle detected
    }

    if (visited.has(model.name)) {
      return false; // Already processed
    }

    visited.add(model.name);
    processing.add(model.name);

    try {
      const effectiveModel = getEffectiveModelType(program!, model);
      if (effectiveModel.name && effectiveModel.name !== model.name) {
        // Check inheritance chain for cycles
        return this.detectCyclicDependency(effectiveModel, visited, processing, program);
      }
    } catch (error) {
      Logger.warn(
        LogContext.TYPESPEC_INTEGRATION,
        "Failed to detect cyclic dependency - assuming safe",
        { 
          modelName: model.name,
          error: error instanceof Error ? error.message : String(error)
        }
      );
    }

    processing.delete(model.name);
    return false;
  }

  /**
   * Break cyclic dependencies by removing problematic inheritance
   * Domain logic: Safe fallback for cyclic inheritance resolution
   */
  static breakCyclicDependency(model: ExtractedModel): ExtractedModel {
    Logger.warn(
      LogContext.TYPESPEC_INTEGRATION,
      "Breaking cyclic dependency - removing inheritance",
      { modelName: model.name }
    );

    return {
      ...model,
      extends: undefined, // Remove inheritance to break cycle
      propertiesFromExtends: undefined,
    };
  }

  /**
   * Validate TypeSpec union structure
   * Domain logic: Ensure union meets processing requirements
   */
  static isValidTypeSpecUnion(typeSpecUnion: unknown): typeSpecUnion is Union {
    if (!typeSpecUnion || typeof typeSpecUnion !== "object") {
      return false;
    }

    const union = typeSpecUnion as Union;
    return (
      union.kind === "Union" &&
      Array.isArray(union.variants) &&
      union.variants.every(variant => 
        variant && typeof variant === "object" && "type" in variant
      )
    );
  }

  /**
   * Validate extracted model completeness
   * Domain logic: Ensure model has required properties for processing
   */
  static validateExtractedModel(model: ExtractedModel): boolean {
    return !!(
      model.name &&
      model.properties &&
      typeof model.properties.forEach === "function"
    );
  }

  /**
   * Validate extracted operation completeness
   * Domain logic: Ensure operation has required properties for processing
   */
  static validateExtractedOperation(operation: {
    name?: string;
    verb?: string;
    path?: string;
    parameters?: unknown;
  }): boolean {
    return !!(
      operation.name &&
      operation.verb &&
      operation.path &&
      operation.parameters &&
      typeof operation.parameters === "object"
    );
  }

  /**
   * Validate extracted union completeness
   * Domain logic: Ensure union has required properties for processing
   */
  static validateExtractedUnion(union: {
    name?: string;
    variants?: unknown;
  }): boolean {
    return !!(
      union.name &&
      union.variants &&
      typeof union.variants === "object"
    );
  }

  /**
   * Sanitize model name for Go compatibility
   * Domain logic: Convert TypeSpec names to valid Go identifiers
   */
  static sanitizeModelName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9_]/g, "_") // Replace invalid chars with underscore
      .replace(/^[0-9]/, "_$&") // Prefix numbers with underscore
      .replace(/__*/g, "_") // Collapse multiple underscores
      .replace(/^_|_$/g, ""); // Remove leading/trailing underscores
  }

  /**
   * Sanitize property name for Go compatibility
   * Domain logic: Convert TypeSpec property names to valid Go identifiers
   */
  static sanitizePropertyName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9_]/g, "_") // Replace invalid chars with underscore
      .replace(/^[0-9]/, "_$&") // Prefix numbers with underscore
      .replace(/__*/g, "_") // Collapse multiple underscores
      .replace(/^_|_$/g, ""); // Remove leading/trailing underscores
  }
}