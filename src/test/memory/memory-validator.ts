/**
 * Memory Validation Utilities - TypeSpec Go Emitter
 *
 * Memory analysis and reporting utilities
 * Provides memory efficiency metrics and recommendations
 */

import type { MemoryMetrics, MemoryLeakTestResult } from "./memory-test-runner.js";

/**
 * Memory analysis and reporting utilities
 */
export class MemoryValidator {
  /**
   * Analyze memory efficiency trends
   */
  analyzeMemoryEfficiency(metrics: MemoryMetrics[]): {
    scalingFactor: number;
    memoryEfficiency: "excellent" | "good" | "acceptable" | "poor";
    recommendation: string;
  } {
    if (metrics.length < 2) {
      return {
        scalingFactor: 1,
        memoryEfficiency: "excellent",
        recommendation: "Need more data points for analysis",
      };
    }

    // Calculate scaling factor (memory growth vs property count)
    const smallModel = metrics[0];
    const largeModel = metrics[metrics.length - 1];
    
    const propertyRatio = largeModel.propertyCount / smallModel.propertyCount;
    const memoryRatio = largeModel.memoryOverheadMB / smallModel.memoryOverheadMB;
    const scalingFactor = memoryRatio / propertyRatio;

    // Determine efficiency rating
    let memoryEfficiency: "excellent" | "good" | "acceptable" | "poor";
    let recommendation: string;

    if (scalingFactor < 1.2) {
      memoryEfficiency = "excellent";
      recommendation = "Memory usage scales very efficiently with model size";
    } else if (scalingFactor < 1.5) {
      memoryEfficiency = "good";
      recommendation = "Memory usage scales reasonably well";
    } else if (scalingFactor < 2.0) {
      memoryEfficiency = "acceptable";
      recommendation = "Memory usage could be more efficient";
    } else {
      memoryEfficiency = "poor";
      recommendation = "Memory usage scales poorly - consider optimization";
    }

    return { scalingFactor, memoryEfficiency, recommendation };
  }

  /**
   * Detect potential memory leaks
   */
  detectMemoryLeaks(leakTestResult: MemoryLeakTestResult): {
    leakSeverity: "none" | "minor" | "moderate" | "severe";
    recommendation: string;
  } {
    const { memoryGrowthMB } = leakTestResult;
    
    let leakSeverity: "none" | "minor" | "moderate" | "severe";
    let recommendation: string;

    if (memoryGrowthMB < 5) {
      leakSeverity = "none";
      recommendation = "No memory leaks detected";
    } else if (memoryGrowthMB < 15) {
      leakSeverity = "minor";
      recommendation = "Minor memory growth - monitor in production";
    } else if (memoryGrowthMB < 30) {
      leakSeverity = "moderate";
      recommendation = "Moderate memory leaks detected - investigate object lifecycle";
    } else {
      leakSeverity = "severe";
      recommendation = "Severe memory leaks - requires immediate attention";
    }

    return { leakSeverity, recommendation };
  }

  /**
   * Validate memory thresholds
   */
  validateMemoryThresholds(metrics: MemoryMetrics[]): {
    passed: boolean;
    violations: Array<{
      testId: string;
      violation: string;
      threshold: number;
      actual: number;
    }>;
  } {
    const violations: Array<{
      testId: string;
      violation: string;
      threshold: number;
      actual: number;
    }> = [];

    // Check individual thresholds
    for (const metric of metrics) {
      // Memory overhead threshold (10MB)
      if (metric.memoryOverheadMB > 10) {
        violations.push({
          testId: metric.testId,
          violation: "Excessive memory overhead",
          threshold: 10,
          actual: metric.memoryOverheadMB,
        });
      }

      // Memory per property threshold (0.1MB)
      if (metric.memoryPerPropertyMB > 0.1) {
        violations.push({
          testId: metric.testId,
          violation: "High memory per property",
          threshold: 0.1,
          actual: metric.memoryPerPropertyMB,
        });
      }

      // Memory leak threshold
      if (metric.memoryLeakDetected) {
        violations.push({
          testId: metric.testId,
          violation: "Memory leak detected",
          threshold: 5,
          actual: metric.finalMemoryMB - metric.baselineMemoryMB,
        });
      }
    }

    return {
      passed: violations.length === 0,
      violations,
    };
  }

  /**
   * Generate memory optimization recommendations
   */
  generateOptimizationRecommendations(
    metrics: MemoryMetrics[],
    leakTestResult: MemoryLeakTestResult
  ): string[] {
    const recommendations: string[] = [];

    // Analyze patterns and generate specific recommendations
    const maxOverhead = Math.max(...metrics.map(m => m.memoryOverheadMB));
    const avgPerProperty = metrics.reduce((sum, m) => sum + m.memoryPerPropertyMB, 0) / metrics.length;

    // Memory overhead recommendations
    if (maxOverhead > 15) {
      recommendations.push("High memory overhead detected - reduce temporary object creation");
    }

    // Memory per property recommendations
    if (avgPerProperty > 0.05) {
      recommendations.push("High memory per property - optimize property storage and processing");
    }

    // Model size recommendations
    const largeModelMetrics = metrics.filter(m => m.propertyCount > 100);
    if (largeModelMetrics.some(m => m.memoryOverheadMB > 10)) {
      recommendations.push("Large models consume excessive memory - implement streaming generation");
    }

    // Leak test recommendations
    if (leakTestResult.leakDetected) {
      recommendations.push("Memory leaks detected - implement proper object cleanup");
      recommendations.push("Consider object pooling for frequent allocations");
    }

    // General optimization recommendations
    recommendations.push("Monitor memory usage in production environments");
    recommendations.push("Implement memory usage alerts for threshold violations");
    recommendations.push("Consider implementing memory usage baselines for regression detection");

    return recommendations;
  }

  /**
   * Generate memory usage summary
   */
  generateMemorySummary(
    metrics: MemoryMetrics[],
    leakTestResult: MemoryLeakTestResult
  ): {
    status: "optimal" | "acceptable" | "needs-attention" | "critical";
    keyMetrics: {
      averageOverheadMB: number;
      maxOverheadMB: number;
      averageMemoryPerPropertyMB: number;
      leakDetected: boolean;
    };
    summary: string;
  } {
    const averageOverheadMB = metrics.reduce((sum, m) => sum + m.memoryOverheadMB, 0) / metrics.length;
    const maxOverheadMB = Math.max(...metrics.map(m => m.memoryOverheadMB));
    const averageMemoryPerPropertyMB = metrics.reduce((sum, m) => sum + m.memoryPerPropertyMB, 0) / metrics.length;
    const leakDetected = leakTestResult.leakDetected;

    let status: "optimal" | "acceptable" | "needs-attention" | "critical";
    let summary: string;

    // Determine overall status
    const hasAcceptableOverhead = averageOverheadMB <= 8 && maxOverheadMB <= 15;
    const hasEfficientMemory = averageMemoryPerPropertyMB <= 0.08;
    const hasNoLeaks = !leakDetected;

    if (hasAcceptableOverhead && hasEfficientMemory && hasNoLeaks) {
      status = "optimal";
      summary = "Memory usage is optimal across all metrics";
    } else if (hasAcceptableOverhead && !leakDetected) {
      status = "acceptable";
      summary = "Memory usage is acceptable with minor optimization opportunities";
    } else if (leakDetected || maxOverheadMB > 20) {
      status = "critical";
      summary = "Memory usage requires immediate attention";
    } else {
      status = "needs-attention";
      summary = "Memory usage needs optimization attention";
    }

    return {
      status,
      keyMetrics: {
        averageOverheadMB,
        maxOverheadMB,
        averageMemoryPerPropertyMB,
        leakDetected,
      },
      summary,
    };
  }
}