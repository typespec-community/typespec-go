/**
 * 🔥 Simple Emitter Integration Test - Working Version
 */

import { test, expect } from "vitest";
import { createTester } from "@typespec/compiler/testing";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";
import type { Program, Model, Namespace } from "@typespec/compiler";
import { render } from "@alloy-js/core";

const Tester = createTester(undefined, { libraries: [] });

/**
 * Helper to get namespace by name
 */
function getNamespaceByName(program: Program, name: string): Namespace | undefined {
  const globalNamespace = program.getGlobalNamespaceType();
  
  // Check direct children of global namespace
  for (const [childName, childNamespace] of globalNamespace.namespaces.entries()) {
    if (childName === name) {
      return childNamespace;
    }
  }
  
  return undefined;
}

test("✅ Debug namespace structure", async () => {
  // Arrange
  const tspCode = `
namespace TestAPI {
  model User {
    id: string;
    name: string;
  }
}
`;

  // Act
  const runner = await Tester.createInstance();
  const result = await runner.compile(tspCode);

  // Debug
  const globalNamespace = result.program.getGlobalNamespaceType();
  console.log("🔍 Global namespace:", globalNamespace.name);
  console.log("🔍 Has namespaces:", !!globalNamespace.namespaces);
  console.log("🔍 Namespaces count:", globalNamespace.namespaces?.size || 0);
  
  if (globalNamespace.namespaces) {
    console.log("🔍 Namespace names:", Array.from(globalNamespace.namespaces.keys()));
    
    for (const [name, ns] of globalNamespace.namespaces.entries()) {
      console.log(`🔍 Namespace "${name}":`, {
        models: ns.models?.size || 0,
        enums: ns.enums?.size || 0,
        unions: ns.unions?.size || 0
      });
    }
  }
});

test("✅ Generate Go code from TypeSpec model", async () => {
  // Arrange
  const tspCode = `
namespace TestAPI {
  model User {
    id: string;
    name: string;
    email?: string;
  }
}
`;

  // Act - Compile TypeSpec
  const runner = await Tester.createInstance();
  const result = await runner.compile(tspCode);

  // Get TestAPI namespace
  const testApiNamespace = getNamespaceByName(result.program, "TestAPI");
  
  expect(testApiNamespace).toBeDefined();

  // Get User model from TestAPI namespace
  const userModel = testApiNamespace ? 
    Array.from(testApiNamespace.models.values()).find((m: Model) => m.name === "User") :
    undefined;

  expect(userModel).toBeDefined();

  // Render Go code
  if (userModel) {
    const goCode = render(
      <GoPackageDirectory
        packageName="api"
        models={[userModel]}
      />
    );

    console.log("🔍 Generated Go code:");
    console.log(goCode);

    const finalCode = typeof goCode === "string" ? goCode : "";
    
    expect(finalCode).toContain("package api");
    expect(finalCode).toContain("type User struct");
    expect(finalCode).toContain("ID string");
    expect(finalCode).toContain("Name string");
  }
});
