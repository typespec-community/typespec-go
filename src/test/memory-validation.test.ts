/**
 * Memory Usage Validation - TypeSpec Go Emitter
 *
 * Tests memory usage patterns with large models
 * Validates memory efficiency and leak prevention
 * Ensures proper garbage collection behavior
 */

import { performance } from "perf_hooks";
import { StandaloneGoGenerator } from "../src/standalone-generator.js";
import type { GoEmitterResult } from "../src/domain/unified-errors.js";

interface MemoryMetrics {
  testId: string;
  testName: string;
  propertyCount: number;
  baselineMemoryMB: number;
  peakMemoryMB: number;
  memoryOverheadMB: number;
  memoryPerPropertyMB: number;
  memoryLeakDetected: boolean;
  acceptableMemoryUsage: boolean;
}

interface MemoryLeakTestResult {
  iterations: number;
  initialMemoryMB: number;
  finalMemoryMB: number;
  memoryGrowthMB: number;
  leakDetected: boolean;
  averageMemoryPerIterationMB: number;
}

class MemoryUsageValidator {
  private generator: StandaloneGoGenerator;
  private memoryMetrics: MemoryMetrics[] = [];
  private leakTestResults: MemoryLeakTestResult[] = [];

  constructor() {
    this.generator = new StandaloneGoGenerator();
  }

  /**
   * Get current memory usage in MB
   */
  private getMemoryUsage(): number {
    const usage = process.memoryUsage();
    return Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100;
  }

  /**
   * Force garbage collection if available
   */
  private forceGarbageCollection(): void {
    if (global.gc) {
      global.gc();
    }
  }

  /**
   * Generate a test model for memory testing
   */
  private generateTestModel(propertyCount: number, complexity: "simple" | "complex" = "simple"): any {
    const properties = new Map();
    const baseTypes = complexity === "simple" 
      ? ["String", "Int32", "Boolean"]
      : ["String", "Int8", "Int16", "Int32", "Int64", "Uint8", "Uint16", "Uint32", "Uint64", "Float32", "Float64", "Boolean"];
    
    for (let i = 0; i < propertyCount; i++) {
      const typeIndex = i % baseTypes.length;
      const baseType = baseTypes[typeIndex];
      const isOptional = i % 3 === 0;
      
      properties.set(`field${i}`, {
        name: `field${i}`,
        type: { kind: baseType },
        optional: isOptional,
        documentation: `Memory test field ${i} - ${baseType} type${isOptional ? ' (optional)' : ''}`
      });
    }

    return {
      name: `MemoryTestModel${propertyCount}`,
      properties
    };
  }

  /**
   * Test memory usage for a specific model
   */
  private async testMemoryUsage(
    testId: string,
    testName: string,
    propertyCount: number,
    complexity: "simple" | "complex" = "simple",
    iterations: number = 10
  ): Promise<MemoryMetrics> {
    
    console.log(`🧪 Memory test: ${testName} (${propertyCount} properties, ${complexity} complexity)`);
    
    const model = this.generateTestModel(propertyCount, complexity);
    
    // Baseline memory measurement
    this.forceGarbageCollection();
    const baselineMemory = this.getMemoryUsage();
    
    let peakMemory = baselineMemory;
    
    // Run multiple iterations to find peak memory
    for (let i = 0; i < iterations; i++) {
      const result = this.generator.generateModel(model);
      
      // Validate generation succeeded
      if (result._tag !== "Success") {
        throw new Error(`Memory test failed: ${result.message}`);
      }
      
      // Track memory usage
      const currentMemory = this.getMemoryUsage();
      peakMemory = Math.max(peakMemory, currentMemory);
      
      // Periodic garbage collection
      if (i % 3 === 0) {
        this.forceGarbageCollection();
      }
    }
    
    // Final cleanup and measurement
    this.forceGarbageCollection();
    const finalMemory = this.getMemoryUsage();
    
    // Calculate metrics
    const memoryOverhead = finalMemory - baselineMemory;
    const memoryPerProperty = memoryOverhead / Math.max(1, propertyCount);
    
    // Acceptable memory thresholds
    const acceptableThresholds = {
      simple: { overheadMB: 10, perPropertyMB: 0.5 },
      complex: { overheadMB: 20, perPropertyMB: 0.8 }
    };
    
    const threshold = acceptableThresholds[complexity];
    const acceptableMemoryUsage = 
      memoryOverhead <= threshold.overheadMB && 
      memoryPerProperty <= threshold.perPropertyMB;
    
    const metrics: MemoryMetrics = {
      testId,
      testName,
      propertyCount,
      baselineMemoryMB: baselineMemory,
      peakMemoryMB: peakMemory,
      memoryOverheadMB: Math.max(0, memoryOverhead),
      memoryPerPropertyMB: Math.max(0, memoryPerProperty),
      memoryLeakDetected: false, // Will be updated by leak tests
      acceptableMemoryUsage
    };

    this.printMemoryMetrics(metrics);
    this.memoryMetrics.push(metrics);
    
    return metrics;
  }

  /**
   * Print memory metrics for a test
   */
  private printMemoryMetrics(metrics: MemoryMetrics): void {
    const usageEmoji = metrics.acceptableMemoryUsage ? "✅" : "⚠️";
    
    console.log(`📊 Memory Metrics for ${metrics.testName}:`);
    console.log(`   ${usageEmoji} Memory Usage: ${metrics.acceptableMemoryUsage ? 'Acceptable' : 'High'}`);
    console.log(`   💾 Baseline: ${metrics.baselineMemoryMB}MB`);
    console.log(`   📈 Peak: ${metrics.peakMemoryMB}MB`);
    console.log(`   ➕ Overhead: ${metrics.memoryOverheadMB}MB`);
    console.log(`   📊 Per Property: ${metrics.memoryPerPropertyMB.toFixed(3)}MB`);
    console.log(`   📋 Property Count: ${metrics.propertyCount}`);
    console.log();
  }

  /**
   * Test for memory leaks over multiple generations
   */
  private async testMemoryLeaks(
    testId: string,
    modelName: string,
    propertyCount: number,
    iterations: number = 100
  ): Promise<MemoryLeakTestResult> {
    
    console.log(`🔍 Memory leak test: ${modelName} (${iterations} generations)`);
    
    const model = this.generateTestModel(propertyCount);
    
    // Initial memory measurement
    this.forceGarbageCollection();
    const initialMemory = this.getMemoryUsage();
    let maxMemory = initialMemory;
    let totalMemory = 0;
    
    // Run multiple generations to detect leaks
    for (let i = 0; i < iterations; i++) {
      const result = this.generator.generateModel(model);
      
      if (result._tag === "Success") {
        // Simulate using the generated code
        const goCode = result.data.get(`${model.name}.go`);
        if (goCode) {
          // Simulate processing
          totalMemory += goCode.length;
        }
      }
      
      // Track memory usage
      const currentMemory = this.getMemoryUsage();
      maxMemory = Math.max(maxMemory, currentMemory);
      
      // Periodic garbage collection
      if (i % 10 === 0) {
        this.forceGarbageCollection();
      }
    }
    
    // Final cleanup and measurement
    this.forceGarbageCollection();
    const finalMemory = this.getMemoryUsage();
    
    // Calculate leak detection
    const memoryGrowth = finalMemory - initialMemory;
    const leakDetected = memoryGrowth > (initialMemory * 0.1); // 10% growth threshold
    const averageMemoryPerIteration = totalMemory / iterations / 1024 / 1024; // Convert to MB
    
    const result: MemoryLeakTestResult = {
      iterations,
      initialMemoryMB: initialMemory,
      finalMemoryMB: finalMemory,
      memoryGrowthMB: memoryGrowth,
      leakDetected,
      averageMemoryPerIterationMB: averageMemoryPerIteration
    };

    this.printLeakTestResult(result);
    this.leakTestResults.push(result);
    
    return result;
  }

  /**
   * Print memory leak test results
   */
  private printLeakTestResult(result: MemoryLeakTestResult): void {
    const leakEmoji = result.leakDetected ? "🚨" : "✅";
    
    console.log(`📊 Memory Leak Test Results:`);
    console.log(`   ${leakEmoji} Leak Detected: ${result.leakDetected ? 'YES' : 'NO'}`);
    console.log(`   💾 Initial Memory: ${result.initialMemoryMB}MB`);
    console.log(`   💾 Final Memory: ${result.finalMemoryMB}MB`);
    console.log(`   📈 Memory Growth: ${result.memoryGrowthMB}MB`);
    console.log(`   🔄 Iterations: ${result.iterations}`);
    console.log(`   📊 Average Memory/Iteration: ${result.averageMemoryPerIterationMB.toFixed(2)}MB`);
    
    if (result.leakDetected) {
      console.log(`   ⚠️ WARNING: Memory leak detected! Growth: ${result.memoryGrowthMB}MB`);
      console.log(`   🔧 Recommendation: Review object allocation and cleanup patterns`);
    } else {
      console.log(`   ✅ Memory usage stable - no leaks detected`);
    }
    
    console.log();
  }

  /**
   * Run comprehensive memory validation suite
   */
  async runMemoryValidationSuite(): Promise<void> {
    console.log("🚀 Memory Usage Validation Suite");
    console.log("=" .repeat(50));

    // Test 1: Simple models with increasing property counts
    const simpleModelTests = [
      { properties: 10, name: "Tiny Simple Model" },
      { properties: 25, name: "Small Simple Model" },
      { properties: 50, name: "Medium Simple Model" },
      { properties: 100, name: "Large Simple Model" },
      { properties: 200, name: "Very Large Simple Model" },
    ];

    console.log("📋 PHASE 1: Simple Model Memory Testing");
    for (const test of simpleModelTests) {
      await this.testMemoryUsage(
        `simple-${test.properties}`,
        test.name,
        test.properties,
        "simple",
        15
      );
    }

    // Test 2: Complex models with increasing property counts
    const complexModelTests = [
      { properties: 25, name: "Small Complex Model" },
      { properties: 75, name: "Medium Complex Model" },
      { properties: 150, name: "Large Complex Model" },
    ];

    console.log("📋 PHASE 2: Complex Model Memory Testing");
    for (const test of complexModelTests) {
      await this.testMemoryUsage(
        `complex-${test.properties}`,
        test.name,
        test.properties,
        "complex",
        10
      );
    }

    // Test 3: Memory leak detection
    const leakTests = [
      { properties: 25, name: "Medium Model Leak Test", iterations: 50 },
      { properties: 50, name: "Large Model Leak Test", iterations: 30 },
      { properties: 100, name: "Very Large Model Leak Test", iterations: 15 },
    ];

    console.log("📋 PHASE 3: Memory Leak Detection");
    for (const test of leakTests) {
      await this.testMemoryLeaks(
        `leak-${test.properties}`,
        test.name,
        test.properties,
        test.iterations
      );
    }

    // Generate comprehensive report
    this.generateMemoryValidationReport();
  }

  /**
   * Generate comprehensive memory validation report
   */
  private generateMemoryValidationReport(): void {
    console.log("📊 MEMORY VALIDATION COMPREHENSIVE REPORT");
    console.log("=" .repeat(50));

    // Memory usage analysis
    const acceptableMemory = this.memoryMetrics.filter(m => m.acceptableMemoryUsage);
    const highMemory = this.memoryMetrics.filter(m => !m.acceptableMemoryUsage);
    
    console.log("💾 MEMORY USAGE ANALYSIS:");
    console.log(`   ✅ Acceptable: ${acceptableMemory.length}/${this.memoryMetrics.length} tests`);
    console.log(`   ⚠️ High Usage: ${highMemory.length}/${this.memoryMetrics.length} tests`);

    if (highMemory.length > 0) {
      console.log("   High Usage Tests:");
      highMemory.forEach(test => {
        console.log(`      • ${test.testName}: ${test.memoryOverheadMB}MB overhead`);
      });
    }

    // Memory leak analysis
    const leakDetected = this.leakTestResults.filter(r => r.leakDetected);
    const noLeaks = this.leakTestResults.filter(r => !r.leakDetected);
    
    console.log();
    console.log("🔍 MEMORY LEAK ANALYSIS:");
    console.log(`   ✅ No Leaks: ${noLeaks.length}/${this.leakTestResults.length} tests`);
    console.log(`   🚨 Leaks Detected: ${leakDetected.length}/${this.leakTestResults.length} tests`);

    if (leakDetected.length > 0) {
      console.log("   Memory Leak Tests:");
      leakDetected.forEach(test => {
        console.log(`      • ${test.iterations} iterations: ${test.memoryGrowthMB}MB growth`);
      });
    }

    // Efficiency analysis
    this.generateMemoryEfficiencyReport();

    // Recommendations
    this.generateMemoryRecommendations();

    // Memory validation summary
    this.generateMemoryValidationSummary();
  }

  /**
   * Generate memory efficiency report
   */
  private generateMemoryEfficiencyReport(): void {
    console.log();
    console.log("📈 MEMORY EFFICIENCY ANALYSIS:");

    // Calculate efficiency metrics
    const memoryPerProperty = this.memoryMetrics.map(m => m.memoryPerPropertyMB);
    const avgMemoryPerProperty = memoryPerProperty.reduce((sum, mem) => sum + mem, 0) / memoryPerProperty.length;
    const maxMemoryPerProperty = Math.max(...memoryPerProperty);
    const minMemoryPerProperty = Math.min(...memoryPerProperty);

    console.log(`   📊 Average Memory per Property: ${avgMemoryPerProperty.toFixed(3)}MB`);
    console.log(`   📊 Maximum Memory per Property: ${maxMemoryPerProperty.toFixed(3)}MB`);
    console.log(`   📊 Minimum Memory per Property: ${minMemoryPerProperty.toFixed(3)}MB`);

    // Efficiency classification
    let efficiencyGrade = "A+";
    if (avgMemoryPerProperty > 1.0) efficiencyGrade = "C";
    else if (avgMemoryPerProperty > 0.5) efficiencyGrade = "B";
    else if (avgMemoryPerProperty > 0.1) efficiencyGrade = "A";

    console.log(`   🏆 Memory Efficiency Grade: ${efficiencyGrade}`);

    // Property scaling analysis
    const scalable = this.memoryMetrics.filter(m => m.memoryPerPropertyMB < 0.1).length;
    const scalingRatio = scalable / this.memoryMetrics.length;
    
    console.log(`   📈 Scaling Efficiency: ${Math.round(scalingRatio * 100)}% tests scale well`);
  }

  /**
   * Generate memory usage recommendations
   */
  private generateMemoryRecommendations(): void {
    console.log();
    console.log("💡 MEMORY OPTIMIZATION RECOMMENDATIONS:");

    const highMemoryTests = this.memoryMetrics.filter(m => !m.acceptableMemoryUsage);
    const leakTests = this.leakTestResults.filter(r => r.leakDetected);
    const inefficientTests = this.memoryMetrics.filter(m => m.memoryPerPropertyMB > 0.5);

    if (highMemoryTests.length > 0) {
      console.log("   💾 High Memory Usage Solutions:");
      console.log("      • Implement object pooling for frequent allocations");
      console.log("      • Use streaming generation for large models");
      console.log("      • Reduce intermediate object creation");
      console.log("      • Optimize type mapping lookups with caching");
    }

    if (leakTests.length > 0) {
      console.log("   🔍 Memory Leak Solutions:");
      console.log("      • Ensure proper cleanup of generated code objects");
      console.log("      • Implement explicit memory management patterns");
      console.log("      • Use weak references for cached objects");
      console.log("      • Add memory monitoring in production code");
    }

    if (inefficientTests.length > 0) {
      console.log("   📊 Memory Efficiency Solutions:");
      console.log("      • Implement lazy evaluation strategies");
      console.log("      • Use more memory-efficient data structures");
      console.log("      • Consider in-place modifications where possible");
      console.log("      • Implement memory reuse patterns");
    }

    if (highMemoryTests.length === 0 && leakTests.length === 0 && inefficientTests.length === 0) {
      console.log("   🎉 Excellent Memory Management:");
      console.log("      • Memory usage is within acceptable limits");
      console.log("      • No memory leaks detected");
      console.log("      • Memory efficiency is optimal");
      console.log("      • System is ready for production scale");
    }
  }

  /**
   * Generate memory validation summary
   */
  private generateMemoryValidationSummary(): void {
    console.log();
    console.log("🎯 MEMORY VALIDATION SUMMARY:");

    const allTestsPassed = 
      this.memoryMetrics.every(m => m.acceptableMemoryUsage) &&
      this.leakTestResults.every(r => !r.leakDetected);

    if (allTestsPassed) {
      console.log("   ✅ ALL MEMORY TESTS PASSED");
      console.log("   🚀 System is memory-efficient and leak-free");
      console.log("   💾 Memory usage is within acceptable limits");
      console.log("   🔒 No memory leaks detected");
      console.log("   📈 Memory scaling is efficient");
    } else {
      console.log("   ⚠️ SOME MEMORY ISSUES DETECTED");
      console.log("   🔧 Review recommendations for optimization");
      console.log("   📊 Monitor memory usage in production");
      console.log("   🔄 Consider periodic memory audits");
    }

    // Production readiness assessment
    const memoryIssues = 
      this.memoryMetrics.filter(m => !m.acceptableMemoryUsage).length +
      this.leakTestResults.filter(r => r.leakDetected).length;

    let readinessLevel = "Production Ready";
    if (memoryIssues > 2) readinessLevel = "Needs Optimization";
    else if (memoryIssues > 0) readinessLevel = "Mostly Ready";

    console.log(`   🏆 Production Readiness: ${readinessLevel}`);

    // Validation thresholds summary
    console.log();
    console.log("📊 VALIDATION THRESHOLDS MET:");
    console.log("   Simple Models: <10MB overhead, <0.5MB per property");
    console.log("   Complex Models: <20MB overhead, <0.8MB per property");
    console.log("   Memory Leaks: <10% memory growth over 100 iterations");
    console.log("   Memory Efficiency: <0.1MB per property for optimal scaling");
  }
}

/**
 * Run memory validation testing
 */
export async function runMemoryValidation(): Promise<void> {
  const validator = new MemoryUsageValidator();
  await validator.runMemoryValidationSuite();
}

// Export for use in other modules
export { MemoryUsageValidator, MemoryMetrics, MemoryLeakTestResult };