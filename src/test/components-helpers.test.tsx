import { describe, test, expect } from "vitest";
import { render } from "@alloy-js/core";
import { GoSwitch, GoCase, GoDefault, GoIf, GoBlock, GoStringLiteral } from "../components/go/core/index.js";

describe("🔥 Go Core Helper Components", () => {
  test("GoSwitch renders correctly", () => {
    const output = render(
      <GoSwitch value="e">
        <GoCase value="User">
          <fmt.Printf>user case</fmt.Printf>
        </GoCase>
        <GoDefault>
          <fmt.Printf>default case</fmt.Printf>
        </GoDefault>
      </GoSwitch>
    );
    
    expect(output).toContain("switch e {");
    expect(output).toContain("case User:");
    expect(output).toContain("default:");
    expect(output).toContain("}");
  });

  test("GoIf renders correctly", () => {
    const output = render(
      <GoIf condition="x > 0">
        <fmt.Printf>positive</fmt.Printf>
      </GoIf>
    );
    
    expect(output).toContain("if x > 0 {");
    expect(output).toContain("}");
  });

  test("GoIf with else renders correctly", () => {
    const output = render(
      <GoIf condition="x > 0">
        <fmt.Printf>positive</fmt.Printf>
        else={<fmt.Printf>negative</fmt.Printf>}
      </GoIf>
    );
    
    expect(output).toContain("if x > 0 {");
    expect(output).toContain("} else {");
    expect(output).toContain("}");
  });

  test("GoBlock renders correctly", () => {
    const output = render(
      <GoBlock>
        <fmt.Printf>test</fmt.Printf>
      </GoBlock>
    );
    
    expect(output).toContain("{");
    expect(output).toContain("}");
  });

  test("GoBlock inline renders correctly", () => {
    const output = render(
      <GoBlock inline>
        <fmt.Printf>test</fmt.Printf>
      </GoBlock>
    );
    
    expect(output).not.toContain("{");
    expect(output).not.toContain("}");
  });

  test("GoStringLiteral renders quoted strings", () => {
    const output = render(<GoStringLiteral value="Hello, World!" />);
    expect(output).toBe('"Hello, World!"');
  });

  test("GoStringLiteral renders raw strings", () => {
    const output = render(<GoStringLiteral value="C:\path\to\file" raw />);
    expect(output).toBe("`C:\\path\\to\\file`");
  });

  test("GoStringLiteral escapes quotes", () => {
    const output = render(<GoStringLiteral value='Say "Hello"' />);
    expect(output).toBe('"Say \\"Hello\\""');
  });
});