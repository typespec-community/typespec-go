/**
 * @visibility integration: compiles a spec with lifecycle visibility
 * decorators inside vitest (createTester), then asserts the read-shaped
 * emission model through the domain filter and the rendered package.
 */

import { describe, expect, test } from "vitest";
import { join } from "node:path";
import { Output, render } from "@alloy-js/core";
import type { OutputDirectory } from "@alloy-js/core";
import { createTester } from "@typespec/compiler/testing";
import type { Model, Program } from "@typespec/compiler";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";
import {
  filterVisibleProperties,
  isVisibilityMode,
  VISIBILITY_MODES,
} from "../domain/visibility.js";

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

async function compileUserModel(): Promise<{ program: Program; user: Model }> {
  const runner = await Tester.createInstance();
  const result = await runner.compile(`
    namespace Demo {
      model User {
        id: string;
        @visibility(TypeSpec.Lifecycle.Create)
        password: string;
        @visibility(TypeSpec.Lifecycle.Read)
        profile: string;
        @visibility(TypeSpec.Lifecycle.Read, TypeSpec.Lifecycle.Update)
        email: string;
      }
    }
  `);
  const demo = result.program.getGlobalNamespaceType().namespaces.get("Demo");
  const user = demo?.models.get("User");
  if (!user) throw new Error("User model not found in compiled program");
  return { program: result.program, user };
}

describe("@visibility read-shaped emission", () => {
  test("read mode keeps only properties visible in the Read lifecycle", async () => {
    const { program, user } = await compileUserModel();

    const names = filterVisibleProperties(program, user, "read").map((p) => p.name);
    expect(names).toEqual(["id", "profile", "email"]);
  });

  test("all mode (default) emits every property, decorated or not", async () => {
    const { program, user } = await compileUserModel();

    const names = filterVisibleProperties(program, user, "all").map((p) => p.name);
    expect(names).toEqual(["id", "password", "profile", "email"]);
  });

  test("rendered package omits create-only fields under read mode", async () => {
    const { program, user } = await compileUserModel();

    const tree = render(
      <Output>
        <GoPackageDirectory
          models={[user]}
          packageName="demo"
          modulePath="example.com/demo"
          program={program}
          visibilityMode="read"
        />
      </Output>,
    );

    const content = collectFiles(tree as OutputDirectory)
      .map((file) => file.content)
      .join("\n");

    expect(content).toContain("ID");
    expect(content).toContain("Profile");
    expect(content).toContain("Email");
    expect(content).not.toContain("Password");
  });

  test("rendered package keeps every field under the default mode", async () => {
    const { program, user } = await compileUserModel();

    const tree = render(
      <Output>
        <GoPackageDirectory
          models={[user]}
          packageName="demo"
          modulePath="example.com/demo"
          program={program}
        />
      </Output>,
    );

    const content = collectFiles(tree as OutputDirectory)
      .map((file) => file.content)
      .join("\n");

    expect(content).toContain("Password");
  });

  test("isVisibilityMode narrows only the documented modes", () => {
    expect(VISIBILITY_MODES).toEqual(["all", "read"]);
    expect(isVisibilityMode("read")).toBe(true);
    expect(isVisibilityMode("all")).toBe(true);
    expect(isVisibilityMode("write")).toBe(false);
    expect(isVisibilityMode(42)).toBe(false);
    expect(isVisibilityMode(undefined)).toBe(false);
  });
});
