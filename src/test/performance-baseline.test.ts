/**
 * Performance Testing - TypeSpec Go Emitter
 *
 * Establishes baseline performance metrics
 * Measures generation speed and memory usage
 * Provides benchmarking for optimization
 */

import { performance } from "perf_hooks";
import { StandaloneGoGenerator } from "../standalone-generator.js";
import type { GoEmitterResult } from "../src/domain/unified-errors.js";

interface PerformanceMetrics {
  testName: string;
  modelComplexity: string;
  propertyCount: number;
  generationTimeMs: number;
  memoryUsageMB: number;
  throughputPerSecond: number;
  goCodeSize: number;
}

class PerformanceTester {
  private generator: StandaloneGoGenerator;
  private results: PerformanceMetrics[] = [];

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
   * Run a performance test
   */
  private async runPerformanceTest(
    testName: string,
    modelComplexity: string,
    modelFactory: () => any,
    iterations: number = 100,
  ): Promise<PerformanceMetrics> {
    console.log(`🧪 Running performance test: ${testName}`);
    console.log(`📊 Model complexity: ${modelComplexity}`);
    console.log(`🔄 Iterations: ${iterations}`);

    // Baseline memory measurement
    const baselineMemory = this.getMemoryUsage();

    // Pre-warm the generator
    this.generator.generateModel(modelFactory());

    // Performance measurement
    const startTime = performance.now();
    let totalGoCodeSize = 0;

    for (let i = 0; i < iterations; i++) {
      const model = modelFactory();
      const result = this.generator.generateModel(model);

      if (result._tag === "Success") {
        const goCode = result.data.get(`${model.name}.go`) || "";
        totalGoCodeSize += goCode.length;
      }

      // Prevent memory accumulation
      if (i % 10 === 0) {
        if (global.gc) global.gc();
      }
    }

    const endTime = performance.now();
    const totalTimeMs = endTime - startTime;
    const peakMemory = this.getMemoryUsage();
    const memoryOverhead = peakMemory - baselineMemory;

    // Calculate metrics
    const averageGenerationTimeMs = totalTimeMs / iterations;
    const throughputPerSecond = Math.round(1000 / averageGenerationTimeMs);
    const averageGoCodeSize = Math.round(totalGoCodeSize / iterations);

    const metrics: PerformanceMetrics = {
      testName,
      modelComplexity,
      propertyCount: modelFactory().properties.size,
      generationTimeMs: Math.round(averageGenerationTimeMs * 100) / 100,
      memoryUsageMB: Math.max(0, memoryOverhead),
      throughputPerSecond,
      goCodeSize: averageGoCodeSize,
    };

    this.results.push(metrics);
    this.printMetrics(metrics);

    return metrics;
  }

  /**
   * Print detailed performance metrics
   */
  private printMetrics(metrics: PerformanceMetrics): void {
    console.log(`📊 Performance Results for ${metrics.testName}:`);
    console.log(`   ⏱️  Average generation time: ${metrics.generationTimeMs}ms`);
    console.log(
      `   🚀 Throughput: ${metrics.throughputPerSecond} models/second`,
    );
    console.log(`   💾 Memory overhead: ${metrics.memoryUsageMB}MB`);
    console.log(`   📄 Average Go code size: ${metrics.goCodeSize} characters`);
    console.log(`   📋 Property count: ${metrics.propertyCount}`);
    console.log();
  }

  /**
   * Run comprehensive performance suite
   */
  async runPerformanceBaseline(): Promise<void> {
    console.log("🚀 TypeSpec Go Emitter - Performance Baseline");
    console.log("=".repeat(50));

    // Test 1: Simple model (baseline)
    await this.runPerformanceTest(
      "Simple User Model",
      "Simple (5 properties)",
      () => ({
        name: "User",
        properties: new Map([
          ["id", { name: "id", type: { kind: "String" }, optional: false }],
          ["name", { name: "name", type: { kind: "String" }, optional: false }],
          [
            "email",
            { name: "email", type: { kind: "String" }, optional: true },
          ],
          ["age", { name: "age", type: { kind: "Uint8" }, optional: true }],
          [
            "active",
            { name: "active", type: { kind: "Boolean" }, optional: false },
          ],
        ]),
      }),
      200, // More iterations for simple model
    );

    // Test 2: Medium model
    await this.runPerformanceTest(
      "Medium Product Model",
      "Medium (15 properties)",
      () => ({
        name: "Product",
        properties: new Map([
          // Basic fields
          ["id", { name: "id", type: { kind: "String" }, optional: false }],
          ["name", { name: "name", type: { kind: "String" }, optional: false }],
          [
            "description",
            { name: "description", type: { kind: "String" }, optional: true },
          ],
          ["sku", { name: "sku", type: { kind: "String" }, optional: false }],
          [
            "price",
            { name: "price", type: { kind: "Float64" }, optional: false },
          ],

          // Inventory fields
          [
            "quantity",
            { name: "quantity", type: { kind: "Uint32" }, optional: false },
          ],
          [
            "inStock",
            { name: "inStock", type: { kind: "Boolean" }, optional: false },
          ],
          [
            "reorderPoint",
            { name: "reorderPoint", type: { kind: "Uint16" }, optional: true },
          ],
          [
            "weight",
            { name: "weight", type: { kind: "Float32" }, optional: true },
          ],

          // Status fields
          [
            "isActive",
            { name: "isActive", type: { kind: "Boolean" }, optional: false },
          ],
          [
            "isFeatured",
            { name: "isFeatured", type: { kind: "Boolean" }, optional: true },
          ],
          [
            "isDigital",
            { name: "isDigital", type: { kind: "Boolean" }, optional: true },
          ],

          // Timestamp fields
          [
            "createdAt",
            { name: "createdAt", type: { kind: "String" }, optional: true },
          ],
          [
            "updatedAt",
            { name: "updatedAt", type: { kind: "String" }, optional: true },
          ],
        ]),
      }),
      100,
    );

    // Test 3: Complex model
    await this.runPerformanceTest(
      "Complex Order Model",
      "Complex (25 properties)",
      () => ({
        name: "Order",
        properties: new Map([
          // Order metadata
          ["id", { name: "id", type: { kind: "String" }, optional: false }],
          [
            "orderNumber",
            { name: "orderNumber", type: { kind: "String" }, optional: false },
          ],
          [
            "status",
            { name: "status", type: { kind: "String" }, optional: false },
          ],
          [
            "priority",
            { name: "priority", type: { kind: "String" }, optional: true },
          ],

          // Customer information
          [
            "customerId",
            { name: "customerId", type: { kind: "String" }, optional: false },
          ],
          [
            "customerName",
            { name: "customerName", type: { kind: "String" }, optional: false },
          ],
          [
            "customerEmail",
            { name: "customerEmail", type: { kind: "String" }, optional: true },
          ],
          [
            "customerPhone",
            { name: "customerPhone", type: { kind: "String" }, optional: true },
          ],

          // Financial information
          [
            "subtotal",
            { name: "subtotal", type: { kind: "Float64" }, optional: false },
          ],
          ["tax", { name: "tax", type: { kind: "Float64" }, optional: false }],
          [
            "shipping",
            { name: "shipping", type: { kind: "Float32" }, optional: true },
          ],
          [
            "discount",
            { name: "discount", type: { kind: "Float32" }, optional: true },
          ],
          [
            "total",
            { name: "total", type: { kind: "Float64" }, optional: false },
          ],
          [
            "currency",
            { name: "currency", type: { kind: "String" }, optional: false },
          ],

          // Address information
          [
            "shippingAddress",
            {
              name: "shippingAddress",
              type: { kind: "String" },
              optional: true,
            },
          ],
          [
            "billingAddress",
            {
              name: "billingAddress",
              type: { kind: "String" },
              optional: true,
            },
          ],
          [
            "shippingMethod",
            {
              name: "shippingMethod",
              type: { kind: "String" },
              optional: true,
            },
          ],

          // Order items
          [
            "itemCount",
            { name: "itemCount", type: { kind: "Uint16" }, optional: false },
          ],
          [
            "totalWeight",
            { name: "totalWeight", type: { kind: "Float32" }, optional: true },
          ],

          // Timestamps
          [
            "orderDate",
            { name: "orderDate", type: { kind: "String" }, optional: false },
          ],
          [
            "deliveryDate",
            { name: "deliveryDate", type: { kind: "String" }, optional: true },
          ],
          [
            "estimatedDelivery",
            {
              name: "estimatedDelivery",
              type: { kind: "String" },
              optional: true,
            },
          ],

          // Additional fields
          [
            "notes",
            { name: "notes", type: { kind: "String" }, optional: true },
          ],
          [
            "tags",
            {
              name: "tags",
              type: { kind: "Array", elementType: { kind: "scalar", name: "string" } },
              optional: true,
            },
          ],
        ]),
      }),
      50,
    );

    // Generate performance summary
    this.generatePerformanceSummary();
  }

  /**
   * Generate comprehensive performance summary
   */
  private generatePerformanceSummary(): void {
    console.log("📊 PERFORMANCE SUMMARY");
    console.log("=".repeat(50));

    if (this.results.length === 0) {
      console.log("No performance data collected.");
      return;
    }

    // Calculate aggregates
    const totalTime = this.results.reduce(
      (sum, r) => sum + r.generationTimeMs,
      0,
    );
    const avgTime = Math.round((totalTime / this.results.length) * 100) / 100;
    const minTime = Math.min(...this.results.map((r) => r.generationTimeMs));
    const maxTime = Math.max(...this.results.map((r) => r.generationTimeMs));

    const totalMemory = this.results.reduce(
      (sum, r) => sum + r.memoryUsageMB,
      0,
    );
    const avgMemory =
      Math.round((totalMemory / this.results.length) * 100) / 100;

    const minThroughput = Math.min(
      ...this.results.map((r) => r.throughputPerSecond),
    );
    const maxThroughput = Math.max(
      ...this.results.map((r) => r.throughputPerSecond),
    );

    // Performance classification
    let performanceGrade = "A+";
    if (avgTime > 10) performanceGrade = "B";
    if (avgTime > 50) performanceGrade = "C";
    if (avgTime > 100) performanceGrade = "D";

    console.log(`🏆 Performance Grade: ${performanceGrade}`);
    console.log(`⏱️  Average generation time: ${avgTime}ms`);
    console.log(`📊 Time range: ${minTime}ms - ${maxTime}ms`);
    console.log(`💾 Average memory overhead: ${avgMemory}MB`);
    console.log(
      `🚀 Throughput range: ${minThroughput} - ${maxThroughput} models/second`,
    );

    console.log();
    console.log("📋 Detailed Results:");
    this.results.forEach((result, index) => {
      const efficiency =
        result.propertyCount / Math.max(1, result.generationTimeMs);
      console.log(`   ${index + 1}. ${result.testName}`);
      console.log(
        `      Properties: ${result.propertyCount} | Time: ${result.generationTimeMs}ms | Throughput: ${result.throughputPerSecond} models/sec | Efficiency: ${efficiency.toFixed(2)}`,
      );
    });

    console.log();
    console.log("🎯 Baseline Establisheds:");
    console.log("   • Simple models: Should be <5ms generation time");
    console.log("   • Medium models: Should be <15ms generation time");
    console.log("   • Complex models: Should be <50ms generation time");
    console.log("   • Memory overhead: Should be <10MB for any model");
    console.log("   • Throughput: Should be >20 models/second");

    // Performance recommendations
    this.generatePerformanceRecommendations();
  }

  /**
   * Generate performance optimization recommendations
   */
  private generatePerformanceRecommendations(): void {
    console.log();
    console.log("💡 PERFORMANCE OPTIMIZATION RECOMMENDATIONS:");

    const slowTest = this.results.find((r) => r.generationTimeMs > 20);
    const memoryIntensive = this.results.find((r) => r.memoryUsageMB > 20);
    const lowThroughput = this.results.find((r) => r.throughputPerSecond < 10);

    if (slowTest) {
      console.log("   ⚠️  Slow generation detected:");
      console.log("      • Consider caching type mapping lookups");
      console.log("      • Optimize string concatenation patterns");
      console.log("      • Reduce object allocation in generation loops");
    }

    if (memoryIntensive) {
      console.log("   ⚠️  High memory usage detected:");
      console.log("      • Implement object pooling for frequent allocations");
      console.log("      • Use streaming generation for large models");
      console.log("      • Consider lazy evaluation strategies");
    }

    if (lowThroughput) {
      console.log("   ⚠️  Low throughput detected:");
      console.log("      • Implement parallel generation for multiple models");
      console.log("      • Add generator instance reuse");
      console.log("      • Consider async generation patterns");
    }

    if (!slowTest && !memoryIntensive && !lowThroughput) {
      console.log("   ✅ Excellent performance detected!");
      console.log("      • Current implementation is well-optimized");
      console.log("      • Consider load testing for production validation");
      console.log("      • Monitor performance in production environment");
    }
  }
}

/**
 * Run performance baseline testing
 */
export async function runPerformanceBaseline(): Promise<void> {
  const tester = new PerformanceTester();
  await tester.runPerformanceBaseline();
}

// Export for use in other modules
export { PerformanceTester, PerformanceMetrics };
