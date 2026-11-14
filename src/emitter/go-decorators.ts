/**
 * TypeSpec.Go namespace decorator implementations.
 *
 * JS bindings for the extern decorators declared in `lib/main.tsp`.
 * Decorator state is stored on the program and consumed by emitter
 * components during generation.
 */

import type {
  DecoratorContext,
  Enum,
  ModelProperty,
  Namespace,
  Program,
  Type,
} from "@typespec/compiler";

const stateKeys = {
  packageName: Symbol("go.packageName"),
  goName: Symbol("go.goName"),
  goType: Symbol("go.goType"),
  structTag: Symbol("go.structTag"),
  nullableMode: Symbol("go.nullableMode"),
  enumMode: Symbol("go.enumMode"),
} as const;

export function $pkg(context: DecoratorContext, target: Namespace, path: string): void {
  context.program.stateMap(stateKeys.packageName).set(target, path);
}

export function $name(
  context: DecoratorContext,
  target: Type,
  name: string,
): void {
  context.program.stateMap(stateKeys.goName).set(target, name);
}

export function $type(
  context: DecoratorContext,
  target: Type,
  type: string,
): void {
  context.program.stateMap(stateKeys.goType).set(target, type);
}

export function $structTag(
  context: DecoratorContext,
  target: ModelProperty,
  tag: string | Record<string, string>,
): void {
  context.program.stateMap(stateKeys.structTag).set(target, tag);
}

export function $nullable(
  context: DecoratorContext,
  target: ModelProperty,
  mode: Type,
): void {
  context.program.stateMap(stateKeys.nullableMode).set(target, mode);
}

export function $enumMode(
  context: DecoratorContext,
  target: Enum,
  mode: Type,
): void {
  context.program.stateMap(stateKeys.enumMode).set(target, mode);
}

export function getGoPackageName(program: Program, namespace: Namespace): string | undefined {
  return program.stateMap(stateKeys.packageName).get(namespace) as string | undefined;
}

export function getGoName(program: Program, target: Type): string | undefined {
  return program.stateMap(stateKeys.goName).get(target) as string | undefined;
}

export function getGoType(program: Program, target: Type): string | undefined {
  return program.stateMap(stateKeys.goType).get(target) as string | undefined;
}

export function getGoStructTag(program: Program, target: ModelProperty): string | undefined {
  return program.stateMap(stateKeys.structTag).get(target) as string | undefined;
}

export function getGoNullableMode(program: Program, target: ModelProperty): Type | undefined {
  return program.stateMap(stateKeys.nullableMode).get(target) as Type | undefined;
}

export function getGoEnumMode(program: Program, target: Enum): Type | undefined {
  return program.stateMap(stateKeys.enumMode).get(target) as Type | undefined;
}

export const $decorators = {
  "TypeSpec.Go": {
    pkg: $pkg,
    name: $name,
    type: $type,
    structTag: $structTag,
    nullable: $nullable,
    enumMode: $enumMode,
  },
} as const;
