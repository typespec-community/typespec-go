/**
 * Test GoRouteRegistrationComponent with proper Go context
 */

import { describe, expect, it } from "vitest";
import { GoRouteRegistrationComponent } from "../components/go/GoRouteRegistrationComponent.js";
import type { GoHandlerMethod } from "../components/go/GoHandlerMethod.js";
import { renderGoContent } from "../testing/test-utils.js";

// Mock GoHandlerMethod for testing
const mockHandlers: GoHandlerMethod[] = [
  {
    name: "GetUserHandler",
    route: "/users/{id}",
    httpMethod: "GET",
    parameters: [],
    returnType: "User",
    doc: "Get user by ID",
  },
  {
    name: "CreateUserHandler",
    route: "/users",
    httpMethod: "POST",
    parameters: [{ name: "user", goType: "User", source: "body", optional: false }],
    returnType: "User",
    doc: "Create new user",
  },
];

describe("GoRouteRegistrationComponent", () => {
  it("should generate proper Go route registration function", () => {
    const result = renderGoContent(
      <GoRouteRegistrationComponent handlers={mockHandlers} serviceName="UserService" />,
      "registration.go",
    );

    // Check that the result contains expected function signature
    expect(result).toContain("func (s *UserService) RegisterRoutes(mux *http.ServeMux)");

    // Check that all handlers are registered (checking actual output with escaped quotes)
    expect(result).toContain('mux.HandleFunc(\\"/users/{id}\\", s.GetUserHandler)');
    expect(result).toContain('mux.HandleFunc(\\"/users\\", s.CreateUserHandler)');

    // Check that documentation is included
    expect(result).toContain("// RegisterRoutes registers all handlers with given router");
  });
});
