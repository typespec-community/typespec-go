/**
 * Go Package Directory Component
 * Organizes Go files into proper package structure using Alloy-JS Go components
 * Eliminates all string-based logic in favor of component-based generation
 */

import type { Model, Enum, Union, Operation, Type, Program } from "@typespec/compiler";
import { For } from "@alloy-js/core";
import { SourceFile as CoreSourceFile } from "@alloy-js/core";
import * as go from "@alloy-js/go";
const { ModuleDirectory, SourceDirectory, SourceFile, SingleImportStatement } = go;
import { GoStructDeclaration } from "./GoStructDeclaration.js";
import { GoEnumDeclaration } from "./GoEnumDeclaration.js";
import { GoUnionDeclaration } from "./GoUnionDeclaration.js";
import { GoModFile } from "./GoModFile.js";
import { GoInterfaceDeclaration } from "./GoInterfaceDeclaration.js";
import { GoHandlerStub } from "./GoHandlerStub.js";
import { capitalize } from "../../utils/strings.js";

/**
 * Type guard to check if a TypeSpec Type is a time-related scalar
 */
function isTimeType(type: Type): boolean {
  if (type.kind !== "Scalar") return false;
  const scalarName = type.name?.toLowerCase() || "";
  return ["plaindate", "plaintime", "utcdatetime", "offsetdatetime", "duration"].includes(
    scalarName,
  );
}

interface GoPackageDirectoryProps {
  /** Models to include in package */
  models: Model[];
  /** Enums to include in package */
  enums?: Enum[];
  /** Unions to include in package */
  unions?: Union[];
  /** Operations to include in package */
  operations?: Operation[];
  /** Package name for directory */
  packageName?: string;
  /** Additional documentation for package */
  packageDocumentation?: string;
  /** Module path for Go module */
  modulePath?: string;
  /** Generate go.mod file */
  generateGoMod?: boolean;
  /** Go version for go.mod (default: "1.21") */
  goVersion?: string;
  /** TypeSpec program for accessing @doc decorators */
  program?: Program;
}

/**
 * Generate proper Go module path
 */
function getModulePath(packageName: string, modulePath?: string): string {
  if (modulePath) {
    return modulePath;
  }

  return "github.com/yourcompany/" + packageName;
}

/**
 * Check if unions require json/fmt imports: every union renders an
 * UnmarshalX helper that reads the discriminator via encoding/json
 * and reports failures via fmt.Errorf (see GoUnionDeclaration).
 */
function unionsEmitUnmarshalImports(unions?: Union[]): boolean {
  return (unions?.length ?? 0) > 0;
}

/**
 * Go Package Directory Component
 * Creates a complete Go package directory using proper Alloy-JS components
 * Supports models, enums, and unions with proper Go file organization
 */
export function GoPackageDirectory({
  models = [],
  enums = [],
  unions = [],
  operations = [],
  packageName = "api",
  packageDocumentation,
  modulePath,
  generateGoMod = false,
  goVersion = "1.22",
  program,
}: GoPackageDirectoryProps) {
  const moduleDirectory = getModulePath(packageName, modulePath);
  const hasEnums = enums.length > 0;
  const hasUnions = unions.length > 0;
  const hasOperations = operations.length > 0;
  const needsUnmarshalImports = unionsEmitUnmarshalImports(unions);

  // Check if any model has time.Time fields
  const needsTimeImport = models.some((model) => {
    if (!model.properties) return false;
    for (const prop of model.properties.values()) {
      if (isTimeType(prop.type)) {
        return true;
      }
    }
    return false;
  });

  return (
    <ModuleDirectory name={moduleDirectory}>
      {/* go.mod is plain module text, not Go source: rendered with the
          core SourceFile so no package clause or package scope applies */}
      {generateGoMod && (
        <CoreSourceFile path="go.mod" filetype="text">
          <GoModFile modulePath={moduleDirectory} goVersion={goVersion} />
        </CoreSourceFile>
      )}
      <SourceDirectory path={packageName}>
        {/* Main models file with proper import block */}
        <SourceFile path="models.go">
          {needsTimeImport && (
            <>
              <SingleImportStatement path="time" />
              {"\n\n"}
            </>
          )}
          <For each={models}>
            {(model: Model, index: number) => (
              <>
                {index > 0 && "\n"}
                <GoStructDeclaration
                  model={model}
                  packageName={packageName}
                  documentation={packageDocumentation}
                  program={program}
                />
              </>
            )}
          </For>
        </SourceFile>

        {/* Enums file - only if we have enums */}
        {hasEnums && (
          <SourceFile path="enums.go">
            <For each={enums}>
              {(enumType: Enum, index: number) => (
                <>
                  {index > 0 && "\n"}
                  <GoEnumDeclaration enum={enumType} packageName={packageName} program={program} />
                </>
              )}
            </For>
          </SourceFile>
        )}

        {/* Handlers file - only if we have operations */}
        {hasOperations && (
          <GoHandlerStub
            operations={operations}
            serviceName={capitalize(packageName) + "Service"}
            packageName={packageName}
            program={program}
          />
        )}

        {/* Interfaces file - only if we have operations */}
        {hasOperations && (
          <SourceFile path="interfaces.go">
            {/* API contract interface (handlers struct owns the Service name) */}
            <SingleImportStatement path="context" />
            {"\n\n"}
            <GoInterfaceDeclaration
              name={capitalize(packageName) + "API"}
              operations={operations}
              packageName={packageName}
              program={program}
            />
          </SourceFile>
        )}

        {/* Unions file - only if we have unions */}
        {hasUnions && (
          <SourceFile path="unions.go">
            {needsUnmarshalImports && (
              <>
                <SingleImportStatement path="encoding/json" />
                {"\n"}
                <SingleImportStatement path="fmt" />
                {"\n\n"}
              </>
            )}
            <For each={unions}>
              {(union: Union, index: number) => (
                <>
                  {index > 0 && "\n"}
                  <GoUnionDeclaration
                    union={union}
                    packageName={packageName}
                    discriminator="type"
                    program={program}
                  />
                </>
              )}
            </For>
          </SourceFile>
        )}
      </SourceDirectory>
    </ModuleDirectory>
  );
}
