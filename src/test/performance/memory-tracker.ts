/**
 * Memory Tracker - TypeSpec Go Emitter
 *
 * Memory usage monitoring for performance testing
 * Provides accurate memory measurements across platforms
 */

/**
 * Memory usage tracking utilities
 */
export class MemoryTracker {
  private baselineMemory: number = 0;

  constructor() {
    this.baselineMemory = this.getCurrentMemoryUsage();
  }

  /**
   * Get current memory usage in bytes
   */
  getCurrentMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      return usage.heapUsed;
    }

    // Fallback for browser or other environments
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize || 0;
    }

    // Return 0 if memory tracking is not available
    return 0;
  }

  /**
   * Get memory usage relative to baseline
   */
  getMemoryDelta(): number {
    return this.getCurrentMemoryUsage() - this.baselineMemory;
  }

  /**
   * Get memory usage in megabytes
   */
  getMemoryUsageMB(): number {
    return this.getCurrentMemoryUsage() / 1024 / 1024;
  }

  /**
   * Get memory delta in megabytes
   */
  getMemoryDeltaMB(): number {
    return this.getMemoryDelta() / 1024 / 1024;
  }

  /**
   * Reset baseline to current memory usage
   */
  resetBaseline(): void {
    this.baselineMemory = this.getCurrentMemoryUsage();
  }

  /**
   * Force garbage collection if available
   */
  forceGarbageCollection(): void {
    if (typeof global !== 'undefined' && (global as any).gc) {
      (global as any).gc();
    } else if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc();
    }
  }

  /**
   * Get detailed memory statistics
   */
  getMemoryStats(): {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
    heapUsedMB: number;
    heapTotalMB: number;
    externalMB: number;
    rssMB: number;
  } {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      return {
        heapUsed: usage.heapUsed,
        heapTotal: usage.heapTotal,
        external: usage.external,
        rss: usage.rss,
        heapUsedMB: usage.heapUsed / 1024 / 1024,
        heapTotalMB: usage.heapTotal / 1024 / 1024,
        externalMB: usage.external / 1024 / 1024,
        rssMB: usage.rss / 1024 / 1024,
      };
    }

    // Fallback for browser environments
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        heapUsed: memory.usedJSHeapSize || 0,
        heapTotal: memory.totalJSHeapSize || 0,
        external: 0,
        rss: 0,
        heapUsedMB: (memory.usedJSHeapSize || 0) / 1024 / 1024,
        heapTotalMB: (memory.totalJSHeapSize || 0) / 1024 / 1024,
        externalMB: 0,
        rssMB: 0,
      };
    }

    // Return zeros if memory tracking is not available
    return {
      heapUsed: 0,
      heapTotal: 0,
      external: 0,
      rss: 0,
      heapUsedMB: 0,
      heapTotalMB: 0,
      externalMB: 0,
      rssMB: 0,
    };
  }
}