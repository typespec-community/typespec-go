/**
 * Property visibility domain logic
 * Evaluates TypeSpec @visibility decorators with the compiler's official
 * visibility APIs and feeds the read-shaped emission model.
 */

import type { Model, ModelProperty, Program } from "@typespec/compiler";
import { getLifecycleVisibilityEnum, isVisible } from "@typespec/compiler";

/**
 * Which lifecycle context the emitter evaluates @visibility against.
 *
 * - "all": every property is emitted (default; @visibility is ignored).
 * - "read": only properties visible in the Lifecycle.Read context are
 *   emitted, so create-only fields (e.g. passwords) disappear from the
 *   generated structs.
 */
export type VisibilityMode = "all" | "read";

/** Modes accepted by the `visibility-mode` emitter option. */
export const VISIBILITY_MODES: readonly VisibilityMode[] = ["all", "read"];

/** Narrow an untyped emitter-option value to a VisibilityMode. */
export function isVisibilityMode(value: unknown): value is VisibilityMode {
  return typeof value === "string" && (VISIBILITY_MODES as readonly string[]).includes(value);
}

/**
 * Properties of `model` that should be emitted under `mode`.
 *
 * "read" evaluation uses the compiler's isVisible API against the
 * Lifecycle visibility class. Properties without @visibility default to
 * visible in every lifecycle, so decoration is the only way a property
 * disappears. An unresolvable Read member (never expected for a real
 * program) falls back to emitting everything rather than guessing.
 */
export function filterVisibleProperties(
  program: Program,
  model: Model,
  mode: VisibilityMode,
): ModelProperty[] {
  const properties = Array.from(model.properties?.values() ?? []);
  if (mode === "all") {
    return properties;
  }
  const readMember = getLifecycleVisibilityEnum(program).members.get("Read");
  if (readMember === undefined) {
    return properties;
  }
  return properties.filter((property) =>
    isVisible(program, property, { any: new Set([readMember]) }),
  );
}
