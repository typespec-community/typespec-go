import { describe, test, expect } from "vitest";
import { testComponent } from "../testing/go-component-test-utils.js";
import {
  GoInterfaceDeclaration,
  collectOperations,
} from "../components/go/GoInterfaceDeclaration.js";
import {
  createModel,
  createNamespace,
  createOperation,
  createScalar,
} from "../testing/mock-factory.js";

describe("GoInterfaceDeclaration Component", () => {
  test("generates interface from operations", () => {
    const mockOperation = createOperation("getUser", {
      returnType: createModel("User"),
      parameters: {
        id: createScalar("string"),
      },
    });

    const code = testComponent(
      <GoInterfaceDeclaration name="TestService" operations={[mockOperation]} packageName="test" />,
      ["type TestService interface", "GetUser(ctx context.Context, id string) (User, error)"],
      "interfaces.go",
    );

    expect(code).toContain("package test");
  });

  test("handles operations with no return type", () => {
    const mockOperation = createOperation("deleteUser", {
      parameters: {
        id: createScalar("string"),
      },
    });

    const code = testComponent(
      <GoInterfaceDeclaration name="UserService" operations={[mockOperation]} packageName="test" />,
      ["type UserService interface", "DeleteUser(ctx context.Context, id string) error"],
      "interfaces.go",
    );

    expect(code).toContain("package test");
  });

  test("collects operations from namespace", () => {
    const mockNamespace = createNamespace("TestAPI", {
      operations: {
        getUser: createOperation("getUser"),
        createUser: createOperation("createUser"),
      },
    });

    const operations = collectOperations(mockNamespace);

    expect(operations).toHaveLength(2);
    expect(operations[0].name).toBe("getUser");
    expect(operations[1].name).toBe("createUser");
  });
});
