import { describe, test, expect } from "vitest";
import { render, Output } from "@alloy-js/core";
import {
  GoSwitchSTC,
  GoCaseSTC,
  GoDefaultSTC,
  GoIfSTC,
  GoBlockSTC,
  GoStringLiteralSTC,
} from "../components/go";

describe("🔥 Go Core Helper Components - STC Version", () => {
  test("GoSwitch renders correctly", () => {
    const output = render(
      <Output>
        <GoSwitchSTC value="e">
          <GoCaseSTC value="User">
            <GoStringLiteralSTC value="fmt.Printf(&quot;user case&quot;)" />
          </GoCaseSTC>
          <GoDefaultSTC>
            <GoStringLiteralSTC value="fmt.Printf(&quot;default case&quot;)" />
          </GoDefaultSTC>
        </GoSwitchSTC>
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
        <GoIfSTC condition="x > 0">
          <GoStringLiteralSTC value="fmt.Printf(&quot;positive&quot;)" />
        </GoIfSTC>
      </Output>,
    );

    expect(output).toContain("if x > 0 {");
    expect(output).toContain("}");
  });

  test("GoIf with else renders correctly", () => {
    const output = render(
      <Output>
        <GoIfSTC condition="x > 0">
          <GoStringLiteralSTC value="fmt.Printf(&quot;positive&quot;)" />
        </GoIfSTC>
        <GoStringLiteralSTC value="fmt.Printf(&quot;non-positive&quot;)" />
      </Output>,
    );

    expect(output).toContain("if x > 0 {");
    expect(output).toContain("}");
  });

  test("GoBlock renders correctly", () => {
    const output = render(
      <Output>
        <GoBlockSTC>
          <GoStringLiteralSTC value="fmt.Printf(&quot;Hello&quot;)" />
        </GoBlockSTC>
      </Output>,
    );

    expect(output).toContain("{");
    expect(output).toContain("}");
  });

  test("GoBlock inline renders correctly", () => {
    const output = render(
      <Output>
        <GoBlockSTC inline>
          <GoStringLiteralSTC value="fmt.Printf(&quot;Inline&quot;)" />
        </GoBlockSTC>
      </Output>,
    );

    expect(output).toContain('fmt.Printf("Inline")');
  });

  test("GoStringLiteral renders quoted strings", () => {
    const output = render(
      <Output>
        <GoStringLiteralSTC value="Hello, World!" />
      </Output>,
    );

    expect(output).toBe('"Hello, World!"');
  });

  test("GoStringLiteral renders raw strings", () => {
    const output = render(
      <Output>
        <GoStringLiteralSTC value="C:\\path\\to\\file" raw />
      </Output>,
    );

    expect(output).toBe('`C:\\path\\to\\file`');
  });

  test("GoStringLiteral escapes quotes", () => {
    const output = render(
      <Output>
        <GoStringLiteralSTC value='Say "Hello"' />
      </Output>,
    );

    expect(output).toBe('"Say \\"Hello\\""');
  });
});