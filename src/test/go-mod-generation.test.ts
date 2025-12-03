/**
 * Go Module File Generation Tests
 * Tests for go.mod file generation
 */

import { describe, it, expect } from "vitest";
import { GoModFile } from "../components/go/GoModFile.js";

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
    expect(result).toContain("go 1.21"); // Default version
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
});
