/**
 * E2E Integration Tests - Fixed TypeSpec File Validation
 * Tests actual TypeSpec files with correct casing
 */

import { describe, it, expect } from "vitest";
import { join } from "path";
import { existsSync, readFileSync } from "fs";

describe("E2E Integration - Real TypeSpec Files", () => {
  
  it("should validate integration-basic.tsp structure and content", async () => {
    const tspPath = join(process.cwd(), "src/test/integration-basic.tsp");
    
    try {
      // Check TypeSpec file exists
      expect(existsSync(tspPath)).toBe(true);
      
      // Read and validate TypeSpec content
      const tspContent = readFileSync(tspPath, "utf8");
      console.log("TypeSpec content preview:");
      console.log(tspContent.substring(0, 200) + "...");
      
      // Should have models
      expect(tspContent).toContain("model User");
      expect(tspContent).toContain("model CreateUserRequest");
      expect(tspContent).toContain("model UserList");
      
      // Should have operations
      expect(tspContent).toContain("op getUser");
      expect(tspContent).toContain("op createUser");
      expect(tspContent).toContain("op listUsers");
      expect(tspContent).toContain("op updateUser");
      expect(tspContent).toContain("op deleteUser");
      
      // Should have namespaces
      expect(tspContent).toContain("namespace TestAPI");
      expect(tspContent).toContain("namespace Utils");
      
      // Should have operation parameters
      expect(tspContent).toContain("@path id: string");
      expect(tspContent).toContain("@query limit?: int32");
      expect(tspContent).toContain("@query offset?: int32");
      expect(tspContent).toContain("@body user: CreateUserRequest");
      
      // Should have proper TypeSpec syntax
      expect(tspContent).toContain("id: string;");
      expect(tspContent).toContain("name: string;");
      expect(tspContent).toContain("email?: string;");
      expect(tspContent).toContain("age: int32;");
      expect(tspContent).toContain("active: boolean;");
      
    } catch (error) {
      console.error("TypeSpec file validation error:", error);
      throw error;
    }
  });

  it("should validate integration-complex.tsp with HTTP decorators", async () => {
    const tspPath = join(process.cwd(), "src/test/integration-complex.tsp");
    
    try {
      expect(existsSync(tspPath)).toBe(true);
      
      const tspContent = readFileSync(tspPath, "utf8");
      
      // Should have HTTP decorators
      expect(tspContent).toContain('import "@typespec/http"');
      expect(tspContent).toContain("@route");
      expect(tspContent).toContain("@tag");
      expect(tspContent).toContain("@error");
      
      // Should have HTTP operations
      expect(tspContent).toContain("@get");
      expect(tspContent).toContain("@post");
      expect(tspContent).toContain("@patch");
      expect(tspContent).toContain("@delete");
      
      // Should have HTTP method patterns
      expect(tspContent).toContain('@path id: string');
      expect(tspContent).toContain('@query limit?: int32');
      expect(tspContent).toContain('@query offset?: int32');
      expect(tspContent).toContain('@body user: User');
      
      // Should have visibility decorators (with correct case)
      expect(tspContent).toContain("@visibility(Lifecycle.Create)");
      expect(tspContent).toContain("@visibility(Lifecycle.Read)");
      
      // Should have error types
      expect(tspContent).toContain("model ApiError");
      expect(tspContent).toContain("code: string;");
      expect(tspContent).toContain("message: string;");
      
      // Should have complex types
      expect(tspContent).toContain("union SearchResult");
      expect(tspContent).toContain("enum Status");
      expect(tspContent).toContain("metadata: Record<string>");
      
    } catch (error) {
      console.error("Complex TypeSpec validation error:", error);
      throw error;
    }
  });

  it("should validate global.tsp file exists and is valid", async () => {
    const globalTspPath = join(process.cwd(), "global.tsp");
    
    try {
      expect(existsSync(globalTspPath)).toBe(true);
      
      const tspContent = readFileSync(globalTspPath, "utf8");
      
      // Should have global models
      expect(tspContent).toContain("model GlobalUser");
      expect(tspContent).toContain("model GlobalProduct");
      
      // Should have scalar types
      expect(tspContent).toContain("id: string");
      expect(tspContent).toContain("price: float64");
      
    } catch (error) {
      console.error("Global TypeSpec validation error:", error);
      throw error;
    }
  });

  it("should validate sample.tsp file exists and is comprehensive", async () => {
    const sampleTspPath = join(process.cwd(), "sample.tsp");
    
    try {
      expect(existsSync(sampleTspPath)).toBe(true);
      
      const tspContent = readFileSync(sampleTspPath, "utf8");
      
      // Should have enums
      expect(tspContent).toContain("enum TaskStatus");
      expect(tspContent).toContain("enum Priority");
      expect(tspContent).toContain("pending,");
      expect(tspContent).toContain("inProgress: \"in_progress\"");
      expect(tspContent).toContain("low: 0,");
      expect(tspContent).toContain("critical: 3,");
      
      // Should have unions
      expect(tspContent).toContain("union NotificationType");
      expect(tspContent).toContain("email: string,");
      expect(tspContent).toContain("sms: string,");
      expect(tspContent).toContain("push: string,");
      
      // Should have complex model relationships
      expect(tspContent).toContain("status: TaskStatus;");
      expect(tspContent).toContain("priority: Priority;");
      expect(tspContent).toContain("assignee?: User;");
      expect(tspContent).toContain("dueDate?: plainDate;");
      
      // Should have namespace
      expect(tspContent).toContain("namespace SampleAPI");
      
    } catch (error) {
      console.error("Sample TypeSpec validation error:", error);
      throw error;
    }
  });
});