/**
 * 🔥 Real TypeSpec Integration Test - PASSING VERSION
 */

import { describe, test, expect } from "vitest";
import { createTester } from "@typespec/compiler/testing";

const Tester = createTester(undefined, { libraries: [] });

describe("🔥 Real TypeSpec Integration - Working API", () => {
  test("✅ Compile simple TypeSpec model", async () => {
    const tspCode = `
namespace TestAPI {
  model User {
    id: string;
    name: string;
  }
}
`;

    const runner = await Tester.createInstance();
    const result = await runner.compile(tspCode);

    expect(result).toBeDefined();
    expect(result.program).toBeDefined();
  });

  test("✅ Compile TypeSpec enum", async () => {
    const tspCode = `
namespace TestAPI {
  enum Status {
    Pending,
    Active,
    Completed
  }
}
`;

    const runner = await Tester.createInstance();
    const result = await runner.compile(tspCode);

    expect(result).toBeDefined();
    expect(result.program).toBeDefined();
  });

  test("✅ Compile TypeSpec with array types", async () => {
    const tspCode = `
namespace TestAPI {
  model User {
    tags: string[];
    scores: int32[];
  }
}
`;

    const runner = await Tester.createInstance();
    const result = await runner.compile(tspCode);

    expect(result).toBeDefined();
    expect(result.program).toBeDefined();
  });

  test("✅ Compile TypeSpec with optional fields", async () => {
    const tspCode = `
namespace TestAPI {
  model User {
    id: string;
    email?: string;
    age?: int32;
  }
}
`;

    const runner = await Tester.createInstance();
    const result = await runner.compile(tspCode);

    expect(result).toBeDefined();
    expect(result.program).toBeDefined();
  });

  test("✅ Handle TypeSpec compilation errors", async () => {
    const tspCode = `
namespace TestAPI {
  model User {
    id: string
    name: string
  }
}
`;

    const runner = await Tester.createInstance();
    const diagnostics = await runner.diagnose(tspCode);

    expect(diagnostics.length).toBeGreaterThan(0);
  });
});
