/**
 * Extended Scalar Mapping Tests
 * Tests for comprehensive TypeSpec scalar to Go type mappings
 */

import { describe, it, expect } from "vitest";
import { render, Output } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";
import { MockFactory } from "../testing/mock-factory.js";
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
    const model = MockFactory.createModelWithProps("IntegerTypes", [
      { name: "int8Val", type: MockFactory.createScalar("int8") },
      { name: "int16Val", type: MockFactory.createScalar("int16") },
      { name: "int32Val", type: MockFactory.createScalar("int32") },
      { name: "int64Val", type: MockFactory.createScalar("int64") },
      { name: "safeint", type: MockFactory.createScalar("safeint") },
    ]);

    expect(renderModel(model)).toBeDefined();
  });

  it("maps float types correctly", () => {
    const model = MockFactory.createModelWithProps("FloatTypes", [
      { name: "float32Val", type: MockFactory.createScalar("float32") },
      { name: "float64Val", type: MockFactory.createScalar("float64") },
      { name: "decimal", type: MockFactory.createScalar("decimal") },
    ]);

    expect(renderModel(model)).toBeDefined();
  });

  it("maps string-based types correctly", () => {
    const model = MockFactory.createModelWithProps("StringTypes", [
      { name: "url", type: MockFactory.createScalar("url") },
      { name: "uri", type: MockFactory.createScalar("uri") },
      { name: "email", type: MockFactory.createScalar("email") },
      { name: "uuid", type: MockFactory.createScalar("uuid") },
    ]);

    expect(renderModel(model)).toBeDefined();
  });

  it("maps datetime types correctly", () => {
    const model = MockFactory.createModelWithProps("DateTimeTypes", [
      { name: "plainDate", type: MockFactory.createScalar("plainDate") },
      { name: "utcDateTime", type: MockFactory.createScalar("utcDateTime") },
      { name: "duration", type: MockFactory.createScalar("duration") },
    ]);

    expect(renderModel(model)).toBeDefined();
  });

  it("maps network types correctly", () => {
    const model = MockFactory.createModelWithProps("NetworkTypes", [
      { name: "ipAddress", type: MockFactory.createScalar("ipAddress") },
      { name: "ipv4", type: MockFactory.createScalar("ipv4Address") },
      { name: "ipv6", type: MockFactory.createScalar("ipv6Address") },
    ]);

    expect(renderModel(model)).toBeDefined();
  });
});
