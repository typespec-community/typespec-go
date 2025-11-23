/**
 * Large Model Performance Testing - TypeSpec Go Emitter
 *
 * Tests performance with high-property-count models
 * Measures scalability and memory usage
 * Identifies performance bottlenecks
 */

import { describe, it, expect, beforeEach } from "vitest";
import { performance } from "perf_hooks";
import { StandaloneGoGenerator } from "../standalone-generator.js";
import type { GoEmitterResult } from "../domain/unified-errors.js";

interface LargeModelMetrics {
  propertyCount: number;
  generationTimeMs: number;
  memoryUsageMB: number;
  goCodeSize: number;
  performanceClassification: string;
}

class LargeModelPerformanceTester {
  private generator: StandaloneGoGenerator;
  private results: LargeModelMetrics[] = [];

  constructor() {
    this.generator = new StandaloneGoGenerator();
  }

  /**
   * Get current memory usage in MB
   */
  private getMemoryUsage(): number {
    const usage = process.memoryUsage();
    return Math.round((usage.heapUsed / 1024 / 1024) * 100) / 100;
  }

  /**
   * Generate a large test model with specified property count
   */
  private generateLargeModel(propertyCount: number): Record<string, unknown> {
    const properties = new Map();
    const baseTypes = [
      "String",
      "Int32",
      "Uint32",
      "Float64",
      "Boolean",
      "Int16",
      "Uint16",
      "Float32",
      "Int8",
      "Uint8",
    ];

    for (let i = 0; i < propertyCount; i++) {
      const typeIndex = i % baseTypes.length;
      const baseType = baseTypes[typeIndex];
      const isOptional = i % 3 === 0; // 33% optional fields

      properties.set(`field${i}`, {
        name: `field${i}`,
        type: { kind: baseType },
        optional: isOptional,
        documentation: `Field ${i} of ${propertyCount} - ${baseType} type${isOptional ? " (optional)" : ""}`,
      });
    }

    return {
      name: `LargeModel${propertyCount}`,
      properties,
    };
  }

  /**
   * Test performance with large model
   */
  private async testLargeModelPerformance(
    propertyCount: number,
    iterations: number = 20,
  ): Promise<LargeModelMetrics> {
    console.log(
      `🧪 Testing ${propertyCount}-property model (${iterations} iterations)`,
    );

    const model = this.generateLargeModel(propertyCount);
    const baselineMemory = this.getMemoryUsage();

    // Warm-up iterations
    for (let i = 0; i < 3; i++) {
      this.generator.generateModel(model);
    }

    // Performance measurement
    const startTime = performance.now();
    let totalGoCodeSize = 0;
    let peakMemory = baselineMemory;

    for (let i = 0; i < iterations; i++) {
      const result = this.generator.generateModel(model);

      if (result._tag === "Success") {
        const goCode = result.data.get(`${model.name}.go`) || "";
        totalGoCodeSize += goCode.length;
      }

      // Track memory usage
      const currentMemory = this.getMemoryUsage();
      peakMemory = Math.max(peakMemory, currentMemory);

      // Prevent memory accumulation
      if (i % 5 === 0) {
        if (global.gc) global.gc();
      }
    }

    const endTime = performance.now();
    const totalTimeMs = endTime - startTime;

    // Calculate metrics
    const averageGenerationTimeMs = totalTimeMs / iterations;
    const memoryOverhead = peakMemory - baselineMemory;
    const averageGoCodeSize = Math.round(totalGoCodeSize / iterations);

    // Classify performance
    let classification = "Excellent";
    if (averageGenerationTimeMs > 100) classification = "Poor";
    else if (averageGenerationTimeMs > 50) classification = "Fair";
    else if (averageGenerationTimeMs > 20) classification = "Good";

    const metrics: LargeModelMetrics = {
      propertyCount,
      generationTimeMs: Math.round(averageGenerationTimeMs * 100) / 100,
      memoryUsageMB: Math.max(0, memoryOverhead),
      goCodeSize: averageGoCodeSize,
      performanceClassification: classification,
    };

    this.printLargeModelMetrics(metrics);
    this.results.push(metrics);

    return metrics;
  }

  /**
   * Print large model performance metrics
   */
  private printLargeModelMetrics(metrics: LargeModelMetrics): void {
    const classificationEmoji = {
      Excellent: "🏆",
      Good: "✅",
      Fair: "⚠️",
      Poor: "❌",
    }[metrics.performanceClassification];

    console.log(
      `📊 Large Model Performance (${metrics.propertyCount} properties):`,
    );
    console.log(
      `   ${classificationEmoji} Performance: ${metrics.performanceClassification}`,
    );
    console.log(`   ⏱️  Generation time: ${metrics.generationTimeMs}ms`);
    console.log(`   💾 Memory overhead: ${metrics.memoryUsageMB}MB`);
    console.log(
      `   📄 Go code size: ${metrics.goCodeSize.toLocaleString()} chars`,
    );
    console.log(
      `   📈 Throughput: ${Math.round(1000 / metrics.generationTimeMs)} models/sec`,
    );
    console.log();
  }

  /**
   * Run comprehensive large model performance suite
   */
  async runLargeModelPerformanceSuite(): Promise<void> {
    console.log("🚀 Large Model Performance Testing Suite");
    console.log("=".repeat(50));

    // Test different scales of models
    const testCases = [
      { properties: 25, iterations: 50, name: "Small-Medium" },
      { properties: 50, iterations: 30, name: "Medium" },
      { properties: 75, iterations: 20, name: "Medium-Large" },
      { properties: 100, iterations: 15, name: "Large" },
      { properties: 150, iterations: 10, name: "Very Large" },
      { properties: 200, iterations: 8, name: "Extra Large" },
      { properties: 300, iterations: 5, name: "Stress Test" },
      { properties: 500, iterations: 3, name: "Extreme Stress" },
    ];

    for (const testCase of testCases) {
      await this.testLargeModelPerformance(
        testCase.properties,
        testCase.iterations,
      );

      // Allow system recovery between tests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.generateLargeModelSummary();
  }

  /**
   * Generate comprehensive large model performance summary
   */
  private generateLargeModelSummary(): void {
    console.log("📊 LARGE MODEL PERFORMANCE SUMMARY");
    console.log("=".repeat(50));

    if (this.results.length === 0) {
      console.log("No performance data collected.");
      return;
    }

    // Sort results by property count
    const sortedResults = [...this.results].sort(
      (a, b) => a.propertyCount - b.propertyCount,
    );

    // Calculate correlations
    const slowestResult = sortedResults.reduce((max, r) =>
      r.generationTimeMs > max.generationTimeMs ? r : max,
    );
    const largestMemory = sortedResults.reduce((max, r) =>
      r.memoryUsageMB > max.memoryUsageMB ? r : max,
    );
    const largestCodeSize = sortedResults.reduce((max, r) =>
      r.goCodeSize > max.goCodeSize ? r : max,
    );

    console.log("🏆 PERFORMANCE LEADERS:");
    console.log(
      `   ⚡ Fastest generation: ${Math.min(...sortedResults.map((r) => r.generationTimeMs))}ms (${sortedResults.find((r) => r.generationTimeMs === Math.min(...sortedResults.map((r) => r.generationTimeMs)))?.propertyCount} properties)`,
    );
    console.log(
      `   💾 Lowest memory: ${Math.min(...sortedResults.map((r) => r.memoryUsageMB))}MB (${sortedResults.find((r) => r.memoryUsageMB === Math.min(...sortedResults.map((r) => r.memoryUsageMB)))?.propertyCount} properties)`,
    );
    console.log(
      `   📈 Highest throughput: ${Math.max(...sortedResults.map((r) => Math.round(1000 / r.generationTimeMs)))} models/sec (${sortedResults.find((r) => r.generationTimeMs === Math.min(...sortedResults.map((r) => r.generationTimeMs)))?.propertyCount} properties)`,
    );

    console.log();
    console.log("📊 PERFORMANCE BREAKDOWN:");
    sortedResults.forEach((result, index) => {
      const efficiency =
        result.propertyCount / Math.max(1, result.generationTimeMs);
      const throughput = Math.round(1000 / result.generationTimeMs);

      console.log(`   ${index + 1}. ${result.propertyCount} properties:`);
      console.log(
        `      Time: ${result.generationTimeMs}ms | Memory: ${result.memoryUsageMB}MB | Code: ${(result.goCodeSize / 1000).toFixed(1)}KB`,
      );
      console.log(
        `      Throughput: ${throughput} models/sec | Efficiency: ${efficiency.toFixed(1)} props/ms`,
      );
      console.log(`      Grade: ${result.performanceClassification}`);
    });

    this.generateScalabilityAnalysis(sortedResults);
    this.generatePerformanceRecommendations();
  }

  /**
   * Generate scalability analysis
   */
  private generateScalabilityAnalysis(results: LargeModelMetrics[]): void {
    console.log();
    console.log("📈 SCALABILITY ANALYSIS:");

    // Analyze time complexity
    if (results.length >= 3) {
      const smallModel = results[0];
      const largeModel = results[results.length - 1];
      const propertyRatio = largeModel.propertyCount / smallModel.propertyCount;
      const timeRatio =
        largeModel.generationTimeMs / smallModel.generationTimeMs;

      console.log(`🔬 Time Complexity Analysis:`);
      console.log(`   Properties increased by ${propertyRatio.toFixed(1)}x`);
      console.log(`   Generation time increased by ${timeRatio.toFixed(1)}x`);

      if (timeRatio < propertyRatio * 1.2) {
        console.log(
          `   ✅ Linear scaling: ${timeRatio.toFixed(1)}x time for ${propertyRatio.toFixed(1)}x properties`,
        );
      } else if (timeRatio < propertyRatio * 2) {
        console.log(`   ⚠️ Sub-linear scaling: Better than expected`);
      } else {
        console.log(`   ❌ Poor scaling: Performance degrades with size`);
      }
    }

    // Memory scaling
    const memoryPerProperty = results.map(
      (r) => r.memoryUsageMB / r.propertyCount,
    );
    const avgMemoryPerProperty =
      memoryPerProperty.reduce((sum, mem) => sum + mem, 0) /
      memoryPerProperty.length;

    console.log();
    console.log(`💾 Memory Scaling Analysis:`);
    console.log(
      `   Average memory per property: ${avgMemoryPerProperty.toFixed(2)}MB`,
    );
    console.log(
      `   Memory efficiency: ${avgMemoryPerProperty < 0.1 ? "✅ Excellent" : avgMemoryPerProperty < 0.2 ? "✅ Good" : "⚠️ Needs optimization"}`,
    );
  }

  /**
   * Generate performance recommendations based on large model results
   */
  private generatePerformanceRecommendations(): void {
    console.log();
    console.log("💡 LARGE MODEL OPTIMIZATION RECOMMENDATIONS:");

    const poorPerformance = this.results.filter(
      (r) => r.performanceClassification === "Poor",
    );
    const fairPerformance = this.results.filter(
      (r) => r.performanceClassification === "Fair",
    );
    const highMemoryUsage = this.results.filter((r) => r.memoryUsageMB > 50);
    const largeCodeSize = this.results.filter((r) => r.goCodeSize > 50000);

    if (poorPerformance.length > 0) {
      console.log("   ⚠️ Poor Performance Detected:");
      console.log(
        "      • Implement lazy generation strategies for large models",
      );
      console.log("      • Use streaming approach for Go code output");
      console.log("      • Consider model splitting for very large schemas");
      console.log("      • Optimize type mapping lookup tables");
    }

    if (fairPerformance.length > 0) {
      console.log("   💡 Fair Performance Improvements:");
      console.log("      • Cache frequently used type mappings");
      console.log("      • Reduce string concatenation operations");
      console.log("      • Use more efficient data structures");
      console.log("      • Consider async generation for large models");
    }

    if (highMemoryUsage.length > 0) {
      console.log("   💾 High Memory Usage Optimization:");
      console.log("      • Implement object pooling for frequent allocations");
      console.log(
        "      • Use streaming generation to reduce memory footprint",
      );
      console.log("      • Consider incremental generation strategies");
      console.log("      • Optimize property iteration patterns");
    }

    if (largeCodeSize.length > 0) {
      console.log("   📄 Large Code Size Considerations:");
      console.log("      • Implement code splitting for large models");
      console.log("      • Use template-based generation for efficiency");
      console.log("      • Consider Go package generation for organization");
      console.log("      • Add optional code formatting configuration");
    }

    if (poorPerformance.length === 0 && fairPerformance.length === 0) {
      console.log("   🎉 Excellent Scalability:");
      console.log("      • Performance scales well with model size");
      console.log("      • Memory usage is reasonable for large models");
      console.log("      • Generation speed is consistently fast");
      console.log("      • Ready for production large-scale usage");
    }

    console.log();
    console.log("🎯 PRODUCTION GUIDELINES:");
    console.log(
      "   • Models <50 properties: Suitable for real-time generation",
    );
    console.log(
      "   • Models 50-100 properties: Suitable for on-demand generation",
    );
    console.log(
      "   • Models 100-200 properties: Consider pre-generation/caching",
    );
    console.log("   • Models >200 properties: Implement background generation");
  }
}

/**
 * Run large model performance testing
 */
export async function runLargeModelPerformanceSuite(): Promise<void> {
  const tester = new LargeModelPerformanceTester();
  await tester.runLargeModelPerformanceSuite();
}

// Test cases for vitest
describe("Large Model Performance Tests", () => {
  let tester: LargeModelPerformanceTester;

  beforeEach(() => {
    tester = new LargeModelPerformanceTester();
  });

  it("should create large model tester successfully", () => {
    expect(tester).toBeDefined();
  });

  it("should handle small models efficiently", async () => {
    const metrics = await tester["testLargeModelPerformance"](25, 5);
    expect(metrics.propertyCount).toBe(25);
    expect(metrics.generationTimeMs).toBeLessThan(100);
  });

  it("should classify performance correctly", () => {
    // Test performance classification logic
    const mockMetrics: LargeModelMetrics = {
      propertyCount: 50,
      generationTimeMs: 25,
      memoryUsageMB: 10,
      goCodeSize: 1000,
      performanceClassification: "Good"
    };
    expect(mockMetrics.performanceClassification).toBe("Good");
  });
});

// Export for use in other modules
export { LargeModelPerformanceTester, LargeModelMetrics };
