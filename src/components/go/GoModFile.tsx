/**
 * Go Module File Component
 * Generates go.mod file for proper Go module initialization
 */

interface GoModFileProps {
  /** Go module path (e.g., github.com/yourcompany/api) */
  modulePath: string;
  /** Go version (e.g., "1.21") */
  goVersion?: string;
  /** Required dependencies */
  requires?: Array<{
    path: string;
    version: string;
  }>;
}

/**
 * Go Module File Component
 * Generates a proper go.mod file for the generated package
 */
export function GoModFile({
  modulePath,
  goVersion = "1.21",
  requires = [],
}: GoModFileProps): string {
  const lines: string[] = [];

  lines.push(`module ${modulePath}`);
  lines.push("");
  lines.push(`go ${goVersion}`);

  if (requires.length > 0) {
    lines.push("");
    lines.push("require (");
    for (const req of requires) {
      lines.push(`\t${req.path} ${req.version}`);
    }
    lines.push(")");
  }

  lines.push(""); // Trailing newline

  return lines.join("\n");
}
