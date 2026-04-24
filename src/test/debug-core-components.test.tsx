import { describe, test, expect } from "vitest";
import { render, Output, code } from "@alloy-js/core";
import {
  SourceDirectory as CoreSourceDirectory,
  SourceFile as CoreSourceFile,
} from "@alloy-js/core";

describe("DEBUG - Core Components Only", () => {
  test("Using core SourceDirectory and SourceFile", () => {
    const result = render(
      <Output basePath="./test-output">
        <CoreSourceDirectory path="main">
          <CoreSourceFile path="test.go" filetype="go">
            {code`func main() {
    fmt.Println("Hello, World!")
}`}
          </CoreSourceFile>
        </CoreSourceDirectory>
      </Output>,
    );
    console.log("Core components result:", JSON.stringify(result, null, 2));
    expect(result).toBeDefined();
    expect(result.kind).toBe("directory");
    if (result.contents && result.contents.length > 0) {
      console.log("✅ SUCCESS: Files generated!");
      expect(result.contents.length).toBeGreaterThan(0);
    } else {
      console.log("❌ FAILED: Empty contents");
    }
  });
});
