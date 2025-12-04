/**
 * Test GoRouteRegistrationComponent with proper Go context
 */

import {expect, test} from "vitest"
import {GoRouteRegistrationComponent} from "../components/go/GoRouteRegistrationComponent"

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
		parameters: [{name: "user", type: "User", goType: "User"}],
		returnType: "User",
		doc: "Create new user",
	},
]

test("GoRouteRegistrationComponent renders correctly", () => {
	const result = GoRouteRegistrationComponent({
		handlers: mockHandlers as any,
		serviceName: "UserService",
	})

	console.log("✅ GoRouteRegistrationComponent render successful")
	console.log("Generated JSX:", result)

	// Just check that it renders without throwing and has expected structure
	expect(result).toBeDefined()
	expect(String(result)).toContain("RegisterRoutes")
})
