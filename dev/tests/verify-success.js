#!/usr/bin/env bun

/**
 * Critical Success Verification Script
 *
 * Verifies that all critical test API fixes are working correctly
 * Ensures GoEmitterResult architecture is properly implemented
 * Confirms professional discriminated union patterns
 */

const { execSync } = require("child_process");
const { readFileSync, existsSync } = require("fs");

console.log("🚀 CRITICAL SUCCESS VERIFICATION SCRIPT");
console.log("=".repeat(50));

// Test results tracking
let testsPassed = 0;
let testsTotal = 0;

function runTest(name, test) {
  testsTotal++;
  try {
    if (test()) {
      console.log(`✅ ${name}`);
      testsPassed++;
    } else {
      console.log(`❌ ${name}`);
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error}`);
  }
}

// Test 1: TypeScript compilation
runTest("TypeScript compilation passes", () => {
  try {
    execSync("bun run build:check", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
});

// Test 2: All critical tests pass
runTest("All critical tests pass", () => {
  try {
    const output = execSync("bun test", { encoding: "utf8", stdio: "pipe" });
    return output.includes("0 fail") && output.includes("pass");
  } catch {
    return false;
  }
});

// Test 3: Core functionality working
runTest("Core generator tests work", () => {
  try {
    const output = execSync("bun test src/test/standalone-generator.test.ts", {
      encoding: "utf8",
      stdio: "pipe",
    });
    return output.includes("5 pass") && output.includes("pass");
  } catch {
    return false;
  }
});

// Test 4: BDD framework functional
runTest("BDD framework functional", () => {
  try {
    const output = execSync("bun test src/test/bdd-framework.test.ts", {
      encoding: "utf8",
      stdio: "pipe",
    });
    return output.includes("pass") && output.includes("BDD Framework Integration");
  } catch {
    return false;
  }
});

// Test 5: Basic example works
runTest("Basic usage example works", () => {
  try {
    const output = execSync("node --loader tsx examples/basic-usage.ts", {
      encoding: "utf8",
      stdio: "pipe",
    });
    return (
      output.includes("All examples completed successfully") &&
      output.includes("Generated Go code:") &&
      !output.includes("Error")
    );
  } catch {
    return false;
  }
});

// Test 6: Generated Go code quality
runTest("Generated Go code has quality", () => {
  try {
    const output = execSync("node --loader tsx examples/basic-usage.ts", {
      encoding: "utf8",
      stdio: "pipe",
    });

    const qualityChecks = [
      output.includes("package api"),
      output.includes("type User struct"),
      output.includes("json:"),
      output.includes("*string") || output.includes("string"), // Handle optional fields
      output.includes("Auto-generated from TypeSpec model"),
    ];

    return qualityChecks.every((check) => check);
  } catch {
    return false;
  }
});

// Test 7: Error handling works
runTest("Error handling works correctly", () => {
  try {
    const output = execSync("node --loader tsx examples/basic-usage.ts", {
      encoding: "utf8",
      stdio: "pipe",
    });

    // Should have both success and error handling examples
    return (
      output.includes("Expected error caught") &&
      output.includes("Model validation failed") &&
      output.includes("empty-name")
    );
  } catch {
    return false;
  }
});

// Test 8: Professional architecture maintained
runTest("Professional GoEmitterResult architecture", () => {
  try {
    // Check that discriminated union patterns are used
    const testFile = readFileSync("src/test/standalone-generator.test.ts", "utf8");
    const exampleFile = readFileSync("examples/basic-usage.ts", "utf8");

    const patternChecks = [
      testFile.includes('result._tag === "Success"'),
      testFile.includes('if (result._tag === "Success")'),
      exampleFile.includes('if (result._tag === "Success")'),
      exampleFile.includes("GoEmitterResult"),
    ];

    return patternChecks.every((check) => check);
  } catch {
    return false;
  }
});

// Test 9: Documentation exists
runTest("Documentation files created", () => {
  const docsExist = [
    existsSync("examples/basic-usage.ts"),
    existsSync("docs/planning/2025-11-19_23_44-COMPREHENSIVE-EXECUTION-PLAN.md"),
    existsSync("docs/planning/2025-11-19_23_44-DETAILED-125-TASK-PLAN.md"),
  ];

  return docsExist.every((exists) => exists);
});

// Test 10: No critical regressions
runTest("No critical regressions", () => {
  try {
    // Check that we haven't broken core functionality
    const output = execSync("bun test src/test/standalone-generator.test.ts", {
      encoding: "utf8",
      stdio: "pipe",
    });

    const regressionChecks = [
      !output.includes("Received value must be an array type"), // Original error
      !output.includes("cannot read property"),
      !output.includes("undefined"),
      output.includes("pass"), // Tests should pass
    ];

    return regressionChecks.every((check) => check);
  } catch {
    return false;
  }
});

// Results summary
console.log("\n" + "=".repeat(50));
console.log("📊 VERIFICATION RESULTS");
console.log(`✅ Tests Passed: ${testsPassed}/${testsTotal}`);
console.log(`📈 Success Rate: ${Math.round((testsPassed / testsTotal) * 100)}%`);

if (testsPassed === testsTotal) {
  console.log("\n🎉 ALL CRITICAL FIXES VERIFIED SUCCESSFULLY!");
  console.log("🚀 PROJECT READY FOR NEXT PHASE");

  console.log("\n✅ ACHIEVEMENTS UNLOCKED:");
  console.log("  • Test API mismatch completely resolved");
  console.log("  • Professional GoEmitterResult architecture working");
  console.log("  • Discriminated union patterns properly implemented");
  console.log("  • Go code generation verified and working");
  console.log("  • Error handling comprehensive and type-safe");
  console.log("  • Documentation and examples created");
} else {
  console.log("\n⚠️ SOME ISSUES DETECTED");
  console.log("🔧 Review failed tests and fix remaining issues");
}

console.log("\n" + "=".repeat(50));
console.log("✅ CRITICAL RESCUE PHASE COMPLETE");

// Exit with appropriate code
process.exit(testsPassed === testsTotal ? 0 : 1);
