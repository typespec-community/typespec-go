import {expect, test} from "vitest"
import {render, Output, ModuleDirectory, SourceDirectory, SourceFile} from "@alloy-js/core"
import {getEnumValues, GoEnumDeclaration} from "../components/go/GoEnumDeclaration.js"
import {GoUnionDeclaration} from "../components/go/GoUnionDeclaration.js"
import type {Enum, Union} from "@typespec/compiler"

/**
 * Test enum generation integration
 */
test("GoEnumDeclaration generates valid Go string enum", async () => {
	// Create mock enum matching TypeSpec Enum interface
	const mockEnum: Enum = {
		name: "Status",
		kind: "Enum",
		members: new Map([
			["pending", {name: "pending", value: "pending"}],
			["active", {name: "active", value: "active"}],
			["completed", {name: "completed", value: "completed"}],
		]),
	}

	const jsx = <GoEnumDeclaration enum={mockEnum}/>
	const result = await renderAsync(jsx)

	// Verify Go code structure
	expect(result).toContain("type Status string")
	expect(result).toContain("StatusPending Status")
	expect(result).toContain("StatusActive Status")
	expect(result).toContain("StatusCompleted Status")
	expect(result).toContain("func (e Status) String() string")
	expect(result).toContain("func (e Status) IsValid() bool")
})

test("GoEnumDeclaration generates valid Go iota enum", async () => {
	// Create mock numeric enum
	const mockEnum: Enum = {
		name: "Priority",
		kind: "Enum",
		members: new Map([
			["low", {name: "low", value: 0}],
			["medium", {name: "medium", value: 1}],
			["high", {name: "high", value: 2}],
		]),
	}

	const jsx = <GoEnumDeclaration enum={mockEnum} useIota={true}/>
	const result = await renderAsync(jsx)

	// Verify iota pattern
	expect(result).toContain("type Priority int")
	expect(result).toContain("PriorityLow Priority = iota")
	expect(result).toContain("func (e Priority) IsValid() bool")
})

test("getEnumValues extracts enum member information", () => {
	const mockEnum: Partial<Enum> = {
		name: "Color",
		members: new Map([
			["red", {name: "red", value: "RED"}],
			["green", {name: "green", value: "GREEN"}],
		]),
	}

	const values = getEnumValues(mockEnum as Enum)

	expect(values).toHaveLength(2)
	expect(values[0]).toEqual({name: "red", value: "RED"})
	expect(values[1]).toEqual({name: "green", value: "GREEN"})
})

/**
 * Test union generation integration
 */
test("GoUnionDeclaration generates sealed interface pattern", async () => {
	// Create mock union matching TypeSpec Union interface
	const mockUnion: Union = {
		name: "PaymentMethod",
		kind: "Union",
		variants: new Map([
			["card", {name: "card", type: {kind: "String"}}],
			["bank", {name: "bank", type: {kind: "String"}}],
		]),
	}

	const jsx = <GoUnionDeclaration union={mockUnion as Union}/>
	const result = await renderAsync(jsx)

	// Verify sealed interface pattern
	expect(result).toContain("type PaymentMethod interface")
	expect(result).toContain("isPaymentMethod()")
	expect(result).toContain("type Card struct")
	expect(result).toContain("type Bank struct")
	expect(result).toContain("func (Card) isPaymentMethod()")
	expect(result).toContain("func (Bank) isPaymentMethod()")
})

test("GoUnionDeclaration generates discriminated union with unmarshaler", async () => {
	const mockUnion: Partial<Union> = {
		name: "Event",
		kind: "Union",
		variants: new Map([
			["created", {name: "created", type: {kind: "String"}}],
			["deleted", {name: "deleted", type: {kind: "String"}}],
		]),
	}

	const jsx = <GoUnionDeclaration 
		union={mockUnion as Union}
		discriminator="type"
	/>
	const result = await renderAsync(jsx)

	// Verify discriminated union features
	expect(result).toContain("GetType() string")
	expect(result).toContain('`json:"type"`')
	expect(result).toContain("func UnmarshalEvent(data []byte)")
	expect(result).toContain("switch base.Type")
})

test("GoUnionDeclaration handles empty union gracefully", async () => {
	const emptyUnion: Union = {
		name: "EmptyUnion",
		kind: "Union",
		variants: new Map(),
	}

	const jsx = <GoUnionDeclaration union={emptyUnion}/>
	const result = await renderAsync(jsx)

	// Should still generate valid interface
	expect(result).toContain("type EmptyUnion interface")
	expect(result).toContain("isEmptyUnion()")
})
