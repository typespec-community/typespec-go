/**
 * Performance Reporter - TypeSpec Go Emitter
 *
 * Generate comprehensive performance reports and summaries
 * Supports multiple output formats and analysis
 */

import type { PerformanceBenchmark, PerformanceTestResult } from "./performance-benchmarks.js";

export interface PerformanceSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
  averageTimeMs: number;
  maxTimeMs: number;
  minTimeMs: number;
  averageMemoryMB: number;
  maxMemoryMB: number;
  minMemoryMB: number;
  averageThroughput: number;
  categories: {
    basic: CategorySummary;
    complex: CategorySummary;
    large: CategorySummary;
    stress: CategorySummary;
  };
  recommendations: string[];
}

export interface CategorySummary {
  count: number;
  passed: number;
  averageTimeMs: number;
  averageMemoryMB: number;
  averageThroughput: number;
}

/**
 * Performance reporting and analysis utilities
 */
export class PerformanceReporter {
  /**
   * Generate comprehensive performance summary
   */
  generateSummary(results: PerformanceTestResult[]): PerformanceSummary {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const passRate = (passedTests / totalTests) * 100;

    const times = results.map(r => r.actualTimeMs);
    const memories = results.map(r => r.actualMemoryMB);
    const throughputs = results.map(r => r.actualThroughput);

    const averageTimeMs = times.reduce((a, b) => a + b, 0) / times.length;
    const maxTimeMs = Math.max(...times);
    const minTimeMs = Math.min(...times);

    const averageMemoryMB = memories.reduce((a, b) => a + b, 0) / memories.length;
    const maxMemoryMB = Math.max(...memories);
    const minMemoryMB = Math.min(...memories);

    const averageThroughput = throughputs.reduce((a, b) => a + b, 0) / throughputs.length;

    const categories = this.generateCategorySummaries(results);

    const recommendations = this.generateRecommendations(results, {
      passRate,
      averageTimeMs,
      averageMemoryMB,
      averageThroughput,
    });

    return {
      totalTests,
      passedTests,
      failedTests,
      passRate,
      averageTimeMs,
      maxTimeMs,
      minTimeMs,
      averageMemoryMB,
      maxMemoryMB,
      minMemoryMB,
      averageThroughput,
      categories,
      recommendations,
    };
  }

  /**
   * Generate category-specific summaries
   */
  private generateCategorySummaries(results: PerformanceTestResult[]): PerformanceSummary["categories"] {
    const categories = {
      basic: this.getCategoryResults(results, "basic"),
      complex: this.getCategoryResults(results, "complex"),
      large: this.getCategoryResults(results, "large"),
      stress: this.getCategoryResults(results, "stress"),
    };

    return {
      basic: this.calculateCategorySummary(categories.basic),
      complex: this.calculateCategorySummary(categories.complex),
      large: this.calculateCategorySummary(categories.large),
      stress: this.calculateCategorySummary(categories.stress),
    };
  }

  /**
   * Get results for specific category
   */
  private getCategoryResults(results: PerformanceTestResult[], category: PerformanceBenchmark["category"]): PerformanceTestResult[] {
    return results.filter(r => r.benchmark.category === category);
  }

  /**
   * Calculate summary for a specific category
   */
  private calculateCategorySummary(categoryResults: PerformanceTestResult[]): CategorySummary {
    const count = categoryResults.length;
    const passed = categoryResults.filter(r => r.passed).length;
    const averageTimeMs = count > 0 ? categoryResults.reduce((sum, r) => sum + r.actualTimeMs, 0) / count : 0;
    const averageMemoryMB = count > 0 ? categoryResults.reduce((sum, r) => sum + r.actualMemoryMB, 0) / count : 0;
    const averageThroughput = count > 0 ? categoryResults.reduce((sum, r) => sum + r.actualThroughput, 0) / count : 0;

    return {
      count,
      passed,
      averageTimeMs,
      averageMemoryMB,
      averageThroughput,
    };
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(
    results: PerformanceTestResult[],
    metrics: {
      passRate: number;
      averageTimeMs: number;
      averageMemoryMB: number;
      averageThroughput: number;
    }
  ): string[] {
    const recommendations: string[] = [];

    // Pass rate recommendations
    if (metrics.passRate < 100) {
      recommendations.push(`${100 - metrics.passRate}% of tests failed. Review failing tests for performance bottlenecks.`);
    }

    // Time performance recommendations
    if (metrics.averageTimeMs > 25) {
      recommendations.push("Average execution time exceeds 25ms. Consider optimizing the generation algorithm.");
    }

    // Memory usage recommendations
    if (metrics.averageMemoryMB > 10) {
      recommendations.push("Average memory usage exceeds 10MB. Check for memory leaks or inefficient data structures.");
    }

    // Throughput recommendations
    if (metrics.averageThroughput < 15) {
      recommendations.push("Low throughput detected. Consider implementing caching or streaming generation.");
    }

    // Category-specific recommendations
    const stressTests = results.filter(r => r.benchmark.category === "stress");
    if (stressTests.length > 0 && stressTests.every(r => !r.passed)) {
      recommendations.push("All stress tests failed. System may not handle large models efficiently.");
    }

    const largeTests = results.filter(r => r.benchmark.category === "large");
    if (largeTests.length > 0 && largeTests.some(r => r.actualMemoryMB > 20)) {
      recommendations.push("Large models consume excessive memory. Consider implementing streaming generation.");
    }

    return recommendations;
  }

  /**
   * Format performance summary for console output
   */
  formatConsoleOutput(summary: PerformanceSummary): string {
    const lines = [
      "🚀 PERFORMANCE TEST SUITE RESULTS",
      "=" .repeat(50),
      `📊 Overall: ${summary.passedTests}/${summary.totalTests} tests passed (${summary.passRate.toFixed(1)}%)`,
      "",
      "⏱️  Timing Performance:",
      `   Average: ${summary.averageTimeMs.toFixed(2)}ms`,
      `   Min: ${summary.minTimeMs.toFixed(2)}ms`,
      `   Max: ${summary.maxTimeMs.toFixed(2)}ms`,
      "",
      "💾 Memory Usage:",
      `   Average: ${summary.averageMemoryMB.toFixed(2)}MB`,
      `   Min: ${summary.minMemoryMB.toFixed(2)}MB`,
      `   Max: ${summary.maxMemoryMB.toFixed(2)}MB`,
      "",
      "📈 Throughput:",
      `   Average: ${summary.averageThroughput.toFixed(2)} properties/sec`,
      "",
      "📂 Category Breakdown:",
      `   Basic: ${summary.categories.basic.passed}/${summary.categories.basic.count} passed (${summary.categories.basic.averageTimeMs.toFixed(2)}ms avg)`,
      `   Complex: ${summary.categories.complex.passed}/${summary.categories.complex.count} passed (${summary.categories.complex.averageTimeMs.toFixed(2)}ms avg)`,
      `   Large: ${summary.categories.large.passed}/${summary.categories.large.count} passed (${summary.categories.large.averageTimeMs.toFixed(2)}ms avg)`,
      `   Stress: ${summary.categories.stress.passed}/${summary.categories.stress.count} passed (${summary.categories.stress.averageTimeMs.toFixed(2)}ms avg)`,
    ];

    if (summary.recommendations.length > 0) {
      lines.push(
        "",
        "💡 Recommendations:",
        ...summary.recommendations.map(rec => `   • ${rec}`)
      );
    }

    return lines.join("\n");
  }

  /**
   * Generate JSON report
   */
  generateJSONReport(summary: PerformanceSummary): string {
    return JSON.stringify(summary, null, 2);
  }
}