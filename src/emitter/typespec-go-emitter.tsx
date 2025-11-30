/**
 * TypeSpec Go Emitter - Modern Alloy-JS Implementation
 * Following TypeSpec v1.7.0 official patterns with Alloy-JS components
 * Zero string-based logic - 100% component-based generation
 */

import type { EmitContext, Program, Model, Namespace } from "@typespec/compiler";
import { writeOutput } from "@typespec/emitter-framework";
import { Output } from "@alloy-js/core";
import { GoPackageDirectory } from "../components/go/index.js";
import { join, relative } from "path";

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
 * Enhanced model collection with namespace grouping
 */
function collectModelsByNamespace(globalNamespace: Namespace): Map<string, { namespace?: Namespace, models: Model[] }> {
  const namespaceGroups = new Map<string, { namespace?: Namespace, models: Model[] }>();
  
  // Group models by namespace
  for (const [name, model] of globalNamespace.models) {
    const groupName = model.namespace?.name || "global";
    if (!namespaceGroups.has(groupName)) {
      namespaceGroups.set(groupName, { namespace: model.namespace, models: [] });
    }
    namespaceGroups.get(groupName)!.models.push(model);
  }
  
  // Process nested namespaces
  for (const namespace of globalNamespace.namespaces.values()) {
    const nsModels = [...namespace.models.values()];
    if (nsModels.length > 0) {
      namespaceGroups.set(namespace.name, { namespace, models: nsModels });
    }
    
    // Process nested namespaces recursively
    processNestedNamespaces(namespace, namespaceGroups);
  }
  
  return namespaceGroups;
}

/**
 * Recursively process nested namespaces
 */
function processNestedNamespaces(
  namespace: Namespace, 
  namespaceGroups: Map<string, { namespace?: Namespace, models: Model[] }>
): void {
  if (!namespace.namespaces || namespace.namespaces.size === 0) {
    return;
  }
  
  for (const nestedNs of namespace.namespaces.values()) {
    const nsModels = [...nestedNs.models.values()];
    if (nsModels.length > 0) {
      namespaceGroups.set(nestedNs.name, { namespace: nestedNs, models: nsModels });
    }
    
    processNestedNamespaces(nestedNs, namespaceGroups);
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

    // Collect models grouped by namespace
    const namespaceGroups = collectModelsByNamespace(globalNamespace);
    
    if (namespaceGroups.size === 0) {
      console.log("⚠️  No models found in TypeSpec program");
      return;
    }

    console.log(`📦 Processing ${namespaceGroups.size} namespace groups`);

    // Process each namespace as separate Go package
    for (const [namespaceName, { namespace, models }] of namespaceGroups) {
      if (models.length === 0) {
        console.log(`⚠️  Skipping namespace '${namespaceName}' - no models`);
        continue;
      }
      
      const packageName = namespaceToPackageName(namespaceName);
      const outputDirectory = getOutputDirectory(namespace, context);
      const packageDocumentation = `Go types from TypeSpec namespace: ${namespaceName}`;
      
      console.log(`📦 Generating package '${packageName}' from namespace '${namespaceName}'`);
      console.log(`   📁 Output directory: ${outputDirectory}`);
      console.log(`   🏗️  Models: ${models.map(m => m.name).join(', ')}`);
      
      // Generate JSX Output using professional component architecture
      await writeOutput(
        program,
        <Output>
          <GoPackageDirectory 
            models={models}
            packageName={packageName}
            packageDocumentation={packageDocumentation}
          />
        </Output>,
        outputDirectory,
      );
    }

    console.log("✅ TypeSpec Go emission completed successfully");
    
    // Summary
    const totalModels = [...namespaceGroups.values()]
      .reduce((sum, group) => sum + group.models.length, 0);
    console.log(`📊 Generated ${totalModels} Go models across ${namespaceGroups.size} packages`);
    
  } catch (error) {
    console.error("❌ TypeSpec Go emission failed:", error);
    throw error;
  }
}