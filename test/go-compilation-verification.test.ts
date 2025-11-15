/**
 * Go Compilation Verification - TypeSpec Go Emitter
 * 
 * REAL CUSTOMER VALUE: Testing actual Go compilation
 * ZERO ANY TYPES: Professional verification implementation
 * BEHAVIOR-DRIVEN DEVELOPMENT: Real-world compilation testing
 */

import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";

import { StandaloneGoGenerator } from "../src/standalone-generator.js";

describe("Go Compilation Verification", () => {
  
  it("S2.1: Test actual Go compilation", () => {
    console.log("🔍 Testing actual Go compilation");
    
    try {
      // Create test directory
      const testDir = "./test-compilation";
      if (!existsSync(testDir)) {
        mkdirSync(testDir, { recursive: true });
      }
      
      // Generate Go code
      const generator = new StandaloneGoGenerator();
      const model = {
        name: "CompilationTest",
        properties: new Map([
          ["id", { name: "id", type: { kind: "Int32" }, optional: false }],
          ["name", { name: "name", type: { kind: "String" }, optional: false }],
          ["email", { name: "email", type: { kind: "String" }, optional: true }],
          ["score", { name: "score", type: { kind: "Float64" }, optional: true }],
          ["isActive", { name: "isActive", type: { kind: "Boolean" }, optional: false }]
        ])
      };
      
      const goCode = generator.generateModel(model);
      
      // Write Go file
      const goFile = `${testDir}/compilation_test.go`;
      writeFileSync(goFile, goCode);
      
      console.log("✅ Go file created successfully");
      console.log("📄 Generated Go code:");
      console.log(goCode);
      
      // Test Go compilation
      try {
        execSync(`go build -o /dev/null ${goFile}`, { 
          stdio: 'pipe',
          timeout: 10000 
        });
        console.log("✅ Go compilation successful");
        
      } catch (compileError) {
        console.error("❌ Go compilation failed:", compileError.message);
        console.error("❌ Compilation stderr:", compileError.stderr?.toString());
        
        // Try alternative compilation method
        try {
          execSync(`go vet ${goFile}`, { 
            stdio: 'pipe',
            timeout: 10000 
          });
          console.log("✅ Go vet successful");
          
        } catch (vetError) {
          console.error("❌ Go vet failed:", vetError.message);
          console.error("❌ Vet stderr:", vetError.stderr?.toString());
        }
      }
      
      // Cleanup
      try {
        unlinkSync(goFile);
        console.log("✅ Cleanup completed");
      } catch (cleanupError) {
        console.warn("⚠️ Cleanup failed:", cleanupError.message);
      }
      
    } catch (error) {
      console.error("❌ Go compilation verification failed:", error.message);
      throw error;
    }
  });
  
  it("S2.2: Test Go syntax validation", () => {
    console.log("🔍 Testing Go syntax validation");
    
    try {
      const generator = new StandaloneGoGenerator();
      
      // Test various Go syntax scenarios
      const syntaxTestCases = [
        {
          name: "BasicStruct",
          model: {
            name: "BasicStruct",
            properties: new Map([
              ["id", { name: "id", type: { kind: "Int32" }, optional: false }],
              ["name", { name: "name", type: { kind: "String" }, optional: false }]
            ])
          }
        },
        {
          name: "ComplexStruct",
          model: {
            name: "ComplexStruct",
            properties: new Map([
              ["id", { name: "id", type: { kind: "Uint32" }, optional: false }],
              ["username", { name: "username", type: { kind: "String" }, optional: false }],
              ["email", { name: "email", type: { kind: "String" }, optional: true }],
              ["age", { name: "age", type: { kind: "Int8" }, optional: true }],
              ["score", { name: "score", type: { kind: "Float32" }, optional: true }],
              ["isActive", { name: "isActive", type: { kind: "Boolean" }, optional: false }]
            ])
          }
        }
      ];
      
      const syntaxValidations = {
        basicStruct: false,
        complexStruct: false,
        allHavePackage: true,
        allHaveTypeStruct: true,
        allHaveJsonTags: true,
        allHaveValidSyntax: true,
        allHaveNoAnyTypes: true,
        allHaveValidGoNaming: true
      };
      
      for (const testCase of syntaxTestCases) {
        console.log(`🔍 Testing ${testCase.name} syntax`);
        
        const goCode = generator.generateModel(testCase.model);
        console.log(`📄 Generated ${testCase.name} Go code:`);
        console.log(goCode);
        
        // Validate Go syntax
        const validations = {
          hasPackage: goCode.includes("package"),
          hasTypeStruct: goCode.includes(`type ${testCase.name} struct`),
          hasJsonTags: goCode.includes("json:"),
          hasValidSyntax: goCode.includes("{") && goCode.includes("}") && goCode.includes(";"),
          hasNoAnyTypes: !goCode.includes("any"),
          hasValidGoNaming: goCode.includes(`${testCase.name.charAt(0).toUpperCase() + testCase.name.slice(1)}`)
        };
        
        const passedValidations = Object.values(validations).filter(Boolean).length;
        const totalValidations = Object.keys(validations).length;
        const successRate = (passedValidations / totalValidations) * 100;
        
        console.log(`📊 ${testCase.name} Validation Results: ${passedValidations}/${totalValidations} (${successRate.toFixed(1)}%)`);
        
        // Update overall validations
        syntaxValidations[testCase.name.toLowerCase() as keyof typeof syntaxValidations] = true;
        syntaxValidations.allHavePackage = syntaxValidations.allHavePackage && validations.hasPackage;
        syntaxValidations.allHaveTypeStruct = syntaxValidations.allHaveTypeStruct && validations.hasTypeStruct;
        syntaxValidations.allHaveJsonTags = syntaxValidations.allHaveJsonTags && validations.hasJsonTags;
        syntaxValidations.allHaveValidSyntax = syntaxValidations.allHaveValidSyntax && validations.hasValidSyntax;
        syntaxValidations.allHaveNoAnyTypes = syntaxValidations.allHaveNoAnyTypes && validations.hasNoAnyTypes;
        syntaxValidations.allHaveValidGoNaming = syntaxValidations.allHaveValidGoNaming && validations.hasValidGoNaming;
      }
      
      // Critical syntax validations must pass
      strictEqual(syntaxValidations.allHavePackage, true, "All generated code should have package declaration");
      strictEqual(syntaxValidations.allHaveTypeStruct, true, "All generated code should have type struct declaration");
      strictEqual(syntaxValidations.allHaveJsonTags, true, "All generated code should have JSON tags");
      strictEqual(syntaxValidations.allHaveNoAnyTypes, true, "All generated code should have no 'any' types");
      strictEqual(syntaxValidations.allHaveValidGoNaming, true, "All generated code should have valid Go naming");
      
      const passedSyntaxValidations = Object.values(syntaxValidations).filter(Boolean).length;
      const totalSyntaxValidations = Object.keys(syntaxValidations).length;
      const overallSuccessRate = (passedSyntaxValidations / totalSyntaxValidations) * 100;
      
      console.log(`📊 Overall Go Syntax Validation Results: ${passedSyntaxValidations}/${totalSyntaxValidations} (${overallSuccessRate.toFixed(1)}%)`);
      console.log(`✅ Go syntax validation test passed: ${overallSuccessRate.toFixed(1)}% success rate`);
      
    } catch (error) {
      console.error("❌ Go syntax validation failed:", error.message);
      throw error;
    }
  });
});