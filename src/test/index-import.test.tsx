/**
 * Test index.tsx import issues
 */

import { test, expect } from "vitest";

test("Index import test", async () => {
  try {
    const testModule = await import("../components/go/index.js");
    console.log("✅ Index import successful:", Object.keys(testModule));
    expect(testModule).toBeDefined();
    expect(testModule.GoModFile).toBeDefined();
    expect(testModule.GoStructDeclaration).toBeDefined();
  } catch (error) {
    console.error("❌ Index import failed:", error);
    throw error;
  }
});
