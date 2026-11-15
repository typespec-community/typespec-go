/**
 * Go Package Directory Component
 * Organizes Go files into proper package structure using Alloy-JS Go components
 * Eliminates all string-based logic in favor of component-based generation
 */

import type { Model, Enum, Union, Operation, Program } from "@typespec/compiler";
import { For } from "@alloy-js/core";
import { SourceFile as CoreSourceFile } from "@alloy-js/core";
import * as go from "@alloy-js/go";
const { ModuleDirectory, SourceDirectory, SourceFile, SingleImportStatement, LineComment } = go;
import { GoStructDeclaration } from "./GoStructDeclaration.js";
import { GoEnumDeclaration } from "./GoEnumDeclaration.js";
import { GoUnionDeclaration } from "./GoUnionDeclaration.js";
import { GoModFile } from "./GoModFile.js";
import { GoInterfaceDeclaration } from "./GoInterfaceDeclaration.js";
import { GoHandlerStub } from "./GoHandlerStub.js";
import type { VisibilityMode } from "../../domain/visibility.js";
import { buildPackageFileLayout } from "../../domain/package-layout.js";

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
  /** @visibility evaluation mode passed through to struct generation */
  visibilityMode?: VisibilityMode;
}

/**
 * Go Package Directory Component
 * Creates a complete Go package directory using proper Alloy-JS components.
 * Layout decisions (which files, which imports, Service/API names) come from
 * the pure `buildPackageFileLayout` builder; this component only renders.
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
  visibilityMode,
}: GoPackageDirectoryProps) {
  const layout = buildPackageFileLayout({
    packageName,
    modulePath,
    models,
    enums,
    unions,
    operations,
  });
  const { moduleDirectory, serviceName, apiInterfaceName } = layout;
  const hasEnums = layout.files.enums;
  const hasUnions = layout.files.unions;
  const hasOperations = layout.files.handlers;

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
        {/* Main models file with proper import block; package doc hoisted to
            the file header instead of repeating above every struct */}
        <SourceFile
          path="models.go"
          header={
            packageDocumentation ? (
              <>
                <LineComment>{packageDocumentation}</LineComment>
                {"\n"}
              </>
            ) : undefined
          }
        >
          {layout.imports.modelsTime && (
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
                  program={program}
                  visibilityMode={visibilityMode}
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
            serviceName={serviceName}
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
              name={apiInterfaceName}
              operations={operations}
              packageName={packageName}
              program={program}
            />
          </SourceFile>
        )}

        {/* Unions file - only if we have unions */}
        {hasUnions && (
          <SourceFile path="unions.go">
            {layout.imports.unionsJsonFmt && (
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
