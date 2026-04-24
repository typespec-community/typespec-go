import { expect, test } from "vitest";
import { getEnumValues, GoEnumDeclaration } from "../components/go/GoEnumDeclaration.js";
import { GoUnionDeclaration } from "../components/go/GoUnionDeclaration.js";
import type { Enum, Union } from "@typespec/compiler";
import { renderGoContent } from "../testing/test-utils.js";

/**
 * Test enum generation integration
 */
test("GoEnumDeclaration generates valid Go string enum", () => {
  // Create mock enum matching TypeSpec Enum interface
  const mockEnum: Enum = {
    name: "Status",
    kind: "Enum",
    members: new Map([
      ["pending", { name: "pending", value: "pending" }],
      ["active", { name: "active", value: "active" }],
      ["completed", { name: "completed", value: "completed" }],
    ]) as any,
  } as any;

  const goFile = renderGoContent(<GoEnumDeclaration enum={mockEnum} />);

  // Verify Go code structure
  expect(goFile).toContain("type Status string");
  expect(goFile).toContain("StatusPending Status");
  expect(goFile).toContain("StatusActive Status");
  expect(goFile).toContain("StatusCompleted Status");
  expect(goFile).toContain("func (e Status) String() string");
  expect(goFile).toContain("func (e Status) IsValid() bool");
});

test("GoEnumDeclaration generates valid Go iota enum", () => {
  // Create mock numeric enum
  const mockEnum: Enum = {
    name: "Priority",
    kind: "Enum",
    members: new Map([
      ["low", { name: "low", value: 0 }],
      ["medium", { name: "medium", value: 1 }],
      ["high", { name: "high", value: 2 }],
    ]) as any,
  } as any;

  const result = renderGoContent(<GoEnumDeclaration enum={mockEnum} useIota={true} />);

  // Verify iota pattern
  expect(result).toContain("type Priority int");
  expect(result).toContain("PriorityLow Priority = iota");
  // Allow for formatting differences in Alloy-JS output
  expect(result).toMatch(/func \(e Priority\) IsValid\(\s*\) bool/);
});

test("getEnumValues extracts enum member information", () => {
  const mockEnum: Partial<Enum> = {
    name: "Color",
    members: new Map([
      ["red", { name: "red", value: "RED" }],
      ["green", { name: "green", value: "GREEN" }],
    ]) as any,
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
  const mockUnion: Union = {
    name: "PaymentMethod",
    kind: "Union",
    variants: new Map([
      ["card", { name: "card", type: { kind: "String" } }],
      ["bank", { name: "bank", type: { kind: "String" } }],
    ]) as any,
  } as any;

  const result = renderGoContent(<GoUnionDeclaration union={mockUnion as Union} />);

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
      ["created", { name: "created", type: { kind: "String" } }],
      ["deleted", { name: "deleted", type: { kind: "String" } }],
    ]) as any,
  };

  const result = renderGoContent(
    <GoUnionDeclaration union={mockUnion as Union} discriminator="type" />,
  );

  // Verify discriminated union features
  expect(result).toContain("GetType() string");
  expect(result).toContain('`json:"type"`');
  expect(result).toContain("func UnmarshalEvent(data []byte)");
  // Placeholder implementation for now
  expect(result).toContain("Unmarshaler implementation");
});

test("GoUnionDeclaration handles empty union gracefully", () => {
  const emptyUnion: Union = {
    name: "EmptyUnion",
    kind: "Union",
    variants: new Map() as any,
  } as any;

  const result = renderGoContent(<GoUnionDeclaration union={emptyUnion} />);

  // Should still generate valid interface
  expect(result).toContain("type EmptyUnion interface");
  expect(result).toContain("isEmptyUnion()");
});
