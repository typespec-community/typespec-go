/**
 * Performance Test Suite - TypeSpec Go Emitter
 *
 * Orchestrates performance testing using extracted modules
 * Provides main test execution and reporting coordination
 */

import { performance } from "perf_hooks";
import { StandaloneGoGenerator } from "../standalone-generator.js";
import type { GoEmitterResult } from "../src/domain/unified-errors.js";
import { PerformanceTestRunner } from "./performance/performance-test-runner.js";
import { PERFORMANCE_BENCHMARKS } from "./performance/performance-benchmarks.js";
import { PerformanceReporter, type PerformanceSummary } from "./performance/performance-reporter.js";

/**
 * Performance Test Suite Orchestrator
 * 
 * Coordinates performance testing using extracted modules
 */
class PerformanceTestSuite {
  private runner: PerformanceTestRunner;
  private reporter: PerformanceReporter;

  constructor() {
    this.runner = new PerformanceTestRunner();
    this.reporter = new PerformanceReporter();
  }

  /**
   * Execute complete performance test suite
   */
  runFullSuite(): PerformanceSummary {
    console.log("🚀 Starting TypeSpec Go Emitter Performance Test Suite");
    console.log("=" .repeat(60));
    
    const results = this.runner.executeBenchmarks(PERFORMANCE_BENCHMARKS);
    const summary = this.reporter.generateSummary(results);
    
    console.log(this.reporter.formatConsoleOutput(summary));
    
    return summary;
  }

  /**
   * Execute specific category of tests
   */
  runCategory(category: "basic" | "complex" | "large" | "stress"): PerformanceSummary {
    const categoryBenchmarks = PERFORMANCE_BENCHMARKS.filter(b => b.category === category);
    const results = this.runner.executeBenchmarks(categoryBenchmarks);
    const summary = this.reporter.generateSummary(results);
    
    console.log(this.reporter.formatConsoleOutput(summary));
    
    return summary;
  }

  /**
   * Execute single benchmark
   */
  runSingleBenchmark(benchmarkId: string): void {
    const benchmark = PERFORMANCE_BENCHMARKS.find(b => b.id === benchmarkId);
    if (!benchmark) {
      throw new Error(`Benchmark with ID '${benchmarkId}' not found`);
    }
    
    const result = this.runner.executeBenchmark(benchmark);
    const summary = this.reporter.generateSummary([result]);
    
    console.log(this.reporter.formatConsoleOutput(summary));
  }
}

/**
 * Performance Test Suite Orchestration - Test Cases
 */

const testSuite = new PerformanceTestSuite();

// Full suite test
describe("Performance Test Suite", () => {
  it("should execute complete performance test suite", () => {
    const summary = testSuite.runFullSuite();
    
    // Verify all benchmarks executed
    expect(summary.totalTests).toBeGreaterThan(0);
    
    // Verify performance thresholds
    expect(summary.passRate).toBeGreaterThanOrEqual(80); // Allow 80% pass rate for CI
    expect(summary.averageTimeMs).toBeLessThan(50); // Average under 50ms
    expect(summary.averageMemoryMB).toBeLessThan(20); // Average under 20MB
    
    console.log(`Performance suite completed: ${summary.passedTests}/${summary.totalTests} passed`);
  });

  it("should execute basic performance benchmarks", () => {
    const summary = testSuite.runCategory("basic");
    
    expect(summary.totalTests).toBeGreaterThan(0);
    expect(summary.passRate).toBeGreaterThanOrEqual(90); // Basic tests should have high pass rate
    expect(summary.averageTimeMs).toBeLessThan(10); // Basic tests should be fast
  });

  it("should execute complex performance benchmarks", () => {
    const summary = testSuite.runCategory("complex");
    
    expect(summary.totalTests).toBeGreaterThan(0);
    expect(summary.averageTimeMs).toBeLessThan(25); // Complex tests under 25ms
  });

  it("should execute single benchmark", () => {
    expect(() => testSuite.runSingleBenchmark("basic-simple-user")).not.toThrow();
  });
});