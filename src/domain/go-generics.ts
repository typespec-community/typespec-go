/**
 * Go generics domain logic
 * Maps TypeSpec template declarations to Go type parameters ([T any]).
 * Constraint translation is deliberately out of scope: TypeSpec template
 * constraints are documented as untranslated in MAPPING-GUIDE (declare-only).
 */

import type { Model, Type } from "@typespec/compiler";

/** A Go type parameter derived from a TypeSpec template parameter. */
export interface GoTypeParameter {
  /** Parameter identifier as written in the template list (e.g. "T"). */
  name: string;
  /** Go constraint; always "any" until constraint translation is designed. */
  constraint: string;
}

/**
 * Type parameters declared on the model's template list, e.g. `Box<T>` →
 * [{ name: "T", constraint: "any" }]. Empty for non-generic models.
 */
export function getTemplateParameters(model: Model): GoTypeParameter[] {
  const node = model.node as { templateParameters?: Array<{ id?: { sv?: string } }> } | undefined;
  const params = node?.templateParameters ?? [];
  const names: GoTypeParameter[] = [];
  for (const param of params) {
    const name = param.id?.sv;
    if (name) {
      names.push({ name, constraint: "any" });
    }
  }
  return names;
}

/**
 * True when the model is a template declaration that should be emitted
 * as a Go generic type.
 */
export function isGenericModel(model: Model): boolean {
  return getTemplateParameters(model).length > 0;
}

/**
 * Render a TemplateParameter type reference as its declared name (T), so
 * `content: T` inside `Box<T>` emits `Content T`. Falls back to
 * interface{} when the parameter name cannot be resolved.
 */
export function templateParameterGoName(type: Type): string {
  if (type.kind !== "TemplateParameter") {
    return "interface{}";
  }
  const node = type.node as { id?: { sv?: string } } | undefined;
  return node?.id?.sv ?? "interface{}";
}

/** Type kinds that can legally appear as a template argument in emitted positions. */
const TEMPLATE_ARG_TYPE_KINDS: readonly string[] = [
  "TemplateParameter",
  "Model",
  "Scalar",
  "Enum",
  "Union",
  "String",
  "Number",
  "Boolean",
];

/**
 * Detect `T[]` sugar, which the compiler instantiates as a Model named
 * "Array" carrying a single template argument (the indexer lives on the
 * Array declaration, not on the instance).
 */
export function isArrayInstantiation(type: Type): type is Model & { templateMapper: unknown } {
  return type.kind === "Model" && type.name === "Array" && type.templateMapper !== undefined;
}

/**
 * The element type of an Array instantiation (T[]), or undefined when the
 * instantiation shape is not recognized.
 */
export function getArrayElementType(type: Type): Type | undefined {
  if (!isArrayInstantiation(type)) {
    return undefined;
  }
  const args = (type.templateMapper as { args?: readonly unknown[] }).args ?? [];
  const arg = args[0];
  if (!arg || typeof arg !== "object" || !("kind" in arg)) {
    return undefined;
  }
  if (!TEMPLATE_ARG_TYPE_KINDS.includes(String((arg as { kind: unknown }).kind))) {
    return undefined;
  }
  return arg as Type;
}
