/**
 * Go Module File Generation Tests
 * Tests for go.mod file generation
 */

import { describe, it, expect } from "vitest";
import { Output, render } from "@alloy-js/core";
import type { OutputDirectory } from "@alloy-js/core";
import { GoModFile } from "../components/go/GoModFile.js";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";
import { MockFactory } from "../testing/mock-factory.js";

function collectFiles(dir: OutputDirectory): Array<{ path: string; content: string }> {
  const files: Array<{ path: string; content: string }> = [];
  for (const entry of dir.contents) {
    if (!("contents" in entry)) continue;
    if (Array.isArray(entry.contents)) {
      files.push(...collectFiles(entry as OutputDirectory));
    } else {
      files.push({ path: entry.path, content: entry.contents });
    }
  }
  return files;
}

describe("GoModFile Generation", () => {
  it("generates basic go.mod with module and go version", () => {
    const result = GoModFile({
      modulePath: "github.com/mycompany/api",
      goVersion: "1.21",
    });

    expect(result).toContain("module github.com/mycompany/api");
    expect(result).toContain("go 1.21");
  });

  it("generates go.mod with default go version", () => {
    const result = GoModFile({
      modulePath: "github.com/test/pkg",
    });

    expect(result).toContain("module github.com/test/pkg");
    expect(result).toContain("go 1.22");
  });

  it("generates go.mod with require statements", () => {
    const result = GoModFile({
      modulePath: "github.com/mycompany/api",
      goVersion: "1.22",
      requires: [
        { path: "github.com/google/uuid", version: "v1.6.0" },
        { path: "github.com/shopspring/decimal", version: "v1.3.1" },
      ],
    });

    expect(result).toContain("module github.com/mycompany/api");
    expect(result).toContain("go 1.22");
    expect(result).toContain("require (");
    expect(result).toContain("github.com/google/uuid v1.6.0");
    expect(result).toContain("github.com/shopspring/decimal v1.3.1");
    expect(result).toContain(")");
  });

  it("generates go.mod without require block when no dependencies", () => {
    const result = GoModFile({
      modulePath: "github.com/test/empty",
    });

    expect(result).not.toContain("require");
  });

  it("GoPackageDirectory emits go.mod as plain module text without a package clause", () => {
    const model = MockFactory.createModelWithProps("Widget", [
      { name: "id", type: MockFactory.createScalar("string") },
    ]);

    const tree = render(
      <Output>
        <GoPackageDirectory
          models={[model]}
          packageName="api"
          modulePath="example.com/sdk"
          generateGoMod={true}
        />
      </Output>,
    );
    const files = collectFiles(tree as OutputDirectory);
    const goMod = files.find((file) => file.path === "go.mod");

    expect(goMod).toBeDefined();
    expect(goMod?.content).toContain("module example.com/sdk");
    expect(goMod?.content).not.toContain("package ");
  });
});
