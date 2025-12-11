import { describe, test, expect } from "vitest";
import { render, Output } from "@alloy-js/core";
import {
  SourceFile,
  ModuleDirectory,
  SourceDirectory,
  VariableDeclaration,
} from "@alloy-js/go";

describe("Debug Basic Rendering", () => {
  test("render simple Go component", () => {
    const result = render(
      <Output basePath="./">
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="test.go">
              <VariableDeclaration name="testVar" type="string">
                "Hello, World!"
              </VariableDeclaration>
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    console.log("Simple render result:", JSON.stringify(result, null, 2));
    expect(result).toBeDefined();
  });
});
