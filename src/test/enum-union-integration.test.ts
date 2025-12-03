import { test, expect } from "vitest";
import { GoEnumDeclaration, getEnumValues } from "../components/go/GoEnumDeclaration.js";
import { GoUnionDeclaration } from "../components/go/GoUnionDeclaration.js";
import type { Enum, EnumMember, Union, UnionVariant } from "@typespec/compiler";

/**
 * Test enum generation integration
 */
test("GoEnumDeclaration generates valid Go string enum", () => {
  // Create mock enum matching TypeSpec Enum interface
  const mockEnum: Partial<Enum> = {
    name: "Status",
    kind: "Enum",
    members: new Map([
      ["pending", { name: "pending", value: "pending" } as EnumMember],
      ["active", { name: "active", value: "active" } as EnumMember],
      ["completed", { name: "completed", value: "completed" } as EnumMember],
    ]),
  };

  const result = GoEnumDeclaration({ enum: mockEnum as Enum });

  // Verify Go code structure
  expect(result).toContain("type Status string");
  expect(result).toContain("StatusPending Status");
  expect(result).toContain("StatusActive Status");
  expect(result).toContain("StatusCompleted Status");
  expect(result).toContain("func (e Status) String() string");
  expect(result).toContain("func (e Status) IsValid() bool");
});

test("GoEnumDeclaration generates valid Go iota enum", () => {
  // Create mock numeric enum
  const mockEnum: Partial<Enum> = {
    name: "Priority",
    kind: "Enum",
    members: new Map([
      ["low", { name: "low", value: 0 } as EnumMember],
      ["medium", { name: "medium", value: 1 } as EnumMember],
      ["high", { name: "high", value: 2 } as EnumMember],
    ]),
  };

  const result = GoEnumDeclaration({ enum: mockEnum as Enum, useIota: true });

  // Verify iota pattern
  expect(result).toContain("type Priority int");
  expect(result).toContain("PriorityLow Priority = iota");
  expect(result).toContain("func (e Priority) IsValid() bool");
});

test("getEnumValues extracts enum member information", () => {
  const mockEnum: Partial<Enum> = {
    name: "Color",
    members: new Map([
      ["red", { name: "red", value: "RED" } as EnumMember],
      ["green", { name: "green", value: "GREEN" } as EnumMember],
    ]),
  };

  const values = getEnumValues(mockEnum as Enum);

  expect(values).toHaveLength(2);
  expect(values[0]).toEqual({ name: "red", value: "RED" });
  expect(values[1]).toEqual({ name: "green", value: "GREEN" });
});

/**
 * Test union generation integration
 */
test("GoUnionDeclaration generates sealed interface pattern", () => {
  // Create mock union matching TypeSpec Union interface
  const mockUnion: Partial<Union> = {
    name: "PaymentMethod",
    kind: "Union",
    variants: new Map([
      ["card", { name: "card", type: { kind: "String" } } as unknown as UnionVariant],
      ["bank", { name: "bank", type: { kind: "String" } } as unknown as UnionVariant],
    ]),
  };

  const result = GoUnionDeclaration({ union: mockUnion as Union });

  // Verify sealed interface pattern
  expect(result).toContain("type PaymentMethod interface");
  expect(result).toContain("isPaymentMethod()");
  expect(result).toContain("type Card struct");
  expect(result).toContain("type Bank struct");
  expect(result).toContain("func (Card) isPaymentMethod()");
  expect(result).toContain("func (Bank) isPaymentMethod()");
});

test("GoUnionDeclaration generates discriminated union with unmarshaler", () => {
  const mockUnion: Partial<Union> = {
    name: "Event",
    kind: "Union",
    variants: new Map([
      ["created", { name: "created", type: { kind: "String" } } as unknown as UnionVariant],
      ["deleted", { name: "deleted", type: { kind: "String" } } as unknown as UnionVariant],
    ]),
  };

  const result = GoUnionDeclaration({
    union: mockUnion as Union,
    discriminator: "type",
  });

  // Verify discriminated union features
  expect(result).toContain("GetType() string");
  expect(result).toContain('`json:"type"`');
  expect(result).toContain("func UnmarshalEvent(data []byte)");
  expect(result).toContain("switch base.Type");
});

test("GoUnionDeclaration handles empty union gracefully", () => {
  const emptyUnion: Partial<Union> = {
    name: "EmptyUnion",
    kind: "Union",
    variants: new Map(),
  };

  const result = GoUnionDeclaration({ union: emptyUnion as Union });

  // Should still generate valid interface
  expect(result).toContain("type EmptyUnion interface");
  expect(result).toContain("isEmptyUnion()");
});
