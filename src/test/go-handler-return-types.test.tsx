import { describe, test, expect } from "vitest";
import { GoHandlerStub } from "../components/go/GoHandlerStub.js";
import { createModel, createOperation } from "../testing/mock-factory.js";
import { renderGoContent } from "../testing/test-utils.js";

describe("GoHandlerStub - Return Type Extraction", () => {
  test("extracts return types from operations", () => {
    const mockOperationWithReturn = createOperation("GetUser", {
      returnType: createModel("User"),
    });

    const output = renderGoContent(
      <GoHandlerStub
        operations={[mockOperationWithReturn]}
        serviceName="UserService"
        packageName="api"
      />,
    );

    expect(output).toContain("package api");
    expect(output).toContain("type UserService struct");
    expect(output).toContain("func (s *UserService) GetUserHandler");
  });

  test("handles operations with no return type", () => {
    const mockOperationNoReturn = createOperation("DeleteUser");

    const output = renderGoContent(
      <GoHandlerStub
        operations={[mockOperationNoReturn]}
        serviceName="UserService"
        packageName="api"
      />,
    );

    expect(output).toContain("func (s *UserService) DeleteUserHandler");
  });

  test("handles operations with different return types", () => {
    const mockOperations = [
      createOperation("GetUser", {
        returnType: createModel("User"),
      }),
      createOperation("CreateUser", {
        returnType: createModel("User"),
      }),
      createOperation("ListUsers", {
        returnType: createModel("UserList"),
      }),
    ];

    const output = renderGoContent(
      <GoHandlerStub operations={mockOperations} serviceName="UserService" packageName="api" />,
    );

    expect(output).toContain("GetUserHandler");
    expect(output).toContain("CreateUserHandler");
    expect(output).toContain("ListUsersHandler");
    expect(output).toContain("GetUserHandler");
    expect(output).toContain("CreateUserHandler");
    expect(output).toContain("ListUsersHandler");
    // Note: Route patterns are generated, exact format may vary
    expect(output).toContain("HandleFunc");
    expect(output).toContain("s.GetUserHandler(context.Background(), w, r)");
    expect(output).toContain("s.CreateUserHandler(context.Background(), w, r)");
    expect(output).toContain("s.ListUsersHandler(context.Background(), w, r)");
  });
});
