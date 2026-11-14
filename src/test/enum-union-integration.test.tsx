import { expect, test } from "vitest";
import { getEnumValues, GoEnumDeclaration } from "../components/go/GoEnumDeclaration.js";
import { GoUnionDeclaration } from "../components/go/GoUnionDeclaration.js";
import { MockFactory } from "../testing/mock-factory.js";
import { renderGoContent } from "../testing/test-utils.js";

/**
 * Test enum generation integration
 */
test("GoEnumDeclaration generates valid Go string enum", () => {
  // Create mock enum matching TypeSpec Enum interface
  const mockEnum = MockFactory.createEnum("Status", [
    { name: "pending", value: "pending" },
    { name: "active", value: "active" },
    { name: "completed", value: "completed" },
  ]);

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
  const mockEnum = MockFactory.createEnum("Priority", [
    { name: "low", value: 0 },
    { name: "medium", value: 1 },
    { name: "high", value: 2 },
  ]);

  const result = renderGoContent(<GoEnumDeclaration enum={mockEnum} useIota={true} />);

  // Verify iota pattern
  expect(result).toContain("type Priority int");
  expect(result).toContain("PriorityLow Priority = iota");
  // Allow for formatting differences in Alloy-JS output
  expect(result).toMatch(/func \(e Priority\) IsValid\(\s*\) bool/);
});

test("getEnumValues extracts enum member information", () => {
  const mockEnum = MockFactory.createEnum("Color", [
    { name: "red", value: "RED" },
    { name: "green", value: "GREEN" },
  ]);

  const values = getEnumValues(mockEnum);

  expect(values).toHaveLength(2);
  expect(values[0]).toEqual({ name: "red", value: "RED" });
  expect(values[1]).toEqual({ name: "green", value: "GREEN" });
});

/**
 * Test union generation integration
 */
test("GoUnionDeclaration generates sealed interface pattern", () => {
  // Create mock union matching TypeSpec Union interface
  const mockUnion = MockFactory.createUnion("PaymentMethod", [
    { name: "card", type: MockFactory.createStringLiteral("card") },
    { name: "bank", type: MockFactory.createStringLiteral("bank") },
  ]);

  const result = renderGoContent(<GoUnionDeclaration union={mockUnion} />);

  // Verify sealed interface pattern
  expect(result).toContain("type PaymentMethod interface");
  expect(result).toContain("isPaymentMethod()");
  expect(result).toContain("type Card struct");
  expect(result).toContain("type Bank struct");
  expect(result).toContain("func (Card) isPaymentMethod()");
  expect(result).toContain("func (Bank) isPaymentMethod()");
});

test("GoUnionDeclaration generates discriminated union with unmarshaler", () => {
  const mockUnion = MockFactory.createUnion("Event", [
    { name: "created", type: MockFactory.createStringLiteral("created") },
    { name: "deleted", type: MockFactory.createStringLiteral("deleted") },
  ]);

  const result = renderGoContent(
    <GoUnionDeclaration union={mockUnion} discriminator="type" />,
  );

  // Verify discriminated union features
  expect(result).toContain("GetType() string");
  expect(result).toContain('`json:"type"`');
  expect(result).toContain("func UnmarshalEvent(data []byte)");
  // Placeholder implementation for now
  expect(result).toContain("Unmarshaler implementation");
});

test("GoUnionDeclaration handles empty union gracefully", () => {
  const emptyUnion = MockFactory.createUnion("EmptyUnion", []);

  const result = renderGoContent(<GoUnionDeclaration union={emptyUnion} />);

  // Should still generate valid interface
  expect(result).toContain("type EmptyUnion interface");
  expect(result).toContain("isEmptyUnion()");
});
