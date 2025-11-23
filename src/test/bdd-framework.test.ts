/**
 * Integration Test - Real BDD Framework Verification
 *
 * Demonstrates professional BDD testing with real assertions
 * Replaces fake console.log testing framework
 */

import { describe, it, expect, beforeAll } from "bun:test";
import { BDDRunner, BDDScenario } from "../utils/bdd-framework.js";
import { GoEmitter } from "../emitter/index.js";
import { StandaloneGoGenerator } from "../standalone-generator.js";
import type { Program } from "@typespec/compiler";

describe("Real BDD Framework Integration", () => {
  let generator: StandaloneGoGenerator;

  beforeAll(async () => {
    generator = new StandaloneGoGenerator();
  });

  it("should execute BDD scenario with real assertions", () => {
    // Given: Create BDD scenario for Go generator testing
    const scenario: BDDScenario = {
      name: "Go Generator Success",
      description:
        "Verify Go generator generates proper code using BDD framework",
      given: () => {
        return { generator };
      },
      when: (context) => {
        // Create proper readonly map for type safety
        const properties = new Map([
          [
            "name",
            { name: "name", type: { kind: "String" }, optional: false },
          ],
          [
            "email",
            { name: "email", type: { kind: "String" }, optional: true },
          ],
        ]);
        
        const model = {
          name: "TestUser",
          properties: properties as ReadonlyMap<string, import("../types/typespec-domain.js").TypeSpecPropertyNode>,
        };
        
        return context.generator.generateModel(model);
      },
      then: (result) => {
        // Use BDDRunner's validation with correct expected file name
        return BDDRunner.validateGoEmitterResult(result, ["TestUser.go"]);
      },
    };

    // When & Then: Execute scenario with real BDD framework
    // The BDD framework handles validation internally
    BDDRunner.executeScenario(scenario);

    // Test passes if no exception is thrown
    expect(true).toBe(true);
  });

  it("should handle BDD scenario failure properly", () => {
    // Given: Create failing BDD scenario
    const failingScenario: BDDScenario = {
      name: "Go Emitter Failure",
      description: "Verify proper error handling in BDD framework",
      given: () => {
        const mockProgram = undefined; // This will cause failure
        const emitter = new GoEmitter();
        return { emitter, program: mockProgram };
      },
      when: (context) => {
        return context.emitter.emit(context.program);
      },
      then: (result) => {
        // This should always fail (emitter.emit returns error)
        return BDDRunner.createValidation(
          false,
          "Expected failure for testing",
        );
      },
    };

    // When & Then: Execute scenario and expect failure
    expect(() => BDDRunner.executeScenario(failingScenario)).toThrow();
  });

  it("should validate generated Go code with domain intelligence", () => {
    // Given: Generate Go code
    const goCode = generator.generateModel({
      name: "TestUser",
      properties: new Map([
        ["Age", { name: "Age", type: { kind: "Uint8" }, optional: true }],
        ["Count", { name: "Count", type: { kind: "Uint16" }, optional: false }],
      ]),
    });

    // When: Extract generated code using proper discriminated union
    let generatedCode = "";
    if (goCode._tag === "success") {
      generatedCode = Array.from(goCode.data.values())[0];
    } else {
      generatedCode = goCode.message || "";
    }

    // Then: Validate with BDD framework
    const validation = BDDRunner.validateGoCode(generatedCode, {
      hasStruct: true,
      hasJsonTags: true,
      hasUintTypes: true,
      hasOptionalPointers: true,
    });

    expect(validation.success).toBe(true);
    expect(validation.details?.uintTypes).toBe(true);
    expect(validation.details?.optionalPointers).toBe(true);
  });

  it("should execute multiple BDD scenarios with comprehensive reporting", () => {
    // Given: Create multiple BDD scenarios
    const scenarios: BDDScenario[] = [
      {
        name: "Scenario 1",
        description: "First test scenario",
        given: () => ({ test: "data1" }),
        when: (context) => ({ result: "success1" }),
        then: (result) =>
          BDDRunner.createValidation(true, "Success scenario 1"),
      },
      {
        name: "Scenario 2",
        description: "Second test scenario",
        given: () => ({ test: "data2" }),
        when: (context) => ({ result: "success2" }),
        then: (result) =>
          BDDRunner.createValidation(true, "Success scenario 2"),
      },
      {
        name: "Scenario 3 (Fails)",
        description: "Intentionally failing scenario",
        given: () => undefined,
        when: (context) => {
          throw new Error("Intentional failure");
        },
        then: (result) => BDDRunner.createValidation(false, "Expected failure"),
      },
    ];

    // When & Then: Execute all scenarios
    const results = BDDRunner.executeScenarios(scenarios);

    // Verify comprehensive reporting
    expect(results.passed).toBe(2);
    expect(results.failed).toBe(1);
    expect(results.results).toHaveLength(3);
    expect(
      results.results.some(
        (r) => !r.passed && r.error?.message.includes("Intentional failure"),
      ),
    ).toBe(true);
  });
});
