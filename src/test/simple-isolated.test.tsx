/**
 * Simple Test to isolate import issues
 */

import { test, expect } from "vitest";
import { GoModFile } from "../components/go/GoModFile.js";

test("Simple component test", () => {
  const result = GoModFile({
    modulePath: "github.com/test/api",
    goVersion: "1.21",
  });

  expect(result).toContain("module github.com/test/api");
  expect(result).toContain("go 1.21");
  console.log("✅ GoModFile test passed");
});