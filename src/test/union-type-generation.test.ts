import { test, expect } from "vitest";
import { StandaloneGoGenerator } from "../standalone-generator.js";

/**
 * Task 1.2.1: Union Type Generation Tests
 * Tests union type to Go sealed interface generation
 */

test("Union Types - Should generate sealed interface", async () => {
  const generator = new StandaloneGoGenerator();

  // Arrange
  const unionModel = {
    name: "EventType",
    kind: "union",
    variants: [
      { name: "userLogin", type: { kind: "Model", name: "UserLoginEvent" } },
      { name: "userLogout", type: { kind: "Model", name: "UserLogoutEvent" } },
      { name: "systemError", type: { kind: "Model", name: "SystemErrorEvent" } },
    ],
    properties: new Map(),
  };

  // Act
  const result = await generator.generateUnionType(unionModel);

  // Assert
  if (result._tag === "success") {
    const goCode = result.data.get("EventType.go");

    // Should generate sealed interface
    expect(goCode).toContain("type EventType interface {");
    expect(goCode).toContain("isEventType()");

    // Should generate variant structs
    expect(goCode).toContain("type UserLoginEvent struct {");
    expect(goCode).toContain("type UserLogoutEvent struct {");
    expect(goCode).toContain("type SystemErrorEvent struct {");

    // Each variant should implement the interface
    expect(goCode).toContain("func (e UserLoginEvent) isEventType() {}");
    expect(goCode).toContain("func (e UserLogoutEvent) isEventType() {}");
    expect(goCode).toContain("func (e SystemErrorEvent) isEventType() {}");
  } else {
    throw new Error(`Failed to generate union type: ${result._tag}`);
  }
});

test("Union Types - Should handle discriminated unions", async () => {
  const generator = new StandaloneGoGenerator();

  // Arrange
  const discriminatedUnion = {
    name: "PaymentMethod",
    kind: "union",
    discriminator: "type",
    variants: [
      {
        name: "creditCard",
        type: { kind: "Model", name: "CreditCard" },
        discriminator: "credit_card",
      },
      { name: "paypal", type: { kind: "Model", name: "PayPal" }, discriminator: "paypal" },
      {
        name: "bankTransfer",
        type: { kind: "Model", name: "BankTransfer" },
        discriminator: "bank_transfer",
      },
    ],
    properties: new Map(),
  };

  // Act
  const result = await generator.generateUnionType(discriminatedUnion);

  // Assert
  if (result._tag === "success") {
    const goCode = result.data.get("PaymentMethod.go");

    // Should generate discriminator field
    expect(goCode).toContain('Type string `json:"type"`');

    // Should generate type constants
    expect(goCode).toContain('const PaymentTypeCreditCard = "credit_card"');
    expect(goCode).toContain('const PaymentTypePayPal = "paypal"');
    expect(goCode).toContain('const PaymentTypeBankTransfer = "bank_transfer"');
  } else {
    throw new Error(`Failed to generate discriminated union: ${result._tag}`);
  }
});

test("Union Types - Should handle recursive union types", async () => {
  const generator = new StandaloneGoGenerator();

  // Arrange
  const recursiveUnion = {
    name: "Expression",
    kind: "union",
    variants: [
      { name: "literal", type: { kind: "scalar", name: "string" } },
      { name: "add", type: { kind: "Model", name: "AddExpression" } },
      { name: "multiply", type: { kind: "Model", name: "MultiplyExpression" } },
    ],
    properties: new Map(),
  };

  // Act
  const result = await generator.generateUnionType(recursiveUnion);

  // Assert
  if (result._tag === "success") {
    const goCode = result.data.get("Expression.go");

    // Should handle recursive references with pointers
    expect(goCode).toContain("*Expression");
    expect(goCode).toContain("Left *Expression");
    expect(goCode).toContain("Right *Expression");
  } else {
    throw new Error(`Failed to generate recursive union: ${result._tag}`);
  }
});

test("Union Types - Should handle empty union gracefully", async () => {
  const generator = new StandaloneGoGenerator();

  // Arrange
  const emptyUnion = {
    name: "EmptyUnion",
    kind: "union",
    variants: [],
    properties: new Map(),
  };

  // Act
  const result = await generator.generateUnionType(emptyUnion);

  // Assert
  // Should either succeed with minimal interface or fail gracefully
  if (result._tag === "success") {
    const goCode = result.data.get("EmptyUnion.go");
    expect(goCode).toContain("type EmptyUnion interface {");
  } else {
    // Should provide meaningful error message
    expect(result._tag).toBe("error");
    expect(result.message).toContain("union");
  }
});

test("Union Types - Should generate proper JSON tags", async () => {
  const generator = new StandaloneGoGenerator();

  // Arrange
  const unionWithJson = {
    name: "ApiResponse",
    kind: "union",
    discriminator: "type",
    variants: [
      {
        name: "success",
        type: { kind: "Model", name: "SuccessResponse" },
        discriminator: "success",
      },
      { name: "error", type: { kind: "Model", name: "ErrorResponse" }, discriminator: "error" },
    ],
    properties: new Map(),
  };

  // Act
  const result = await generator.generateUnionType(unionWithJson);

  // Assert
  if (result._tag === "success") {
    const goCode = result.data.get("ApiResponse.go");

    // Should include JSON tags for proper serialization
    expect(goCode).toContain('`json:"type"`');
    expect(goCode).toContain('`json:"success,omitempty"`');
    expect(goCode).toContain('`json:"error,omitempty"`');
  } else {
    throw new Error(`Failed to generate union with JSON tags: ${result._tag}`);
  }
});

test("Union Types - Should handle union performance efficiently", async () => {
  const generator = new StandaloneGoGenerator();

  // Arrange
  const largeUnion = {
    name: "LargeUnion",
    kind: "union",
    variants: Array.from({ length: 20 }, (_, i) => ({
      name: `variant${i}`,
      type: { kind: "Model", name: `Variant${i}` },
    })),
    properties: new Map(),
  };

  // Act
  const startTime = performance.now();
  const result = await generator.generateUnionType(largeUnion);
  const endTime = performance.now();
  const duration = endTime - startTime;

  // Assert
  expect(duration).toBeLessThan(5); // Should handle large unions quickly

  if (result._tag === "success") {
    const goCode = result.data.get("LargeUnion.go");

    // Should generate all variants
    expect(goCode).toMatch(/type Variant\d+ struct {/g);
  } else {
    throw new Error(`Failed to generate large union: ${result._tag}`);
  }
});
