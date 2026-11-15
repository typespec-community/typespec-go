/**
 * Tests for TypeSpec.Go decorator consumption in generation:
 * @go.name, @go.type, @go.structTag on properties, and @error models
 * gaining an Error() string method.
 */

import { describe, expect, test } from "vitest";
import type { DecoratorContext, ModelProperty } from "@typespec/compiler";
import { renderGoContent } from "../testing/test-utils.js";
import { createModelWithProps, createProgram, createScalar } from "../testing/mock-factory.js";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";
import { $name, $structTag, $type } from "../emitter/go-decorators.js";

function contextFor(program: ReturnType<typeof createProgram>): DecoratorContext {
  return { program } as unknown as DecoratorContext;
}

function propertyNamed(model: ReturnType<typeof createModelWithProps>, name: string) {
  const prop = Array.from(model.properties.values()).find((p) => p.name === name);
  if (!prop) throw new Error(`property ${name} not found`);
  return prop as ModelProperty;
}

describe("TypeSpec.Go decorator consumption", () => {
  test("@go.name overrides the generated field name", () => {
    const program = createProgram();
    const model = createModelWithProps("User", [
      { name: "created_at", type: createScalar("utcDateTime") },
    ]);
    $name(contextFor(program), propertyNamed(model, "created_at"), "CreatedAtUTC");

    const result = renderGoContent(
      <GoStructDeclaration model={model} program={program} />,
      "models.go",
    );

    expect(result).toContain("CreatedAtUTC time.Time");
    expect(result).not.toContain("CreatedAt time.Time");
  });

  test("@go.type overrides the generated field type", () => {
    const program = createProgram();
    const model = createModelWithProps("Event", [
      { name: "happened_at", type: createScalar("offsetDateTime") },
    ]);
    $type(contextFor(program), propertyNamed(model, "happened_at"), "time.Time");

    const result = renderGoContent(
      <GoStructDeclaration model={model} program={program} />,
      "models.go",
    );

    expect(result).toContain("Happened_at time.Time");
  });

  test("@go.structTag overrides the generated struct tag", () => {
    const program = createProgram();
    const model = createModelWithProps("Item", [{ name: "id", type: createScalar("string") }]);
    $structTag(contextFor(program), propertyNamed(model, "id"), `json:"identifier" db:"pk"`);

    const result = renderGoContent(
      <GoStructDeclaration model={model} program={program} />,
      "models.go",
    );

    expect(result).toContain('ID string `json:"identifier" db:"pk"`');
    expect(result).not.toContain('json:"id"`');
  });

  test("@error model generates an Error() string method", () => {
    const model = createModelWithProps("Failure", [
      { name: "message", type: createScalar("string") },
    ]);
    (model as unknown as { decorators: unknown[] }).decorators = [
      { decorator: { name: "$error" } },
    ];

    const result = renderGoContent(<GoStructDeclaration model={model} />, "models.go");

    expect(result).toContain("type Failure struct");
    expect(result).toContain("func (e Failure) Error() string");
    expect(result).toContain("return e.Message");
  });

  test("non-error model does not generate an Error() method", () => {
    const model = createModelWithProps("Plain", [
      { name: "message", type: createScalar("string") },
    ]);

    const result = renderGoContent(<GoStructDeclaration model={model} />, "models.go");

    expect(result).toContain("type Plain struct");
    expect(result).not.toContain("Error() string");
  });
});
