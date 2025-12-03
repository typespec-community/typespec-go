/**
 * Go Code Formatter Utility
 * Provides gofmt integration for formatting generated Go code
 */

import {execSync} from "child_process"

/**
 * Format Go source code using gofmt
 * @param code - Go source code to format
 * @returns Formatted Go code
 */
export function formatGoCode(code: string): string {
  try {
    // Use gofmt -s for simplification and formatting
	  return execSync("gofmt -s", {
	    input: code,
	    encoding: "utf-8",
	    timeout: 5000, // 5 second timeout
	    maxBuffer: 1024 * 1024, // 1MB buffer
    });
  } catch (error) {
    // If gofmt fails (syntax error, not available), return original code
    console.warn(
      `⚠️ gofmt formatting failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return code;
  }
}

/**
 * Check if gofmt is available on the system
 * @returns true if gofmt is available
 */
export function isGofmtAvailable(): boolean {
  try {
    execSync("gofmt -h", {
      encoding: "utf-8",
      stdio: "pipe",
      timeout: 1000,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Format Go code with error details
 * @param code - Go source code to format
 * @returns Object with formatted code and any errors
 */
export function formatGoCodeWithDetails(code: string): {
  formatted: string;
  success: boolean;
  error?: string;
} {
  try {
    const formatted = execSync("gofmt -s", {
      input: code,
      encoding: "utf-8",
      timeout: 5000,
      maxBuffer: 1024 * 1024,
    });
    return { formatted, success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      formatted: code,
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Format multiple Go source files
 * @param files - Map of filename to source code
 * @returns Map of filename to formatted code
 */
export function formatGoFiles(files: Map<string, string>): Map<string, string> {
  const result = new Map<string, string>();

  for (const [filename, code] of files) {
    // Only format .go files
    if (filename.endsWith(".go")) {
      result.set(filename, formatGoCode(code));
    } else {
      result.set(filename, code);
    }
  }

  return result;
}
