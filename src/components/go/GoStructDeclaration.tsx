/**
 * Go Struct Declaration Component
 * Professional Go struct generation with Alloy-JS Go components
 * Following Alloy-JS patterns with zero string-based logic
 */

import type { Model, ModelProperty, Program, Type, Union } from "@typespec/compiler";
import type { JSX } from "@alloy-js/core/jsx-runtime";
import {
  FunctionDeclaration,
  FunctionReceiver,
  Reference,
  StructDeclaration,
  StructMember,
  TypeDeclaration,
} from "@alloy-js/go";
import { For, refkey } from "@alloy-js/core";
import { capitalize } from "../../utils/strings.js";
import { lookupGoScalarPrimitive } from "../../domain/go-primitive-types.js";
import {
  getGoName,
  getGoNullableMode,
  getGoStructTag,
  getGoType,
} from "../../emitter/go-decorators.js";
import { getDocumentation } from "../../utils/typespec-utils.js";

interface GoStructDeclarationProps {
  /** TypeSpec model to convert to Go struct */
  model: Model;
  /** Optional struct documentation (overrides @doc) */
  documentation?: string;
  /** Package name for struct */
  packageName?: string;
  /** Use pointers for optional model/struct fields (default: true) */
  usePointersForOptional?: boolean;
  /** TypeSpec program for accessing @doc decorators */
  program?: Program;
}

/**
 * Go Struct Declaration Component
 * Generates complete Go struct with proper field declarations
 * Uses only Alloy-JS Go components, no string generation
 */
export function GoStructDeclaration({
  model,
  documentation,
  packageName: _packageName = "api",
  usePointersForOptional = true,
  program,
}: GoStructDeclarationProps) {
  // Get documentation from @doc decorator if program is provided
  const modelDoc =
    documentation ||
    (program ? getDocumentation(program, model) : undefined) ||
    "Generated from TypeSpec model " + model.name;

  // @error models get an Error() string method when they carry a string
  // `message` property (the Go error convention).
  const isErrorModel = (model.decorators ?? []).some(
    (d) => d.decorator?.name?.replace(/^\$/, "") === "error",
  );
  const messageProp = Array.from(model.properties?.values() ?? []).find(
    (p) => p.name.toLowerCase() === "message",
  );
  const modelRef = refkey(model);

  // @go.name overrides the generated Go type name
  const goModelName = (program ? getGoName(program, model) : undefined) ?? model.name;

  const properties = Array.from(model.properties?.values() || []);

  // gofmt-style column alignment: pad name and type columns to the widest
  // member so emitted structs are natively gofmt-clean.
  interface MemberLayout {
    prop: ModelProperty;
    fieldName: string;
    displayType: string;
    finalType: string | JSX.Element;
    tag: string | Record<string, string>;
  }
  const members: MemberLayout[] = properties.map((prop: ModelProperty) => {
    const typeRef = refkey(prop.type);

    // @go.name overrides the generated Go field name
    const fieldName = (program ? getGoName(program, prop) : undefined) ?? capitalize(prop.name);

    // @go.type overrides the generated Go type entirely
    const goTypeOverride = program ? getGoType(program, prop) : undefined;

    // @go.nullable overrides the optionality shape (pointer vs zero value vs
    // struct value); defaults keep the historical nested-model-pointer rule
    const nullableMode = program ? getGoNullableMode(program, prop) : undefined;
    const nullableModeName =
      nullableMode?.kind === "EnumMember" ? String(nullableMode.name) : undefined;

    let shouldUsePointer: boolean;
    if (nullableModeName === "pointer") {
      shouldUsePointer = prop.optional === true;
    } else if (nullableModeName === "zeroValue") {
      shouldUsePointer = false;
    } else if (nullableModeName === "struct") {
      shouldUsePointer = prop.optional === true && !isNestedModelType(prop.type);
    } else {
      shouldUsePointer =
        prop.optional === true && usePointersForOptional && isNestedModelType(prop.type);
    }
    const pointerPrefix = shouldUsePointer ? "*" : "";

    let baseType: string | JSX.Element;
    let displayType: string;
    if (goTypeOverride) {
      baseType = goTypeOverride;
      displayType = goTypeOverride;
    } else if (prop.type.kind === "Model" || prop.type.kind === "Enum") {
      // Referenced declarations resolve to their symbol name
      baseType = <Reference refkey={typeRef} />;
      displayType = prop.type.name;
    } else {
      const mapped = mapTypeSpecToGoType(prop.type);
      baseType = mapped;
      if (typeof mapped === "string") {
        displayType = mapped;
      } else if (prop.type.kind === "Union") {
        displayType = prop.type.name || "";
      } else {
        displayType = "";
      }
    }

    const finalType: string | JSX.Element = shouldUsePointer ? (
      typeof baseType === "string" ? (
        pointerPrefix + baseType
      ) : (
        <>
          {pointerPrefix}
          {baseType}
        </>
      )
    ) : (
      baseType
    );

    // @go.structTag overrides the default JSON tag with a raw tag string
    const customTag = program ? getGoStructTag(program, prop) : undefined;
    const jsonTagValue = prop.optional ? prop.name + ",omitempty" : prop.name;
    const tag = customTag ?? { json: jsonTagValue };

    return { prop, fieldName, displayType, finalType, tag };
  });
  const nameWidth = Math.max(0, ...members.map((m) => m.fieldName.length));
  const typeWidth = Math.max(0, ...members.map((m) => m.displayType.length));

  // Generate struct fields using Alloy-JS components with <For> iteration
  return (
    <>
      <TypeDeclaration name={goModelName} refkey={modelRef} doc={modelDoc}>
        <StructDeclaration>
          <For each={members}>
            {(member: MemberLayout) => (
              <StructMember
                name={member.fieldName.padEnd(nameWidth)}
                type={
                  <>
                    {member.finalType}
                    {" ".repeat(Math.max(0, typeWidth - member.displayType.length))}
                  </>
                }
                tag={member.tag}
              />
            )}
          </For>
        </StructDeclaration>
      </TypeDeclaration>
      {isErrorModel && messageProp ? (
        <>
          {"\n\n"}
          <FunctionDeclaration
            name="Error"
            returns="string"
            doc={`Error implements the error interface for ${model.name}.`}
            receiver={<FunctionReceiver name="e" type={<Reference refkey={modelRef} />} />}
          >
            {`return e.${capitalize(messageProp.name)}`}
          </FunctionDeclaration>
        </>
      ) : undefined}
    </>
  );
}

/**
 * Check if type is a nested model that should use pointer for optional fields
 * Returns true for Model types (excluding Array and Record)
 */
function isNestedModelType(type: Type): boolean {
  if (type.kind !== "Model") return false;
  // Don't use pointer for built-in collection types
  if (type.name === "Array" || type.name === "Record") return false;
  return true;
}

/**
 * Helper to safely get Type from template argument
 * Template args can be Type | Value | IndeterminateEntity
 */
function getTypeFromTemplateArg(arg: unknown): Type | undefined {
  if (arg && typeof arg === "object" && "kind" in arg) {
    const argObj = arg as { kind: string };
    // Check if it's a valid Type kind
    if (
      ["Model", "Scalar", "Enum", "Union", "String", "Boolean", "Number", "Tuple"].includes(
        argObj.kind,
      )
    ) {
      return arg as Type;
    }
  }
  return undefined;
}

/**
 * TypeSpec to Alloy.js Go type mapping with proper refkey support
 * Uses Alloy.js Reference system for automatic import management
 * Maps TypeSpec scalar types to native Go types
 */
function mapTypeSpecToGoType(type: Type): string | JSX.Element {
  switch (type.kind) {
    case "String":
      return "string";
    case "Boolean":
      return "bool";
    case "Number":
      return "float64"; // Default number type in Go

    case "Scalar": {
      const mapped = lookupGoScalarPrimitive(type.name ?? "");
      if (mapped) {
        return mapped;
      }
      return type.name || "interface{}";
    }

    case "Model":
      // Handle TypeSpec's built-in Array model with Alloy.js
      if (type.name === "Array" && type.templateMapper) {
        const elementType = getTypeFromTemplateArg(type.templateMapper.args?.[0]);
        if (elementType) {
          const elementTypeRef = mapTypeSpecToGoType(elementType);
          return `[]${elementTypeRef}`; // Template literal for slice types
        }
        return "[]interface{}";
      }

      // Handle TypeSpec's built-in Record model with Alloy.js
      if (type.name === "Record" && type.templateMapper) {
        const keyType = getTypeFromTemplateArg(type.templateMapper.args?.[0]);
        const valueType = getTypeFromTemplateArg(type.templateMapper.args?.[1]);
        const goKey = keyType ? mapTypeSpecToGoType(keyType) : "string";
        const goValue = valueType ? mapTypeSpecToGoType(valueType) : "interface{}";
        return `map[${goKey}]${goValue}`; // Template literal for map types
      }

      // Reference to other model - Alloy.js handles import
      const modelRef = refkey(type);
      return <Reference refkey={modelRef} />;

    case "Enum":
      // Reference to enum - Alloy.js handles import
      const enumRef = refkey(type);
      return <Reference refkey={enumRef} />;

    case "Union": {
      // Inline literal unions (e.g. "red" | "blue") have no generated Go type
      // of their own; map them to the closest primitive instead of emitting an
      // unresolved reference to a type that is never generated.
      const union = type;
      if (union.expression || union.variants.size === 0) {
        return primitiveForLiteralUnion(union);
      }
      // Named union - reference the generated union interface
      const unionRef = refkey(union);
      return <Reference refkey={unionRef} />;
    }

    case "Tuple":
      // TODO: Implement proper Go tuple type mapping with specific slice types
      // Go doesn't have tuples, use slice
      return "[]interface{}";

    default:
      return "interface{}";
  }
}

/**
 * Maps an inline (anonymous) union to the closest Go primitive based on its
 * variant kinds. Homogeneous string/number/boolean unions map to that
 * primitive; anything else falls back to interface{}.
 */
function primitiveForLiteralUnion(union: Union): string {
  const variantKinds = new Set([...union.variants.values()].map((variant) => variant.type.kind));
  if (variantKinds.size === 1) {
    switch (variantKinds.values().next().value) {
      case "String":
        return "string";
      case "Number":
        return "float64";
      case "Boolean":
        return "bool";
    }
  }
  return "interface{}";
}
