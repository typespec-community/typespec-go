/**
 * Simple Working Test Host
 * 
 * Uses minimal dependencies and working patterns
 * Enables TypeSpec → Go testing without complexity
 */
import { createTestHost, createTestWrapper } from "@typespec/compiler/testing";

// Create simple library object (no TypeScript issues)
const SimpleLibrary = {
  name: "@typespec-community/typespec-go",
  diagnostics: {
    "unsupported-type": {
      severity: "error",
      messages: {
        default: "Type '{typeName}' ({kind}) is not yet supported for Go generation.",
      },
    },
  },
};

export async function createSimpleTestHost() {
  const host = createTestHost({
    libraries: [SimpleLibrary],
  });
  return host;
}

export async function createSimpleTestRunner() {
  const host = await createSimpleTestHost();

  return createTestWrapper(host, {
    compilerOptions: {
      noEmit: false,
      emit: ["@typespec-community/typespec-go"],
    },
  });
}