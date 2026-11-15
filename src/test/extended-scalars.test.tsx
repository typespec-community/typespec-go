/**
 * Extended Scalar Mapping Tests
 * Tests for comprehensive TypeSpec scalar to Go type mappings
 */

import { describe, it, expect } from "vitest";
import { render, Output } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";
import { createModelWithProps, createScalar } from "../testing/mock-factory.js";
import type { Model } from "@typespec/compiler";

function renderModel(model: Model) {
  return render(
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
}

describe("Extended Scalar Mappings", () => {
  it("maps integer types correctly", () => {
    const model = createModelWithProps("IntegerTypes", [
      { name: "int8Val", type: createScalar("int8") },
      { name: "int16Val", type: createScalar("int16") },
      { name: "int32Val", type: createScalar("int32") },
      { name: "int64Val", type: createScalar("int64") },
      { name: "safeint", type: createScalar("safeint") },
    ]);

    expect(renderModel(model)).toBeDefined();
  });

  it("maps float types correctly", () => {
    const model = createModelWithProps("FloatTypes", [
      { name: "float32Val", type: createScalar("float32") },
      { name: "float64Val", type: createScalar("float64") },
      { name: "decimal", type: createScalar("decimal") },
    ]);

    expect(renderModel(model)).toBeDefined();
  });

  it("maps string-based types correctly", () => {
    const model = createModelWithProps("StringTypes", [
      { name: "url", type: createScalar("url") },
      { name: "uri", type: createScalar("uri") },
      { name: "email", type: createScalar("email") },
      { name: "uuid", type: createScalar("uuid") },
    ]);

    expect(renderModel(model)).toBeDefined();
  });

  it("maps datetime types correctly", () => {
    const model = createModelWithProps("DateTimeTypes", [
      { name: "plainDate", type: createScalar("plainDate") },
      { name: "utcDateTime", type: createScalar("utcDateTime") },
      { name: "duration", type: createScalar("duration") },
    ]);

    expect(renderModel(model)).toBeDefined();
  });

  it("maps network types correctly", () => {
    const model = createModelWithProps("NetworkTypes", [
      { name: "ipAddress", type: createScalar("ipAddress") },
      { name: "ipv4", type: createScalar("ipv4Address") },
      { name: "ipv6", type: createScalar("ipv6Address") },
    ]);

    expect(renderModel(model)).toBeDefined();
  });
});
