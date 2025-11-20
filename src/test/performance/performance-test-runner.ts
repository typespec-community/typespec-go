/**
 * Performance Test Runner - TypeSpec Go Emitter
 *
 * Core test execution engine for performance benchmarks
 * Handles timing, memory tracking, and result collection
 */

import { performance } from "perf_hooks";
import { StandaloneGoGenerator } from "../../standalone-generator.js";
import type { GoEmitterResult } from "../../domain/unified-errors.js";
import type { PerformanceBenchmark, PerformanceTestResult } from "./performance-benchmarks.js";
import { MemoryTracker } from "./memory-tracker.js";

/**
 * Core performance test execution engine
 */
export class PerformanceTestRunner {
  private generator: StandaloneGoGenerator;
  private memoryTracker: MemoryTracker;

  constructor() {
    this.generator = new StandaloneGoGenerator();
    this.memoryTracker = new MemoryTracker();
  }

  /**
   * Execute a single performance benchmark
   */
  executeBenchmark(benchmark: PerformanceBenchmark): PerformanceTestResult {
    // Start performance tracking
    const startTime = performance.now();
    const startMemory = this.memoryTracker.getCurrentMemoryUsage();

    // Execute the benchmark
    const model = benchmark.modelFactory();
    const result = this.generator.generateModel(model);

    // Calculate performance metrics
    const endTime = performance.now();
    const endMemory = this.memoryTracker.getCurrentMemoryUsage();

    const actualTimeMs = endTime - startTime;
    const actualMemoryMB = (endMemory - startMemory) / 1024 / 1024;
    const actualThroughput = model.properties ? Object.keys(model.properties).length / (actualTimeMs / 1000) : 0;

    // Determine if benchmark passed
    const passed = 
      actualTimeMs <= benchmark.expectedMaxTimeMs &&
      actualMemoryMB <= benchmark.expectedMaxMemoryMB &&
      actualThroughput >= benchmark.expectedMinThroughput;

    const failureReason = passed ? undefined : this.getFailureReason(benchmark, actualTimeMs, actualMemoryMB, actualThroughput);

    return {
      benchmark,
      actualTimeMs,
      actualMemoryMB,
      actualThroughput,
      passed,
      failureReason,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Execute multiple benchmarks in sequence
   */
  executeBenchmarks(benchmarks: PerformanceBenchmark[]): PerformanceTestResult[] {
    const results: PerformanceTestResult[] = [];
    
    for (const benchmark of benchmarks) {
      const result = this.executeBenchmark(benchmark);
      results.push(result);
    }

    return results;
  }

  /**
   * Get failure reason for failed benchmarks
   */
  private getFailureReason(
    benchmark: PerformanceBenchmark,
    actualTimeMs: number,
    actualMemoryMB: number,
    actualThroughput: number
  ): string {
    const reasons: string[] = [];

    if (actualTimeMs > benchmark.expectedMaxTimeMs) {
      reasons.push(`Time exceeded: ${actualTimeMs.toFixed(2)}ms > ${benchmark.expectedMaxTimeMs}ms`);
    }

    if (actualMemoryMB > benchmark.expectedMaxMemoryMB) {
      reasons.push(`Memory exceeded: ${actualMemoryMB.toFixed(2)}MB > ${benchmark.expectedMaxMemoryMB}MB`);
    }

    if (actualThroughput < benchmark.expectedMinThroughput) {
      reasons.push(`Throughput below: ${actualThroughput.toFixed(2)}/s < ${benchmark.expectedMinThroughput}/s`);
    }

    return reasons.join("; ");
  }
}