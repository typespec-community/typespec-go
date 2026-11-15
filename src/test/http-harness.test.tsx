/**
 * @typespec/http integration: compiles an HTTP-decorated spec inside vitest
 * (createTester with libraries), runs the real collector and generation
 * pipeline, and asserts handlers, routes, verbs, and the merge-patch body
 * mapping end to end.
 */

import { describe, expect, test } from "vitest";
import { join } from "node:path";
import { Output, render } from "@alloy-js/core";
import type { OutputDirectory } from "@alloy-js/core";
import { createTester } from "@typespec/compiler/testing";
import { collectTypesByNamespace } from "../emitter/typespec-go-emitter.js";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";
import { TypeExpression } from "../components/TypeExpression.js";

const Tester = createTester(join(import.meta.dirname, "..", ".."), {
  libraries: ["@typespec/http"],
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

describe("@typespec/http through the vitest harness", () => {
  test("collector walks interface operations decorated with HTTP metadata", async () => {
    const runner = await Tester.createInstance();
    const result = await runner.compile(`
      import "@typespec/http";
      using Http;

      @service(#{ title: "Widgets API" })
      namespace Demo {
        model Widget {
          id: string;
          weight: int32;
        }
        interface Widgets {
          @route("/widgets")
          @get list(): Widget[];
          @route("/widgets/{id}")
          @post create(@path id: string, @body widget: Widget): Widget;
        }
      }
    `);

    const globalNamespace = result.program.getGlobalNamespaceType();
    const groups = collectTypesByNamespace(globalNamespace);
    const demo = groups.get("Demo");

    expect(demo).toBeDefined();
    const opNames = (demo?.operations ?? []).map((op) => op.name).sort();
    expect(opNames).toEqual(["create", "list"]);
  });

  test("merge-patch update bodies map to their base model type", async () => {
    const runner = await Tester.createInstance();
    const result = await runner.compile(`
      import "@typespec/http";
      using Http;

      @service(#{ title: "t" })
      namespace Demo {
        model Widget {
          id: string;
        }
        interface Widgets {
          @route("{id}")
          @patch
          update(@path id: string, @body widget: MergePatchUpdate<Widget>): Widget;
        }
      }
    `);

    const globalNamespace = result.program.getGlobalNamespaceType();
    const demo = globalNamespace.namespaces.get("Demo");
    const update = demo?.interfaces.get("Widgets")?.operations.get("update");
    expect(update).toBeDefined();

    const bodyProp = [...(update?.parameters.properties.values() ?? [])].find(
      (p) => p.name === "widget",
    );
    if (!bodyProp) throw new Error("merge-patch body param not found");
    const goType = TypeExpression({ type: bodyProp.type });
    expect(goType).toBe("Widget");
  });

  test("generated package contains handlers, routes, and verbs for the spec", async () => {
    const runner = await Tester.createInstance();
    const result = await runner.compile(`
      import "@typespec/http";
      using Http;

      @service(#{ title: "Widgets API" })
      namespace Demo {
        model Widget {
          id: string;
          weight: int32;
        }
        interface Widgets {
          @route("/widgets")
          @get list(): Widget[];
          @route("/widgets/{id}")
          @post create(@path id: string, @body widget: Widget): Widget;
        }
      }
    `);

    const globalNamespace = result.program.getGlobalNamespaceType();
    const groups = collectTypesByNamespace(globalNamespace);
    const demo = groups.get("Demo");
    expect(demo).toBeDefined();

    const tree = render(
      <Output>
        <GoPackageDirectory
          models={demo?.models ?? []}
          operations={demo?.operations ?? []}
          packageName="demo"
          modulePath="example.com/demo"
          generateGoMod={true}
          program={result.program}
        />
      </Output>,
    );

    const content = collectFiles(tree as OutputDirectory)
      .map((file) => file.content)
      .join("\n");

    expect(content).toContain("func (s *DemoService) listHandler(");
    expect(content).toContain("ctx context.Context");
    expect(content).toContain("w http.ResponseWriter");
    expect(content).toContain("r *http.Request");
    expect(content).toContain("func (s *DemoService) createHandler(");
    expect(content).toContain('mux.HandleFunc("/widgets"');
    expect(content).toContain('mux.HandleFunc("/widgets/{id}"');
    expect(content).toContain('r.PathValue("id")');
    expect(content).toContain("json.NewDecoder(r.Body).Decode(&widget)");
    expect(content).toContain("type DemoAPI interface");
  });
});
