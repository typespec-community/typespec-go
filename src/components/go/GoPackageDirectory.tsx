/**
 * Go Package Directory Component
 * Organizes Go files into proper package structure using Alloy-JS Go components
 * Eliminates all string-based logic in favor of component-based generation
 */

import type { Model } from "@typespec/compiler";
import { For, refkey } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile, TypeDeclaration, SingleImportStatement } from "@alloy-js/go";
import { GoStructDeclaration } from "./GoStructDeclaration.js";

interface GoPackageDirectoryProps {
  /** Models to include in package */
  models: Model[];
  /** Package name for directory */
  packageName?: string;
  /** Additional documentation for package */
  packageDocumentation?: string;
}

/**
 * Go Package Directory Component
 * Creates a complete Go package directory using proper Alloy-JS components
 * Replaces all string-based generation with declarative components
 */
export function GoPackageDirectory({ 
  models, 
  packageName = "api",
  packageDocumentation
}: GoPackageDirectoryProps) {
  return (
    <ModuleDirectory name="github.com/typespec-community/typespec-go">
      <SourceDirectory path={packageName}>
        {/* Generate a single models file with all structs */}
        <SourceFile path="models.go">
          {/* Import time package if needed */}
          <SingleImportStatement path="time" />
          
          {/* Generate all struct declarations using <For> */}
          <For each={models}>
            {(model: Model) => (
              <GoStructDeclaration 
                model={model}
                packageName={packageName}
              />
            )}
          </For>
        </SourceFile>
      </SourceDirectory>
    </ModuleDirectory>
  );
}