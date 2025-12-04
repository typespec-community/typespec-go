import { describe, test, expect } from "vitest";
import { GoHandlerStub } from "../components/go/GoHandlerStub.js";
import { MockFactory } from "../testing/mock-factory.js";

describe("GoHandlerStub Component", () => {
  test("generates complete HTTP handler file", () => {
    const mockOperation = MockFactory.createOperation("CreateUser");

    const output = GoHandlerStub({
      operations: [mockOperation], 
      serviceName: "UserService",
      packageName: "api"
    });

    // Check that it contains the essential parts
    expect(output).toContain("package api");
    expect(output).toContain("import");
    expect(output).toContain("type UserService struct");
    expect(output).toContain("logger *log.Logger");
    expect(output).toContain("func (s *UserService) RegisterRoutes");
    expect(output).toContain("func NewUserService");
  });

  test("generates handler methods with proper signatures", () => {
    const mockOperation = MockFactory.createOperation("GetUser");

    const output = GoHandlerStub({
      operations: [mockOperation], 
      serviceName: "UserService",
      packageName: "api"
    });

    // Check for handler method signature
    expect(output).toContain("func (s *UserService) GetUserHandler");
    expect(output).toContain("ctx context.Context");
    expect(output).toContain("w http.ResponseWriter");
    expect(output).toContain("r *http.Request");
  });
});