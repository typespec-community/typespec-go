/**
 * Go Handler Stub Component
 * Generates HTTP handler functions from TypeSpec operations using Alloy-JS Go components
 * Replaces string-based generation with component-based architecture
 */

import type { Operation, Program } from "@typespec/compiler";
import { SourceFile } from "@alloy-js/go";
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
    <SourceFile path="handlers.go">{`package ${packageName}

import (
	"context"
	"encoding/json"
	"net/http"
	"log"
)

// ${serviceName} provides HTTP handlers for API operations
type ${serviceName} struct {
	logger *log.Logger
}

${handlers.map((handler) => generateHandlerMethod(handler, serviceName)).join("\n\n")}

${generateRouteRegistration(handlers, serviceName)}

${generateServiceConstructor(serviceName)}
`}</SourceFile>
  );
}

/**
 * Generate handler method code string
 */
function generateHandlerMethod(handler: GoHandlerMethod, serviceName: string): string {
  return `func (s *${serviceName}) ${handler.name}(${generateParameters(handler.parameters)}) {
	// ${handler.doc || `handles ${handler.httpMethod} ${handler.route}`}
	// TODO: Implement ${handler.name} handler with business logic
	// Route: ${handler.httpMethod} ${handler.route}

	${generateHandlerImplementation(handler)}
}`;
}

/**
 * Generate parameter list for handler method
 */
function generateParameters(parameters: any[]): string {
  const stdParams = ["ctx context.Context", "w http.ResponseWriter", "r *http.Request"];
  const customParams = parameters.map((p) => `${p.name} ${p.goType}`);
  return [...stdParams, ...customParams].join(", ");
}

/**
 * Generate handler implementation based on HTTP method
 */
function generateHandlerImplementation(handler: GoHandlerMethod): string {
  switch (handler.httpMethod) {
    case "GET":
      return `\t// Example implementation:
	// result, err := s.service.${handler.name.slice(0, -7)}(ctx)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }
	// w.Header().Set("Content-Type", "application/json")
	// json.NewEncoder(w).Encode(result)`;
    case "POST":
      return `\t// Example implementation:
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
      return `\t// TODO: Add ${handler.httpMethod} request implementation with body parsing and validation
	w.WriteHeader(http.StatusNotImplemented)
	json.NewEncoder(w).Encode(map[string]string{"message": "Not implemented"})`;
  }
}

/**
 * Generate route registration function
 */
function generateRouteRegistration(handlers: GoHandlerMethod[], serviceName: string): string {
  const handlerRegistrations = handlers
    .map((handler) => `\tmux.HandleFunc("${handler.route}", s.${handler.name})`)
    .join("\n");

  return `// RegisterRoutes registers all handlers with given router
func (s *${serviceName}) RegisterRoutes(mux *http.ServeMux) {
${handlerRegistrations}
}`;
}

/**
 * Generate service constructor
 */
function generateServiceConstructor(serviceName: string): string {
  return `// New${serviceName} creates a new service instance
func New${serviceName}(logger *log.Logger) *${serviceName} {
	${serviceName.toLowerCase()} := &${serviceName}{
		logger: logger,
	}
	return ${serviceName.toLowerCase()}
}`;
}
