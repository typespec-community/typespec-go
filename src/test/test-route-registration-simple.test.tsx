/**
 * Test GoRouteRegistrationComponent with proper Go context
 */

import { expect, test } from "vitest";
import { GoRouteRegistrationComponent } from "../components/go/GoRouteRegistrationComponent";
import { renderGoContent } from "../testing/test-utils.js";

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
  const result = renderGoContent(
    <GoRouteRegistrationComponent handlers={mockHandlers as unknown} serviceName="UserService" />,
    "registration.go",
  );

  // Just check that it renders without throwing and has expected structure
  expect(result).toBeDefined();
  expect(result).toContain("RegisterRoutes");
});
