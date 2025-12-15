import { describe, test, expect } from "vitest";
import { render } from "@alloy-js/core";
import { GoStringLiteral } from "../components/go/index.js";

describe("DEBUG - Isolated Component Test", () => {
  test("GoStringLiteral renders directly without Output", () => {
    // Test component directly, not wrapped in Output structure
    const result = render(<GoStringLiteral value="Hello, World!" />);
    console.log("🔍 Direct render result:", JSON.stringify(result, null, 2));

    // Should render as a code template literal
    expect(result).toBeDefined();
  });

  test("simple code template literal", () => {
    // Test basic code template literal
    const result = render`"Hello, World!"`;
    console.log("🔍 Code template result:", JSON.stringify(result, null, 2));

    // Should render as a code template literal
    expect(result).toBeDefined();
  });
});
