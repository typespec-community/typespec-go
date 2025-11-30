/**
 * Go Enum Declaration Component
 * Generates Go const blocks from TypeSpec enums
 * Supports both string and iota patterns
 */

import type { Enum, EnumMember } from "@typespec/compiler";
import { refkey, For } from "@alloy-js/core";

interface GoEnumDeclarationProps {
  /** TypeSpec enum to convert to Go constants */
  enum: Enum;
  /** Package name for documentation */
  packageName?: string;
  /** Whether to use iota for integer enums */
  useIota?: boolean;
}

/**
 * Go Enum Declaration Component
 * Generates proper Go const blocks with type safety
 */
export function GoEnumDeclaration({ 
  enum: enumType, 
  packageName = "api",
  useIota = false
}: GoEnumDeclarationProps) {
  const typeName = enumType.name || "UnnamedEnum";
  const members = Array.from(enumType.members?.values() || []);
  
  // Determine if this is a string enum or numeric enum
  const isStringEnum = members.some(m => typeof m.value === "string");
  
  return generateEnumCode(typeName, members, isStringEnum, useIota);
}

/**
 * Generate Go enum code as string (for use with Alloy-JS)
 */
function generateEnumCode(
  typeName: string,
  members: EnumMember[],
  isStringEnum: boolean,
  useIota: boolean
): string {
  const lines: string[] = [];
  
  // Type declaration
  if (isStringEnum) {
    lines.push(`type ${typeName} string`);
  } else {
    lines.push(`type ${typeName} int`);
  }
  lines.push("");
  
  // Const block
  lines.push(`const (`);
  
  members.forEach((member, index) => {
    const memberName = `${typeName}${capitalize(member.name)}`;
    
    if (isStringEnum) {
      lines.push(`\t${memberName} ${typeName} = "${member.value || member.name}"`);
    } else if (useIota && index === 0) {
      lines.push(`\t${memberName} ${typeName} = iota`);
    } else if (useIota) {
      lines.push(`\t${memberName}`);
    } else {
      lines.push(`\t${memberName} ${typeName} = ${member.value ?? index}`);
    }
  });
  
  lines.push(`)`);
  lines.push("");
  
  // Add Stringer interface for string enums
  if (isStringEnum) {
    lines.push(`func (e ${typeName}) String() string {`);
    lines.push(`\treturn string(e)`);
    lines.push(`}`);
    lines.push("");
  }
  
  // Add validation method
  lines.push(`func (e ${typeName}) IsValid() bool {`);
  lines.push(`\tswitch e {`);
  lines.push(`\tcase ${members.map(m => `${typeName}${capitalize(m.name)}`).join(", ")}:`);
  lines.push(`\t\treturn true`);
  lines.push(`\tdefault:`);
  lines.push(`\t\treturn false`);
  lines.push(`\t}`);
  lines.push(`}`);
  
  return lines.join("\n");
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Parse all enum values from TypeSpec enum for export
 */
export function getEnumValues(enumType: Enum): Array<{ name: string; value: string | number }> {
  const members = Array.from(enumType.members?.values() || []);
  return members.map((member, index) => ({
    name: member.name,
    value: member.value ?? (typeof members[0]?.value === "string" ? member.name : index)
  }));
}
