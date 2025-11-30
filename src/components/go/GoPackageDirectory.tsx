/**
 * Go Package Directory Component
 * Organizes Go files into proper package structure using Alloy-JS Go components
 * Eliminates all string-based logic in favor of component-based generation
 */

import type { Model, Enum, Union } from "@typespec/compiler";
import { For } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import { GoStructDeclaration } from "./GoStructDeclaration.js";
import { GoEnumDeclaration } from "./GoEnumDeclaration.js";
import { GoUnionDeclaration } from "./GoUnionDeclaration.js";

interface GoPackageDirectoryProps {
  /** Models to include in package */
  models: Model[];
  /** Enums to include in package */
  enums?: Enum[];
  /** Unions to include in package */
  unions?: Union[];
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
 * Check if union types require fmt package for error formatting
 */
function needsFmtPackage(unions?: Union[]): boolean {
  // Unions with discriminators need fmt.Errorf
  return unions?.some(u => u.variants && u.variants.size > 0) ?? false;
}

/**
 * Go Package Directory Component
 * Creates a complete Go package directory using proper Alloy-JS components
 * Supports models, enums, and unions with proper Go file organization
 */
export function GoPackageDirectory({ 
  models, 
  enums = [],
  unions = [],
  packageName = "api",
  packageDocumentation,
  modulePath
}: GoPackageDirectoryProps) {
  const moduleDirectory = getModulePath(packageName, modulePath);
  const hasEnums = enums.length > 0;
  const hasUnions = unions.length > 0;
  const needsFmt = needsFmtPackage(unions);
  
  // Check if any model has time.Time fields
  const needsTimeImport = models.some(model => {
    if (!model.properties) return false;
    for (const prop of model.properties.values()) {
      const propType = prop.type as any;
      if (propType.kind === "Scalar") {
        const scalarName = propType.name?.toLowerCase() || "";
        if (["plaindate", "plaintime", "utcdatetime", "offsetdatetime", "duration"].includes(scalarName)) {
          return true;
        }
      }
    }
    return false;
  });
  
  return (
    <ModuleDirectory name={moduleDirectory}>
      <SourceDirectory path={packageName}>
        {/* Main models file with proper import block */}
        <SourceFile path="models.go">
          {needsTimeImport 
            ? `import "time"

`
            : ""}
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

        {/* Enums file - only if we have enums */}
        {hasEnums && (
          <SourceFile path="enums.go">
            <For each={enums}>
              {(enumType: Enum) => (
                <GoEnumDeclaration 
                  enum={enumType}
                  packageName={packageName}
                />
              )}
            </For>
          </SourceFile>
        )}

        {/* Unions file - only if we have unions */}
        {hasUnions && (
          <SourceFile path="unions.go">
            {needsFmt 
              ? `import (
	"encoding/json"
	"fmt"
)

`
              : `import "encoding/json"

`}
            <For each={unions}>
              {(union: Union) => (
                <GoUnionDeclaration 
                  union={union}
                  packageName={packageName}
                  discriminator="type"
                />
              )}
            </For>
          </SourceFile>
        )}
      </SourceDirectory>
    </ModuleDirectory>
  );
}
