/**
 * Go Enum Declaration Component
 * Generates Go const blocks from TypeSpec enums using 100% Alloy.js
 * Supports both string and iota patterns with proper Go components
 */

import { refkey } from "@alloy-js/core";
import type { Enum, Program } from "@typespec/compiler";
import { capitalize } from "../../utils/strings.js";
import { getDocumentation } from "../../utils/typespec-utils.js";
import * as go from "@alloy-js/go";
import { getGoEnumMode, getGoName } from "../../emitter/go-decorators.js";
import { GoReturn, GoStringLiteral, GoSwitch, GoCase, GoDefault } from "./core/index.js";
const {
  FunctionDeclaration,
  FunctionReceiver,
  TypeDeclaration,
  VariableDeclaration,
  VariableDeclarationGroup,
} = go;

interface GoEnumDeclarationProps {
  /** TypeSpec enum to convert to Go constants */
  enum: Enum;
  /** Package name for documentation */
  packageName?: string;
  /** Whether to use iota for integer enums */
  useIota?: boolean;
  /** TypeSpec program for accessing @doc decorators */
  program?: Program;
}

/**
 * Go Enum Declaration Component
 * Generates proper Go const blocks with type safety using Alloy.js components
 */
export function GoEnumDeclaration({
  enum: enumType,
  packageName: _packageName = "api",
  useIota = false,
  program,
}: GoEnumDeclarationProps) {
  const typeName = enumType.name || "UnnamedEnum";
  const members = Array.from(enumType.members?.values() || []);

  // @go.name overrides the generated Go type name
  const goEnumName = (program ? getGoName(program, enumType) : undefined) ?? typeName;

  // Get documentation from @doc decorator
  const doc = program ? getDocumentation(program, enumType) : undefined;

  // @go.enumMode forces the constant shape (iota | string | name); without
  // it, string-valued enums render string constants, others use iota.
  // `valueof EnumMode` arrives as a plain string, not an EnumMember type.
  const enumMode = program ? getGoEnumMode(program, enumType) : undefined;
  const enumModeName =
    typeof enumMode === "string"
      ? enumMode
      : enumMode?.kind === "EnumMember"
        ? String(enumMode.name)
        : undefined;
  const forceIota = enumModeName === "iota";
  const nameOnly = enumModeName === "name";
  const isStringEnum = forceIota
    ? false
    : enumModeName === "string" || enumModeName === "name"
      ? true
      : members.some((m) => typeof m.value === "string");
  const effectiveIota = useIota || forceIota;
  const constName = (member: { name: string }): string => goEnumName + capitalize(member.name);
  const nameWidth = Math.max(0, ...members.map((m) => constName(m).length));

  return (
    <>
      <TypeDeclaration name={goEnumName} refkey={refkey(enumType)} doc={doc}>
        {isStringEnum ? "string" : "int"}
      </TypeDeclaration>
      {"\n\n"}
      <VariableDeclarationGroup const={effectiveIota}>
        {members.map((member, memberIndex) => (
          <VariableDeclaration
            name={effectiveIota ? constName(member) : constName(member).padEnd(nameWidth)}
            type={effectiveIota ? (memberIndex === 0 ? goEnumName : undefined) : goEnumName}
          >
            {effectiveIota ? (
              memberIndex === 0 ? (
                "iota"
              ) : null
            ) : nameOnly || (isStringEnum && typeof member.value !== "string") ? (
              <GoStringLiteral value={member.name} />
            ) : isStringEnum ? (
              <GoStringLiteral value={String(member.value)} />
            ) : (
              String(member.value)
            )}
          </VariableDeclaration>
        ))}
      </VariableDeclarationGroup>
      {effectiveIota ? "" : "\n\n"}
      {isStringEnum && (
        <FunctionDeclaration
          name="String"
          returns="string"
          receiver={<FunctionReceiver name="e" type={goEnumName} />}
        >
          <GoReturn value="string(e)" />
        </FunctionDeclaration>
      )}
      {"\n\n"}
      <FunctionDeclaration
        name="IsValid"
        returns="bool"
        receiver={<FunctionReceiver name="e" type={goEnumName} />}
      >
        <GoSwitch value="e">
          {members.map((member) => (
            <>
              <GoCase value={constName(member)}>
                <GoReturn value="true" />
              </GoCase>
              {"\n"}
            </>
          ))}
          <GoDefault>
            <GoReturn value="false" />
          </GoDefault>
        </GoSwitch>
      </FunctionDeclaration>
    </>
  );
}

/**
 * Parse all enum values from TypeSpec enum for export
 */
export function getEnumValues(enumType: Enum): Array<{ name: string; value: string | number }> {
  const members = Array.from(enumType.members?.values() || []);
  return members.map((member, index) => ({
    name: member.name,
    value: member.value ?? (typeof members[0]?.value === "string" ? member.name : index),
  }));
}
