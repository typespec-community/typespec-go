import { describe, test, expect } from "vitest";
import { render, Output } from "@alloy-js/core";
import { renderGoContent } from "../testing/test-utils.js";
import {
  GoSwitchSTC,
  GoCaseSTC,
  GoDefaultSTC,
  GoIfSTC,
  GoBlockSTC,
  GoStringLiteralSTC,
} from "../components/go";

describe("🔥 Go Core Helper Components", () => {
  test("GoSwitch renders correctly", () => {
    const output = renderGoContent(
      <GoSwitchSTC value="e">
        <GoCaseSTC value="User">
          <GoStringLiteralSTC value='fmt.Printf("user case")' />
        </GoCaseSTC>
        <GoDefaultSTC>
          <GoStringLiteralSTC value='fmt.Printf("default case")' />
        </GoDefaultSTC>
      </GoSwitchSTC>
    );

    expect(output).toContain("package api");
    expect(output).toContain("switch e {");
    expect(output).toContain("case User:");
    expect(output).toContain("default:");
    expect(output).toContain("}");
  });

  test("GoIf renders correctly", () => {
    const output = renderGoContent(
      <GoIfSTC condition="x > 0">
        <GoStringLiteralSTC value='fmt.Printf("positive")' />
      </GoIfSTC>
    );

    expect(output).toContain("package api");
    expect(output).toContain("if x > 0 {");
    expect(output).toContain('"fmt.Printf(\\"positive\\")"');
    expect(output).toContain("}");
  });

  test("GoIf with else renders correctly", () => {
    const output = renderGoContent(
      <GoIfSTC condition="x > 0" else={<GoStringLiteralSTC value='fmt.Printf("negative")' />}>
        <GoStringLiteralSTC value='fmt.Printf("positive")' />
      </GoIfSTC>
    );

    expect(output).toContain("package api");
    expect(output).toContain("if x > 0 {");
    expect(output).toContain('"fmt.Printf(\\"positive\\")"');
    expect(output).toContain("} else {");
    expect(output).toContain('"fmt.Printf(\\"negative\\")"');
    expect(output).toContain("}");
  });

  test("GoBlock renders correctly", () => {
    const output = renderGoContent(
      <GoBlockSTC>
        <GoStringLiteralSTC value='fmt.Printf("test")' />
      </GoBlockSTC>
    );

    expect(output).toContain("package api");
    expect(output).toContain("{");
    expect(output).toContain('"fmt.Printf(\\"test\\")"');
    expect(output).toContain("}");
  });

  test("GoBlock inline renders correctly", () => {
    const output = renderGoContent(
      <GoBlockSTC inline>
        <GoStringLiteralSTC value='fmt.Printf("test")' />
      </GoBlockSTC>
    );

    expect(output).toContain("package api");
    expect(output).not.toContain("{");
    expect(output).not.toContain("}");
    expect(output).toContain('"fmt.Printf(\\"test\\")"');
  });

  test("GoStringLiteral renders quoted strings", () => {
    const output = renderGoContent(
      <GoStringLiteralSTC value="Hello, World!" />
    );
    expect(output).toContain("package api");
    expect(output).toContain('"Hello, World!"');
  });

  test("GoStringLiteral renders raw strings", () => {
    const output = renderGoContent(
      <GoStringLiteralSTC value="C:\\path\\to\\file" raw />
    );
    expect(output).toContain("package api");
    expect(output).toContain('`C:\\\\path\\\\to\\\\file`');
  });

  test("GoStringLiteral escapes quotes", () => {
    const output = renderGoContent(
      <GoStringLiteralSTC value='Say "Hello"' />
    );
    expect(output).toContain("package api");
    expect(output).toContain('"Say \\"Hello\\""');
  });
});
