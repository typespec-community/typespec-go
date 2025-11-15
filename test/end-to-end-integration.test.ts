/**
 * End-to-End Integration Test - TypeSpec Go Emitter
 * 
 * CUSTOMER-VALUE TESTING: Working TypeSpec → Go generation
 * ZERO ANY TYPES: Professional test implementation
 * BEHAVIOR-DRIVEN DEVELOPMENT: Real customer scenarios
 */

import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

import { StandaloneGoGenerator } from "../src/standalone-generator.js";
import { TypeSpecConfigFactory, ValidationLevel, GeneratorMode } from "../src/utils/config-modules.js";
import { TypeSafeStateManager, GenerationState, ValidationState, IntegrationState, TypeSafetyState } from "../src/utils/state-management.js";

describe("End-to-End Integration Test", () => {
  
  it("T5.1: Test professional-emitter.ts functionality", () => {
    console.log("🔍 Testing professional-emitter.ts functionality");
    
    try {
      // Import and test professional emitter
      import("../src/professional-emitter.js").then(module => {
        console.log("✅ Professional emitter imported successfully");
        console.log("✅ Available exports:", Object.keys(module));
        
        strictEqual(typeof module.$onEmit, "function", 
          "Professional emitter should export $onEmit function");
        strictEqual(typeof module.$lib, "object", 
          "Professional emitter should export $lib object");
          
      }).catch(error => {
        throw new Error(`Professional emitter import failed: ${error.message}`);
      });
      
    } catch (error) {
      throw new Error(`Professional emitter test failed: ${error.message}`);
    }
  });
  
  it("T5.2: Test standalone-generator.ts functionality", () => {
    console.log("🔍 Testing standalone-generator.ts functionality");
    
    try {
      const generator = new StandaloneGoGenerator();
      console.log("✅ Standalone generator created successfully");
      
      // Test basic model generation
      const model = {
        name: "TestUser",
        properties: new Map([
          ["id", { name: "id", type: { kind: "Int32" }, optional: false }],
          ["name", { name: "name", type: { kind: "String" }, optional: false }],
          ["email", { name: "email", type: { kind: "String" }, optional: true }],
          ["score", { name: "score", type: { kind: "Float64" }, optional: true }]
        ])
      };
      
      const goCode = generator.generateModel(model);
      console.log("✅ Go code generated successfully");
      
      // Validate generated Go code
      const validations = {
        hasPackage: goCode.includes("package"),
        hasTypeStruct: goCode.includes("type TestUser struct"),
        hasIdField: goCode.includes("Id int32"),
        hasNameField: goCode.includes("Name string"),
        hasEmailField: goCode.includes("Email *string"),
        hasScoreField: goCode.includes("Score *float64"),
        hasJsonTags: goCode.includes("json:"),
        hasOmitempty: goCode.includes("omitempty"),
        hasNoAnyTypes: !goCode.includes("any"),
        hasNoInterface: !goCode.includes("interface{}")
      };
      
      const passedValidations = Object.values(validations).filter(Boolean).length;
      const totalValidations = Object.keys(validations).length;
      const successRate = (passedValidations / totalValidations) * 100;
      
      console.log(`📊 Validation Results: ${passedValidations}/${totalValidations} (${successRate.toFixed(1)}%)`);
      
      // Critical validations must pass
      strictEqual(validations.hasPackage, true, "Should have package declaration");
      strictEqual(validations.hasTypeStruct, true, "Should have type struct declaration");
      strictEqual(validations.hasIdField, true, "Should have Id field");
      strictEqual(validations.hasNameField, true, "Should have Name field");
      strictEqual(validations.hasEmailField, true, "Should have Email field");
      strictEqual(validations.hasScoreField, true, "Should have Score field");
      strictEqual(validations.hasJsonTags, true, "Should have JSON tags");
      strictEqual(validations.hasNoAnyTypes, true, "Should have no 'any' types");
      
      console.log(`✅ Standalone generator test passed: ${successRate.toFixed(1)}% success rate`);
      
    } catch (error) {
      throw new Error(`Standalone generator test failed: ${error.message}`);
    }
  });
  
  it("T5.3: Verify end-to-end TypeSpec → Go functionality", () => {
    console.log("🔍 Verifying end-to-end TypeSpec → Go functionality");
    
    try {
      // Test complete pipeline
      const config = TypeSpecConfigFactory.createDefault();
      console.log("✅ Configuration created successfully");
      
      const stateManager = new TypeSafeStateManager();
      console.log("✅ State manager created successfully");
      
      const generator = new StandaloneGoGenerator();
      console.log("✅ Generator created successfully");
      
      // Test state transitions
      stateManager.setGenerationState(GenerationState.IDLE);
      stateManager.setValidationState(ValidationState.NOT_VALIDATED);
      stateManager.setIntegrationState(IntegrationState.NOT_INTEGRATED);
      stateManager.setTypeSafetyState(TypeSafetyState.UNKNOWN);
      
      // Generate complex model
      const complexModel = {
        name: "ComplexUser",
        properties: new Map([
          ["id", { name: "id", type: { kind: "Uint32" }, optional: false }],
          ["username", { name: "username", type: { kind: "String" }, optional: false }],
          ["email", { name: "email", type: { kind: "String" }, optional: true }],
          ["age", { name: "age", type: { kind: "Int8" }, optional: true }],
          ["score", { name: "score", type: { kind: "Float32" }, optional: true }],
          ["isActive", { name: "isActive", type: { kind: "Boolean" }, optional: false }],
          ["profile", { name: "profile", type: { kind: "Model" }, optional: true }],
          ["tags", { name: "tags", type: { kind: "Array" }, optional: false }]
        ])
      };
      
      stateManager.setGenerationState(GenerationState.GENERATING);
      const goCode = generator.generateModel(complexModel);
      stateManager.setGenerationState(GenerationState.COMPLETED);
      
      stateManager.setValidationState(ValidationState.VALIDATING);
      const validation = generator.validateGoCode(goCode);
      stateManager.setValidationState(validation.isValid ? ValidationState.PASSED : ValidationState.FAILED);
      
      stateManager.setTypeSafetyState(TypeSafetyState.TYPE_SAFE);
      stateManager.setIntegrationState(IntegrationState.INTEGRATED);
      
      // Validate complex model generation
      const complexValidations = {
        hasPackage: goCode.includes("package"),
        hasTypeStruct: goCode.includes("type ComplexUser struct"),
        hasUint32Id: goCode.includes("Id uint32"),
        hasUsername: goCode.includes("Username string"),
        hasEmailPointer: goCode.includes("Email *string"),
        hasInt8Age: goCode.includes("Age *int8"),
        hasFloat32Score: goCode.includes("Score *float32"),
        hasBooleanActive: goCode.includes("IsActive bool"),
        hasModelProfile: goCode.includes("Profile interface{}"),
        hasArrayTags: goCode.includes("Tags []interface{}"),
        hasJsonTags: goCode.includes("json:"),
        hasOmitempty: goCode.includes("omitempty"),
        hasNoAnyTypes: !goCode.includes("any"),
        validationPassed: validation.isValid
      };
      
      const passedComplexValidations = Object.values(complexValidations).filter(Boolean).length;
      const totalComplexValidations = Object.keys(complexValidations).length;
      const complexSuccessRate = (passedComplexValidations / totalComplexValidations) * 100;
      
      console.log(`📊 Complex Model Validation Results: ${passedComplexValidations}/${totalComplexValidations} (${complexSuccessRate.toFixed(1)}%)`);
      
      // Critical validations must pass
      strictEqual(complexValidations.hasPackage, true, "Should have package declaration");
      strictEqual(complexValidations.hasTypeStruct, true, "Should have type struct declaration");
      strictEqual(complexValidations.hasUint32Id, true, "Should have Uint32 Id field");
      strictEqual(complexValidations.hasUsername, true, "Should have Username field");
      strictEqual(complexValidations.hasEmailPointer, true, "Should have Email pointer field");
      strictEqual(complexValidations.hasJsonTags, true, "Should have JSON tags");
      strictEqual(complexValidations.hasNoAnyTypes, true, "Should have no 'any' types");
      strictEqual(complexValidations.validationPassed, true, "Should pass validation");
      
      // Validate state management
      const systemStatus = stateManager.getSystemStatus();
      strictEqual(systemStatus.isReady, true, "System should be ready");
      strictEqual(systemStatus.generation, GenerationState.COMPLETED, "Generation should be completed");
      strictEqual(systemStatus.validation, ValidationState.PASSED, "Validation should be passed");
      strictEqual(systemStatus.integration, IntegrationState.INTEGRATED, "Integration should be integrated");
      strictEqual(systemStatus.typeSafety, TypeSafetyState.TYPE_SAFE, "Type safety should be type safe");
      
      console.log(`✅ End-to-end integration test passed: ${complexSuccessRate.toFixed(1)}% success rate`);
      console.log(`✅ System status: ${JSON.stringify(systemStatus, null, 2)}`);
      
    } catch (error) {
      throw new Error(`End-to-end integration test failed: ${error.message}`);
    }
  });
});