/**
 * Test GoRouteRegistrationComponent with proper Go context
 */

import { test, expect } from "vitest";
import { GoRouteRegistrationComponent } from "../components/go/GoRouteRegistrationComponent.js";

// Mock GoHandlerMethod for testing
const mockHandlers = [
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
    parameters: [{ name: "user", type: "User", goType: "User" }],
    returnType: "User",
    doc: "Create new user",
  },
];

test("GoRouteRegistrationComponent renders correctly", () => {
  const result = GoRouteRegistrationComponent({
    handlers: mockHandlers,
    serviceName: "UserService",
  });

  console.log("✅ GoRouteRegistrationComponent render successful");
  console.log("Generated JSX:", result);

  // Just check that it renders without throwing and has expected structure
  expect(result).toBeDefined();
  expect(String(result)).toContain("RegisterRoutes");
});
