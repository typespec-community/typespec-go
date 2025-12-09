/**
 * Go Enum Declaration Component
 * Generates Go const blocks from TypeSpec enums using 100% Alloy.js
 * Supports both string and iota patterns with proper Go components
 */

import type { Enum, Program } from "@typespec/compiler";
import { capitalize } from "../../utils/strings.js";
import { getDocumentation } from "../../utils/typespec-utils.js";
import * as go from "@alloy-js/go";
import { GoSwitch, GoCase, GoDefault, GoReturn, GoStringLiteral } from "./core/index.js";
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
  packageName = "api",
  useIota = false,
  program,
}: GoEnumDeclarationProps) {
  const typeName = enumType.name || "UnnamedEnum";
  const members = Array.from(enumType.members?.values() || []);

  // Get documentation from @doc decorator
  const doc = program ? getDocumentation(program, enumType) : undefined;

  // Determine if this is a string enum or numeric enum
  const isStringEnum = members.some((m) => typeof m.value === "string");

  return (
    <>
      <TypeDeclaration name={typeName}>{isStringEnum ? "string" : "int"}</TypeDeclaration>

      {!useIota && (
        <VariableDeclarationGroup>
          {members.map((member) => (
            <VariableDeclaration name={typeName + capitalize(member.name)} type={typeName}>
              {isStringEnum ? (
                <GoStringLiteral value={String(member.value)} />
              ) : (
                String(member.value)
              )}
            </VariableDeclaration>
          ))}
        </VariableDeclarationGroup>
      )}

      {useIota && (
        <VariableDeclarationGroup>
          {members.map((member, index) => (
            <VariableDeclaration name={typeName + capitalize(member.name)} type={typeName}>
              {index === 0 ? "iota" : null}
            </VariableDeclaration>
          ))}
        </VariableDeclarationGroup>
      )}

      {isStringEnum && (
        <FunctionDeclaration
          name="String"
          returns="string"
          receiver={<FunctionReceiver name="e" type={typeName} />}
        >
          {"\n  return string(e)"}
        </FunctionDeclaration>
      )}

      <FunctionDeclaration
        name="IsValid"
        returns="bool"
        receiver={<FunctionReceiver name="e" type={typeName} />}
      >
        {"\n  switch e {"}
        {members.map((member) => (
          <>
            {"\n    case " + typeName + capitalize(member.name) + ":"}
            {"\n      return true"}
          </>
        ))}
        {"\n    default:"}
        {"\n      return false"}
        {"\n  }"}
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
