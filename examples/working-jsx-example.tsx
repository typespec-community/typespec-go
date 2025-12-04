#!/usr/bin/env bun

/**
 * REAL ALLOY.JS JSX → GO CODE GENERATION EXAMPLE
 * This is a working example, not fake TypeScript interfaces
 */

import {Output, render} from "@alloy-js/core"
import {SourceFile, StructMember, StructTypeDeclaration} from "@alloy-js/go"

// Real JSX component that generates actual Go code
function generateUserStruct() {
	const goOutput = render(
		<Output>
			<SourceFile path="models/user.go">
				<StructTypeDeclaration name="User">
					<StructMember name="ID" type="string" tag={{json: "id"}}/>
					<StructMember name="Name" type="string" tag={{json: "name"}}/>
					<StructMember name="Email" type="string" tag={{json: "email"}}/>
					<StructMember name="Age" type="int" tag={{json: "age,omitempty"}}/>
					<StructMember name="Active" type="bool" tag={{json: "active"}}/>
					<StructMember name="Profile" type="*Profile" tag={{json: "profile,omitempty"}}/>
				</StructTypeDeclaration>

				<StructTypeDeclaration name="Profile">
					<StructMember name="Bio" type="string" tag={{json: "bio"}}/>
					<StructMember name="Avatar" type="string" tag={{json: "avatar,omitempty"}}/>
				</StructTypeDeclaration>
			</SourceFile>
		</Output>,
	)

	return goOutput
}

// Execute JSX generation
console.log("=== REAL JSX → Go Code Generation ===")
const result = generateUserStruct()
console.log(result)
console.log("=== Generation Complete ===")

export {generateUserStruct}
