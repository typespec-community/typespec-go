import { describe, test, expect } from "vitest";
import { GoInterfaceDeclaration, collectOperations } from "../components/go/GoInterfaceDeclaration.js";

describe("GoInterfaceDeclaration Component", () => {
  test("generates interface from operations", () => {
    const mockOperation = {
      name: "getUser",
      kind: "Operation" as const,
      parameters: {
        properties: new Map([
          ["id", { name: "id", type: { kind: "Scalar", name: "string" }, optional: false }]
        ])
      },
      returnType: {
        kind: "Model",
        name: "User"
      }
    };

    const output = GoInterfaceDeclaration({
      name: "UserService",
      operations: [mockOperation],
      packageName: "test"
    });

    expect(output).toContain("type UserService interface {");
    expect(output).toContain("GetUser(ctx context.Context, id string) (interface{}, error)");
  });

  test("handles operations with no return type", () => {
    const mockOperation = {
      name: "deleteUser",
      kind: "Operation" as const,
      parameters: {
        properties: new Map([
          ["id", { name: "id", type: { kind: "Scalar", name: "string" }, optional: false }]
        ])
      }
    };

    const output = GoInterfaceDeclaration({
      name: "UserService",
      operations: [mockOperation]
    });

    expect(output).toContain("DeleteUser(ctx context.Context, id string) error");
  });

  test("collects operations from namespace", () => {
    const mockNamespace = {
      operations: new Map([
        ["getUser", { name: "getUser", kind: "Operation" as const }],
        ["createUser", { name: "createUser", kind: "Operation" as const }]
      ])
    };

    const operations = collectOperations(mockNamespace);

    expect(operations).toHaveLength(2);
    expect(operations[0].name).toBe("getUser");
    expect(operations[1].name).toBe("createUser");
  });
});