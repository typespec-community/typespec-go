/**
 * Go generics integration: template declarations (model Box<T>) emit as
 * Go generic type declarations with `[T any]` parameters, and template
 * parameter references resolve to their declared names.
 */

import { describe, expect, test } from "vitest";
import { join } from "node:path";
import { Output, render } from "@alloy-js/core";
import type { OutputDirectory } from "@alloy-js/core";
import { createTester } from "@typespec/compiler/testing";
import type { Model, Program } from "@typespec/compiler";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";
import { TypeExpression } from "../components/TypeExpression.js";
import { getTemplateParameters, isGenericModel } from "../domain/go-generics.js";

const Tester = createTester(join(import.meta.dirname, "..", ".."), {
  libraries: [],
});

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

async function compileSpec(tsp: string): Promise<{ program: Program; box: Model; plain: Model }> {
  const runner = await Tester.createInstance();
  const result = await runner.compile(tsp);
  const demo = result.program.getGlobalNamespaceType().namespaces.get("Demo");
  const box = demo?.models.get("Box");
  const plain = demo?.models.get("Plain");
  if (!box || !plain) throw new Error("expected Box and Plain models in compiled program");
  return { program: result.program, box, plain };
}

const SPEC = `
    namespace Demo {
      model Box<T> {
        content: T;
        label: string;
      }
      model Plain {
        id: string;
      }
    }
  `;

describe("Go generics emission", () => {
  test("template declarations expose their parameter names", async () => {
    const { box, plain } = await compileSpec(SPEC);

    expect(isGenericModel(box)).toBe(true);
    expect(getTemplateParameters(box)).toEqual([{ name: "T", constraint: "any" }]);
    expect(isGenericModel(plain)).toBe(false);
    expect(getTemplateParameters(plain)).toEqual([]);
  });

  test("rendered package declares the generic struct with [T any]", async () => {
    const { program, box } = await compileSpec(SPEC);

    const tree = render(
      <Output>
        <GoPackageDirectory
          models={[box]}
          packageName="demo"
          modulePath="example.com/demo"
          program={program}
        />
      </Output>,
    );

    const content = collectFiles(tree as OutputDirectory)
      .map((file) => file.content)
      .join("\n");

    expect(content).toContain("type Box[T any] struct");
    expect(content).toMatch(/Content\s+T\s+`json:"content"`/);
    expect(content).toMatch(/Label\s+string\s+`json:"label"`/);
  });

  test("non-generic models render without type parameters", async () => {
    const { program, plain } = await compileSpec(SPEC);

    const tree = render(
      <Output>
        <GoPackageDirectory
          models={[plain]}
          packageName="demo"
          modulePath="example.com/demo"
          program={program}
        />
      </Output>,
    );

    const content = collectFiles(tree as OutputDirectory)
      .map((file) => file.content)
      .join("\n");

    expect(content).toContain("type Plain struct");
    expect(content).not.toContain("[T any]");
  });

  test("template parameter references resolve to their declared name", async () => {
    const { box } = await compileSpec(SPEC);

    const contentProp = box.properties.get("content");
    if (!contentProp) throw new Error("content property not found");

    expect(TypeExpression({ type: contentProp.type })).toBe("T");
    expect(TypeExpression({ type: contentProp.type })).not.toBe("interface{}");
  });

  test("array-of-parameter fields render as []T without unresolved refs", async () => {
    const runner = await Tester.createInstance();
    const result = await runner.compile(`
      namespace Demo {
        model Page<T> {
          items: T[];
          total: int32;
        }
      }
    `);
    const demo = result.program.getGlobalNamespaceType().namespaces.get("Demo");
    const page = demo?.models.get("Page");
    if (!page) throw new Error("Page model not found");

    const tree = render(
      <Output>
        <GoPackageDirectory
          models={[page]}
          packageName="demo"
          modulePath="example.com/demo"
          program={result.program}
        />
      </Output>,
    );
    const content = collectFiles(tree as OutputDirectory)
      .map((file) => file.content)
      .join("\n");

    expect(content).toContain("type Page[T any] struct");
    expect(content).toMatch(/Items\s+\[\]T\s+`json:"items"`/);
    expect(content).not.toContain("<Unresolved Symbol>");
  });

  test("multi-parameter templates emit all parameters in order", async () => {
    const runner = await Tester.createInstance();
    const result = await runner.compile(`
      namespace Demo {
        model Pair<K, V> {
          key: K;
          value: V;
        }
      }
    `);
    const demo = result.program.getGlobalNamespaceType().namespaces.get("Demo");
    const pair = demo?.models.get("Pair");
    if (!pair) throw new Error("Pair model not found");

    expect(getTemplateParameters(pair)).toEqual([
      { name: "K", constraint: "any" },
      { name: "V", constraint: "any" },
    ]);

    const tree = render(
      <Output>
        <GoPackageDirectory
          models={[pair]}
          packageName="demo"
          modulePath="example.com/demo"
          program={result.program}
        />
      </Output>,
    );
    const content = collectFiles(tree as OutputDirectory)
      .map((file) => file.content)
      .join("\n");
    expect(content).toContain("type Pair[K any, V any] struct");
    expect(content).toMatch(/Key\s+K\s+`json:"key"`/);
    expect(content).toMatch(/Value\s+V\s+`json:"value"`/);
  });
});
