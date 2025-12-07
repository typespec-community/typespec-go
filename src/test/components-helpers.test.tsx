import { describe, test, expect } from "vitest";
import { render, Output } from "@alloy-js/core";
import {
  GoSwitch,
  GoCase,
  GoDefault,
  GoIf,
  GoBlock,
  GoStringLiteral,
} from "../components/go/core/index.js";

describe("🔥 Go Core Helper Components", () => {
  test("GoSwitch renders correctly", () => {
    const output = render(
      <Output>
        <GoSwitch value="e">
          <GoCase value="User">
            <GoStringLiteral value='fmt.Printf("user case")' />
          </GoCase>
          <GoDefault>
            <GoStringLiteral value='fmt.Printf("default case")' />
          </GoDefault>
        </GoSwitch>
      </Output>,
    );

    expect(output).toContain("switch e {");
    expect(output).toContain("case User:");
    expect(output).toContain("default:");
    expect(output).toContain("}");
  });

  test("GoIf renders correctly", () => {
    const output = render(
      <Output>
        <GoIf condition="x > 0">
          <GoStringLiteral value='fmt.Printf("positive")' />
        </GoIf>
      </Output>,
    );

    expect(output).toContain("if x > 0 {");
    expect(output).toContain("}");
  });

  test("GoIf with else renders correctly", () => {
    const output = render(
      <Output>
        <GoIf condition="x > 0">
          <GoStringLiteral value='fmt.Printf("positive")' />
          else={<GoStringLiteral value='fmt.Printf("negative")' />}
        </GoIf>
      </Output>,
    );

    expect(output).toContain("if x > 0 {");
    expect(output).toContain("} else {");
    expect(output).toContain("}");
  });

  test("GoBlock renders correctly", () => {
    const output = render(
      <Output>
        <GoBlock>
          <GoStringLiteral value='fmt.Printf("test")' />
        </GoBlock>
      </Output>,
    );

    expect(output).toContain("{");
    expect(output).toContain("}");
  });

  test("GoBlock inline renders correctly", () => {
    const output = render(
      <Output>
        <GoBlock inline>
          <GoStringLiteral value='fmt.Printf("test")' />
        </GoBlock>
      </Output>,
    );

    expect(output).not.toContain("{");
    expect(output).not.toContain("}");
  });

  test("GoStringLiteral renders quoted strings", () => {
    const output = render(
      <Output>
        <GoStringLiteral value="Hello, World!" />
      </Output>,
    );
    expect(output).toBe('"Hello, World!"');
  });

  test("GoStringLiteral renders raw strings", () => {
    const output = render(
      <Output>
        <GoStringLiteral value="C:\path\to\file" raw />
      </Output>,
    );
    expect(output).toBe("`C:\\path\\to\\file`");
  });

  test("GoStringLiteral escapes quotes", () => {
    const output = render(
      <Output>
        <GoStringLiteral value='Say "Hello"' />
      </Output>,
    );
    expect(output).toBe('"Say \\"Hello\\""');
  });
});
