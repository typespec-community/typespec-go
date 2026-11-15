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

  // Get documentation from @doc decorator
  const doc = program ? getDocumentation(program, enumType) : undefined;

  // Determine if this is a string enum or numeric enum
  const isStringEnum = members.some((m) => typeof m.value === "string");
  const constName = (member: { name: string }): string => typeName + capitalize(member.name);
  const nameWidth = Math.max(0, ...members.map((m) => constName(m).length));

  return (
    <>
      <TypeDeclaration name={typeName} refkey={refkey(enumType)} doc={doc}>
        {isStringEnum ? "string" : "int"}
      </TypeDeclaration>
      {"\n\n"}
      <VariableDeclarationGroup>
        {members.map((member) => (
          <VariableDeclaration
            name={useIota ? constName(member) : constName(member).padEnd(nameWidth)}
            type={typeName}
          >
            {useIota ? (
              members.indexOf(member) === 0 ? (
                "iota"
              ) : null
            ) : isStringEnum ? (
              <GoStringLiteral value={String(member.value)} />
            ) : (
              String(member.value)
            )}
          </VariableDeclaration>
        ))}
      </VariableDeclarationGroup>
      {"\n\n"}
      {isStringEnum && (
        <FunctionDeclaration
          name="String"
          returns="string"
          receiver={<FunctionReceiver name="e" type={typeName} />}
        >
          <GoReturn value="string(e)" />
        </FunctionDeclaration>
      )}
      {"\n\n"}
      <FunctionDeclaration
        name="IsValid"
        returns="bool"
        receiver={<FunctionReceiver name="e" type={typeName} />}
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
