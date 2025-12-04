/**
 * Go Module File Component
 * Generates go.mod file for proper Go module initialization
 * Clean implementation without string array concatenation
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
 * Generates a proper go.mod file for generated package
 * Clean string-based implementation (go.mod is not standard Go code)
 */
export function GoModFile({
  modulePath,
  goVersion = "1.21",
  requires = [],
}: GoModFileProps): string {
  let content = `module ${modulePath}

go ${goVersion}`;

  if (requires.length > 0) {
    const requireBlock = requires
      .map(req => `\t${req.path} ${req.version}`)
      .join('\n');
    content += `

require (
${requireBlock}
)`;
  }

  return content + '\n';
}
