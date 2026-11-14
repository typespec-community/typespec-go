/**
 * Test GoRouteRegistrationComponent with proper Go context
 */

import { expect, test } from "vitest";
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

test("GoRouteRegistrationComponent renders correctly", () => {
  const result = renderGoContent(
    <GoRouteRegistrationComponent handlers={mockHandlers} serviceName="UserService" />,
    "registration.go",
  );

  // Just check that it renders without throwing and has expected structure
  expect(result).toBeDefined();
  expect(result).toContain("RegisterRoutes");
});
