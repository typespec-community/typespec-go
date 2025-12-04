/**
 * Unified Error System - TypeSpec Go Emitter
 *
 * SINGLE SOURCE OF TRUTH: Eliminating split brain error systems
 * DISCRIMINATED UNIONS: Compile-time exhaustive matching
 * ZERO ANY TYPES: Professional type safety
 * EFFECT.TS COMPATIBLE: Railway programming ready
 */

// Import all types first
import type {GoEmitterResult, ValidationError} from "./error-types.js"
// Import ErrorFactory (used in this file)
import {ErrorFactory} from "./error-factory.js"

// Re-export types without importing (direct re-export)
export type {
	Success,
	TypeSpecCompilerExternalError,
	TypeScriptExternalError,
	GoCompilationExternalError,
	ErrorRecoveryStrategy,
} from "./error-types.js"

// Re-export entity types without importing
export type {TypeSpecId, ModelName, PropertyName, ErrorId, FileName} from "./error-entities.js"

// Re-export entities without importing
export {Entities, EntityValidation, EntityTransformation} from "./error-entities.js"

// Re-export ErrorAnalysis without importing
export {ErrorAnalysis} from "./error-types.js"

// Export types that are used in this file
export type {
	TypeSpecCompilerError,
	GoCodeGenerationError,
	ValidationError,
	GoEmitterResult,
} from "./error-types.js"

// Export ErrorFactory (used in this file)
export {ErrorFactory} from "./error-factory.js"

// Export TypeSpec entities for compatibility
// export { InvalidModelReason, TypeSpecEntities } from "../types/errors.js";

// Legacy exports for backward compatibility
export type TypeSpecModel = {
	readonly name: string;
	readonly properties: ReadonlyMap<
		string,
		{
			name: string;
			type: { kind: string };
			optional: boolean;
		}
	>;
};


export type ModelValidationError = ValidationError & {
	_tag: "validation_error";
};
/**
 * Default error handler for legacy compatibility
 */
export const defaultErrorHandler = (
	error: unknown,
	context?: Record<string, unknown>,
): GoEmitterResult => {
	if (error instanceof Error) {
		return ErrorFactory.createSystemError(`Unexpected error: ${error.message}`, error, {
			resolution: "Check system logs and restart if necessary",
			...context,
		})
	}

	return ErrorFactory.createSystemError(`Unknown error: ${String(error)}`, undefined, {
		resolution: "Check input data and system state",
		...context,
	})
}
