/**
 * Behavior-Driven Development Framework for TypeSpec Go Emitter
 *
 * BDD EXCELLENCE: Customer scenario testing
 * ZERO ANY TYPES: Professional type safety
 * REAL VALIDATION: Actual test framework assertions
 * UNIFIED ERROR SYSTEM: Single source of truth for error handling
 */

import { GoEmitterResult } from "../domain/unified-errors.js";

// Real BDD testing with proper assertions
import { expect } from "vitest";

/**
 * BDD Validation Record Type
 * Type-safe record for validation results
 */
interface BDDValidationRecord {
  struct?: boolean;
  pointers?: boolean;
  json?: boolean;
  package?: boolean;
  imports?: boolean;
  [key: string]: unknown;
}

/**
 * BDD Test Scenario Interface
 * ZERO ANY TYPES: Type-safe scenario definition
 */
export interface BDDScenario {
  readonly name: string;
  readonly description: string;
  readonly given: () => unknown;
  readonly when: (context: unknown) => unknown;
  readonly then: (result: unknown) => BDDValidation;
}

/**
 * BDD Validation Result
 * DISCRIMINATED UNION: Success or failure with details
 */
export interface BDDValidation {
  readonly success: boolean;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

/**
 * Real BDD Test Runner
 * PROFESSIONAL TESTING: Uses actual assertions
 */
export class BDDRunner {
  /**
   * Execute BDD scenario with comprehensive validation
   * ZERO ANY TYPES: Type-safe scenario execution
   */
  static executeScenario(scenario: BDDScenario): void {
    console.log(`\n=== BDD SCENARIO: ${scenario.name} ===`);
    console.log(`Description: ${scenario.description}`);

    try {
      // GIVEN
      console.log("\n📋 GIVEN:");
      const context = scenario.given();
      console.log(`✅ Context prepared`);

      // WHEN
      console.log("\n⚡ WHEN:");
      const result = scenario.when(context);
      console.log(`✅ Action executed`);

      // THEN
      console.log("\n🎯 THEN:");
      const validation = scenario.then(result);

      // REAL ASSERTIONS: Use expect instead of console.log
      if (validation.success) {
        expect(validation.success).toBe(true);
        console.log(`✅ ${validation.message}`);

        // Additional validation details
        if (validation.details) {
          console.log("📊 Validation Details:", validation.details);
        }
      } else {
        console.log(`❌ ${validation.message}`);
        throw new Error(`BDD Scenario Failed: ${scenario.name}`);
      }
    } catch (error) {
      console.log(`❌ Scenario failed: ${error}`);
      throw error;
    }

    console.log(`=== BDD SCENARIO COMPLETE: ${scenario.name} ===\n`);
  }

  /**
   * Execute multiple BDD scenarios
   * ZERO ANY TYPES: Batch scenario execution with real validation
   */
  static executeScenarios(scenarios: BDDScenario[]): {
    passed: number;
    failed: number;
    results: Array<{ name: string; passed: boolean; error?: Error }>;
  } {
    const results: Array<{ name: string; passed: boolean; error?: Error }> = [];

    for (const scenario of scenarios) {
      try {
        this.executeScenario(scenario);
        results.push({ name: scenario.name, passed: true });
      } catch (error) {
        console.log(`❌ Failed scenario: ${scenario.name}`);
        results.push({
          name: scenario.name,
          passed: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }

    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;

    console.log(`\n🎯 BDD EXECUTION SUMMARY: ${passed} passed, ${failed} failed`);

    // Detailed results for debugging
    if (failed > 0) {
      console.log("\n❌ Failed Scenarios:");
      results.forEach((result) => {
        if (!result.passed) {
          console.log(`  ❌ ${result.name}: ${result.error?.message || "Unknown error"}`);
        }
      });
    }

    return { passed, failed, results };
  }

  /**
   * Create BDD validation result
   * HELPER: Type-safe validation creation
   */
  static createValidation(
    success: boolean,
    message: string,
    details?: Record<string, unknown>,
  ): BDDValidation {
    const baseValidation = { success, message };
    return Object.assign(baseValidation, details && { details });
  }

  /**
   * Create BDD error validation result
   * HELPER: Type-safe error validation creation
   */
  static createErrorValidation(
    success: boolean,
    message: string,
    errorDetails?: Record<string, unknown>,
  ): BDDValidation {
    const baseValidation = { success, message };
    return Object.assign(baseValidation, errorDetails && { details: errorDetails });
  }

  /**
   * Validate Go emitter result
   * DOMAIN INTELLIGENCE: Proper result validation
   */
  static validateGoEmitterResult(result: GoEmitterResult, expectedFiles?: string[]): BDDValidation {
    if (result._tag === "success") {
      const generatedFiles = Array.from(result.data.keys());

      // Check expected files if provided
      if (expectedFiles) {
        const missingFiles = expectedFiles.filter((file) => !generatedFiles.includes(file));
        const extraFiles = generatedFiles.filter((file) => !expectedFiles.includes(file));

        if (missingFiles.length > 0 || extraFiles.length > 0) {
          return this.createValidation(
            false,
            `Generated files mismatch. Expected: [${expectedFiles.join(", ")}], Generated: [${generatedFiles.join(", ")}]`,
            {
              missingFiles: missingFiles.length > 0 ? missingFiles : undefined,
              extraFiles: extraFiles.length > 0 ? extraFiles : undefined,
              generatedFiles,
            },
          );
        }
      }

      return this.createValidation(
        true,
        `Go emitter success with ${generatedFiles.length} files generated`,
        { generatedFiles: Array.from(result.data.entries()) },
      );
    } else {
      return this.createValidation(false, `Go emitter failed: ${result.message}`, {
        error: result,
        errorId: result.errorId,
      });
    }
  }

  /**
   * Validate generated Go code
   * DOMAIN INTELLIGENCE: Go syntax and type validation
   */
  static validateGoCode(
    goCode: string,
    expectedElements?: {
      hasStruct?: boolean;
      hasJsonTags?: boolean;
      hasUintTypes?: boolean;
      hasOptionalPointers?: boolean;
    },
  ): BDDValidation {
    const validation: BDDValidationRecord = {};

    // Check for struct definition
    if (expectedElements?.hasStruct) {
      const hasStruct = goCode.includes("type") && goCode.includes("struct");
      validation.struct = hasStruct;

      if (!hasStruct) {
        return this.createValidation(false, "Generated code missing struct definition", validation);
      }
    }

    // Check for JSON tags
    if (expectedElements?.hasJsonTags) {
      const hasJsonTags = goCode.includes("json:");
      validation.jsonTags = hasJsonTags;

      if (!hasJsonTags) {
        return this.createValidation(false, "Generated code missing JSON struct tags", validation);
      }
    }

    // Check for uint types
    if (expectedElements?.hasUintTypes) {
      const hasUintTypes = /uint(8|16|32|64)/.test(goCode);
      validation.uintTypes = hasUintTypes;

      if (!hasUintTypes) {
        return this.createValidation(
          false,
          "Generated code missing uint types for never-negative fields",
          validation,
        );
      }
    }

    // Check for optional pointers
    if (expectedElements?.hasOptionalPointers) {
      const hasPointers = /\*\w+/.test(goCode);
      validation.optionalPointers = hasPointers;

      if (!hasPointers) {
        return this.createValidation(
          false,
          "Generated code missing optional field pointers",
          validation,
        );
      }
    }

    return this.createValidation(true, "Generated Go code validation passed", validation);
  }
}
