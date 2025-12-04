import { describe, test, expect } from "vitest";
import { GoHandlerStub } from "../components/go/GoHandlerStub.js";

describe("GoHandlerStub - Return Type Extraction", () => {
  test("extracts return types from operations", () => {
    const mockOperationWithReturn = {
      name: "GetUser",
      kind: "Operation" as const,
      returnType: {
        kind: "Model",
        name: "User"
      }
    };

    const output = GoHandlerStub({
      operations: [mockOperationWithReturn], 
      serviceName: "UserService",
      packageName: "api"
    });

    expect(output).toContain("package api");
    expect(output).toContain("type UserService struct");
    expect(output).toContain("func (s *UserService) GetUserHandler");
  });

  test("handles operations with no return type", () => {
    const mockOperationNoReturn = {
      name: "DeleteUser",
      kind: "Operation" as const,
    };

    const output = GoHandlerStub({
      operations: [mockOperationNoReturn], 
      serviceName: "UserService",
      packageName: "api"
    });

    expect(output).toContain("func (s *UserService) DeleteUserHandler");
  });

  test("handles operations with different return types", () => {
    const mockOperations = [
      {
        name: "GetUser",
        kind: "Operation" as const,
        returnType: {
          kind: "Model",
          name: "User"
        }
      },
      {
        name: "CreateUser", 
        kind: "Operation" as const,
        returnType: {
          kind: "Model",
          name: "User"
        }
      },
      {
        name: "ListUsers",
        kind: "Operation" as const,
        returnType: {
          kind: "Model", 
          name: "UserList"
        }
      }
    ];

    const output = GoHandlerStub({
      operations: mockOperations,
      serviceName: "UserService", 
      packageName: "api"
    });

    expect(output).toContain("GetUserHandler");
    expect(output).toContain("CreateUserHandler");
    expect(output).toContain("ListUsersHandler");
    expect(output).toContain("mux.HandleFunc(\"/getuser\", s.GetUserHandler)");
    expect(output).toContain("mux.HandleFunc(\"/createuser\", s.CreateUserHandler)");
    expect(output).toContain("mux.HandleFunc(\"/listusers\", s.ListUsersHandler)");
  });
});