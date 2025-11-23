/**
 * TypeSpec Model Generator - Validation Module
 *
 * Input validation and error handling for model generation
 * Clean separation of concerns for generator architecture
 */

import type { Program } from "@typespec/compiler";
import type { GoEmitterResult } from "../domain/unified-errors.js";
import type { ExtractedModel, ExtractedUnion, ExtractedOperation } from "../emitter/model-extractor-core.js";
import { ErrorFactory } from "../domain/error-factory.js";

/**
 * Validation utilities for model generation
 */
export class ModelGeneratorValidation {
  /**
   * Validate TypeSpec program input
   */
  static validateInput(program: Program): GoEmitterResult | null {
    try {
      // Check if program exists and is valid
      if (!program) {
        return ErrorFactory.inputValidationError("Program is null or undefined");
      }

      // Check if program has necessary compiler APIs
      if (typeof program !== 'object') {
        return ErrorFactory.inputValidationError("Program is not a valid object");
      }

      // Validate program has required methods
      if (!program.getGlobalNamespaceType || typeof program.getGlobalNamespaceType !== 'function') {
        return ErrorFactory.inputValidationError("Program missing required compiler APIs");
      }

      return null; // Input is valid
    } catch (error) {
      return ErrorFactory.inputValidationError(
        `Program validation failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Validate extracted model data
   */
  static validateExtractedModel(modelName: string, model: ExtractedModel): GoEmitterResult | null {
    try {
      // Check model name
      if (!modelName || typeof modelName !== 'string') {
        return ErrorFactory.modelValidationError("Invalid model name", modelName);
      }

      // Check model object
      if (!model || typeof model !== 'object') {
        return ErrorFactory.modelValidationError("Model is not a valid object", modelName);
      }

      // Check required properties
      if (!model.properties || typeof model.properties !== 'object') {
        return ErrorFactory.modelValidationError("Model missing properties map", modelName);
      }

      // Validate properties map
      if (!(model.properties instanceof Map) && !Array.isArray(model.properties)) {
        return ErrorFactory.modelValidationError("Properties must be Map or Array", modelName);
      }

      return null; // Model is valid
    } catch (error) {
      return ErrorFactory.modelValidationError(
        `Model validation failed for ${modelName}: ${error instanceof Error ? error.message : String(error)}`,
        modelName
      );
    }
  }

  /**
   * Validate extracted union data
   */
  static validateExtractedUnion(unionName: string, union: ExtractedUnion): GoEmitterResult | null {
    try {
      // Check union name
      if (!unionName || typeof unionName !== 'string') {
        return ErrorFactory.unionValidationError("Invalid union name", unionName);
      }

      // Check union object
      if (!union || typeof union !== 'object') {
        return ErrorFactory.unionValidationError("Union is not a valid object", unionName);
      }

      // Check required variants
      if (!union.variants || typeof union.variants !== 'object') {
        return ErrorFactory.unionValidationError("Union missing variants map", unionName);
      }

      // Validate variants map
      if (!(union.variants instanceof Map) && !Array.isArray(union.variants)) {
        return ErrorFactory.unionValidationError("Variants must be Map or Array", unionName);
      }

      return null; // Union is valid
    } catch (error) {
      return ErrorFactory.unionValidationError(
        `Union validation failed for ${unionName}: ${error instanceof Error ? error.message : String(error)}`,
        unionName
      );
    }
  }

  /**
   * Validate extracted operation data
   */
  static validateExtractedOperation(operationName: string, operation: ExtractedOperation): GoEmitterResult | null {
    try {
      // Check operation name
      if (!operationName || typeof operationName !== 'string') {
        return ErrorFactory.operationValidationError("Invalid operation name", operationName);
      }

      // Check operation object
      if (!operation || typeof operation !== 'object') {
        return ErrorFactory.operationValidationError("Operation is not a valid object", operationName);
      }

      // Check required fields
      if (!operation.verb || typeof operation.verb !== 'string') {
        return ErrorFactory.operationValidationError("Operation missing HTTP verb", operationName);
      }

      if (!operation.path || typeof operation.path !== 'string') {
        return ErrorFactory.operationValidationError("Operation missing HTTP path", operationName);
      }

      // Validate parameters
      if (operation.parameters && typeof operation.parameters !== 'object') {
        return ErrorFactory.operationValidationError("Invalid parameters map", operationName);
      }

      return null; // Operation is valid
    } catch (error) {
      return ErrorFactory.operationValidationError(
        `Operation validation failed for ${operationName}: ${error instanceof Error ? error.message : String(error)}`,
        operationName
      );
    }
  }

  /**
   * Validate file name generation
   */
  static validateFileName(fileName: string): GoEmitterResult | null {
    try {
      // Check file name
      if (!fileName || typeof fileName !== 'string') {
        return ErrorFactory.fileValidationError("Invalid file name", fileName);
      }

      // Check file extension
      if (!fileName.endsWith('.go')) {
        return ErrorFactory.fileValidationError("File must have .go extension", fileName);
      }

      // Check for invalid characters
      const invalidChars = /[<>:"|?*\\]/;
      if (invalidChars.test(fileName)) {
        return ErrorFactory.fileValidationError("File name contains invalid characters", fileName);
      }

      return null; // File name is valid
    } catch (error) {
      return ErrorFactory.fileValidationError(
        `File name validation failed: ${error instanceof Error ? error.message : String(error)}`,
        fileName
      );
    }
  }

  /**
   * Validate Go code generation results
   */
  static validateGoCode(goCode: string): GoEmitterResult | null {
    try {
      // Check Go code
      if (!goCode || typeof goCode !== 'string') {
        return ErrorFactory.generationValidationError("Generated Go code is invalid");
      }

      // Check for basic Go structure
      if (!goCode.includes('package')) {
        return ErrorFactory.generationValidationError("Generated Go code missing package declaration");
      }

      if (!goCode.includes('type')) {
        return ErrorFactory.generationValidationError("Generated Go code missing type declarations");
      }

      return null; // Go code is valid
    } catch (error) {
      return ErrorFactory.generationValidationError(
        `Go code validation failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Validate complete generation result
   */
  static validateGenerationResult(result: Map<string, string>): GoEmitterResult | null {
    try {
      // Check result map
      if (!result || !(result instanceof Map)) {
        return ErrorFactory.generationValidationError("Generation result is not a valid Map");
      }

      // Check if any files were generated
      if (result.size === 0) {
        return ErrorFactory.generationValidationError("No files were generated");
      }

      // Validate each generated file
      for (const [fileName, goCode] of result) {
        const fileNameValidation = this.validateFileName(fileName);
        if (fileNameValidation) {
          return fileNameValidation;
        }

        const goCodeValidation = this.validateGoCode(goCode);
        if (goCodeValidation) {
          return goCodeValidation;
        }
      }

      return null; // Generation result is valid
    } catch (error) {
      return ErrorFactory.generationValidationError(
        `Generation result validation failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}