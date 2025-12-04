/**
 * Go Handler Stub Component
 * Generates HTTP handler functions from TypeSpec operations using Alloy-JS Go components
 * Replaces string-based generation with component-based architecture
 */

import type { Operation, Program } from "@typespec/compiler";
import { 
  SourceFile,
  SingleImportStatement,
  FunctionDeclaration,
  FunctionReceiver,
  VariableDeclaration,
  StructTypeDeclaration,
  StructMember,
  Reference
} from "@alloy-js/go";
import { For, refkey } from "@alloy-js/core";
import { extractHttpMetadata } from "../../utils/typespec-http-utils.js";
import type { GoHandlerMethod } from "./GoHandlerMethod.js";

interface GoHandlerStubProps {
  /** TypeSpec operations to convert to HTTP handlers */
  operations: Operation[];
  /** Service name for handler struct */
  serviceName?: string;
  /** Package name for imports */
  packageName?: string;
  /** TypeSpec program for accessing @doc decorators */
  program?: Program;
}

/**
 * Go Handler Stub Component using Alloy-JS
 * Generates complete HTTP handler file with proper Go code structure
 * Uses component-based generation instead of string manipulation
 */
export function GoHandlerStub({
  operations,
  serviceName = "Service",
  packageName = "api",
  program,
}: GoHandlerStubProps) {
  // Convert TypeSpec operations to handler methods
  const handlers: GoHandlerMethod[] = [];

  for (const operation of operations) {
    if (program) {
      const httpMetadata = extractHttpMetadata(operation, program);
      if (httpMetadata) {
        handlers.push({
          name: `${operation.name}Handler`,
          httpMethod: httpMetadata.method,
          route: httpMetadata.fullRoute,
          parameters: httpMetadata.parameters,
          returnType: "interface{}", // TODO: Extract from operation return type
          doc: `Handler for ${operation.name}`,
          operation,
        });
      }
    }
  }

  return (
    <SourceFile path="handlers.go">
      {/* Import statements */}
      <SingleImportStatement path="context" />
      <SingleImportStatement path="encoding/json" />
      <SingleImportStatement path="net/http" />
      <SingleImportStatement path="log" />
      
      {/* Service struct declaration */}
      <StructTypeDeclaration name={serviceName}>
        <StructMember name="logger" type="*log.Logger" doc={`Logger instance for ${serviceName}`} />
      </StructTypeDeclaration>

      {/* Handler methods */}
      <For each={handlers}>
        {(handler: GoHandlerMethod) => (
          <FunctionDeclaration 
            name={handler.name}
            doc={handler.doc}
            receiver={<FunctionReceiver name="s" type="*Service" />}
            parameters={[
              { name: "ctx", type: "context.Context" },
              { name: "w", type: "http.ResponseWriter" },
              { name: "r", type: "*http.Request" },
              ...handler.parameters.map((p: any) => ({ name: p.name, type: p.goType }))
            ]}
          >
            {generateHandlerImplementation(handler)}
          </FunctionDeclaration>
        )}
      </For>

      {/* Route registration */}
      <FunctionDeclaration 
        name="RegisterRoutes"
        doc="Registers all handlers with given router"
        receiver={<FunctionReceiver name="s" type="*Service" />}
        parameters={[{ name: "mux", type: "*http.ServeMux" }]}
      >
        <For each={handlers} joiner={<hbr />}>
          {(handler: GoHandlerMethod) => `mux.HandleFunc("${handler.route}", s.${handler.name})`}
        </For>
      </FunctionDeclaration>

      {/* Service constructor */}
      <FunctionDeclaration 
        name={`New${serviceName}`}
        doc={`Creates a new ${serviceName} instance`}
        parameters={[{ name: "logger", type: "*log.Logger" }]}
        returns={`*${serviceName}`}
      >
        {`${serviceName.toLowerCase()} := &${serviceName}{
			logger: logger,
		}
		return ${serviceName.toLowerCase()}`}
      </FunctionDeclaration>
    </SourceFile>
  );
}

/**
 * Generate handler implementation based on HTTP method
 */
function generateHandlerImplementation(handler: GoHandlerMethod): string {
  switch (handler.httpMethod) {
    case "GET":
      return `// Example implementation:
	// result, err := s.service.${handler.name.slice(0, -7)}(ctx)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }
	// w.Header().Set("Content-Type", "application/json")
	// json.NewEncoder(w).Encode(result)`;
    case "POST":
      return `// Example implementation:
	// var input ${handler.returnType}
	// if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
	// 	http.Error(w, "Invalid JSON", http.StatusBadRequest)
	// 	return
	// }
	// result, err := s.service.Create${handler.returnType}(ctx, input)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }
	// w.Header().Set("Content-Type", "application/json")
	// w.WriteHeader(http.StatusCreated)
	// json.NewEncoder(w).Encode(result)`;
    default:
      return `// TODO: Add ${handler.httpMethod} request implementation with body parsing and validation
	w.WriteHeader(http.StatusNotImplemented)
	json.NewEncoder(w).Encode(map[string]string{"message": "Not implemented"})`;
  }
}
