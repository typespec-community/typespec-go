/**
 * Test GoRouteRegistrationComponent with proper Go context
 */

import { test, expect, describe, it } from "vitest";
import { render, Output } from "@alloy-js/core";
import * as go from "@alloy-js/go";
const { ModuleDirectory, SourceDirectory, SourceFile } = go;
import { GoRouteRegistrationComponent } from "../src/components/go/GoRouteRegistrationComponent.js";

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
      <Output>
        <ModuleDirectory name="github.com/test/api">
          <SourceDirectory path="routes">
            <SourceFile path="registration.go">
              <GoRouteRegistrationComponent 
                handlers={mockHandlers} 
                serviceName="UserService" 
              />
            </SourceFile>
          </SourceDirectory>
        </ModuleDirectory>
      </Output>
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