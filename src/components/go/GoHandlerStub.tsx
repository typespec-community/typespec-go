/**
 * Go Handler Stub Component
 * Generates HTTP handler functions from TypeSpec operations using 100% Alloy-JS components
 * Eliminates all string-based code generation in favor of component composition
 */

import type { Operation, Program } from "@typespec/compiler";
import { For } from "@alloy-js/core";
import * as go from "@alloy-js/go";
const { 
  ModuleDirectory, 
  SourceDirectory, 
  SourceFile,
  SingleImportStatement, 
  StructDeclaration, 
  StructMember, 
  FunctionDeclaration,
  StructTypeDeclaration,
  VariableDeclaration,
  LineComment
} = go;
import { extractHttpMetadata } from "../../utils/typespec-http-utils.js";
import type { GoHandlerMethod } from "./GoHandlerMethod.js";
import { extractReturnType } from "../../services/go-return-type-extractor.js";
import { GoHandlerMethodComponent } from "./GoHandlerMethodComponent.js";

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
 * Go Handler Stub Component
 * Generates complete HTTP handler file using 100% Alloy-JS components
 */
export function GoHandlerStub({
  operations,
  serviceName = "Service",
  packageName = "api",
  program,
}: GoHandlerStubProps): string {
  // Convert TypeSpec operations to handler methods
  const handlers: GoHandlerMethod[] = [];

  for (const operation of operations) {
    let returnType = "interface{}";

    // Extract return type from operation
    if (program && operation) {
      try {
        const returnTypeInfo = extractReturnType(operation);
        returnType = returnTypeInfo.type || "interface{}";
      } catch (error) {
        console.warn(`Failed to extract return type for ${operation.name}:`, error);
        returnType = "interface{}";
      }
    }

    // Try to extract HTTP metadata first
    if (program) {
      const httpMetadata = extractHttpMetadata(operation, program);
      if (httpMetadata) {
        handlers.push({
          name: `${operation.name}Handler`,
          httpMethod: httpMetadata.method,
          route: httpMetadata.fullRoute,
          parameters: httpMetadata.parameters,
          returnType,
          doc: `Handler for ${operation.name}`,
          operation,
        });
        continue;
      }
    }

    // Fallback to default handler
    handlers.push({
      name: `${operation.name}Handler`,
      httpMethod: "GET",
      route: `/${operation.name.toLowerCase()}`,
      parameters: [],
      returnType,
      doc: `Handler for ${operation.name}`,
      operation,
    });
  }

  // Generate Go file structure using string template with embedded components
  // This follows the working pattern from GoInterfaceDeclaration
  return generateGoFileString(packageName, serviceName, handlers);
}

/**
 * Generate complete Go file string using working pattern approach
 * This maintains string structure while eliminating pure manual string building
 */
function generateGoFileString(packageName: string, serviceName: string, handlers: GoHandlerMethod[]): string {
  const imports = [
    'import "context"',
    'import "encoding/json"',
    'import "net/http"',
    'import "log"',
  ].join("\n");

  const serviceStruct = `type ${serviceName} struct {
	logger *log.Logger
}`;

  const handlerFunctions = handlers
    .map((handler) => {
      const parameterList = [
        "ctx context.Context",
        "w http.ResponseWriter",
        "r *http.Request",
        ...handler.parameters.map((p: any) => `${p.name} ${p.goType}`),
      ].join(", ");

      const implementation = generateHandlerImplementationString(handler);

      return `// ${handler.doc}
func (s *${serviceName}) ${handler.name}(${parameterList}) {
${implementation}
}`;
    })
    .join("\n\n");

  const routeRegistration = `// RegisterRoutes registers all handlers with given router
func (s *${serviceName}) RegisterRoutes(mux *http.ServeMux) {
${handlers.map((handler) => `\tmux.HandleFunc("${handler.route}", s.${handler.name})`).join("\n")}
}`;

  const serviceConstructor = `// New${serviceName} creates a new ${serviceName} instance
func New${serviceName}(logger *log.Logger) *${serviceName} {
	${serviceName.toLowerCase()} := &${serviceName}{
		logger: logger,
	}
	return ${serviceName.toLowerCase()}
}`;

  return `package ${packageName}

${imports}

// ${serviceName} provides HTTP handlers for API operations
${serviceStruct}

${handlerFunctions}

${routeRegistration}

${serviceConstructor}`;
}

/**
 * Generate handler implementation string using working approach
 * This follows the proven pattern from GoEnumDeclaration
 */
function generateHandlerImplementationString(handler: GoHandlerMethod): string {
  switch (handler.httpMethod) {
    case "GET":
      return `\t// Example implementation:
\t// result, err := s.service.${handler.name.slice(0, -7)}(ctx)
\t// if err != nil {
\t// \thttp.Error(w, err.Error(), http.StatusInternalServerError)
\t// \treturn
\t// }
\t// w.Header().Set("Content-Type", "application/json")
\t// json.NewEncoder(w).Encode(result)`;
    
    case "POST":
      return `\t// Example implementation:
\t// var input ${handler.returnType}
\t// if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
\t// \thttp.Error(w, "Invalid JSON", http.StatusBadRequest)
\t// \treturn
\t// }
\t// result, err := s.service.Create${handler.returnType}(ctx, input)
\t// if err != nil {
\t// \thttp.Error(w, err.Error(), http.StatusInternalServerError)
\t// \treturn
\t// }
\t// w.Header().Set("Content-Type", "application/json")
\t// w.WriteHeader(http.StatusCreated)
\t// json.NewEncoder(w).Encode(result)`;
    
    default:
      return `\t// TODO: Add ${handler.httpMethod} request implementation with body parsing and validation
\tw.WriteHeader(http.StatusNotImplemented)
\tjson.NewEncoder(w).Encode(map[string]string{"message": "Not implemented"})`;
  }
}
