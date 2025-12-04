/**
 * Go Handler Stub Component
 * Generates HTTP handler functions from TypeSpec operations using Alloy-JS Go components
 * Replaces string-based generation with component-based architecture
 */

import type {ModelProperty, Operation, Program, Type} from "@typespec/compiler"
import {For, refkey, StatementList, Switch, Match} from "@alloy-js/core"
import {FunctionDeclaration, ImportStatements, Reference} from "@alloy-js/go"
import {capitalize} from "../../utils/strings.js"
import {getDocumentation} from "../../utils/typespec-utils.js"
import {extractHttpMetadata, HttpOperationMetadata, HttpParameter} from "../../utils/typespec-http-utils.js"

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
	parameters: HttpParameter[];
	/** Return type */
	returnType: string | JSX.Element;
	/** Documentation comment */
	doc?: string;
	/** TypeSpec operation for refkey tracking */
	operation?: Operation;
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
	// Convert operations to handlers, filtering out those without HTTP metadata
	const handlers = operations
		.map((op) => operationToHandler(op, program))
		.filter((handler): handler is GoHandlerMethod => handler !== null)
	
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
 * Convert TypeSpec Operation to Go HTTP handler using TypeSpec HTTP decorators
 */
function operationToHandler(operation: Operation, program?: Program): GoHandlerMethod | null {
	if (!program) {
		return null
	}

	// Extract HTTP metadata from TypeSpec decorators
	const httpMetadata = extractHttpMetadata(operation, program)
	if (!httpMetadata) {
		return null
	}

	const operationName = operation.name
	const handlerName = `${capitalize(operationName)}Handler`
	const returnType = mapHandlerReturnType(operation)
	const doc = getDocumentation(program, operation)

	return {
		name: handlerName,
		httpMethod: httpMetadata.method,
		route: httpMetadata.fullRoute,
		parameters: httpMetadata.parameters,
		returnType,
		doc,
		operation: operation,
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
 * Map handler return type using Alloy-JS components
 */
function mapHandlerReturnType(operation: Operation): string | JSX.Element {
	if (operation.returnType) {
		const goType = mapTypeToGo(operation.returnType)
		return goType !== "" ? goType : "void"
	}
	return "void"
}

/**
 * Map TypeSpec type to Go type using Alloy-JS refkey system
 */
function mapTypeToGo(type: Type): string | JSX.Element {
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
	serviceRef: ReturnType<typeof refkey>;
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
			<ImportStatements records={[
				"context",
				"encoding/json",
				"net/http",
				"time"
			]}/>

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
	serviceRef: ReturnType<typeof refkey>;
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
					type: p.goType,
				}))}
				returnType=""
			>
				{/* Handler implementation placeholder */}
				{`\t// TODO: Implement ${handler.name} handler with business logic
\t// Route: ${handler.httpMethod} ${handler.route}

`}

				{`// Handler implementation:`}
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
				{`// End Switch replacement`}
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


