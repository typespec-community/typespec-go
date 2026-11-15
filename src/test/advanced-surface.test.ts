/**
 * Advanced type-surface integration tests: template instances, @visibility,
 * and deep namespace hierarchies are compiled by the real TypeSpec compiler
 * and fed through the emitter's namespace collector.
 */

import { describe, expect, test } from "vitest";
import { createTester } from "@typespec/compiler/testing";
import { collectTypesByNamespace } from "../emitter/typespec-go-emitter.js";

const Tester = createTester(undefined, { libraries: [] });

async function collect(tspCode: string) {
  const runner = await Tester.createInstance();
  const result = await runner.compile(tspCode);
  const globalNamespace = result.program.getGlobalNamespaceType();
  return { result, groups: collectTypesByNamespace(globalNamespace) };
}

describe("advanced type surface through the namespace collector", () => {
  test("template instances land in their namespace groups", async () => {
    const { groups } = await collect(`
      namespace Inventory {
        model Box<T> {
          item: T;
        }
        model Crate {
          contents: Box<string>;
        }
      }
    `);

    expect(groups.has("Inventory")).toBe(true);
    const names = groups
      .get("Inventory")
      ?.models.map((m) => m.name)
      .toSorted();
    expect(names).toContain("Crate");
  });

  test("@visibility-decorated properties stay in their models", async () => {
    const { groups } = await collect(`
      namespace Profiles {
        model Account {
          @visibility(TypeSpec.Lifecycle.Read)
          id: string;
          secret: string;
        }
      }
    `);

    const account = groups.get("Profiles")?.models.find((m) => m.name === "Account");
    expect(account).toBeDefined();
    const propNames = Array.from(account?.properties.values() ?? []).map((p) => p.name);
    expect(propNames).toContain("id");
    expect(propNames).toContain("secret");
  });

  test("deep namespace hierarchies group at every level", async () => {
    const { groups } = await collect(`
      namespace Vendor {
        namespace Service {
          namespace API {
            model Resource {
              id: string;
            }
          }
        }
      }
    `);

    expect(groups.has("API")).toBe(true);
    expect(groups.has("Vendor")).toBe(false);
  });

  test("anonymous unions inside models compile and group", async () => {
    const { groups } = await collect(`
      namespace Payments {
        model Receipt {
          method: "card" | "transfer";
        }
      }
    `);

    const receipt = groups.get("Payments")?.models.find((m) => m.name === "Receipt");
    expect(receipt).toBeDefined();
    expect(Array.from(receipt?.properties.values() ?? [])[0]?.type.kind).toBe("Union");
  });

  test("interface operations reach the namespace group", async () => {
    const { groups } = await collect(`
      namespace Store {
        model Widget {
          id: string;
        }
        interface Widgets {
          list(): Widget[];
          read(id: string): Widget;
        }
      }
    `);

    const group = groups.get("Store");
    expect(group).toBeDefined();
    const opNames = group?.operations.map((op) => op.name).toSorted();
    expect(opNames).toEqual(["list", "read"]);
  });
});
