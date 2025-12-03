/**
 * Go Enum Declaration Component
 * Generates Go const blocks from TypeSpec enums using 100% Alloy.js
 * Supports both string and iota patterns with proper Go components
 */

import type { Enum, EnumMember, Program } from "@typespec/compiler";
import { capitalize } from "../../utils/strings.js";
import { getDocumentation } from "../../utils/typespec-utils.js";
import { TypeDeclaration, VariableDeclarationGroup, VariableDeclaration, FunctionDeclaration, FunctionReceiver } from "@alloy-js/go";
import type { ReactNode } from "react";

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
}: GoEnumDeclarationProps): ReactNode {
  const typeName = enumType.name || "UnnamedEnum";
  const members = Array.from(enumType.members?.values() || []);

  // Get documentation from @doc decorator
  const doc = program ? getDocumentation(program, enumType) : undefined;

  // Determine if this is a string enum or numeric enum
  const isStringEnum = members.some((m) => typeof m.value === "string");

  return (
    <>
      {/* Type declaration */}
      {doc && <LineComment>{`${typeName} ${doc}`}</LineComment>}
      <TypeDeclaration name={typeName}>
        {isStringEnum ? "string" : "int"}
      </TypeDeclaration>

      {/* Const block */}
      <VariableDeclarationGroup const>
        {members.map((member, index) => {
          const memberName = `${typeName}${capitalize(member.name)}`;
          
          if (isStringEnum) {
            return (
              <VariableDeclaration
                key={memberName}
                name={memberName}
                type={typeName}
                children={`"${member.value || member.name}"`}
              />
            );
          } else if (useIota && index === 0) {
            return (
              <VariableDeclaration
                key={memberName}
                name={memberName}
                type={typeName}
                children="iota"
              />
            );
          } else if (useIota) {
            return (
              <VariableDeclaration
                key={memberName}
                name={memberName}
              />
            );
          } else {
            return (
              <VariableDeclaration
                key={memberName}
                name={memberName}
                type={typeName}
                children={member.value ?? index}
              />
            );
          }
        })}
      </VariableDeclarationGroup>

      {/* Stringer interface for string enums */}
      {isStringEnum && (
        <FunctionDeclaration 
          name="String" 
          returns="string"
          receiver={<FunctionReceiver name="e" type={typeName} />}
        >
          return string(e)
        </FunctionDeclaration>
      )}

      {/* Validation method */}
      <FunctionDeclaration 
        name="IsValid" 
        returns="bool"
        receiver={<FunctionReceiver name="e" type={typeName} />}
      >
        switch e {"{"}
        {members.map((m) => `${typeName}${capitalize(m.name)}`).join(", ")}:
          return true
        default:
          return false
        {"}"}
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
