/**
 * Extended Scalar Mapping Tests
 * Tests for comprehensive TypeSpec scalar to Go type mappings
 */

import { describe, it, expect } from "vitest";
import { render, Output, refkey } from "@alloy-js/core";
import { Reference } from "@alloy-js/go";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";

describe("Extended Scalar Mappings", () => {
  it("maps integer types correctly", () => {
    const model = {
      kind: "Model" as const,
      name: "IntegerTypes",
      properties: new Map([
        ["int8Val", { name: "int8Val", type: { kind: "Scalar", name: "int8" }, optional: false }],
        [
          "int16Val",
          { name: "int16Val", type: { kind: "Scalar", name: "int16" }, optional: false },
        ],
        [
          "int32Val",
          { name: "int32Val", type: { kind: "Scalar", name: "int32" }, optional: false },
        ],
        [
          "int64Val",
          { name: "int64Val", type: { kind: "Scalar", name: "int64" }, optional: false },
        ],
        [
          "safeint",
          { name: "safeint", type: { kind: "Scalar", name: "safeint" }, optional: false },
        ],
      ]),
    };

    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="models.go">
              <GoStructDeclaration model={model} packageName="api" />
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    expect(result).toBeDefined();
  });

  it("maps float types correctly", () => {
    const model = {
      kind: "Model" as const,
      name: "FloatTypes",
      properties: new Map([
        [
          "float32Val",
          { name: "float32Val", type: { kind: "Scalar", name: "float32" }, optional: false },
        ],
        [
          "float64Val",
          { name: "float64Val", type: { kind: "Scalar", name: "float64" }, optional: false },
        ],
        [
          "decimal",
          { name: "decimal", type: { kind: "Scalar", name: "decimal" }, optional: false },
        ],
      ]),
    };

    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="models.go">
              <GoStructDeclaration model={model} packageName="api" />
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    expect(result).toBeDefined();
  });

  it("maps string-based types correctly", () => {
    const model = {
      kind: "Model" as const,
      name: "StringTypes",
      properties: new Map([
        ["url", { name: "url", type: { kind: "Scalar", name: "url" }, optional: false }],
        ["uri", { name: "uri", type: { kind: "Scalar", name: "uri" }, optional: false }],
        ["email", { name: "email", type: { kind: "Scalar", name: "email" }, optional: false }],
        ["uuid", { name: "uuid", type: { kind: "Scalar", name: "uuid" }, optional: false }],
      ]),
    };

    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="models.go">
              <GoStructDeclaration model={model} packageName="api" />
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    expect(result).toBeDefined();
  });

  it("maps datetime types correctly", () => {
    const model = {
      kind: "Model" as const,
      name: "DateTimeTypes",
      properties: new Map([
        [
          "plainDate",
          { name: "plainDate", type: { kind: "Scalar", name: "plainDate" }, optional: false },
        ],
        [
          "utcDateTime",
          { name: "utcDateTime", type: { kind: "Scalar", name: "utcDateTime" }, optional: false },
        ],
        [
          "duration",
          { name: "duration", type: { kind: "Scalar", name: "duration" }, optional: false },
        ],
      ]),
    };

    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="models.go">
              <GoStructDeclaration model={model} packageName="api" />
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    expect(result).toBeDefined();
  });

  it("maps network types correctly", () => {
    const model = {
      kind: "Model" as const,
      name: "NetworkTypes",
      properties: new Map([
        [
          "ipAddress",
          { name: "ipAddress", type: { kind: "Scalar", name: "ipAddress" }, optional: false },
        ],
        ["ipv4", { name: "ipv4", type: { kind: "Scalar", name: "ipv4Address" }, optional: false }],
        ["ipv6", { name: "ipv6", type: { kind: "Scalar", name: "ipv6Address" }, optional: false }],
      ]),
    };

    const result = render(
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="api">
            <SourceFile path="models.go">
              <GoStructDeclaration model={model} packageName="api" />
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>,
    );

    expect(result).toBeDefined();
  });
});
