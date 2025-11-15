/**
 * Real BDD Customer Scenarios for TypeSpec Go Emitter
 * 
 * BDD EXCELLENCE: Customer value validation
 * ZERO ANY TYPES: Professional type safety
 * REAL TESTING: Go compilation verification
 */

import { BDDRunner, GoCompilationValidator } from '../src/utils/bdd-framework.js';
import { StandaloneGoGenerator } from '../src/standalone-generator.js';

/**
 * BDD Customer Scenarios
 * ZERO ANY TYPES: Professional scenario definitions
 */
const bddScenarios = [
  {
    name: "Basic Model Generation",
    description: "Generate Go struct from basic TypeSpec model with common types",
    
    given: () => {
      console.log("  📋 Basic TypeSpec model with string, int32, boolean fields");
      const generator = new StandaloneGoGenerator();
      const model = {
        name: "User",
        properties: new Map([
          ["id", { name: "id", type: { kind: "String" }, optional: false }],
          ["age", { name: "age", type: { kind: "Int32" }, optional: true }],
          ["active", { name: "active", type: { kind: "Boolean" }, optional: false }]
        ])
      };
      return { generator, model };
    },
    
    when: ({ generator, model }) => {
      console.log("  ⚡ Generating Go code from TypeSpec model");
      return generator.generateModel(model);
    },
    
    then: (goCode) => {
      const validation = GoCompilationValidator.validateGoCode(goCode);
      
      if (!validation.isValid) {
        return {
          success: false,
          message: `Go code validation failed: ${validation.errors.join(', ')}`
        };
      }
      
      if (!goCode.includes('type User struct')) {
        return {
          success: false,
          message: 'Generated struct name incorrect'
        };
      }
      
      if (!goCode.includes('Id string')) {
        return {
          success: false,
          message: 'String field not properly generated'
        };
      }
      
      if (!goCode.includes('Age *int32')) {
        return {
          success: false,
          message: 'Optional int32 field not properly generated'
        };
      }
      
      return {
        success: true,
        message: 'Basic model with all field types generated correctly'
      };
    }
  },
  
  {
    name: "Complex Model with Arrays and Models",
    description: "Generate Go struct with arrays and nested model fields",
    
    given: () => {
      console.log("  📋 Complex TypeSpec model with arrays and nested models");
      const generator = new StandaloneGoGenerator();
      const model = {
        name: "Product",
        properties: new Map([
          ["id", { name: "id", type: { kind: "String" }, optional: false }],
          ["tags", { name: "tags", type: { kind: "Array" }, optional: false }],
          ["category", { name: "category", type: { kind: "Model" }, optional: true }]
        ])
      };
      return { generator, model };
    },
    
    when: ({ generator, model }) => {
      console.log("  ⚡ Generating Go code with complex types");
      return generator.generateModel(model);
    },
    
    then: (goCode) => {
      const validation = GoCompilationValidator.validateGoCode(goCode);
      
      if (!validation.isValid) {
        return {
          success: false,
          message: `Go code validation failed: ${validation.errors.join(', ')}`
        };
      }
      
      if (!goCode.includes('Tags []interface{}')) {
        return {
          success: false,
          message: 'Array field not properly generated'
        };
      }
      
      if (!goCode.includes('Category interface{}')) {
        return {
          success: false,
          message: 'Optional model field not properly generated'
        };
      }
      
      return {
        success: true,
        message: 'Complex model with arrays and nested types generated correctly'
      };
    }
  },
  
  {
    name: "Error Handling for Invalid Models",
    description: "Properly handle invalid TypeSpec models with helpful error messages",
    
    given: () => {
      console.log("  📋 Invalid TypeSpec model with empty name and no properties");
      const generator = new StandaloneGoGenerator();
      const invalidModel = { name: "", properties: new Map() };
      return { generator, invalidModel };
    },
    
    when: ({ generator, invalidModel }) => {
      console.log("  ⚡ Attempting to generate Go code from invalid model");
      
      try {
        generator.generateModel(invalidModel);
        return { error: null, threwError: false };
      } catch (error) {
        return { error, threwError: true };
      }
    },
    
    then: ({ error, threwError }) => {
      if (!threwError || !error) {
        return {
          success: false,
          message: 'Should have thrown error for invalid model'
        };
      }
      
      if (!error.message.includes('Invalid model')) {
        return {
          success: false,
          message: 'Error message does not indicate invalid model'
        };
      }
      
      return {
        success: true,
        message: 'Invalid model properly handled with descriptive error'
      };
    }
  }
];

/**
 * Execute all BDD scenarios
 * ZERO ANY TYPES: Professional test execution
 */
console.log("🚀 STARTING BDD TEST EXECUTION");
console.log("=" .repeat(60));

const results = BDDRunner.executeScenarios(bddScenarios);

console.log("=" .repeat(60));
console.log(`🎯 BDD EXECUTION COMPLETE: ${results.passed}/${results.passed + results.failed} scenarios passed`);

if (results.failed > 0) {
  console.log("❌ Some BDD scenarios failed - customer value compromised");
  process.exit(1);
} else {
  console.log("✅ All BDD scenarios passed - customer value delivered");
}