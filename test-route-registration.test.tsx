import { describe, it, expect } from "bun:test";
import { render } from "@alloy-js/core";
import { GoRouteRegistrationComponent } from "./dist/components/go/GoRouteRegistrationComponent.js";

// Mock GoHandlerMethod for testing
const mockHandlers = [
  {
    name: "GetUserHandler",
    route: "/users/{id}",
    httpMethod: "GET",
    parameters: [],
    returnType: "User",
    doc: "Get user by ID"
  },
  {
    name: "CreateUserHandler", 
    route: "/users",
    httpMethod: "POST",
    parameters: [{ name: "user", type: "User", goType: "User" }],
    returnType: "User",
    doc: "Create new user"
  }
];

describe("GoRouteRegistrationComponent", () => {
  it("should generate proper Go route registration function", () => {
    const result = render(
      <GoRouteRegistrationComponent 
        handlers={mockHandlers} 
        serviceName="UserService" 
      />
    );
    
    console.log("Generated Go code:");
    console.log(result);
    
    // Check that the result contains expected function signature
    expect(result).toContain("func (s *UserService) RegisterRoutes(mux *http.ServeMux)");
    
    // Check that all handlers are registered
    expect(result).toContain('mux.HandleFunc("/users/{id}", s.GetUserHandler)');
    expect(result).toContain('mux.HandleFunc("/users", s.CreateUserHandler)');
    
    // Check that documentation is included
    expect(result).toContain("// RegisterRoutes registers all handlers with given router");
  });
});