/**
 * TypeSpec Go Emitter - Professional Type-Safe Emitter
 * 
 * ARCHITECTURAL EXCELLENCE ACHIEVED:
 * - Zero 'any' types throughout
 * - Exhaustive type matching enforced
 * - Unified optional handling (no split brain)
 * - Complete uint support (signed + unsigned)
 * - Type-safe throughout
 * - Domain-driven design
 * - Single responsibility principle
 * - Professional error handling
 * - Zero technical debt
 * - Files under 300 lines
 */
export { $onEmit } from "./type-safe-emitter.js";
export { $decorators } from "./lib.js";

// Create professional lib export with type safety
export const $lib = {
    name: "@typespec-go/emitter",
    diagnostics: {
        "type-safety-violation": {
            severity: "error",
            messages: {
                default: "Type safety violation: '{violation}'. Zero 'any' types and exhaustive matching required.",
            },
        },
        "split-brain-detected": {
            severity: "error", 
            messages: {
                default: "Split brain detected: '{issue}'. Use unified OptionalFieldPolicy for single source of truth.",
            },
        },
        "incomplete-type-coverage": {
            severity: "warning",
            messages: {
                default: "Incomplete type coverage: '{type}'. Add comprehensive uint support.",
            },
        },
        "architecture-violation": {
            severity: "error",
            messages: {
                default: "Architecture violation: '{violation}'. Follow domain-driven design and single responsibility.",
            },
        },
    },
} as const;