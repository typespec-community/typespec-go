/**
 * Tests for the T05–T07 decorator surface: @go.nullable modes, @go.enumMode
 * shapes, and @go.name on type declarations and operations.
 */

import { describe, expect, test } from "vitest";
import type { DecoratorContext, EnumMember, ModelProperty, Operation } from "@typespec/compiler";
import { renderGoContent } from "../testing/test-utils.js";
import { MockFactory } from "../testing/mock-factory.js";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";
import { GoEnumDeclaration } from "../components/go/GoEnumDeclaration.js";
import { GoInterfaceDeclaration } from "../components/go/GoInterfaceDeclaration.js";
import { $enumMode, $name, $nullable, $structTag } from "../emitter/go-decorators.js";

function contextFor(program: ReturnType<typeof MockFactory.createProgram>): DecoratorContext {
  return { program } as unknown as DecoratorContext;
}

function propertyNamed(model: ReturnType<typeof MockFactory.createModelWithProps>, name: string) {
  const prop = Array.from(model.properties.values()).find((p) => p.name === name);
  if (!prop) throw new Error(`property ${name} not found`);
  return prop as ModelProperty;
}

function enumMemberNamed(name: string): EnumMember {
  return { kind: "EnumMember", name } as unknown as EnumMember;
}

describe("@go.nullable consumption", () => {
  test("pointer mode turns an optional scalar into a pointer", () => {
    const program = MockFactory.createProgram();
    const model = MockFactory.createModelWithProps("Note", [
      { name: "body", type: MockFactory.createScalar("string"), optional: true },
    ]);
    $nullable(contextFor(program), propertyNamed(model, "body"), enumMemberNamed("pointer"));

    const result = renderGoContent(
      <GoStructDeclaration model={model} program={program} />,
      "models.go",
    );

    expect(result).toContain("Body *string");
  });

  test("zeroValue mode keeps an optional scalar flat", () => {
    const program = MockFactory.createProgram();
    const model = MockFactory.createModelWithProps("Note", [
      { name: "body", type: MockFactory.createScalar("string"), optional: true },
    ]);
    $nullable(contextFor(program), propertyNamed(model, "body"), enumMemberNamed("zeroValue"));

    const result = renderGoContent(
      <GoStructDeclaration model={model} program={program} />,
      "models.go",
    );

    expect(result).toContain("Body string");
    expect(result).not.toContain("*string");
  });

  test("default (no decorator) keeps optional scalars flat and models pointed", () => {
    const program = MockFactory.createProgram();
    const scalar = MockFactory.createModelWithProps("Plain", [
      { name: "note", type: MockFactory.createScalar("string"), optional: true },
    ]);
    const inner = MockFactory.createModelWithProps("Inner", []);
    const holder = MockFactory.createModelWithProps("Holder", [
      { name: "inner", type: inner, optional: true },
    ]);

    const scalarOut = renderGoContent(
      <GoStructDeclaration model={scalar} program={program} />,
      "models.go",
    );
    const nestedOut = renderGoContent(
      <>
        <GoStructDeclaration model={inner} program={program} />
        <GoStructDeclaration model={holder} program={program} />
      </>,
      "models.go",
    );

    expect(scalarOut).toContain("Note string");
    expect(nestedOut).toContain("*Inner");
  });
});

describe("@go.enumMode consumption", () => {
  const priorityMembers = [
    { name: "low", value: 0 },
    { name: "high", value: 1 },
  ];

  test("iota mode renders int-backed iota constants", () => {
    const program = MockFactory.createProgram();
    const enumType = MockFactory.createEnum("Priority", priorityMembers);
    $enumMode(contextFor(program), enumType, enumMemberNamed("iota"));

    const result = renderGoContent(<GoEnumDeclaration enum={enumType} program={program} />);

    expect(result).toContain("type Priority int");
    expect(result).toContain("PriorityLow Priority = iota");
    expect(result).not.toContain("String() string");
  });

  test("string mode on a numeric enum renders string constants", () => {
    const program = MockFactory.createProgram();
    const enumType = MockFactory.createEnum("Level", priorityMembers);
    $enumMode(contextFor(program), enumType, enumMemberNamed("string"));

    const result = renderGoContent(<GoEnumDeclaration enum={enumType} program={program} />);

    expect(result).toContain("type Level string");
    expect(result).toContain('LevelLow  Level = "low"');
    expect(result).not.toContain('"0"');
  });

  test("name mode uses member names as the constant values", () => {
    const program = MockFactory.createProgram();
    const enumType = MockFactory.createEnum("Kind", [{ name: "alpha", value: 0 }]);
    $enumMode(contextFor(program), enumType, enumMemberNamed("name"));

    const result = renderGoContent(<GoEnumDeclaration enum={enumType} program={program} />);

    expect(result).toContain('KindAlpha Kind = "alpha"');
  });
});

describe("@go.name on declarations", () => {
  test("overrides a model type name", () => {
    const program = MockFactory.createProgram();
    const model = MockFactory.createModelWithProps("user_dto", [
      { name: "id", type: MockFactory.createScalar("string") },
    ]);
    $name(contextFor(program), model, "UserDTO");

    const result = renderGoContent(
      <GoStructDeclaration model={model} program={program} />,
      "models.go",
    );

    expect(result).toContain("type UserDTO struct");
    expect(result).not.toContain("type User_dto struct");
  });

  test("overrides an enum type name", () => {
    const program = MockFactory.createProgram();
    const enumType = MockFactory.createEnum("color_kind", [{ name: "red", value: "red" }]);
    $name(contextFor(program), enumType, "ColorKind");

    const result = renderGoContent(<GoEnumDeclaration enum={enumType} program={program} />);

    expect(result).toContain("type ColorKind string");
    expect(result).toContain("ColorKindRed ColorKind");
  });

  test("overrides an operation method name in the API interface", () => {
    const program = MockFactory.createProgram();
    const operation = MockFactory.createOperation("fetch_by_id") as Operation;
    $name(contextFor(program), operation, "FetchByID");

    const result = renderGoContent(
      <GoInterfaceDeclaration name="StoreAPI" operations={[operation]} program={program} />,
      "interfaces.go",
    );

    expect(result).toContain("FetchByID(ctx context.Context)");
    expect(result).not.toContain("Fetch_by_id");
  });
});

describe("@go.structTag Record form", () => {
  test("serializes a Record-shaped tag model to a raw tag string", () => {
    const program = MockFactory.createProgram();
    const model = MockFactory.createModelWithProps("Item", [
      { name: "id", type: MockFactory.createScalar("string") },
    ]);

    const recordTag = {
      properties: new Map([
        [
          "json",
          {
            name: "json",
            type: { kind: "String", value: "identifier" },
          },
        ],
        [
          "db",
          {
            name: "db",
            type: { kind: "String", value: "pk" },
          },
        ],
      ]),
    } as unknown as Parameters<typeof $structTag>[2];

    $structTag(contextFor(program), propertyNamed(model, "id"), recordTag);

    const result = renderGoContent(
      <GoStructDeclaration model={model} program={program} />,
      "models.go",
    );

    expect(result).toContain('`json:"identifier" db:"pk"`');
    expect(result).not.toContain('json:"id"`');
  });
});
