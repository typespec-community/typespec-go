/**
 * Go Module File Component
 * Generates go.mod file for proper Go module initialization
 * Using 100% Alloy.js approach
 */

import type { ReactNode } from "react";

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
 * Returns JSX content for Alloy.js rendering
 */
export function GoModFile({
  modulePath,
  goVersion = "1.21",
  requires = [],
}: GoModFileProps): ReactNode {
  return (
    <>
      module {modulePath}
      
      go {goVersion}
      
      {requires.length > 0 && (
        <>
          require (
            {requires.map((req, index) => (
              <div key={index}>
                {"\t"}{req.path} {req.version}
              </div>
            ))}
            )
        </>
      )}
      
    </>
  );
}
