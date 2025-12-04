/**
 * Go Handler Stub Component
 * Generates HTTP handler functions from TypeSpec operations using Alloy-JS Go components
 * Replaces string-based generation with component-based architecture
 */

import type {Operation, Program, Type} from "@typespec/compiler"
// Temporarily disable all JSX-related imports
// import {For, refkey, Reference} from "@alloy-js/core"
// import * as go from "@alloy-js/go"
// const { ImportStatements } = go
import {capitalize} from "../../utils/strings.js"
import {getDocumentation} from "../../utils/typespec-utils.js"
import {extractHttpMetadata} from "../../utils/typespec-http-utils.js"
import type {JSX} from "@alloy-js/core/jsx-runtime"
import type {GoHandlerMethod} from "./GoHandlerMethod"
import {GoHandlerMethodComponent} from "./GoHandlerMethodComponent"
import {GoRouteRegistrationComponent} from "./GoRouteRegistrationComponent"
import {For, refkey} from "@alloy-js/core"
import {ImportStatements} from "@alloy-js/go"

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
	// Convert operations to handlers, filtering out those without HTTP metadata
	const handlers = operations
		.map((op) => operationToHandler(op, program))
		.filter((handler): handler is GoHandlerMethod => handler !== null && handler !== undefined)

	// Ensure no null/undefined handlers for JSX compatibility
	const validHandlers = handlers.filter(Boolean)

	const serviceRef = refkey(serviceName)

	return (
		<GoHandlerContent
			handlers={validHandlers}
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
 * Map handler return type using Alloy-JS components
 */
function mapHandlerReturnType(operation: Operation): string {
	if (operation.returnType) {
		const goType = mapTypeToGo(operation.returnType)
		return goType !== "" ? goType : "void"
	}
	return "void"
}

/**
 * Map TypeSpec type to Go type using Alloy-JS refkey system
 */
function mapTypeToGo(type: Type): string {
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
			return type.name || "interface{}"
		case "Enum":
			return type.name || "interface{}"
		case "Union":
			return type.name || "interface{}"
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
			<ImportStatements
				records={new Map([
					{package: "context", wildcard: false},
					{package: "encoding/json", wildcard: false},
					{package: "net/http", wildcard: false},
					{package: "time", wildcard: false},
				])}
			/>

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
			<GoRouteRegistrationComponent handlers={handlers} serviceName={serviceName}/>
		</>
	)
}
