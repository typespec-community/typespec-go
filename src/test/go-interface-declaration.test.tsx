import { describe, test, expect } from "vitest";
import {
  GoInterfaceDeclaration,
  collectOperations,
} from "../components/go/GoInterfaceDeclaration.js";
import { MockFactory } from "../testing/mock-factory.js";

describe("GoInterfaceDeclaration Component", () => {
  test("generates interface from operations", () => {
    const mockOperation = MockFactory.createOperation("getUser", {
      returnType: MockFactory.createModel("User"),
      parameters: {
        id: MockFactory.createScalar("string"),
      },
    });

    const output = GoInterfaceDeclaration({
      name: "UserService",
      operations: [mockOperation],
      packageName: "test",
    });

    expect(output).toContain("type UserService interface {");
    expect(output).toContain("GetUser(ctx context.Context, id string) (User, error)");
  });

  test("handles operations with no return type", () => {
    const mockOperation = MockFactory.createOperation("deleteUser", {
      parameters: {
        id: MockFactory.createScalar("string"),
      },
    });

    const output = GoInterfaceDeclaration({
      name: "UserService",
      operations: [mockOperation],
    });

    expect(output).toContain("DeleteUser(ctx context.Context, id string) error");
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
