/**
 * Go Enum Declaration Component
 * Generates Go const blocks from TypeSpec enums using 100% Alloy.js
 * Supports both string and iota patterns with proper Go components
 */

import type {Enum} from "@typespec/compiler"
import {capitalize} from "../../utils/strings.js"
import {getDocumentation} from "../../utils/typespec-utils.js"
import {
	FunctionDeclaration,
	FunctionReceiver,
	TypeDeclaration,
	VariableDeclaration,
	VariableDeclarationGroup,
} from "@alloy-js/go"
import {GoEnumDeclarationProps} from "./GoEnumDeclarationProps"


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
	const typeName = enumType.name || "UnnamedEnum"
	const members = Array.from(enumType.members?.values() || [])

	// Get documentation from @doc decorator
	const doc = program ? getDocumentation(program, enumType) : undefined

	// Determine if this is a string enum or numeric enum
	const isStringEnum = members.some((m) => typeof m.value === "string")

	return (
		<>
			<TypeDeclaration name={typeName}>
				{isStringEnum ? "string" : "int"}
			</TypeDeclaration>

			{!useIota && (
				<VariableDeclarationGroup>
					{members.map((member) => (
						<VariableDeclaration
							name={`${typeName}${capitalize(member.name)}`}
							type={typeName}
							value={isStringEnum ? `"${member.value}"` : member.value}
						/>
					))}
				</VariableDeclarationGroup>
			)}

			{useIota && (
				<>
					{members.map((member, index) => (
						<VariableDeclaration
							name={`${typeName}${capitalize(member.name)}`}
							type={typeName}
							value={index === 0 ? "iota" : undefined}
						/>
					))}
				</>
			)}

			{isStringEnum && (
				<FunctionDeclaration name={`${typeName}String`}>
					<FunctionReceiver receiver={`e ${typeName}`}/>
					string
				</FunctionDeclaration>
			)}

			<FunctionDeclaration name={`${typeName}IsValid`}>
				<FunctionReceiver receiver={`e ${typeName}`}/>
				bool
			</FunctionDeclaration>
		</>
	)
}

/**
 * Parse all enum values from TypeSpec enum for export
 */
export function getEnumValues(enumType: Enum): Array<{ name: string; value: string | number }> {
	const members = Array.from(enumType.members?.values() || [])
	return members.map((member, index) => ({
		name: member.name,
		value: member.value ?? (typeof members[0]?.value === "string" ? member.name : index),
	}))
}