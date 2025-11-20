/**
 * Memory Test Logic - TypeSpec Go Emitter
 *
 * Core memory testing utilities and validation logic
 * Provides memory usage tracking and leak detection
 */

import { performance } from "perf_hooks";
import { StandaloneGoGenerator } from "../../standalone-generator.js";
import type { GoEmitterResult } from "../../domain/unified-errors.js";

export interface MemoryMetrics {
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

export interface MemoryLeakTestResult {
  iterations: number;
  initialMemoryMB: number;
  finalMemoryMB: number;
  memoryGrowthMB: number;
  leakDetected: boolean;
  averageMemoryPerIterationMB: number;
}

/**
 * Memory usage testing utilities
 */
export class MemoryTestRunner {
  private generator: StandaloneGoGenerator;

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
    if (typeof global !== 'undefined' && (global as any).gc) {
      (global as any).gc();
    }
  }

  /**
   * Measure memory usage for model generation
   */
  measureMemoryUsage(model: {
    name: string;
    properties: ReadonlyMap<string, any>;
  }): MemoryMetrics {
    const testId = `memory-test-${Date.now()}`;
    const propertyCount = model.properties.size;

    // Force garbage collection before test
    this.forceGarbageCollection();
    const baselineMemoryMB = this.getMemoryUsage();

    // Generate code and measure peak memory
    const startTime = performance.now();
    let peakMemoryMB = baselineMemoryMB;

    const memoryCheckInterval = setInterval(() => {
      const currentMemoryMB = this.getMemoryUsage();
      peakMemoryMB = Math.max(peakMemoryMB, currentMemoryMB);
    }, 10);

    try {
      const result = this.generator.generateModel(model);
      
      // Clear interval and measure final memory
      clearInterval(memoryCheckInterval);
      this.forceGarbageCollection();
      const finalMemoryMB = this.getMemoryUsage();

      const memoryOverheadMB = finalMemoryMB - baselineMemoryMB;
      const memoryPerPropertyMB = propertyCount > 0 ? memoryOverheadMB / propertyCount : 0;
      const memoryLeakDetected = finalMemoryMB > baselineMemoryMB + 5; // 5MB threshold
      const acceptableMemoryUsage = memoryOverheadMB <= 10; // 10MB threshold

      return {
        testId,
        testName: model.name,
        propertyCount,
        baselineMemoryMB,
        peakMemoryMB,
        memoryOverheadMB,
        memoryPerPropertyMB,
        memoryLeakDetected,
        acceptableMemoryUsage,
      };
    } catch (error) {
      clearInterval(memoryCheckInterval);
      throw error;
    }
  }

  /**
   * Test for memory leaks over multiple iterations
   */
  testMemoryLeaks(
    modelFactory: () => { name: string; properties: ReadonlyMap<string, any> },
    iterations: number = 100
  ): MemoryLeakTestResult {
    this.forceGarbageCollection();
    const initialMemoryMB = this.getMemoryUsage();

    let totalMemoryUsage = 0;
    
    for (let i = 0; i < iterations; i++) {
      const model = modelFactory();
      this.generator.generateModel(model);
      
      const currentMemoryMB = this.getMemoryUsage();
      totalMemoryUsage += currentMemoryMB;
      
      // Force GC every 10 iterations
      if (i % 10 === 0) {
        this.forceGarbageCollection();
      }
    }

    // Final cleanup
    this.forceGarbageCollection();
    const finalMemoryMB = this.getMemoryUsage();

    const memoryGrowthMB = finalMemoryMB - initialMemoryMB;
    const leakDetected = memoryGrowthMB > 20; // 20MB leak threshold
    const averageMemoryPerIterationMB = totalMemoryUsage / iterations;

    return {
      iterations,
      initialMemoryMB,
      finalMemoryMB,
      memoryGrowthMB,
      leakDetected,
      averageMemoryPerIterationMB,
    };
  }

  /**
   * Test memory efficiency with progressively larger models
   */
  testMemoryEfficiency(): MemoryMetrics[] {
    const metrics: MemoryMetrics[] = [];
    
    // Test with increasing property counts
    const propertyCounts = [10, 50, 100, 200, 500];
    
    for (const propertyCount of propertyCounts) {
      const model = this.createTestModel(`MemoryTest-${propertyCount}`, propertyCount);
      const metric = this.measureMemoryUsage(model);
      metrics.push(metric);
    }
    
    return metrics;
  }

  /**
   * Create test model with specified property count
   */
  private createTestModel(name: string, propertyCount: number): {
    name: string;
    properties: ReadonlyMap<string, any>;
  } {
    const properties = new Map<string, any>();
    
    for (let i = 0; i < propertyCount; i++) {
      const typeIndex = i % 6; // Cycle through 6 basic types
      const types = [
        { kind: "String" },
        { kind: "Int32" },
        { kind: "Int64" },
        { kind: "Float64" },
        { kind: "Boolean" },
        { kind: "Array", element: { kind: "String" } },
      ];
      
      properties.set(`property${i}`, {
        name: `property${i}`,
        type: types[typeIndex],
        optional: i % 3 === 0, // 1/3 of properties are optional
      });
    }
    
    return { name, properties };
  }

  /**
   * Generate memory validation report
   */
  generateMemoryReport(metrics: MemoryMetrics[], leakTestResult: MemoryLeakTestResult): string {
    const lines = [
      "🧠 MEMORY USAGE VALIDATION REPORT",
      "=" .repeat(50),
      `📊 Total tests: ${metrics.length}`,
      `✅ Tests with acceptable memory: ${metrics.filter(m => m.acceptableMemoryUsage).length}`,
      `⚠️ Tests with memory leaks: ${metrics.filter(m => m.memoryLeakDetected).length}`,
      "",
      "📈 Memory Efficiency:",
      ...metrics.map(m => 
        `   ${m.testName}: ${m.memoryOverheadMB.toFixed(2)}MB (${m.propertyCount} properties, ${m.memoryPerPropertyMB.toFixed(4)}MB/property)`
      ),
      "",
      "🔄 Memory Leak Test:",
      `   Iterations: ${leakTestResult.iterations}`,
      `   Initial memory: ${leakTestResult.initialMemoryMB}MB`,
      `   Final memory: ${leakTestResult.finalMemoryMB}MB`,
      `   Memory growth: ${leakTestResult.memoryGrowthMB.toFixed(2)}MB`,
      `   Leak detected: ${leakTestResult.leakDetected ? '❌ YES' : '✅ NO'}`,
      "",
      "📋 Memory Usage Analysis:",
      `   Average overhead: ${(metrics.reduce((sum, m) => sum + m.memoryOverheadMB, 0) / metrics.length).toFixed(2)}MB`,
      `   Max overhead: ${Math.max(...metrics.map(m => m.memoryOverheadMB)).toFixed(2)}MB`,
      `   Average per property: ${(metrics.reduce((sum, m) => sum + m.memoryPerPropertyMB, 0) / metrics.length).toFixed(4)}MB`,
    ];

    // Add recommendations if issues detected
    const hasLeaks = metrics.some(m => m.memoryLeakDetected) || leakTestResult.leakDetected;
    const hasHighOverhead = metrics.some(m => !m.acceptableMemoryUsage);

    if (hasLeaks || hasHighOverhead) {
      lines.push("", "💡 Memory Optimization Recommendations:");
      if (hasLeaks) {
        lines.push("   • Memory leaks detected - review object lifecycle management");
        lines.push("   • Ensure proper cleanup of temporary objects");
        lines.push("   • Consider object pooling for frequent allocations");
      }
      if (hasHighOverhead) {
        lines.push("   • High memory overhead detected - optimize data structures");
        lines.push("   • Reduce intermediate object creation");
        lines.push("   • Consider streaming generation for large models");
      }
    } else {
      lines.push("", "🎉 Memory usage is optimal!");
    }

    return lines.join("\n");
  }
}