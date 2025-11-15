/**
 * BDD Customer Scenarios - TypeSpec Go Emitter
 * 
 * BEHAVIOR-DRIVEN DEVELOPMENT: Real customer scenarios
 * ZERO ANY TYPES: Professional test implementation
 * CUSTOMER VALUE: Working TypeSpec → Go generation
 */

import { BDDTestRunner, BDDTestBuilder, BDDFeature } from "../src/utils/bdd-framework.js";
import { StandaloneGoGenerator } from "../src/standalone-generator.js";

/**
 * BDD Customer Feature: TypeSpec to Go Code Generation
 * 
 * CUSTOMER-FOCUSED: Real-world scenarios
 */
const typeSpecToGoFeature: BDDFeature = {
  name: "TypeSpec to Go Code Generation",
  description: "As a Go developer, I want to generate type-safe Go code from TypeSpec models, so that I can maintain type safety across my stack.",
  scenarios: []
};

/**
 * Scenario: Generate struct with optional fields
 * 
 * BEHAVIOR-DRIVEN: Customer scenario
 */
const optionalFieldsScenario = new BDDTestBuilder()
  .scenarioName("Generate struct with optional fields")
  .given("a TypeSpec model with optional properties")
  .when("I generate Go code")
  .then("I should see proper pointer types for optional fields")
  .test(() => {
    const generator = new StandaloneGoGenerator();
    const model = {
      name: "User",
      properties: new Map([
        ["id", { name: "id", type: { kind: "Int32" }, optional: false }],
        ["name", { name: "name", type: { kind: "String" }, optional: false }],
        ["email", { name: "email", type: { kind: "String" }, optional: true }],
        ["score", { name: "score", type: { kind: "Float64" }, optional: true }]
      ])
    };
    
    const goCode = generator.generateModel(model);
    
    // Validate optional fields have pointer types
    const hasEmailPointer = goCode.includes("Email *string");
    const hasScorePointer = goCode.includes("Score *float64");
    
    if (!hasEmailPointer) {
      throw new Error("Email should use pointer type for optional field");
    }
    
    if (!hasScorePointer) {
      throw new Error("Score should use pointer type for optional field");
    }
  })
  .test();

/**
 * Scenario: Generate struct with uint types
 * 
 * BEHAVIOR-DRIVEN: Customer scenario
 */
const uintTypesScenario = new BDDTestBuilder()
  .scenarioName("Generate struct with uint types")
  .given("a TypeSpec model with uint properties")
  .when("I generate Go code")
  .then("I should see correct uint types in Go")
  .test(() => {
    const generator = new StandaloneGoGenerator();
    const model = {
      name: "Metrics",
      properties: new Map([
        ["id", { name: "id", type: { kind: "Uint32" }, optional: false }],
        ["count", { name: "count", type: { kind: "Uint64" }, optional: false }],
        ["value", { name: "value", type: { kind: "Uint8" }, optional: false }],
        ["size", { name: "size", type: { kind: "Uint16" }, optional: false }]
      ])
    };
    
    const goCode = generator.generateModel(model);
    
    // Validate uint types
    const hasUint32Id = goCode.includes("Id uint32");
    const hasUint64Count = goCode.includes("Count uint64");
    const hasUint8Value = goCode.includes("Value uint8");
    const hasUint16Size = goCode.includes("Size uint16");
    
    if (!hasUint32Id) throw new Error("Id should use uint32");
    if (!hasUint64Count) throw new Error("Count should use uint64");
    if (!hasUint8Value) throw new Error("Value should use uint8");
    if (!hasUint16Size) throw new Error("Size should use uint16");
  })
  .test();

/**
 * Scenario: Generate struct with proper JSON tags
 * 
 * BEHAVIOR-DRIVEN: Customer scenario
 */
const jsonTagsScenario = new BDDTestBuilder()
  .scenarioName("Generate struct with proper JSON tags")
  .given("a TypeSpec model with various properties")
  .when("I generate Go code")
  .then("I should see proper JSON tags for all fields")
  .test(() => {
    const generator = new StandaloneGoGenerator();
    const model = {
      name: "UserProfile",
      properties: new Map([
        ["userId", { name: "userId", type: { kind: "Int64" }, optional: false }],
        ["username", { name: "username", type: { kind: "String" }, optional: false }],
        ["email", { name: "email", type: { kind: "String" }, optional: true }],
        ["isActive", { name: "isActive", type: { kind: "Boolean" }, optional: false }]
      ])
    };
    
    const goCode = generator.generateModel(model);
    
    // Validate JSON tags
    const hasUserIdJson = goCode.includes('json:"userId"');
    const hasUsernameJson = goCode.includes('json:"username"');
    const hasEmailJson = goCode.includes('json:"email",omitempty');
    const hasActiveJson = goCode.includes('json:"isActive"');
    
    if (!hasUserIdJson) throw new Error("UserId should have json tag");
    if (!hasUsernameJson) throw new Error("Username should have json tag");
    if (!hasEmailJson) throw new Error("Email should have json tag with omitempty");
    if (!hasActiveJson) throw new Error("IsActive should have json tag");
  })
  .test();

/**
 * Add scenarios to feature
 */
typeSpecToGoFeature.scenarios.push(
  optionalFieldsScenario,
  uintTypesScenario,
  jsonTagsScenario
);

/**
 * Run BDD Tests
 * 
 * BEHAVIOR-DRIVEN: Customer scenario execution
 */
export async function runBDDTests(): Promise<void> {
  const runner = new BDDTestRunner();
  runner.addFeature(typeSpecToGoFeature);
  await runner.runTests();
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runBDDTests().catch(console.error);
}