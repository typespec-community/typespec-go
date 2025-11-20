/**
 * Performance Test Suite - TypeSpec Go Emitter
 *
 * Automated performance verification and regression testing
 * Maintains performance quality over time
 * Provides performance monitoring capabilities
 */

import { performance } from "perf_hooks";
import { StandaloneGoGenerator } from "../standalone-generator.js";
import type { GoEmitterResult } from "../src/domain/unified-errors.js";

interface PerformanceBenchmark {
  id: string;
  name: string;
  category: "basic" | "complex" | "large" | "stress";
  expectedMaxTimeMs: number;
  expectedMaxMemoryMB: number;
  expectedMinThroughput: number;
  modelFactory: () => any;
}

interface PerformanceTestResult {
  benchmark: PerformanceBenchmark;
  actualTimeMs: number;
  actualMemoryMB: number;
  actualThroughput: number;
  passed: boolean;
  failureReason?: string;
  timestamp: string;
}

class PerformanceTestSuite {
  private generator: StandaloneGoGenerator;
  private results: PerformanceTestResult[] = [];
  private benchmarks: PerformanceBenchmark[];

  constructor() {
    this.generator = new StandaloneGoGenerator();
    this.benchmarks = this.defineBenchmarks();
  }

  /**
   * Define performance benchmarks for testing
   */
  private defineBenchmarks(): PerformanceBenchmark[] {
    return [
      // Basic performance benchmarks
      {
        id: "basic-simple-user",
        name: "Basic Simple User Model",
        category: "basic",
        expectedMaxTimeMs: 5,
        expectedMaxMemoryMB: 2,
        expectedMinThroughput: 200,
        modelFactory: () => ({
          name: "User",
          properties: new Map([
            ["id", { name: "id", type: { kind: "String" }, optional: false }],
            ["name", { name: "name", type: { kind: "String" }, optional: false }],
            ["email", { name: "email", type: { kind: "String" }, optional: true }],
          ])
        })
      },
      {
        id: "basic-product",
        name: "Basic Product Model",
        category: "basic",
        expectedMaxTimeMs: 5,
        expectedMaxMemoryMB: 2,
        expectedMinThroughput: 200,
        modelFactory: () => ({
          name: "Product",
          properties: new Map([
            ["id", { name: "id", type: { kind: "String" }, optional: false }],
            ["name", { name: "name", type: { kind: "String" }, optional: false }],
            ["price", { name: "price", type: { kind: "Float64" }, optional: false }],
          ])
        })
      },

      // Complex performance benchmarks
      {
        id: "complex-user-profile",
        name: "Complex User Profile Model",
        category: "complex",
        expectedMaxTimeMs: 15,
        expectedMaxMemoryMB: 5,
        expectedMinThroughput: 50,
        modelFactory: () => ({
          name: "UserProfile",
          properties: new Map([
            ["id", { name: "id", type: { kind: "String" }, optional: false }],
            ["username", { name: "username", type: { kind: "String" }, optional: false }],
            ["email", { name: "email", type: { kind: "String" }, optional: true }],
            ["firstName", { name: "firstName", type: { kind: "String" }, optional: true }],
            ["lastName", { name: "lastName", type: { kind: "String" }, optional: true }],
            ["avatar", { name: "avatar", type: { kind: "String" }, optional: true }],
            ["age", { name: "age", type: { kind: "Uint8" }, optional: true }],
            ["active", { name: "active", type: { kind: "Boolean" }, optional: false }],
            ["verified", { name: "verified", type: { kind: "Boolean" }, optional: true }],
            ["lastLogin", { name: "lastLogin", type: { kind: "String" }, optional: true }],
          ])
        })
      },
      {
        id: "complex-api-response",
        name: "Complex API Response Model",
        category: "complex",
        expectedMaxTimeMs: 20,
        expectedMaxMemoryMB: 8,
        expectedMinThroughput: 40,
        modelFactory: () => ({
          name: "APIResponse",
          properties: new Map([
            ["status", { name: "status", type: { kind: "String" }, optional: false }],
            ["code", { name: "code", type: { kind: "Int32" }, optional: false }],
            ["message", { name: "message", type: { kind: "String" }, optional: true }],
            ["data", { name: "data", type: { kind: "String" }, optional: true }],
            ["timestamp", { name: "timestamp", type: { kind: "String" }, optional: false }],
            ["requestId", { name: "requestId", type: { kind: "String" }, optional: false }],
            ["userId", { name: "userId", type: { kind: "String" }, optional: true }],
            ["sessionId", { name: "sessionId", type: { kind: "String" }, optional: true }],
            ["errors", { 
              name: "errors", 
              type: { kind: "Array", element: { kind: "String" } }, 
              optional: true 
            }],
            ["warnings", { 
              name: "warnings", 
              type: { kind: "Array", element: { kind: "String" } }, 
              optional: true 
            }],
            ["metadata", { name: "metadata", type: { kind: "String" }, optional: true }],
            ["rateLimit", { name: "rateLimit", type: { kind: "Uint32" }, optional: true }],
            ["retryAfter", { name: "retryAfter", type: { kind: "Uint16" }, optional: true }],
          ])
        })
      },

      // Large model benchmarks
      {
        id: "large-order",
        name: "Large Order Model",
        category: "large",
        expectedMaxTimeMs: 50,
        expectedMaxMemoryMB: 15,
        expectedMinThroughput: 20,
        modelFactory: () => ({
          name: "Order",
          properties: new Map([
            ["id", { name: "id", type: { kind: "String" }, optional: false }],
            ["orderNumber", { name: "orderNumber", type: { kind: "String" }, optional: false }],
            ["customerId", { name: "customerId", type: { kind: "String" }, optional: false }],
            ["status", { name: "status", type: { kind: "String" }, optional: false }],
            ["subtotal", { name: "subtotal", type: { kind: "Float64" }, optional: false }],
            ["tax", { name: "tax", type: { kind: "Float64" }, optional: false }],
            ["total", { name: "total", type: { kind: "Float64" }, optional: false }],
            ["currency", { name: "currency", type: { kind: "String" }, optional: false }],
            ["createdAt", { name: "createdAt", type: { kind: "String" }, optional: false }],
            ["updatedAt", { name: "updatedAt", type: { kind: "String" }, optional: true }],
            ["items", { 
              name: "items", 
              type: { kind: "Array", element: { kind: "String" } }, 
              optional: true 
            }],
            ["shippingAddress", { name: "shippingAddress", type: { kind: "String" }, optional: true }],
            ["billingAddress", { name: "billingAddress", type: { kind: "String" }, optional: true }],
            ["paymentMethod", { name: "paymentMethod", type: { kind: "String" }, optional: true }],
            ["trackingNumber", { name: "trackingNumber", type: { kind: "String" }, optional: true }],
            ["estimatedDelivery", { name: "estimatedDelivery", type: { kind: "String" }, optional: true }],
          ])
        })
      },

      // Stress test benchmarks
      {
        id: "stress-complex",
        name: "Stress Test Complex Model",
        category: "stress",
        expectedMaxTimeMs: 100,
        expectedMaxMemoryMB: 50,
        expectedMinThroughput: 10,
        modelFactory: () => this.generateStressModel(50)
      },
      {
        id: "stress-large",
        name: "Stress Test Large Model",
        category: "stress",
        expectedMaxTimeMs: 150,
        expectedMaxMemoryMB: 80,
        expectedMinThroughput: 6,
        modelFactory: () => this.generateStressModel(100)
      },
    ];
  }

  /**
   * Generate stress test model with specified property count
   */
  private generateStressModel(propertyCount: number): any {
    const properties = new Map();
    const baseTypes = ["String", "Int32", "Uint32", "Float64", "Boolean"];
    
    for (let i = 0; i < propertyCount; i++) {
      const typeIndex = i % baseTypes.length;
      const baseType = baseTypes[typeIndex];
      const isOptional = i % 3 === 0;
      
      properties.set(`field${i}`, {
        name: `field${i}`,
        type: { kind: baseType },
        optional: isOptional,
        documentation: `Stress test field ${i} - ${baseType} type${isOptional ? ' (optional)' : ''}`
      });
    }

    return {
      name: `StressModel${propertyCount}`,
      properties
    };
  }

  /**
   * Get current memory usage in MB
   */
  private getMemoryUsage(): number {
    const usage = process.memoryUsage();
    return Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100;
  }

  /**
   * Run a single performance benchmark test
   */
  private async runBenchmarkTest(benchmark: PerformanceBenchmark, iterations: number = 10): Promise<PerformanceTestResult> {
    console.log(`🧪 Running benchmark: ${benchmark.name}`);
    console.log(`📊 Category: ${benchmark.category} | Expected: <${benchmark.expectedMaxTimeMs}ms, <${benchmark.expectedMaxMemoryMB}MB, >${benchmark.expectedMinThroughput}/sec`);
    
    // Warm up
    const model = benchmark.modelFactory();
    this.generator.generateModel(model);
    
    // Performance measurement
    const baselineMemory = this.getMemoryUsage();
    const startTime = performance.now();
    let peakMemory = baselineMemory;
    
    for (let i = 0; i < iterations; i++) {
      const result = this.generator.generateModel(model);
      
      if (result._tag !== "Success") {
        return {
          benchmark,
          actualTimeMs: 0,
          actualMemoryMB: 0,
          actualThroughput: 0,
          passed: false,
          failureReason: `Generation failed: ${result.message}`,
          timestamp: new Date().toISOString()
        };
      }
      
      // Track memory usage
      const currentMemory = this.getMemoryUsage();
      peakMemory = Math.max(peakMemory, currentMemory);
      
      // Prevent memory accumulation
      if (i % 3 === 0) {
        if (global.gc) global.gc();
      }
    }
    
    const endTime = performance.now();
    const totalTimeMs = endTime - startTime;
    
    // Calculate metrics
    const averageTimeMs = totalTimeMs / iterations;
    const memoryOverhead = peakMemory - baselineMemory;
    const throughput = Math.round(1000 / averageTimeMs);
    
    // Evaluate against benchmarks
    const passed = 
      averageTimeMs <= benchmark.expectedMaxTimeMs &&
      memoryOverhead <= benchmark.expectedMaxMemoryMB &&
      throughput >= benchmark.expectedMinThroughput;
    
    let failureReason: string | undefined;
    if (!passed) {
      const reasons = [];
      if (averageTimeMs > benchmark.expectedMaxTimeMs) 
        reasons.push(`Time: ${averageTimeMs}ms > ${benchmark.expectedMaxTimeMs}ms`);
      if (memoryOverhead > benchmark.expectedMaxMemoryMB) 
        reasons.push(`Memory: ${memoryOverhead}MB > ${benchmark.expectedMaxMemoryMB}MB`);
      if (throughput < benchmark.expectedMinThroughput) 
        reasons.push(`Throughput: ${throughput}/sec < ${benchmark.expectedMinThroughput}/sec`);
      failureReason = reasons.join("; ");
    }
    
    const result: PerformanceTestResult = {
      benchmark,
      actualTimeMs: Math.round(averageTimeMs * 100) / 100,
      actualMemoryMB: Math.max(0, memoryOverhead),
      actualThroughput: throughput,
      passed,
      failureReason,
      timestamp: new Date().toISOString()
    };

    this.printBenchmarkResult(result);
    this.results.push(result);
    
    return result;
  }

  /**
   * Print individual benchmark result
   */
  private printBenchmarkResult(result: PerformanceTestResult): void {
    const status = result.passed ? "✅ PASSED" : "❌ FAILED";
    const statusEmoji = result.passed ? "🎉" : "⚠️";
    
    console.log(`   ${status} ${statusEmoji} ${result.benchmark.name}`);
    console.log(`      ⏱️  Time: ${result.actualTimeMs}ms (target: <${result.benchmark.expectedMaxTimeMs}ms)`);
    console.log(`      💾 Memory: ${result.actualMemoryMB}MB (target: <${result.benchmark.expectedMaxMemoryMB}MB)`);
    console.log(`      🚀 Throughput: ${result.actualThroughput}/sec (target: >${result.benchmark.expectedMinThroughput}/sec)`);
    
    if (result.failureReason) {
      console.log(`      💥 Failure: ${result.failureReason}`);
    }
    
    console.log();
  }

  /**
   * Run complete performance test suite
   */
  async runPerformanceTestSuite(): Promise<void> {
    console.log("🚀 TypeSpec Go Emitter - Performance Test Suite");
    console.log("=" .repeat(50));
    
    console.log(`📊 Running ${this.benchmarks.length} performance benchmarks...\n`);
    
    // Run all benchmarks
    for (const benchmark of this.benchmarks) {
      await this.runBenchmarkTest(benchmark);
      
      // Allow system recovery between tests
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Generate comprehensive report
    this.generatePerformanceReport();
  }

  /**
   * Generate comprehensive performance report
   */
  private generatePerformanceReport(): void {
    console.log("📊 PERFORMANCE TEST SUITE REPORT");
    console.log("=" .repeat(50));
    
    const passed = this.results.filter(r => r.passed);
    const failed = this.results.filter(r => !r.passed);
    
    console.log(`📈 SUMMARY: ${passed.length}/${this.results.length} benchmarks passed`);
    
    if (failed.length > 0) {
      console.log(`⚠️  FAILED BENCHMARKS: ${failed.length}`);
      failed.forEach(result => {
        console.log(`   ❌ ${result.benchmark.name}: ${result.failureReason}`);
      });
    }
    
    // Category breakdown
    this.generateCategoryBreakdown();
    
    // Performance trends
    this.generatePerformanceTrends();
    
    // Recommendations
    this.generatePerformanceRecommendations();
    
    // Export results for CI/CD
    this.exportResultsForCI();
  }

  /**
   * Generate performance breakdown by category
   */
  private generateCategoryBreakdown(): void {
    console.log();
    console.log("📊 PERFORMANCE BREAKDOWN BY CATEGORY:");
    
    const categories = ["basic", "complex", "large", "stress"] as const;
    
    for (const category of categories) {
      const categoryResults = this.results.filter(r => r.benchmark.category === category);
      const categoryPassed = categoryResults.filter(r => r.passed);
      const avgTime = categoryResults.reduce((sum, r) => sum + r.actualTimeMs, 0) / categoryResults.length;
      const avgMemory = categoryResults.reduce((sum, r) => sum + r.actualMemoryMB, 0) / categoryResults.length;
      const avgThroughput = categoryResults.reduce((sum, r) => sum + r.actualThroughput, 0) / categoryResults.length;
      
      const categoryIcon = {
        "basic": "🏃",
        "complex": "🏋",
        "large": "🏊",
        "stress": "🏋‍♂️"
      }[category];
      
      console.log(`   ${categoryIcon} ${category.toUpperCase()}:`);
      console.log(`      Pass rate: ${categoryPassed.length}/${categoryResults.length} (${Math.round(categoryPassed.length / categoryResults.length * 100)}%)`);
      console.log(`      Avg time: ${Math.round(avgTime)}ms`);
      console.log(`      Avg memory: ${Math.round(avgMemory)}MB`);
      console.log(`      Avg throughput: ${Math.round(avgThroughput)}/sec`);
    }
  }

  /**
   * Generate performance trends analysis
   */
  private generatePerformanceTrends(): void {
    console.log();
    console.log("📈 PERFORMANCE TRENDS ANALYSIS:");
    
    // Sort by complexity
    const sortedByComplexity = [...this.results].sort((a, b) => 
      this.getComplexityScore(a.benchmark) - this.getComplexityScore(b.benchmark)
    );
    
    // Analyze scaling
    if (sortedByComplexity.length >= 3) {
      const simple = sortedByComplexity[0];
      const complex = sortedByComplexity[sortedByComplexity.length - 1];
      const timeRatio = complex.actualTimeMs / simple.actualTimeMs;
      const memoryRatio = complex.actualMemoryMB / Math.max(0.1, simple.actualMemoryMB);
      
      console.log(`   🔬 Scaling Analysis:`);
      console.log(`      Time scaling: ${timeRatio.toFixed(1)}x from simple to complex`);
      console.log(`      Memory scaling: ${memoryRatio.toFixed(1)}x from simple to complex`);
      
      if (timeRatio < 5) {
        console.log(`      ✅ Excellent time scaling`);
      } else if (timeRatio < 10) {
        console.log(`      ⚠️ Acceptable time scaling`);
      } else {
        console.log(`      ❌ Poor time scaling`);
      }
      
      if (memoryRatio < 5) {
        console.log(`      ✅ Excellent memory scaling`);
      } else if (memoryRatio < 10) {
        console.log(`      ⚠️ Acceptable memory scaling`);
      } else {
        console.log(`      ❌ Poor memory scaling`);
      }
    }
    
    // Performance consistency
    const times = this.results.map(r => r.actualTimeMs);
    const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
    const timeVariance = times.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / times.length;
    const timeStdDev = Math.sqrt(timeVariance);
    
    console.log(`   📊 Performance Consistency:`);
    console.log(`      Average time: ${Math.round(avgTime)}ms`);
    console.log(`      Standard deviation: ${Math.round(timeStdDev)}ms`);
    console.log(`      Coefficient of variation: ${Math.round((timeStdDev / avgTime) * 100)}%`);
    
    if (timeStdDev / avgTime < 0.3) {
      console.log(`      ✅ Very consistent performance`);
    } else if (timeStdDev / avgTime < 0.5) {
      console.log(`      ✅ Acceptable consistency`);
    } else {
      console.log(`      ⚠️ Performance varies significantly`);
    }
  }

  /**
   * Generate performance recommendations
   */
  private generatePerformanceRecommendations(): void {
    console.log();
    console.log("💡 PERFORMANCE OPTIMIZATION RECOMMENDATIONS:");
    
    const failedBenchmarks = this.results.filter(r => !r.passed);
    
    if (failedBenchmarks.length === 0) {
      console.log("   🎉 All benchmarks passed! Excellent performance.");
      console.log("   🚀 System is ready for production deployment.");
      console.log("   📊 Consider performance monitoring in production.");
      return;
    }
    
    // Categorize failures
    const timeFailures = failedBenchmarks.filter(r => r.actualTimeMs > r.benchmark.expectedMaxTimeMs);
    const memoryFailures = failedBenchmarks.filter(r => r.actualMemoryMB > r.benchmark.expectedMaxMemoryMB);
    const throughputFailures = failedBenchmarks.filter(r => r.actualThroughput < r.benchmark.expectedMinThroughput);
    
    if (timeFailures.length > 0) {
      console.log("   ⏱️  Time Optimization:");
      console.log("      • Implement type mapping cache for lookups");
      console.log("      • Optimize string concatenation operations");
      console.log("      • Reduce object allocations in generation loops");
      console.log("      • Consider template-based code generation");
    }
    
    if (memoryFailures.length > 0) {
      console.log("   💾 Memory Optimization:");
      console.log("      • Implement object pooling for frequent allocations");
      console.log("      • Use streaming generation for large models");
      console.log("      • Reduce intermediate object creation");
      console.log("      • Consider lazy evaluation strategies");
    }
    
    if (throughputFailures.length > 0) {
      console.log("   🚀 Throughput Optimization:");
      console.log("      • Implement parallel generation for multiple models");
      console.log("      • Add generator instance reuse");
      console.log("      • Consider async generation patterns");
      console.log("      • Optimize for high-frequency usage");
    }
  }

  /**
   * Calculate complexity score for benchmark
   */
  private getComplexityScore(benchmark: PerformanceBenchmark): number {
    const model = benchmark.modelFactory();
    const propertyCount = model.properties.size;
    
    // Add complexity for arrays, optional fields, etc.
    let complexity = propertyCount;
    
    for (const [, prop] of model.properties) {
      if (prop.optional) complexity += 0.5;
      if (prop.type.kind === "Array") complexity += 2;
      if (prop.type.kind?.element) complexity += 1;
    }
    
    return complexity;
  }

  /**
   * Export results for CI/CD integration
   */
  private exportResultsForCI(): void {
    console.log();
    console.log("🔧 CI/CD Integration Data:");
    
    const summary = {
      timestamp: new Date().toISOString(),
      total: this.results.length,
      passed: this.results.filter(r => r.passed).length,
      failed: this.results.filter(r => !r.passed).length,
      categories: {
        basic: {
          total: this.results.filter(r => r.benchmark.category === "basic").length,
          passed: this.results.filter(r => r.benchmark.category === "basic" && r.passed).length
        },
        complex: {
          total: this.results.filter(r => r.benchmark.category === "complex").length,
          passed: this.results.filter(r => r.benchmark.category === "complex" && r.passed).length
        },
        large: {
          total: this.results.filter(r => r.benchmark.category === "large").length,
          passed: this.results.filter(r => r.benchmark.category === "large" && r.passed).length
        },
        stress: {
          total: this.results.filter(r => r.benchmark.category === "stress").length,
          passed: this.results.filter(r => r.benchmark.category === "stress" && r.passed).length
        }
      },
      results: this.results.map(r => ({
        id: r.benchmark.id,
        name: r.benchmark.name,
        category: r.benchmark.category,
        passed: r.passed,
        timeMs: r.actualTimeMs,
        memoryMB: r.actualMemoryMB,
        throughput: r.actualThroughput,
        failureReason: r.failureReason
      }))
    };
    
    console.log(`📊 Performance Summary JSON:`);
    console.log(JSON.stringify(summary, null, 2));
    
    // Write results to file for CI/CD
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      fs.writeFileSync('performance-results.json', JSON.stringify(summary, null, 2));
      console.log("💾 Results saved to performance-results.json");
    }
  }
}

/**
 * Run performance test suite
 */
export async function runPerformanceTestSuite(): Promise<void> {
  const suite = new PerformanceTestSuite();
  await suite.runPerformanceTestSuite();
}

// Export for use in other modules
export { PerformanceTestSuite, PerformanceTestResult, PerformanceBenchmark };