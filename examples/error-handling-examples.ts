/**
 * Error Handling Examples - TypeSpec Go Emitter
 *
 * Comprehensive examples of professional error handling patterns
 * Demonstrates discriminated union usage with railway programming
 */

import { StandaloneGoGenerator } from "../src/standalone-generator.js";
import type { GoEmitterResult } from "../src/domain/unified-errors.js";

/**
 * Example 1: Basic Error Handling with Discriminated Unions
 */
function basicErrorHandling() {
  console.log("🔍 Example 1: Basic Error Handling");

  const generator = new StandaloneGoGenerator();

  // Success case
  const validModel = {
    name: "User",
    properties: new Map([
      ["id", { name: "id", type: { kind: "String" }, optional: false }],
      ["name", { name: "name", type: { kind: "String" }, optional: false }],
    ]),
  };

  const result: GoEmitterResult = generator.generateModel(validModel);

  // Professional discriminated union handling
  if (result._tag === "Success") {
    console.log("✅ Success: Generated Go code");
    console.log(`📁 Files: ${result.generatedFiles.join(", ")}`);
  } else {
    console.log("❌ Error: Generation failed");
    console.log(`💬 Message: ${result.message}`);
    console.log(`🔧 Resolution: ${result.resolution}`);
  }

  console.log();
}

/**
 * Example 2: Railway Programming Pattern
 * Functional composition for error handling
 */
function railwayProgrammingExample() {
  console.log("🔍 Example 2: Railway Programming Pattern");

  const generator = new StandaloneGoGenerator();

  // Railway-style functions
  const validateModel = (model: any) => {
    if (!model?.name || typeof model.name !== "string") {
      return {
        _tag: "ModelValidationError" as const,
        message: "Invalid model: name must be a non-empty string",
        modelName: model?.name || "unknown",
        reason: "empty-name" as const,
        resolution: "Provide a valid model name",
        errorId: `error-${Date.now()}`,
      };
    }
    return { _tag: "Validated" as const, model };
  };

  const generateCode = (validation: any) => {
    if (validation._tag === "Validated") {
      return generator.generateModel(validation.model);
    } else {
      return validation; // Pass through validation error
    }
  };

  const extractCode = (result: GoEmitterResult) => {
    if (result._tag === "Success") {
      return result.data.get("User.go") || "";
    } else {
      throw new Error(`Code generation failed: ${result.message}`);
    }
  };

  // Railway composition (simplified - normally would use Effect.TS pipe)
  const model = {
    name: "User",
    properties: new Map([["id", { name: "id", type: { kind: "String" }, optional: false }]]),
  };

  try {
    const validation = validateModel(model);
    const result = generateCode(validation);
    const goCode = extractCode(result);

    console.log("✅ Railway composition successful");
    console.log(`📄 Generated ${goCode.length} characters of Go code`);
  } catch (error) {
    console.log("❌ Railway composition failed:", error.message);
  }

  console.log();
}

/**
 * Example 3: Error Handling by Type
 * Type-specific error handling for different error categories
 */
function typeSpecificErrorHandling() {
  console.log("🔍 Example 3: Type-Specific Error Handling");

  const generator = new StandaloneGoGenerator();

  // Test different error scenarios
  const scenarios = [
    {
      name: "Empty Model Name",
      model: { name: "", properties: new Map() },
      expectedError: "ModelValidationError",
    },
    {
      name: "No Properties",
      model: { name: "User", properties: new Map() },
      expectedError: "ModelValidationError",
    },
    {
      name: "Invalid Type",
      model: {
        name: "User",
        properties: new Map([
          ["field", { name: "field", type: { kind: "InvalidType" }, optional: false }],
        ]),
      },
      expectedError: "GoCodeGenerationError", // May vary
    },
  ];

  for (const scenario of scenarios) {
    console.log(`📋 Testing: ${scenario.name}`);

    const result = generator.generateModel(scenario.model);

    switch (result._tag) {
      case "Success":
        console.log("⚠️  Unexpected success");
        break;

      case "ModelValidationError":
        console.log("🛡️  Model Validation Error:");
        console.log(`   Message: ${result.message}`);
        console.log(`   Reason: ${result.reason}`);
        console.log(`   Model: ${result.modelName}`);
        console.log(`   Resolution: ${result.resolution}`);
        break;

      case "GoCodeGenerationError":
        console.log("💻 Code Generation Error:");
        console.log(`   Message: ${result.message}`);
        if (result.fileName) console.log(`   File: ${result.fileName}`);
        if (result.goCode) console.log(`   Code: ${result.goCode.substring(0, 100)}...`);
        console.log(`   Resolution: ${result.resolution}`);
        break;

      case "TypeSpecCompilerError":
        console.log("📝 TypeSpec Compiler Error:");
        console.log(`   Message: ${result.message}`);
        if (result.modelName) console.log(`   Model: ${result.modelName}`);
        if (result.propertyName) console.log(`   Property: ${result.propertyName}`);
        console.log(`   Resolution: ${result.resolution}`);
        break;

      case "TypeSafetyError":
        console.log("🔒 Type Safety Error:");
        console.log(`   Message: ${result.message}`);
        console.log(`   Violation: ${result.violation}`);
        console.log(`   Expected: ${result.expected}`);
        console.log(`   Actual: ${result.actual}`);
        console.log(`   Resolution: ${result.resolution}`);
        break;

      case "SystemError":
        console.log("⚙️  System Error:");
        console.log(`   Message: ${result.message}`);
        if (result.originalError) console.log(`   Original: ${result.originalError.message}`);
        console.log(`   Resolution: ${result.resolution}`);
        break;

      default:
        // TypeScript ensures this is exhaustive
        console.log("❌ Unknown error type");
    }

    console.log();
  }
}

/**
 * Example 4: Advanced Error Recovery
 * Attempting to recover from errors and provide alternatives
 */
function advancedErrorRecovery() {
  console.log("🔍 Example 4: Advanced Error Recovery");

  const generator = new StandaloneGoGenerator();

  // Recovery strategy function
  const recoverWithErrorHandling = (model: any, fallbackModel?: any) => {
    const result = generator.generateModel(model);

    if (result._tag === "Success") {
      return result;
    }

    console.log(`🔄 Primary generation failed: ${result.message}`);
    console.log(`🔧 Attempting recovery...`);

    // Try recovery strategies
    if (result._tag === "ModelValidationError" && result.reason === "empty-name") {
      // Recovery: Provide default name
      const recoveredModel = {
        ...model,
        name: "RecoveredModel",
      };
      console.log(`📝 Recovered: Using default name "RecoveredModel"`);

      const recoveredResult = generator.generateModel(recoveredModel);
      if (recoveredResult._tag === "Success") {
        console.log("✅ Recovery successful!");
        return recoveredResult;
      }
    }

    // Fallback to alternative model
    if (fallbackModel) {
      console.log(`🔄 Using fallback model...`);
      const fallbackResult = generator.generateModel(fallbackModel);
      if (fallbackResult._tag === "Success") {
        console.log("✅ Fallback successful!");
        return fallbackResult;
      }
    }

    // Recovery failed, return original error
    console.log("❌ All recovery strategies failed");
    return result;
  };

  // Test recovery scenarios
  const invalidModel = {
    name: "",
    properties: new Map([["id", { name: "id", type: { kind: "String" }, optional: false }]]),
  };

  const fallbackModel = {
    name: "FallbackUser",
    properties: new Map([["id", { name: "id", type: { kind: "String" }, optional: false }]]),
  };

  const finalResult = recoverWithErrorHandling(invalidModel, fallbackModel);

  if (finalResult._tag === "Success") {
    console.log(`🎉 Final result: ${finalResult.generatedFiles.join(", ")}`);
  } else {
    console.log(`💥 Final error: ${finalResult.message}`);
  }

  console.log();
}

/**
 * Example 5: Async Error Handling
 * Error handling in asynchronous contexts
 */
async function asyncErrorHandling() {
  console.log("🔍 Example 5: Async Error Handling");

  const generator = new StandaloneGoGenerator();

  // Async wrapper for generation
  const generateAsync = async (model: any): Promise<GoEmitterResult> => {
    return new Promise((resolve) => {
      // Simulate async processing
      setTimeout(() => {
        const result = generator.generateModel(model);
        resolve(result);
      }, 10);
    });
  };

  // Async save function
  const saveAsync = async (result: GoEmitterResult): Promise<void> => {
    if (result._tag === "Success") {
      for (const [fileName, goCode] of result.data.entries()) {
        console.log(`💾 Saving ${fileName} (${goCode.length} chars)`);
        // Simulate async file save
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
      console.log("✅ All files saved successfully");
    } else {
      throw new Error(`Cannot save files: ${result.message}`);
    }
  };

  // Async processing pipeline
  const model = {
    name: "AsyncUser",
    properties: new Map([
      ["id", { name: "id", type: { kind: "String" }, optional: false }],
      ["createdAt", { name: "createdAt", type: { kind: "String" }, optional: true }],
    ]),
  };

  try {
    const result = await generateAsync(model);
    await saveAsync(result);
    console.log("🎉 Async pipeline completed successfully");
  } catch (error) {
    console.log("💥 Async pipeline failed:", error.message);
  }

  console.log();
}

/**
 * Example 6: Error Logging and Monitoring
 * Professional error tracking and observability
 */
function errorLoggingAndMonitoring() {
  console.log("🔍 Example 6: Error Logging and Monitoring");

  const generator = new StandaloneGoGenerator();

  // Error tracking
  const errors: Array<{
    timestamp: string;
    errorType: string;
    message: string;
    resolution: string;
    errorId: string;
  }> = [];

  // Enhanced error handling with logging
  const generateWithLogging = (model: any): GoEmitterResult => {
    const startTime = Date.now();
    const result = generator.generateModel(model);
    const duration = Date.now() - startTime;

    if (result._tag === "Success") {
      console.log(`📊 Metrics: Generated ${result.generatedFiles.length} files in ${duration}ms`);
    } else {
      const errorRecord = {
        timestamp: new Date().toISOString(),
        errorType: result._tag,
        message: result.message,
        resolution: result.resolution,
        errorId: result.errorId,
      };

      errors.push(errorRecord);
      console.log(`📝 Error logged: ${errorRecord.errorType} (${errorRecord.errorId})`);
      console.log(`⏰ Timestamp: ${errorRecord.timestamp}`);
      console.log(`💬 Message: ${errorRecord.message}`);
    }

    return result;
  };

  // Test with various scenarios
  const testModels = [
    {
      name: "ValidUser",
      properties: new Map([["id", { name: "id", type: { kind: "String" }, optional: false }]]),
    },
    {
      name: "",
      properties: new Map([["id", { name: "id", type: { kind: "String" }, optional: false }]]),
    },
  ];

  for (const testModel of testModels) {
    console.log(`🧪 Testing model: ${testModel.name || "<empty>"}`);
    generateWithLogging(testModel);
    console.log();
  }

  // Error summary
  if (errors.length > 0) {
    console.log("📊 Error Summary:");
    console.log(`   Total Errors: ${errors.length}`);
    console.log(`   Error Types: ${[...new Set(errors.map((e) => e.errorType))].join(", ")}`);

    errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.errorType}: ${error.message}`);
    });
  } else {
    console.log("✅ No errors encountered");
  }

  console.log();
}

/**
 * Run all error handling examples
 */
export function runErrorHandlingExamples(): void {
  console.log("🚀 Error Handling Examples - TypeSpec Go Emitter");
  console.log("=".repeat(50));

  basicErrorHandling();
  railwayProgrammingExample();
  typeSpecificErrorHandling();
  advancedErrorRecovery();
  asyncErrorHandling().then(() => errorLoggingAndMonitoring());

  console.log("🎯 All error handling examples completed!");
  console.log("💡 Key takeaways:");
  console.log("   • Always use discriminated union patterns for type safety");
  console.log("   • Handle different error types with specific strategies");
  console.log("   • Implement recovery mechanisms where appropriate");
  console.log("   • Log errors for debugging and monitoring");
  console.log("   • Use railway programming for complex error flows");
  console.log("   • Consider async error handling in production code");
}

// Uncomment to run examples directly
// runErrorHandlingExamples();
