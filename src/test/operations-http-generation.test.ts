/**
 * Operations/HTTP Generation Tests
 *
 * Tests for TypeSpec operations to Go HTTP services
 * Service interfaces, handlers, route registration
 */

import { describe, it, expect, beforeAll } from "vitest";
import { ModelGenerator } from "../generators/model-generator.js";
import type { ExtractedOperation } from "../emitter/model-extractor-core.js";

describe("Operations HTTP Generation", () => {
  let generator: ModelGenerator;

  beforeAll(async () => {
    generator = new ModelGenerator();
  });

  describe("Service Interface Generation", () => {
    it("should generate service interface with methods", () => {
      const operations = new Map<string, ExtractedOperation>();
      
      operations.set("getUser", {
        name: "getUser",
        verb: "get",
        path: "/users/{id}",
        parameters: new Map([
          ["id", { name: "id", type: { kind: "String" }, location: "path", optional: false }],
        ]),
        returnType: { kind: "model", name: "User" },
      });

      operations.set("createUser", {
        name: "createUser", 
        verb: "post",
        path: "/users",
        parameters: new Map([
          ["user", { name: "user", type: { kind: "model" }, location: "body", optional: false }],
        ]),
        returnType: { kind: "model", name: "User" },
      });

      const serviceInterface = generator.generateGoServiceInterface(operations);
      
      // Test interface structure
      expect(serviceInterface).toContain("type ApiService interface");
      expect(serviceInterface).toContain("GetUser(ctx context.Context, id string) (User, error)");
      expect(serviceInterface).toContain("CreateUser(ctx context.Context, user model) (User, error)");
    });

    it("should handle operations with no return type", () => {
      const operations = new Map<string, ExtractedOperation>();
      
      operations.set("deleteUser", {
        name: "deleteUser",
        verb: "delete", 
        path: "/users/{id}",
        parameters: new Map([
          ["id", { name: "id", type: { kind: "String" }, location: "path", optional: false }],
        ]),
        returnType: undefined,
      });

      const serviceInterface = generator.generateGoServiceInterface(operations);
      
      expect(serviceInterface).toContain("DeleteUser(ctx context.Context, id string) (interface{}, error)");
    });
  });

  describe("HTTP Handler Generation", () => {
    it("should generate HTTP handler functions", () => {
      const operations = new Map<string, ExtractedOperation>();
      
      operations.set("getUser", {
        name: "getUser",
        verb: "get",
        path: "/users/{id}", 
        parameters: new Map([
          ["id", { name: "id", type: { kind: "String" }, location: "path", optional: false }],
        ]),
        returnType: { kind: "model", name: "User" },
      });

      const httpHandlers = generator.generateGoHttpHandlers(operations);
      
      // Test handler structure
      expect(httpHandlers).toContain("func handleGetUser(");
      expect(httpHandlers).toContain("GET /users/{id}");
      expect(httpHandlers).toContain("resp, err := service.getUser(ctx, id)");
      expect(httpHandlers).toContain("w.Header().Set(\"Content-Type\", \"application/json\")");
    });

    it("should handle operations with query parameters", () => {
      const operations = new Map<string, ExtractedOperation>();
      
      operations.set("listUsers", {
        name: "listUsers",
        verb: "get",
        path: "/users",
        parameters: new Map([
          ["limit", { name: "limit", type: { kind: "Int32" }, location: "query", optional: true }],
          ["offset", { name: "offset", type: { kind: "Int32" }, location: "query", optional: true }],
        ]),
        returnType: { kind: "Array", elementType: { kind: "model", name: "User" } },
      });

      const httpHandlers = generator.generateGoHttpHandlers(operations);
      
      expect(httpHandlers).toContain("func handleListUsers(");
      expect(httpHandlers).toContain("GET /users");
      expect(httpHandlers).toContain("// No path parameters");
    });
  });

  describe("Route Registration Generation", () => {
    it("should generate route registration function", () => {
      const operations = new Map<string, ExtractedOperation>();
      
      operations.set("getUser", {
        name: "getUser",
        verb: "get",
        path: "/users/{id}",
        parameters: new Map([
          ["id", { name: "id", type: { kind: "String" }, location: "path", optional: false }],
        ]),
      });

      operations.set("createUser", {
        name: "createUser",
        verb: "post", 
        path: "/users",
        parameters: new Map([
          ["user", { name: "user", type: { kind: "model" }, location: "body", optional: false }],
        ]),
      });

      const routeRegistration = generator.generateGoRouteRegistration(operations);
      
      // Test route registration structure
      expect(routeRegistration).toContain("func RegisterRoutes(");
      expect(routeRegistration).toContain("router.HandleFunc(\"GET\", \"/users/{id}\", handleGetUser(service))");
      expect(routeRegistration).toContain("router.HandleFunc(\"POST\", \"/users\", handleCreateUser(service))");
      expect(routeRegistration).toContain("service ApiService");
    });
  });

  describe("Parameter Extraction", () => {
    it("should extract path parameters correctly", () => {
      const path = "/users/{userId}/posts/{postId}/comments/{commentId}";
      const params = generator["extractPathParameters"](path);
      
      expect(params).toHaveLength(3);
      expect(params[0].name).toBe("userId");
      expect(params[1].name).toBe("postId");
      expect(params[2].name).toBe("commentId");
    });

    it("should handle complex path parameters", () => {
      const path = "/api/v1/{category}/{subcategory}/items/{itemId}";
      const params = generator["extractPathParameters"](path);
      
      expect(params).toHaveLength(3);
      expect(params[0].name).toBe("category");
      expect(params[1].name).toBe("subcategory");
      expect(params[2].name).toBe("itemId");
    });

    it("should handle paths without parameters", () => {
      const path = "/health/status";
      const params = generator["extractPathParameters"](path);
      
      expect(params).toHaveLength(0);
    });
  });

  describe("HTTP Verb Handling", () => {
    it("should handle all HTTP verbs", () => {
      const httpVerbs = [
        { verb: "get", expected: "GET" },
        { verb: "post", expected: "POST" },
        { verb: "put", expected: "PUT" },
        { verb: "delete", expected: "DELETE" },
        { verb: "patch", expected: "PATCH" },
      ];

      httpVerbs.forEach(({ verb, expected }) => {
        const operations = new Map<string, ExtractedOperation>();
        operations.set(`test${verb}`, {
          name: `test${verb}`,
          verb: verb,
          path: "/test",
          parameters: new Map(),
        });

        const httpHandlers = generator.generateGoHttpHandlers(operations);
        expect(httpHandlers).toContain(`// ${expected} /test`);
      });
    });

    it("should handle undefined verbs", () => {
      const operations = new Map<string, ExtractedOperation>();
      operations.set("testOperation", {
        name: "testOperation",
        verb: undefined,
        path: "/test", 
        parameters: new Map(),
      });

      const routeRegistration = generator.generateGoRouteRegistration(operations);
      expect(routeRegistration).toContain("router.HandleFunc(\"GET\", \"/test\"");
    });
  });

  describe("Error Handling", () => {
    it("should handle empty operations", () => {
      const operations = new Map<string, ExtractedOperation>();
      
      const serviceInterface = generator.generateGoServiceInterface(operations);
      const httpHandlers = generator.generateGoHttpHandlers(operations);
      const routeRegistration = generator.generateGoRouteRegistration(operations);
      
      // Should not throw on empty operations
      expect(() => {
        serviceInterface;
        httpHandlers;
        routeRegistration;
      }).not.toThrow();
    });

    it("should handle malformed operations gracefully", () => {
      const operations = new Map<string, ExtractedOperation>();
      
      operations.set("brokenOperation", {
        name: "brokenOperation",
        verb: "get",
        path: undefined,
        parameters: new Map(),
        returnType: undefined,
      });

      // Should handle undefined values gracefully
      expect(() => {
        const serviceInterface = generator.generateGoServiceInterface(operations);
        const httpHandlers = generator.generateGoHttpHandlers(operations);
        const routeRegistration = generator.generateGoRouteRegistration(operations);
      }).not.toThrow();
    });
  });

  describe("Performance Tests", () => {
    it("should handle large operations efficiently", () => {
      const startTime = performance.now();
      
      const operations = new Map<string, ExtractedOperation>();
      
      // Create many operations
      for (let i = 0; i < 100; i++) {
        operations.set(`operation${i}`, {
          name: `operation${i}`,
          verb: "get",
          path: `/endpoint${i}`,
          parameters: new Map([
            [`param${i}`, { name: `param${i}`, type: { kind: "String" }, location: "query", optional: false }],
          ]),
        });
      }
      
      generator.generateGoServiceInterface(operations);
      generator.generateGoHttpHandlers(operations);
      generator.generateGoRouteRegistration(operations);
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(50); // Should be under 50ms
    });
  });
});