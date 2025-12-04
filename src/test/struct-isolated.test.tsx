/**
 * Test GoStructDeclaration in isolation
 */

import {expect, test} from "vitest"
import {GoStructDeclaration} from "../components/go/GoStructDeclaration.js"

test("GoStructDeclaration isolation test", () => {
	const mockModel = {
		kind: "Model" as const,
		name: "TestUser",
		properties: new Map([
			[
				"id",
				{
					name: "id",
					type: {kind: "Scalar", name: "string"},
					optional: false,
				},
			],
			[
				"name",
				{
					name: "name",
					type: {kind: "Scalar", name: "string"},
					optional: false,
				},
			],
		]),
	}

	const result = GoStructDeclaration({
		model: mockModel as any,
		program: undefined,
	})

	console.log("✅ GoStructDeclaration render successful")
	console.log("Generated result:", result)

	expect(result).toContain("type TestUser struct")
	expect(result).toContain('ID string `json:"id"`')
	expect(result).toContain('Name string `json:"name"`')
})
