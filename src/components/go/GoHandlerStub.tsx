/**
 * Go Handler Stub Component
 * Generates HTTP handler functions from TypeSpec operations using 100% Alloy-JS components
 * Eliminates all string-based code generation in favor of component composition
 */

import { code, refkey } from "@alloy-js/core";
import type { Operation, Program } from "@typespec/compiler";
import * as go from "@alloy-js/go";
const {
  SourceFile,
  StructTypeDeclaration,
  StructMember,
  FunctionDeclaration,
  LineComment,
  FunctionReceiver,
} = go;
import { extractHttpMetadata } from "../../utils/typespec-http-utils.js";
import type { HttpParameter } from "../../utils/typespec-http-utils.js";
import type { GoHandlerMethod } from "./GoHandlerMethod.js";
import { extractReturnType } from "../../services/go-return-type-extractor.js";
import { GoHandlerMethodComponent } from "./GoHandlerMethodComponent.js";
import { GoImportGroup } from "./GoImportGroup.js";
import type { Children } from "@alloy-js/core";

/**
 * Build the call-site expression + prelude statements that adapt an HTTP
 * request into one handler parameter (path/query extraction, body decoding).
 */
function handlerArgument(p: HttpParameter): { preludes: string[]; expr: string } {
  if (p.goType === "context.Context") return { preludes: [], expr: "context.Background()" };
  if (p.goType === "http.ResponseWriter") return { preludes: [], expr: "w" };
  if (p.goType === "*http.Request") return { preludes: [], expr: "r" };

  const rawName = p.property?.name ?? p.name;
  if (p.source === "path") {
    return { preludes: [], expr: `r.PathValue("${rawName}")` };
  }
  if (p.source === "query") {
    return { preludes: [], expr: `r.URL.Query().Get("${rawName}")` };
  }
  if (p.source === "body") {
    return {
      preludes: [`var ${p.name} ${p.goType}`, `_ = json.NewDecoder(r.Body).Decode(&${p.name})`],
      expr: p.name,
    };
  }
  return { preludes: [], expr: `*new(${p.goType})` };
}

/**
 * One mux.HandleFunc registration: a wrapping closure that adapts the raw
 * request (context, path/query values, decoded body) into handler arguments.
 */
function routeRegistration(handler: GoHandlerMethod, isFirst: boolean): Children {
  const preludes: string[] = [];
  const args: string[] = [];
  for (const p of handler.parameters) {
    const adapted = handlerArgument(p);
    preludes.push(...adapted.preludes);
    args.push(adapted.expr);
  }

  return (
    <>
      {!isFirst && "\n"}
      {`mux.HandleFunc("${handler.route}", func(w http.ResponseWriter, r *http.Request) {`}
      {"\n"}
      {preludes.map((line, index) => (
        <>
          {index > 0 && "\n"}
          {"\t" + line}
        </>
      ))}
      {preludes.length > 0 && "\n"}
      {`\ts.${handler.name}(${args.join(", ")})`}
      {"\n"}
      {"})"}
    </>
  );
}

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
  packageName: _packageName = "api",
  program,
}: GoHandlerStubProps) {
  const serviceRefkey = refkey(serviceName);

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
        console.warn("Failed to extract return type for " + operation.name + ":", error);
        returnType = "interface{}";
      }
    }

    // Try to extract HTTP metadata first
    if (program) {
      const httpMetadata = extractHttpMetadata(operation, program);
      if (httpMetadata) {
        handlers.push({
          name: operation.name + "Handler",
          httpMethod: httpMetadata.method,
          route: httpMetadata.fullRoute,
          parameters: httpMetadata.parameters,
          returnType,
          doc: "Handler for " + operation.name,
          operation,
        });
        continue;
      }
    }

    // Fallback to default handler
    handlers.push({
      name: operation.name + "Handler",
      httpMethod: "GET",
      route: "/" + operation.name.toLowerCase(),
      parameters: [
        { name: "ctx", goType: "context.Context", source: "header", optional: false },
        { name: "w", goType: "http.ResponseWriter", source: "header", optional: false },
        { name: "r", goType: "*http.Request", source: "header", optional: false },
      ],
      returnType,
      doc: "Handler for " + operation.name,
      operation,
    });
  }

  // encoding/json is only consumed when a handler takes a request body
  const needsJsonImport = handlers.some((handler) =>
    handler.parameters.some((p) => p.source === "body"),
  );

  // Generate Go file structure using 100% Alloy-JS components
  // goimports convention: one sorted std-lib group
  const handlerImports = ["context", "log", "net/http"];
  if (needsJsonImport) {
    handlerImports.push("encoding/json");
  }
  handlerImports.sort();
  return (
    <SourceFile path="handlers.go">
      {/* Usage-driven imports: framework trio always, json only for bodies */}
      <GoImportGroup paths={handlerImports} />
      {"\n\n"}

      {/* Service struct declaration */}
      <LineComment>{serviceName + " provides HTTP handlers for API operations"}</LineComment>
      {"\n"}
      <StructTypeDeclaration name={serviceName} refkey={serviceRefkey}>
        <StructMember name="logger" type="*log.Logger" />
      </StructTypeDeclaration>

      {/* Handler methods */}
      {handlers.map((handler, index) => (
        <>
          {"\n\n"}
          <GoHandlerMethodComponent handler={handler} serviceName={serviceName} />
          {index === handlers.length - 1 && "\n\n"}
        </>
      ))}

      {/* Route registration method */}
      <FunctionDeclaration
        name="RegisterRoutes"
        receiver={<FunctionReceiver name="s" type={`*${serviceName}`} />}
        doc="RegisterRoutes registers all handlers with given router"
        parameters={[{ name: "mux", type: "*http.ServeMux" }]}
      >
        {handlers.map((handler, index) => routeRegistration(handler, index === 0))}
      </FunctionDeclaration>

      {/* Service constructor */}
      {"\n\n"}
      <FunctionDeclaration
        name={`New${serviceName}`}
        returns={`*${serviceName}`}
        parameters={[{ name: "logger", type: "*log.Logger" }]}
      >
        {code`
          return &${serviceName}{logger: logger}
        `}
      </FunctionDeclaration>
    </SourceFile>
  );
}
