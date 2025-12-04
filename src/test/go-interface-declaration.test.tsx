import { describe, test, expect } from "vitest";
import { render, Output } from "@alloy-js/core";
import { ModuleDirectory, SourceFile, SourceDirectory } from "@alloy-js/go";
import { testComponent } from "../testing/go-component-test-utils.js";
import { GoInterfaceDeclaration, collectOperations } from "../components/go/GoInterfaceDeclaration.js";
import { MockFactory } from "../testing/mock-factory.js";

describe("GoInterfaceDeclaration Component", () => {
  test("generates interface from operations", () => {
    const mockOperation = MockFactory.createOperation("getUser", {
      returnType: MockFactory.createModel("User"),
      parameters: {
        id: MockFactory.createScalar("string"),
      },
    });

    const code = testComponent(
      <GoInterfaceDeclaration
        name="TestService"
        operations={[mockOperation]}
        packageName="test"
      />,
      ["type TestService interface", "GetUser(ctx context.Context, id string) (User, error)"],
      "interfaces.go"
    );

    expect(code).toContain("package test");
  });

  test("handles operations with no return type", () => {
    const mockOperation = MockFactory.createOperation("deleteUser", {
      parameters: {
        id: MockFactory.createScalar("string"),
      },
    });

    const code = testComponent(
      <GoInterfaceDeclaration
        name="UserService"
        operations={[mockOperation]}
        packageName="test"
      />,
      ["type UserService interface", "DeleteUser(ctx context.Context, id string) error"],
      "interfaces.go"
    );

    expect(code).toContain("package test");
  });

  test("collects operations from namespace", () => {
    const mockNamespace = MockFactory.createNamespace("TestAPI", {
      operations: {
        getUser: MockFactory.createOperation("getUser"),
        createUser: MockFactory.createOperation("createUser"),
      },
    });

    const operations = collectOperations(mockNamespace);

    expect(operations).toHaveLength(2);
    expect(operations[0].name).toBe("getUser");
    expect(operations[1].name).toBe("createUser");
  });
});