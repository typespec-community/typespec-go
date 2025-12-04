/**
 * Go Handler Stub Component
 * Generates HTTP handler functions from TypeSpec operations using Alloy-JS Go components
 * Replaces string-based generation with component-based architecture
 */

import type {ModelProperty, Operation, Program, Type} from "@typespec/compiler"
import {For, refkey, StatementList, Switch} from "@alloy-js/core"
import {FunctionDeclaration, Reference} from "@alloy-js/go"
import {capitalize} from "../../utils/strings.js"
import {getDocumentation} from "../../utils/typespec-utils.js"

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

interface GoHandlerMethod {
	/** Handler function name */
	name: string;
	/** HTTP method (GET, POST, etc.) */
	httpMethod: string;
	/** Route path */
	route: string;
	/** Method parameters */
	parameters: HandlerParameter[];
	/** Return type */
	returnType: string | any;
	/** Documentation comment */
	doc?: string;
	/** TypeSpec operation for refkey tracking */
	operation?: Operation;
}

interface HandlerParameter {
	/** Parameter name */
	name: string;
	/** Go type */
	type: string | any;
	/** Source (path, query, body) */
	source: string;
	/** TypeSpec property for refkey tracking */
	property?: ModelProperty;
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
	const handlers = operations.map((op) => operationToHandler(op, program))
	const serviceRef = refkey(serviceName)

	return (
		<GoHandlerContent
			handlers={handlers}
			serviceName={serviceName}
			packageName={packageName}
			serviceRef={serviceRef}
		/>
	)
}

/**
 * Convert TypeSpec Operation to Go HTTP handler with refkey tracking
 */
function operationToHandler(operation: Operation, program?: Program): GoHandlerMethod {
	const operationName = operation.name
	const httpMethod = inferHttpMethod(operationName)
	const route = inferRoute(operationName)
	const handlerName = `${capitalize(operationName)}Handler`
	const parameters = extractHandlerParameters(operation)
	const returnType = mapHandlerReturnType(operation)
	const doc = program && getDocumentation ? getDocumentation(program, operation) : undefined
	const operationRef = refkey(operation)

	return {
		name: handlerName,
		httpMethod,
		route,
		parameters,
		returnType,
		doc,
		operation: operation,
	}
}

/**
 * Infer HTTP method from operation name
 */
function inferHttpMethod(operationName: string): string {
	const name = operationName.toLowerCase()

	if (name.startsWith("get") || name.includes("list") || name.includes("find")) {
		return "GET"
	} else if (name.startsWith("create") || name.startsWith("post") || name.includes("add")) {
		return "POST"
	} else if (name.startsWith("update") || name.startsWith("put") || name.includes("modify")) {
		return "PUT"
	} else if (name.startsWith("patch") || name.includes("partial")) {
		return "PATCH"
	} else if (name.startsWith("delete") || name.startsWith("remove") || name.includes("destroy")) {
		return "DELETE"
	} else {
		return "POST" // Default to POST
	}
}

/**
 * Infer route path from operation name
 */
function inferRoute(operationName: string): string {
	const name = operationName.toLowerCase()

	// Extract resource name from operation
	// getUser -> /users/{id}
	// listUsers -> /users
	// createUser -> /users

	if (name.includes("list")) {
		const resource = name.replace("list", "").replace("s", "") + "s"
		return `/${resource}`
	} else if (name.includes("create")) {
		const resource = name.replace("create", "") + "s"
		return `/${resource}`
	} else if (name.startsWith("get") && name !== "get") {
		const resource = name.slice(3).replace(/s$/, "")
		return `/${resource}s/{id}`
	} else if (name.startsWith("update")) {
		const resource = name.replace("update", "").replace(/s$/, "")
		return `/${resource}s/{id}`
	} else if (name.startsWith("delete")) {
		const resource = name.replace("delete", "").replace("s", "") + "s"
		return `/${resource}/{id}`
	} else {
		// Default: use operation name as route
		return `/${operationName.toLowerCase()}`
	}
}

/**
 * Extract handler parameters from operation using Alloy-JS refkeys
 */
function extractHandlerParameters(operation: Operation): HandlerParameter[] {
	const params: HandlerParameter[] = []

	// Always include context and writer
	params.push({name: "ctx", type: "context.Context", source: "context"})
	params.push({name: "w", type: "http.ResponseWriter", source: "response"})
	params.push({name: "r", type: "*http.Request", source: "request"})

	// Add operation parameters
	if (operation.parameters) {
		for (const [name, prop] of operation.parameters.properties) {
			const source = inferParameterSource(name, prop)
			params.push({
				name: toCamelCase(name),
				type: mapTypeToGo(prop.type),
				source,
				property: prop,
			})
		}
	}

	return params
}

/**
 * Infer parameter source (path, query, body)
 */
function inferParameterSource(name: string, prop: ModelProperty): string {
	const lowerName = name.toLowerCase()

	if (lowerName === "id" || lowerName.includes("id")) {
		return "path"
	} else if (prop.type?.kind === "String" && prop.optional) {
		return "query"
	} else if (prop.type?.kind === "Model") {
		return "body"
	} else {
		return "query"
	}
}

/**
 * Map handler return type using Alloy-JS components
 */
function mapHandlerReturnType(operation: Operation): string | any {
	if (operation.returnType) {
		const goType = mapTypeToGo(operation.returnType)
		return goType !== "" ? goType : "void"
	}
	return "void"
}

/**
 * Map TypeSpec type to Go type using Alloy-JS refkey system
 */
function mapTypeToGo(type: Type): string | any {
	const typeRef = refkey(type)

	switch (type.kind) {
		case "String":
			return "string"
		case "Boolean":
			return "bool"
		case "Number":
			return "float64"
		case "Scalar":
			return mapScalarToGo(type.name || "")
		case "Model":
			if (type.name === "void") return ""
			return <Reference refkey={typeRef}/>
		case "Enum":
			return <Reference refkey={typeRef}/>
		case "Union":
			return <Reference refkey={typeRef}/>
		default:
			return "interface{}"
	}
}

/**
 * Map scalar type to Go
 */
function mapScalarToGo(name: string): string {
	const scalarMap: Record<string, string> = {
		string: "string",
		int8: "int8",
		int16: "int16",
		int32: "int32",
		int64: "int64",
		uint8: "uint8",
		uint16: "uint16",
		uint32: "uint32",
		uint64: "uint64",
		integer: "int",
		float32: "float32",
		float64: "float64",
		boolean: "bool",
		bytes: "[]byte",
		utcDateTime: "time.Time",
		plainDate: "time.Time",
		plainTime: "time.Time",
		duration: "time.Duration",
	}

	return scalarMap[name.toLowerCase()] || "interface{}"
}

/**
 * Convert to camelCase
 */
function toCamelCase(s: string): string {
	return s.charAt(0).toLowerCase() + s.slice(1)
}

/**
 * Alloy-JS Component for Go handler content generation
 * Replaces string-based generation with declarative components
 */
interface GoHandlerContentProps {
	handlers: GoHandlerMethod[];
	serviceName: string;
	packageName: string;
	serviceRef: any;
}

function GoHandlerContent({
	                          handlers,
	                          serviceName,
	                          packageName,
	                          serviceRef,
                          }: GoHandlerContentProps) {
	return (
		<>
			{/* Package declaration */}
			{`package ${packageName}

`}

			{/* Imports */}
			{`import (
\t"${packageName}" // Generated models
\t"context"
\t"encoding/json" 
\t"net/http"
\t"time"
)

`}

			{/* Service struct */}
			{`// ${serviceName} provides HTTP handlers for API operations
type ${serviceName} struct {
\t// Add service dependencies here (database, repositories, etc.)
}

`}

			{/* Generate handler methods */}
			<For each={handlers}>
				{(handler: GoHandlerMethod) => (
					<GoHandlerMethodComponent
						handler={handler}
						serviceName={serviceName}
						serviceRef={serviceRef}
					/>
				)}
			</For>

			{/* Route registration helper */}
			<GoRouteRegistrationComponent
				handlers={handlers}
				serviceName={serviceName}
			/>
		</>
	)
}

/**
 * Component for individual handler method generation
 */
function GoHandlerMethodComponent({
	                                  handler,
	                                  serviceName,
	                                  serviceRef,
                                  }: {
	handler: GoHandlerMethod;
	serviceName: string;
	serviceRef: any;
}) {
	return (
		<>
			{/* Handler documentation */}
			{handler.doc ? (
				`// ${handler.name} ${handler.doc}`
			) : (
				`// ${handler.name} handles ${handler.httpMethod} ${handler.route}`
			)}

			{/* Function signature */}
			<FunctionDeclaration
				name={handler.name}
				receiver={`s *${serviceName}`}
				parameters={handler.parameters.map(p => ({
					name: p.name,
					type: p.type,
				}))}
				returnType=""
			>
				{/* Handler implementation placeholder */}
				{`\t// TODO: Implement ${handler.name} handler with business logic
\t// Route: ${handler.httpMethod} ${handler.route}

`}

				<Switch>
					<Match when={handler.httpMethod === "GET"}>
						{`\t// Example implementation:
\t// result, err := s.service.${handler.name.slice(0, -7)}(ctx)
\t// if err != nil {
\t// \thttp.Error(w, err.Error(), http.StatusInternalServerError)
\t// \treturn
\t// }
\t// w.Header().Set("Content-Type", "application/json")
\t// json.NewEncoder(w).Encode(result)
`}
					</Match>

					<Match when={handler.httpMethod === "POST"}>
						{`\t// Example implementation:
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
\t// json.NewEncoder(w).Encode(result)
`}
					</Match>

					<Match else>
						{`\t// TODO: Add ${handler.httpMethod} request implementation with body parsing and validation
\tw.WriteHeader(http.StatusNotImplemented)
\tjson.NewEncoder(w).Encode(map[string]string{"message": "Not implemented"})
`}
					</Match>
				</Switch>
			</FunctionDeclaration>

			{`

`}
		</>
	)
}

/**
 * Component for route registration function
 */
function GoRouteRegistrationComponent({
	                                      handlers,
	                                      serviceName,
                                      }: {
	handlers: GoHandlerMethod[];
	serviceName: string;
}) {
	return (
		<>
			{`// RegisterRoutes registers all handlers with given router
func (s *${serviceName}) RegisterRoutes(mux *http.ServeMux) {
`}

			<For each={handlers}>
				{(handler: GoHandlerMethod) => (
					<StatementList>
						{`\tmux.HandleFunc("${handler.route}", s.${handler.name})`}
					</StatementList>
				)}
			</For>

			{`}
`}
		</>
	)
}

/**
 * Generate Go handler code
 */
function generateHandlerCode(
	serviceName: string,
	handlers: GoHandlerMethod[],
	packageName: string,
): string {
//TODO: THIS IS SHIT! Use alloy/go!

	const lines: string[] = []

	// Package and imports
	lines.push(`package ${packageName}`)
	lines.push("")
	lines.push("import (")
	lines.push(`\t"${packageName}" // Generated models`)
	lines.push('\t"context"')
	lines.push('\t"encoding/json"')
	lines.push('\t"net/http"')
	lines.push('\t"time"')
	lines.push(")")
	lines.push("")

	// Service struct
	lines.push(`// ${serviceName} provides HTTP handlers for API operations`)
	lines.push(`type ${serviceName} struct {`)
	lines.push(`\t// Add service dependencies here (database, repositories, etc.)`)
	lines.push("}")
	lines.push("")

	// Generate handler methods
	for (const handler of handlers) {
		if (handler.doc) {
			lines.push(`// ${handler.name} ${handler.doc}`)
		} else {
			lines.push(`// ${handler.name} handles ${handler.httpMethod} ${handler.route}`)
		}

		lines.push(`func (s *${serviceName}) ${handler.name}(`)

		// Parameters
		const params = handler.parameters.map((p) => `${p.name} ${p.type}`).join(", ")
		lines.push(`\t${params}) {`)

		// Handler implementation - developer action required
		lines.push(`\t// TODO: Implement ${handler.name} handler with business logic`)
		lines.push(`\t// Route: ${handler.httpMethod} ${handler.route}`)
		lines.push("")

		if (handler.httpMethod === "GET") {
			lines.push(`\t// Example implementation:`)
			lines.push(`\t// result, err := s.service.${handler.name.slice(0, -7)}(ctx)`)
			lines.push(`\t// if err != nil {`)
			lines.push(`\t// \thttp.Error(w, err.Error(), http.StatusInternalServerError)`)
			lines.push(`\t// \treturn`)
			lines.push(`\t// }`)
			lines.push(`\t// w.Header().Set("Content-Type", "application/json")`)
			lines.push(`\t// json.NewEncoder(w).Encode(result)`)
		} else if (handler.httpMethod === "POST") {
			lines.push(`\t// Example implementation:`)
			lines.push(`\t// var input ${handler.returnType}`)
			lines.push(`\t// if err := json.NewDecoder(r.Body).Decode(&input); err != nil {`)
			lines.push(`\t// \thttp.Error(w, "Invalid JSON", http.StatusBadRequest)`)
			lines.push(`\t// \treturn`)
			lines.push(`\t// }`)
			lines.push(`\t// result, err := s.service.Create${handler.returnType}(ctx, input)`)
			lines.push(`\t// if err != nil {`)
			lines.push(`\t// \thttp.Error(w, err.Error(), http.StatusInternalServerError)`)
			lines.push(`\t// \treturn`)
			lines.push(`\t// }`)
			lines.push(`\t// w.Header().Set("Content-Type", "application/json")`)
			lines.push(`\t// w.WriteHeader(http.StatusCreated)`)
			lines.push(`\t// json.NewEncoder(w).Encode(result)`)
		} else {
			lines.push(
				`\t// TODO: Add ${handler.httpMethod} request implementation with body parsing and validation`,
			)
			lines.push(`\tw.WriteHeader(http.StatusNotImplemented)`)
			lines.push(`\tjson.NewEncoder(w).Encode(map[string]string{"message": "Not implemented"})`)
		}

		lines.push("}")
		lines.push("")
	}

	// Route registration helper
	lines.push("// RegisterRoutes registers all handlers with the given router")
	lines.push(`func (s *${serviceName}) RegisterRoutes(mux *http.ServeMux) {`)

	for (const handler of handlers) {
		lines.push(`\tmux.HandleFunc("${handler.route}", s.${handler.name})`)
	}

	lines.push("}")

	return lines.join("\n")
}
