/**
 * Simple Working Test Host
 * 
 * Uses minimal TypeSpec testing infrastructure
 * Avoids complex import and compilation issues
 */
import {
  createTestHost,
  createTestWrapper,
} from "@typespec/compiler/testing";

// Create simple inline library to avoid import issues
const SimpleLibrary = {
  name: "@typespec-community/typespec-go",
  emitter: {
    options: {
      // Basic emitter options
    },
  },
  diagnostics: {
    "test-error": {
      severity: "error",
      messages: {
        default: "Test error: {message}",
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