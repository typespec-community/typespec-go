/**
 * TypeSpec Go Emitter - Modern Alloy-JS Implementation
 * Following TypeSpec v1.7.0 official patterns with Alloy-JS components
 * Zero string-based logic - 100% component-based generation
 */

import type { EmitContext, Program, Model, Namespace, Enum, Union } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";
import { Output } from "@alloy-js/core";
import { GoPackageDirectory } from "../components/go/index.js";
import { join } from "path";

/** Namespace group containing models, enums, and unions */
interface NamespaceGroup {
  namespace?: Namespace;
  models: Model[];
  enums: Enum[];
  unions: Union[];
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
  const namespacePath = namespace.name.replace(/\./g, '/');
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
      namespaceGroups.set(name, { namespace, models: [], enums: [], unions: [] });
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
  ensureGroup: (name: string, namespace?: Namespace) => NamespaceGroup
): void {
  // Collect models from this namespace
  const nsModels = [...namespace.models.values()];
  const nsEnums = [...namespace.enums.values()];
  const nsUnions = [...namespace.unions.values()];
  
  if (nsModels.length > 0 || nsEnums.length > 0 || nsUnions.length > 0) {
    const group = ensureGroup(namespace.name, namespace);
    group.models.push(...nsModels);
    group.enums.push(...nsEnums);
    group.unions.push(...nsUnions);
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
  return namespaceName.replace(/\./g, '/').toLowerCase();
}

/**
 * Main TypeSpec emitter entry point
 */
export async function $onEmit(context: EmitContext): Promise<void> {
  try {
    const program = context.program;
    const globalNamespace = program.getGlobalNamespaceType();
    
    console.log("🚀 TypeSpec Go Emitter starting...");
    console.log("📋 Global namespace:", globalNamespace.name);

    // Collect all types grouped by namespace
    const namespaceGroups = collectTypesByNamespace(globalNamespace);
    
    if (namespaceGroups.size === 0) {
      console.log("⚠️  No types found in TypeSpec program");
      return;
    }

    console.log(`📦 Processing ${namespaceGroups.size} namespace groups`);

    // Track statistics
    let totalModels = 0;
    let totalEnums = 0;
    let totalUnions = 0;

    // Process each namespace as separate Go package
    for (const [namespaceName, group] of namespaceGroups) {
      const { namespace, models, enums, unions } = group;
      const typeCount = models.length + enums.length + unions.length;
      
      if (typeCount === 0) {
        console.log(`⚠️  Skipping namespace '${namespaceName}' - no types`);
        continue;
      }
      
      const packageName = namespaceToPackageName(namespaceName);
      const outputDirectory = getOutputDirectory(namespace, context);
      const packageDocumentation = `Go types from TypeSpec namespace: ${namespaceName}`;
      
      console.log(`📦 Generating package '${packageName}' from namespace '${namespaceName}'`);
      console.log(`   📁 Output directory: ${outputDirectory}`);
      
      if (models.length > 0) {
        console.log(`   🏗️  Models: ${models.map(m => m.name).join(', ')}`);
        totalModels += models.length;
      }
      if (enums.length > 0) {
        console.log(`   📋 Enums: ${enums.map(e => e.name).join(', ')}`);
        totalEnums += enums.length;
      }
      if (unions.length > 0) {
        console.log(`   🔀 Unions: ${unions.map(u => u.name || 'Anonymous').join(', ')}`);
        totalUnions += unions.length;
      }
      
      // Generate JSX Output using professional component architecture
      await writeOutput(
        program,
        <Output>
          <GoPackageDirectory 
            models={models}
            enums={enums}
            unions={unions}
            packageName={packageName}
            packageDocumentation={packageDocumentation}
            program={program}
          />
        </Output>,
        outputDirectory,
      );
    }

    console.log("✅ TypeSpec Go emission completed successfully");
    
    // Summary
    console.log(`📊 Generated across ${namespaceGroups.size} packages:`);
    console.log(`   - ${totalModels} models`);
    console.log(`   - ${totalEnums} enums`);
    console.log(`   - ${totalUnions} unions`);
    
  } catch (error) {
    console.error("❌ TypeSpec Go emission failed:", error);
    throw error;
  }
}