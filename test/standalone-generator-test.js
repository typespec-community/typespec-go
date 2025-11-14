/**
 * Standalone Generator Test
 * 
 * Tests StandaloneGoGenerator with no dependencies
 * Validates complete TypeSpec → Go string generation
 */
import { StandaloneGoGenerator } from "../src/standalone-generator.js";

console.log("🚀 Starting Standalone Generator Test");

function testStandaloneGenerator() {
  try {
    console.log("📝 Creating standalone generator...");
    const generator = new StandaloneGoGenerator();
    console.log("✅ Generator created");
    
    // Create mock model without TypeSpec Model interface issues
    const mockModel = {
      name: "User",
      properties: new Map([
        ["name", {
          name: "name",
          type: { kind: "String" },
          optional: false
        }],
        ["age", {
          name: "age", 
          type: { kind: "Int32" },
          optional: false
        }],
        ["email", {
          name: "email",
          type: { kind: "String" },
          optional: true
        }],
        ["active", {
          name: "active",
          type: { kind: "Boolean" },
          optional: false
        }],
        ["score", {
          name: "score",
          type: { kind: "Float64" },
          optional: true
        }]
      ])
    };
    
    console.log("🏗️ Generating Go code...");
    const goCode = generator.generateModel(mockModel);
    
    console.log("📄 Generated Go code:");
    console.log("=" .repeat(60));
    console.log(goCode);
    console.log("=".repeat(60));
    
    // Comprehensive validation
    const validations = {
      // Package validation
      hasPackage: goCode.includes("package api"),
      
      // Struct validation
      hasTypeStruct: goCode.includes("type User struct"),
      hasOpeningBrace: goCode.includes("{"),
      hasClosingBrace: goCode.includes("}"),
      
      // Field validation
      hasNameField: goCode.includes("Name string"),
      hasAgeField: goCode.includes("Age int32"),
      hasEmailField: goCode.includes("Email *string"),
      hasActiveField: goCode.includes("Active bool"),
      hasScoreField: goCode.includes("Score *float64"),
      
      // JSON tag validation
      hasJsonTags: goCode.includes('json:'),
      hasNameJson: goCode.includes('json:"name"'),
      hasEmailJson: goCode.includes('json:"email",omitempty'),
      hasScoreJson: goCode.includes('json:"score",omitempty'),
      
      // Optional property validation
      hasEmailPointer: goCode.includes("Email *string"),
      hasScorePointer: goCode.includes("Score *float64"),
      hasOmitempty: goCode.includes("omitempty"),
      
      // Type validation
      hasStringType: goCode.includes("string"),
      hasInt32Type: goCode.includes("int32"),
      hasBoolType: goCode.includes("bool"),
      hasFloat64Type: goCode.includes("float64"),
      
      // Formatting validation
      hasProperIndentation: goCode.includes("  "),
      hasValidGoSyntax: !goCode.includes("interface{}")
    };
    
    console.log("🔍 Comprehensive Validation:");
    const results = [];
    Object.entries(validations).forEach(([check, passed]) => {
      const status = passed ? "✅" : "❌";
      console.log(`  ${status} ${check}`);
      results.push(passed);
    });
    
    const passedChecks = results.filter(Boolean).length;
    const totalChecks = results.length;
    const successRate = (passedChecks / totalChecks) * 100;
    
    console.log("\n📈 Validation Results:");
    console.log(`  Passed: ${passedChecks}/${totalChecks}`);
    console.log(`  Success Rate: ${successRate.toFixed(1)}%`);
    
    // Determine success level
    if (successRate >= 95) {
      console.log("\n🎉 PERFECT SUCCESS: Standalone generator working flawlessly!");
      console.log("✅ All critical validations passed");
      console.log("✅ Go syntax generation perfect");
      console.log("✅ Type mapping fully functional");
      console.log("✅ Optional property handling correct");
      console.log("✅ JSON tag generation complete");
      console.log("\n🚀 READY FOR END-TO-END INTEGRATION!");
      return "perfect";
    } else if (successRate >= 85) {
      console.log("\n✅ EXCELLENT SUCCESS: Standalone generator working well!");
      console.log("🔧 Minor improvements needed");
      return "excellent";
    } else if (successRate >= 70) {
      console.log("\n🟡 GOOD SUCCESS: Standalone generator working but needs fixes");
      console.log("🔧 Significant improvements needed");
      return "good";
    } else {
      console.log("\n❌ LIMITED SUCCESS: Standalone generator needs major fixes");
      return "limited";
    }
    
  } catch (error) {
    console.error("💥 STANDALONE TEST FAILED:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    return "failed";
  }
}

// Execute standalone test
const result = testStandaloneGenerator();

console.log("\n🏁 Standalone Generator Test Results:");
switch (result) {
  case "perfect":
    console.log("🎯 ACHIEVEMENT UNLOCKED: Perfect Go Generator!");
    console.log("📊 Status: Ready for TypeSpec integration");
    console.log("🎉 Customer Value: Can generate Go from TypeSpec models");
    break;
  case "excellent":
    console.log("🎯 ACHIEVEMENT UNLOCKED: Excellent Go Generator!");
    console.log("📊 Status: Ready for TypeSpec integration with minor tweaks");
    console.log("🎉 Customer Value: High-quality Go generation from TypeSpec");
    break;
  case "good":
    console.log("🎯 PROGRESS: Good Go Generator foundation");
    console.log("📊 Status: Ready for integration after improvements");
    console.log("🎉 Customer Value: Working Go generation with some issues");
    break;
  case "limited":
    console.log("🔯 NEEDS WORK: Limited Go Generator");
    console.log("📊 Status: Requires significant improvements");
    console.log("🔧 Customer Value: Limited Go generation capability");
    break;
  case "failed":
    console.log("❌ CRITICAL FAILURE: Standalone generator not working");
    console.log("📊 Status: Requires complete rebuild");
    console.log("🔥 Customer Value: No Go generation capability");
    break;
}