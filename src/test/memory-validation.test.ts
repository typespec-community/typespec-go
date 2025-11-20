/**
 * Memory Validation Test Suite - TypeSpec Go Emitter
 *
 * Orchestrates memory testing using extracted modules
 * Provides memory usage validation and leak detection
 */

import { performance } from "perf_hooks";
import { StandaloneGoGenerator } from "../standalone-generator.js";
import type { GoEmitterResult } from "../src/domain/unified-errors.js";
import {
  MemoryTestRunner,
  type MemoryMetrics,
  type MemoryLeakTestResult,
} from "./memory/memory-test-runner.js";
import { MemoryValidator } from "./memory/memory-validator.js";

/**
 * Memory validation test orchestrator
 */
class MemoryValidationSuite {
  private memoryRunner: MemoryTestRunner;
  private memoryValidator: MemoryValidator;

  constructor() {
    this.memoryRunner = new MemoryTestRunner();
    this.memoryValidator = new MemoryValidator();
  }

  /**
   * Execute complete memory validation test suite
   */
  runFullMemoryValidation(): {
    efficiencyMetrics: MemoryMetrics[];
    leakTestResult: MemoryLeakTestResult;
    validationResults: any;
    summary: any;
  } {
    console.log("🧠 Starting Memory Validation Test Suite");
    console.log("=".repeat(50));

    // Test memory efficiency with increasing model sizes
    const efficiencyMetrics = this.memoryRunner.testMemoryEfficiency();

    // Test for memory leaks over multiple iterations
    const leakTestResult = this.memoryRunner.testMemoryLeaks(
      () => this.memoryRunner.createTestModel("LeakTest", 50),
      100,
    );

    // Generate memory report
    const report = this.memoryRunner.generateMemoryReport(
      efficiencyMetrics,
      leakTestResult,
    );
    console.log(report);

    // Analyze and validate results
    const efficiencyAnalysis =
      this.memoryValidator.analyzeMemoryEfficiency(efficiencyMetrics);
    const leakAnalysis = this.memoryValidator.detectMemoryLeaks(leakTestResult);
    const thresholdValidation =
      this.memoryValidator.validateMemoryThresholds(efficiencyMetrics);
    const recommendations =
      this.memoryValidator.generateOptimizationRecommendations(
        efficiencyMetrics,
        leakTestResult,
      );
    const summary = this.memoryValidator.generateMemorySummary(
      efficiencyMetrics,
      leakTestResult,
    );

    console.log("\n🔍 Memory Analysis Results:");
    console.log(
      `   Efficiency: ${efficiencyAnalysis.memoryEfficiency} (${efficiencyAnalysis.scalingFactor.toFixed(2)}x scaling)`,
    );
    console.log(
      `   Leak Status: ${leakAnalysis.leakSeverity} (${leakAnalysis.recommendation})`,
    );
    console.log(
      `   Threshold Validation: ${thresholdValidation.passed ? "✅ PASSED" : "❌ FAILED"}`,
    );
    console.log(`   Overall Status: ${summary.status.toUpperCase()}`);
    console.log(`   Summary: ${summary.summary}`);

    if (recommendations.length > 0) {
      console.log("\n💡 Optimization Recommendations:");
      recommendations.forEach((rec) => console.log(`   • ${rec}`));
    }

    return {
      efficiencyMetrics,
      leakTestResult,
      validationResults: {
        efficiencyAnalysis,
        leakAnalysis,
        thresholdValidation,
      },
      summary,
    };
  }

  /**
   * Test specific model memory usage
   */
  testModelMemory(model: {
    name: string;
    properties: ReadonlyMap<string, any>;
  }): MemoryMetrics {
    const metrics = this.memoryRunner.measureMemoryUsage(model);

    console.log(`📊 Memory usage for ${model.name}:`);
    console.log(`   Properties: ${metrics.propertyCount}`);
    console.log(`   Memory overhead: ${metrics.memoryOverheadMB.toFixed(2)}MB`);
    console.log(
      `   Memory per property: ${metrics.memoryPerPropertyMB.toFixed(4)}MB`,
    );
    console.log(
      `   Acceptable usage: ${metrics.acceptableMemoryUsage ? "✅" : "❌"}`,
    );
    console.log(`   Memory leak: ${metrics.memoryLeakDetected ? "❌" : "✅"}`);

    return metrics;
  }

  /**
   * Test memory leaks for specific model pattern
   */
  testModelPatternLeaks(
    modelFactory: () => { name: string; properties: ReadonlyMap<string, any> },
    iterations: number = 50,
  ): MemoryLeakTestResult {
    console.log(`🔄 Testing memory leaks with ${iterations} iterations`);

    const result = this.memoryRunner.testMemoryLeaks(modelFactory, iterations);

    console.log(`   Initial memory: ${result.initialMemoryMB}MB`);
    console.log(`   Final memory: ${result.finalMemoryMB}MB`);
    console.log(`   Memory growth: ${result.memoryGrowthMB.toFixed(2)}MB`);
    console.log(
      `   Leak detected: ${result.leakDetected ? "❌ YES" : "✅ NO"}`,
    );

    return result;
  }
}

// Test execution
describe("Memory Validation Tests", () => {
  let memorySuite: MemoryValidationSuite;

  beforeEach(() => {
    memorySuite = new MemoryValidationSuite();
  });

  it("should validate memory efficiency across model sizes", () => {
    const results = memorySuite.runFullMemoryValidation();

    // Verify all tests completed
    expect(results.efficiencyMetrics).toHaveLength(5); // 10, 50, 100, 200, 500 properties
    expect(results.summary.keyMetrics.averageOverheadMB).toBeLessThan(15);
    expect(results.summary.keyMetrics.averageMemoryPerPropertyMB).toBeLessThan(
      0.1,
    );

    console.log(
      `Memory validation completed with status: ${results.summary.status}`,
    );
  });

  it("should test individual model memory usage", () => {
    // Create test model
    const properties = new Map<string, any>();
    for (let i = 0; i < 50; i++) {
      properties.set(`field${i}`, {
        name: `field${i}`,
        type: { kind: "String" },
        optional: i % 3 === 0,
      });
    }

    const model = { name: "TestModel", properties };
    const metrics = memorySuite.testModelMemory(model);

    expect(metrics.propertyCount).toBe(50);
    expect(metrics.memoryOverheadMB).toBeGreaterThanOrEqual(0);
    expect(metrics.memoryPerPropertyMB).toBeGreaterThanOrEqual(0);
  });

  it("should detect memory leaks in model generation", () => {
    const result = memorySuite.testModelPatternLeaks(() => {
      const properties = new Map<string, any>();
      for (let i = 0; i < 25; i++) {
        properties.set(`field${i}`, {
          name: `field${i}`,
          type: { kind: "Int32" },
          optional: false,
        });
      }
      return { name: "LeakTest", properties };
    }, 50);

    expect(result.iterations).toBe(50);
    expect(result.initialMemoryMB).toBeGreaterThan(0);
    expect(result.finalMemoryMB).toBeGreaterThan(0);

    // Memory growth should be minimal
    expect(result.memoryGrowthMB).toBeLessThan(20);
  });
});
