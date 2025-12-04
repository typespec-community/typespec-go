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
import {ErrorFactory} from "./error-factory.js"

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
