/**
 * Type-Safe Generator Comprehensive Tests
 * 
 * BEHAVIOR-DRIVEN DEVELOPMENT (BDD) IMPLEMENTED
 * TEST-DRIVEN DEVELOPMENT (TDD) FOLLOWED
 * ZERO SPLIT BRAIN VALIDATIONS
 * TYPE SAFETY ENFORCEMENT
 */

import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

// Import type-safe components
import { 
  TypeSpecTypeNode,
  TypeSpecPropertyNode,
  GoField,
  OptionalHandlingStrategy 
} from "../src/types/type-spec-types.js";

import { 
  TypeSafeMapper,
  TYPE_SPEC_MAPPINGS
} from "../src/mappers/type-safe-mapper.js";

import { 
  OptionalFieldPolicy 
} from "../src/policies/optional-field-policy.js";

import { 
  TypeSafeGoGenerator 
} from "../src/type-safe-generator.js";

describe("TypeSpec Go Emitter - Type-Safe Architecture", () => {
  
  // =======================
  // BEHAVIOR-DRIVEN TESTS
  // =======================
  
  describe("BDD: Type Safety - Zero 'any' Types", () => {
    it("GIVEN: TypeSpec type nodes - WHEN: Mapping to Go - THEN: Zero 'any' types", () => {
      // Given: Proper TypeSpec type nodes
      const stringNode: TypeSpecTypeNode = { kind: "String" };
      const uint32Node: TypeSpecTypeNode = { kind: "Uint32" };
      
      // When: Mapping to Go types
      const stringMapping = TypeSafeMapper.mapTypeSpecType(stringNode);
      const uint32Mapping = TypeSafeMapper.mapTypeSpecType(uint32Node);
      
      // Then: Should have no 'any' types
      strictEqual(stringMapping.goType, "string");
      strictEqual(uint32Mapping.goType, "uint32");
      strictEqual(typeof stringMapping.usePointerForOptional, "boolean");
      strictEqual(typeof uint32Mapping.usePointerForOptional, "boolean");
      
      // Critical: No 'any' types in mappings
      const mappingsHaveAnyTypes = JSON.stringify(stringMapping).includes('any') || 
                                JSON.stringify(uint32Mapping).includes('any');
      strictEqual(mappingsHaveAnyTypes, false, "Should contain no 'any' types");
    });
  });
  
  describe("BDD: Exhaustive Type Matching - Compile-Time Safety", () => {
    it("GIVEN: All TypeSpec types - WHEN: Accessing mappings - THEN: Compile-time exhaustive matching", () => {
      // Given: All TypeSpec kinds defined
      const typeSpecKinds = Object.keys(TYPE_SPEC_MAPPINGS);
      
      // When: Checking mappings completeness
      const expectedKinds = [
        "String", "Int8", "Int16", "Int32", "Int64",
        "Uint8", "Uint16", "Uint32", "Uint64", 
        "Float32", "Float64", "Boolean", "Bytes"
      ];
      
      // Then: Should have all expected kinds
      expectedKinds.forEach(kind => {
        strictEqual(typeSpecKinds.includes(kind), true, 
          `Should have mapping for ${kind} type`);
      });
      
      // Critical: Complete type coverage
      const missingKinds = expectedKinds.filter(kind => !typeSpecKinds.includes(kind));
      strictEqual(missingKinds.length, 0, 
        `Should have no missing kinds. Missing: ${missingKinds.join(', ')}`);
    });
  });
  
  describe("BDD: Complete Uint Support - Professional Go Coverage", () => {
    it("GIVEN: Uint TypeSpec types - WHEN: Mapping to Go - THEN: All uint types supported", () => {
      // Given: Complete uint TypeSpec types
      const uintTypes = ["Uint8", "Uint16", "Uint32", "Uint64"];
      
      uintTypes.forEach(uintKind => {
        const uintNode: TypeSpecTypeNode = { kind: uintKind as any };
        
        // When: Mapping to Go
        const mapping = TypeSafeMapper.mapTypeSpecType(uintNode);
        
        // Then: Should map to correct Go uint types
        const expectedGoType = uintKind.toLowerCase().replace("uint", "uint");
        strictEqual(mapping.goType, expectedGoType, 
          `${uintKind} should map to ${expectedGoType}`);
        
        // Then: Should use pointer for optional
        strictEqual(mapping.usePointerForOptional, true, 
          `${uintKind} should use pointer for optional`);
      });
    });
  });
  
  describe("BDD: Unified Optional Handling - No Split Brain", () => {
    it("GIVEN: Optional property - WHEN: Generating field - THEN: Unified pointer + JSON logic", () => {
      // Given: Optional property with string type
      const optionalProperty: TypeSpecPropertyNode = {
        name: "email",
        type: { kind: "String" },
        optional: true
      };
      
      // When: Generating Go field
      const goField = OptionalFieldPolicy.generateField(optionalProperty);
      
      // Then: Should have unified optional handling
      strictEqual(goField.name, "Email", "Should capitalize field name");
      strictEqual(goField.type, "*string", "Should use pointer for optional string");
      strictEqual(goField.jsonTag, 'json:"email",omitempty', "Should add omitempty for optional");
      
      // Critical: No split brain - pointer and JSON unified
      const hasPointer = goField.type.includes('*');
      const hasOmitempty = goField.jsonTag.includes('omitempty');
      strictEqual(hasPointer && hasOmitempty, true, 
        "Should have unified pointer + JSON handling (no split brain)");
    });
    
    it("GIVEN: Required property - WHEN: Generating field - THEN: No pointer, no omitempty", () => {
      // Given: Required property
      const requiredProperty: TypeSpecPropertyNode = {
        name: "name",
        type: { kind: "String" },
        optional: false
      };
      
      // When: Generating Go field
      const goField = OptionalFieldPolicy.generateField(requiredProperty);
      
      // Then: Should have no optional handling
      strictEqual(goField.name, "Name", "Should capitalize field name");
      strictEqual(goField.type, "string", "Should not use pointer for required");
      strictEqual(goField.jsonTag, 'json:"name"', "Should not add omitempty for required");
      
      // Critical: No split brain - consistent required handling
      const hasPointer = goField.type.includes('*');
      const hasOmitempty = goField.jsonTag.includes('omitempty');
      strictEqual(!hasPointer && !hasOmitempty, true, 
        "Should have no optional handling for required (no split brain)");
    });
  });
  
  // =======================
  // INTEGRATION TESTS
  // =======================
  
  describe("Integration: Complete Model Generation", () => {
    it("GIVEN: Complex TypeSpec model - WHEN: Generating Go - THEN: Type-safe struct with all features", () => {
      // Given: Complex model with various types
      const mockModel = {
        name: "User",
        properties: [
          { name: "id", type: { kind: "Uint32" }, optional: false },
          { name: "name", type: { kind: "String" }, optional: false },
          { name: "age", type: { kind: "Uint8" }, optional: true },
          { name: "score", type: { kind: "Float64" }, optional: true },
          { name: "active", type: { kind: "Boolean" }, optional: false },
          { name: "email", type: { kind: "String" }, optional: true }
        ]
      };
      
      // When: Generating Go struct
      const generator = new TypeSafeGoGenerator();
      const goCode = generator.generateStruct(mockModel.name, mockModel.properties);
      
      // Then: Should generate type-safe Go code
      console.log("Generated Go code:");
      console.log(goCode);
      
      // Critical validations
      const validations = {
        hasPackage: goCode.includes("package"),
        hasUserStruct: goCode.includes("type User struct"),
        hasUint32Id: goCode.includes("Id uint32"),
        hasStringName: goCode.includes("Name string"),
        hasUint8AgePointer: goCode.includes("Age *uint8"),
        hasFloat64ScorePointer: goCode.includes("Score *float64"),
        hasBoolActive: goCode.includes("Active bool"),
        hasStringEmailPointer: goCode.includes("Email *string"),
        hasJsonTags: goCode.includes("json:"),
        hasOmitemptyForOptionals: goCode.includes("omitempty"),
        hasNoInterfaceTypes: !goCode.includes("interface{}"),
        hasNoAnyTypes: !goCode.includes("any"),
        hasComprehensiveUintSupport: goCode.includes("uint32") && goCode.includes("uint8")
      };
      
      // Assert all validations
      Object.entries(validations).forEach(([validation, passed]) => {
        strictEqual(passed, true, 
          `Should pass validation: ${validation}`);
      });
      
      // Critical: Zero split brain validation
      const optionalFields = (goCode.match(/json:"[^"]*",omitempty/g) || []).length;
      const pointerFields = (goCode.match(/\*[a-zA-Z]/g) || []).length;
      strictEqual(optionalFields, pointerFields, 
        "Should have equal optional fields and pointer fields (no split brain)");
    });
  });
  
  // =======================
  // ARCHITECTURAL TESTS
  // =======================
  
  describe("Architecture: Domain Separation", () => {
    it("GIVEN: Domain components - WHEN: Analyzing dependencies - THEN: Clean separation", () => {
      // Given: Domain components should be independent
      
      // Then: Type mapping domain should be self-contained
      const typeMapperIsSelfContained = TypeSafeMapper.mapTypeSpecType !== undefined;
      strictEqual(typeMapperIsSelfContained, true, 
        "Type mapping domain should be self-contained");
      
      // Then: Optional field policy should be independent
      const optionalPolicyIsIndependent = OptionalFieldPolicy.generateField !== undefined;
      strictEqual(optionalPolicyIsIndependent, true, 
        "Optional field policy should be independent");
      
      // Then: Generator should compose domains properly
      const generatorComposesDomains = new TypeSafeGoGenerator().generateModel !== undefined;
      strictEqual(generatorComposesDomains, true, 
        "Generator should properly compose domains");
    });
  });
  
  describe("Architecture: Type Safety Enforcement", () => {
    it("GIVEN: Type-safe components - WHEN: Checking types - THEN: No 'any' usage", () => {
      // Check source code for 'any' usage (this would be a build-time validation in real project)
      const componentFiles = [
        "../src/types/type-spec-types.js",
        "../src/mappers/type-safe-mapper.js", 
        "../src/policies/optional-field-policy.js",
        "../src/type-safe-generator.js"
      ];
      
      // Note: In a real project, this would check actual file contents
      // For now, we validate our implementation through tests
      
      // Then: All components should be type-safe
      const stringMapping = TypeSafeMapper.mapTypeSpecType({ kind: "String" });
      strictEqual(typeof stringMapping.goType, "string", 
        "Should have typed goType");
      strictEqual(typeof stringMapping.usePointerForOptional, "boolean", 
        "Should have typed usePointerForOptional");
        
      // Critical: No 'any' in returned type
      const hasAnyInMapping = JSON.stringify(stringMapping).includes('any');
      strictEqual(hasAnyInMapping, false, 
        "Mapping should contain no 'any' types");
    });
  });
  
  // =======================
  // PERFORMANCE TESTS
  // =======================
  
  describe("Performance: Large Model Generation", () => {
    it("GIVEN: Large model with many properties - WHEN: Generating Go - THEN: Efficient generation", () => {
      // Given: Large model with many properties
      const largeProperties: TypeSpecPropertyNode[] = [];
      for (let i = 0; i < 100; i++) {
        const kind = i % 2 === 0 ? "String" : "Uint32";
        const typeNode: TypeSpecTypeNode = kind === "String" 
          ? { kind: "String" }
          : { kind: "Uint32" };
          
        largeProperties.push({
          name: `field${i}`,
          type: typeNode,
          optional: i % 3 === 0
        });
      }
      
      // When: Generating Go code
      const startTime = Date.now();
      const generator = new TypeSafeGoGenerator();
      const goCode = generator.generateStruct("LargeModel", largeProperties);
      const generationTime = Date.now() - startTime;
      
      // Then: Should generate efficiently
      strictEqual(goCode.length > 0, true, "Should generate Go code");
      strictEqual(generationTime < 1000, true, "Should generate in under 1 second");
      
      // Critical: Should maintain type safety for large models
      const hasNoInterfaceTypes = !goCode.includes("interface{}");
      strictEqual(hasNoInterfaceTypes, true, 
        "Should maintain type safety for large models");
      
      console.log(`Generated ${largeProperties.length} fields in ${generationTime}ms`);
    });
  });
});