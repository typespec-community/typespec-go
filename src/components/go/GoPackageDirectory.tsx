/**
 * Go Package Directory Component
 * Organizes Go files into proper package structure using Alloy-JS Go components
 * Eliminates all string-based logic in favor of component-based generation
 */

import type { Model } from "@typespec/compiler";
import { For } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile, SingleImportStatement } from "@alloy-js/go";
import { GoStructDeclaration } from "./GoStructDeclaration.js";

interface GoPackageDirectoryProps {
  /** Models to include in package */
  models: Model[];
  /** Package name for directory */
  packageName?: string;
  /** Additional documentation for package */
  packageDocumentation?: string;
  /** Module path for Go module */
  modulePath?: string;
}

/**
 * Generate proper Go module path
 */
function getModulePath(packageName: string, modulePath?: string): string {
  if (modulePath) {
    return modulePath;
  }
  
  return `github.com/yourcompany/${packageName}`;
}

/**
 * Go Package Directory Component
 * Creates a complete Go package directory using proper Alloy-JS components
 */
export function GoPackageDirectory({ 
  models, 
  packageName = "api",
  packageDocumentation,
  modulePath
}: GoPackageDirectoryProps) {
  const moduleDirectory = getModulePath(packageName, modulePath);
  
  return (
    <ModuleDirectory name={moduleDirectory}>
      <SourceDirectory path={packageName}>
        <SourceFile path="models.go">
          <SingleImportStatement path="time" />
          <SingleImportStatement path="encoding/json" />
          
          <For each={models}>
            {(model: Model) => (
              <GoStructDeclaration 
                model={model}
                packageName={packageName}
                documentation={packageDocumentation}
              />
            )}
          </For>
        </SourceFile>
      </SourceDirectory>
    </ModuleDirectory>
  );
}
