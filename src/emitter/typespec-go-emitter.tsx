/**
 * TypeSpec Go Emitter - Modern Alloy-JS Implementation
 * Following TypeSpec v1.7.0 official patterns with Alloy-JS components
 * Zero string-based logic - 100% component-based generation
 */

import type { EmitContext, Enum, Model, Namespace, Operation, Union } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";
import { Output } from "@alloy-js/core";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";
import { join } from "path";
import { LogContext, Logger } from "../domain/structured-logging.js";

/** Namespace group containing models, enums, unions, and operations */
interface NamespaceGroup {
  namespace?: Namespace;
  models: Model[];
  enums: Enum[];
  unions: Union[];
  operations: Operation[];
}

/**
 * Determine output directory for a namespace
 */
function getOutputDirectory(namespace: Namespace | undefined, context: EmitContext): string {
  if (!namespace || namespace.name === "") {
    // Global models - output to 'api' directory
    return join(context.emitterOutputDir, "api");
  }

  // Convert namespace path to directory structure
  // Vendor.Service.API → vendor/service/api
  const namespacePath = namespace.name.replace(/\./g, "/");
  return join(context.emitterOutputDir, namespacePath.toLowerCase());
}

/**
 * Enhanced collection with namespace grouping for models, enums, and unions
 */
function collectTypesByNamespace(globalNamespace: Namespace): Map<string, NamespaceGroup> {
  const namespaceGroups = new Map<string, NamespaceGroup>();

  // Helper to ensure a group exists
  const ensureGroup = (name: string, namespace?: Namespace): NamespaceGroup => {
    if (!namespaceGroups.has(name)) {
      namespaceGroups.set(name, { namespace, models: [], enums: [], unions: [], operations: [] });
    }
    return namespaceGroups.get(name)!;
  };

  // Collect models from global namespace
  for (const [name, model] of globalNamespace.models) {
    const groupName = model.namespace?.name || "global";
    const group = ensureGroup(groupName, model.namespace);
    group.models.push(model);
  }

  // Collect enums from global namespace
  for (const [name, enumType] of globalNamespace.enums) {
    const groupName = enumType.namespace?.name || "global";
    const group = ensureGroup(groupName, enumType.namespace);
    group.enums.push(enumType);
  }

  // Collect unions from global namespace
  for (const [name, union] of globalNamespace.unions) {
    const groupName = union.namespace?.name || "global";
    const group = ensureGroup(groupName, union.namespace);
    group.unions.push(union);
  }

  // Collect operations from global namespace
  for (const [name, operation] of globalNamespace.operations) {
    const groupName = operation.namespace?.name || "global";
    const group = ensureGroup(groupName, operation.namespace);
    group.operations.push(operation);
  }

  // Process nested namespaces
  for (const namespace of globalNamespace.namespaces.values()) {
    processNestedNamespace(namespace, namespaceGroups, ensureGroup);
  }

  return namespaceGroups;
}

/**
 * Recursively process nested namespaces
 */
function processNestedNamespace(
  namespace: Namespace,
  namespaceGroups: Map<string, NamespaceGroup>,
  ensureGroup: (name: string, namespace?: Namespace) => NamespaceGroup,
): void {
  // Collect models from this namespace
  const nsModels = [...namespace.models.values()];
  const nsEnums = [...namespace.enums.values()];
  const nsUnions = [...namespace.unions.values()];
  const nsOperations = [...namespace.operations.values()];

  if (nsModels.length > 0 || nsEnums.length > 0 || nsUnions.length > 0 || nsOperations.length > 0) {
    const group = ensureGroup(namespace.name, namespace);
    group.models.push(...nsModels);
    group.enums.push(...nsEnums);
    group.unions.push(...nsUnions);
    group.operations.push(...nsOperations);
  }

  // Recurse into nested namespaces
  if (namespace.namespaces && namespace.namespaces.size > 0) {
    for (const nestedNs of namespace.namespaces.values()) {
      processNestedNamespace(nestedNs, namespaceGroups, ensureGroup);
    }
  }
}

/**
 * Convert namespace name to Go package name
 */
function namespaceToPackageName(namespaceName: string): string {
  // Convert dots to slashes and lowercase
  return namespaceName.replace(/\./g, "/").toLowerCase();
}

/**
 * Main TypeSpec emitter entry point
 */
export async function $onEmit(context: EmitContext): Promise<void> {
  try {
    const program = context.program;
    const globalNamespace = program.getGlobalNamespaceType();

    Logger.info(LogContext.TYPESPEC_INTEGRATION, "TypeSpec Go Emitter starting...", {
      globalNamespace: globalNamespace.name,
    });

    // Collect all types grouped by namespace
    const namespaceGroups = collectTypesByNamespace(globalNamespace);

    if (namespaceGroups.size === 0) {
      Logger.warn(LogContext.TYPESPEC_INTEGRATION, "No types found in TypeSpec program");
      return;
    }

    Logger.info(
      LogContext.TYPESPEC_INTEGRATION,
      `Processing ${namespaceGroups.size} namespace groups`,
    );

    // Track statistics
    let totalModels = 0;
    let totalEnums = 0;
    let totalUnions = 0;
    let totalOperations = 0;

    // Process each namespace as separate Go package
    for (const [namespaceName, group] of namespaceGroups) {
      const { namespace, models, enums, unions, operations } = group;
      const typeCount = models.length + enums.length + unions.length + operations.length;

      if (typeCount === 0) {
        Logger.warn(
          LogContext.TYPESPEC_INTEGRATION,
          `Skipping namespace '${namespaceName}' - no types`,
        );
        continue;
      }

      const packageName = namespaceToPackageName(namespaceName);
      const outputDirectory = getOutputDirectory(namespace, context);
      const packageDocumentation = `Go types from TypeSpec namespace: ${namespaceName}`;

      Logger.info(
        LogContext.TYPESPEC_INTEGRATION,
        `Generating package '${packageName}' from namespace '${namespaceName}'`,
        {
          outputDirectory,
          typeCount,
          modelCount: models.length,
          enumCount: enums.length,
          unionCount: unions.length,
          operationCount: operations.length,
        },
      );

      if (models.length > 0) {
        Logger.debug(LogContext.GO_GENERATION, "Models to generate", {
          models: models.map((m) => m.name),
        });
        totalModels += models.length;
      }
      if (enums.length > 0) {
        Logger.debug(LogContext.GO_GENERATION, "Enums to generate", {
          enums: enums.map((e) => e.name),
        });
        totalEnums += enums.length;
      }
      if (unions.length > 0) {
        Logger.debug(LogContext.GO_GENERATION, "Unions to generate", {
          unions: unions.map((u) => u.name || "Anonymous"),
        });
        totalUnions += unions.length;
      }
      if (operations.length > 0) {
        Logger.debug(LogContext.GO_GENERATION, "Operations to generate", {
          operations: operations.map((o) => o.name),
        });
        totalOperations += operations.length;
      }

      // Generate JSX Output using professional component architecture
      await writeOutput(
        program,
        <Output>
          <GoPackageDirectory
            models={models}
            enums={enums}
            unions={unions}
            operations={operations}
            packageName={packageName}
            packageDocumentation={packageDocumentation}
            program={program}
          />
        </Output>,
        outputDirectory,
      );
    }

    Logger.info(LogContext.TYPESPEC_INTEGRATION, "TypeSpec Go emission completed successfully", {
      namespaceCount: namespaceGroups.size,
      totalModels,
      totalEnums,
      totalUnions,
      totalOperations,
    });
  } catch (error) {
    Logger.error(
      LogContext.ERROR_HANDLING,
      "TypeSpec Go emission failed",
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      "emitter-failed",
    );
    throw error;
  }
}
