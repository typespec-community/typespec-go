import { describe, test, expect } from "vitest";
import { render, Output, code } from "@alloy-js/core";
import {
  GoSwitchSTC,
  GoCaseSTC,
  GoDefaultSTC,
  GoIfSTC,
  GoBlockSTC,
  GoStringLiteralSTC,
} from "../components/go";
import { renderGoContent } from "../testing/test-utils.js";

describe("🔥 Go Core Helper Components - STC Version", () => {
  test("GoSwitch renders correctly", () => {
    const output = renderGoContent(
      <GoSwitchSTC value="e">
        <GoCaseSTC value="User">
          <GoStringLiteralSTC value='fmt.Printf("user case")' />
        </GoCaseSTC>
        <GoDefaultSTC>
          <GoStringLiteralSTC value='fmt.Printf("default case")' />
        </GoDefaultSTC>
      </GoSwitchSTC>,
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
      </GoIfSTC>,
    );

    expect(output).toContain("package api");
    expect(output).toContain("if x > 0 {");
    expect(output).toContain("}");
  });

  test("GoIf with else renders correctly", () => {
    // First test with simple strings
    const simpleOutput = renderGoContent(
      <GoIfSTC condition="x > 0" else={code`fmt.Println("negative")`}>
        {code`fmt.Println("positive")`}
      </GoIfSTC>,
    );

    expect(simpleOutput).toContain("package api");
    expect(simpleOutput).toContain("if x > 0 {");
    expect(simpleOutput).toContain('fmt.Println("positive")');
    expect(simpleOutput).toContain("else {");
    expect(simpleOutput).toContain('fmt.Println("negative")');

    // Then test with GoStringLiteral components
    const output = renderGoContent(
      <GoIfSTC condition="x > 0" else={<GoStringLiteralSTC value="negative" />}>
        <GoStringLiteralSTC value="positive" />
      </GoIfSTC>,
    );

    expect(output).toContain("package api");
    expect(output).toContain("if x > 0 {");
    expect(output).toContain('"positive"');
    expect(output).toContain("else {");
    expect(output).toContain('"negative"');
  });

  test("GoBlock renders correctly", () => {
    const output = renderGoContent(
      <GoBlockSTC>
        <GoStringLiteralSTC value='fmt.Printf("Hello")' />
      </GoBlockSTC>,
    );

    expect(output).toContain("package api");
    expect(output).toContain("{");
    expect(output).toContain("}");
  });

  test("GoBlock inline renders correctly", () => {
    const output = renderGoContent(
      <GoBlockSTC inline>
        <GoStringLiteralSTC value="Inline" />
      </GoBlockSTC>,
    );

    expect(output).toContain("package api");
    expect(output).toContain('"Inline"');
  });

  test("GoStringLiteral renders quoted strings", () => {
    const output = renderGoContent(<GoStringLiteralSTC value="Hello, World!" />);

    expect(output).toContain("package api");
    expect(output).toContain('"Hello, World!"');
  });

  test("GoStringLiteral renders raw strings", () => {
    const output = renderGoContent(<GoStringLiteralSTC value="C:\\path\\to\\file" raw />);

    expect(output).toContain("package api");
    // Should render as Go raw string with proper escaping
    expect(output).toContain("`C:\\\\path\\\\to\\\\file`");
  });

  test("GoStringLiteral escapes quotes", () => {
    const output = renderGoContent(<GoStringLiteralSTC value='Say "Hello"' />);

    expect(output).toContain("package api");
    expect(output).toContain('"Say \\"Hello\\""');
  });
});
