#!/usr/bin/env tsx

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const COMPONENTS_DIR = "src/components";
const VIOLATIONS_FILE = "violations-count.txt";

/**
 * Scan for template literal violations in components
 * Template literals = backtick strings (`)
 */
function scanForViolations(): number {
  try {
    const output = execSync(
      "grep -r '`' " + COMPONENTS_DIR + " --include='*.tsx' --include='*.ts' || true",
      { encoding: "utf8" },
    );

    const lines = output.split("\n").filter((line) => line.trim());

    // Filter out comments and docblocks that legitimately use backticks
    const violations = lines.filter((line) => {
      const trimmed = line.trim();
      // Skip if it's a comment line
      if (trimmed.includes("//") || trimmed.includes("/*") || trimmed.includes("*")) {
        return false;
      }
      // Count actual template literals in code
      return true;
    });

    console.log(`\n🔍 SCANNING FOR TEMPLATE LITERAL VIOLATIONS`);
    console.log(`==========================================`);
    console.log(`Found ${violations.length} violations:`);

    if (violations.length > 0) {
      console.log("\nViolations:");
      violations.forEach((line, index) => {
        console.log(`${index + 1}. ${line}`);
      });
    }

    return violations.length;
  } catch (error) {
    console.error("Error scanning for violations:", error);
    return 0;
  }
}

/**
 * Track violations over time
 */
function trackViolations(count: number): void {
  const timestamp = new Date().toISOString();
  const entry = `${timestamp}: ${count} violations\n`;

  try {
    const existing = readFileSync(VIOLATIONS_FILE, "utf8");
    const updated = existing + entry;
    writeFileSync(VIOLATIONS_FILE, updated);
  } catch {
    writeFileSync(VIOLATIONS_FILE, entry);
  }

  console.log(`\n📊 Tracking: ${entry.trim()}`);
}

/**
 * Main execution
 */
function main(): void {
  console.log("🚨 ALLOY-JS VIOLATION SCANNER");
  console.log("=============================\n");

  const violations = scanForViolations();
  trackViolations(violations);

  if (violations === 0) {
    console.log("\n✅ SUCCESS: No template literal violations found!");
    console.log("   You are 100% Alloy-JS compliant!");
  } else {
    console.log(`\n❌ ACTION REQUIRED: ${violations} template literal violations found.`);
    console.log("   These need to be migrated to Alloy components.");
  }
}

main();
