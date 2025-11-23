/**
 * Manual Test for StandaloneGoGenerator
 *
 * This tests our basic Go generation functionality without
 * complex TypeSpec testing framework.
 */

import { describe, it, expect } from "vitest";
import { StandaloneGoGenerator } from "../standalone-generator.js";
import {
  TypeSpecTypeMapper,
  TypeSpecPropertyNode,
} from "../mappers/type-mapper.js";

describe("Manual Basic Test", () => {
  it("should generate basic Go code correctly", () => {
    console.log("🧪 Testing basic Go generation...");

    try {
      const generator = new StandaloneGoGenerator();

      // Create a simple TypeSpec model
      const properties = new Map<string, TypeSpecPropertyNode>();

      properties.set("name", {
        name: "name",
        type: { kind: "scalar", name: "string" },
        optional: false,
        documentation: "User name",
      });

      properties.set("age", {
        name: "age",
        type: { kind: "scalar", name: "uint8" },
        optional: true,
        documentation: "User age (0-255)",
      });

      const model = {
        name: "User",
        properties,
      };

      // Generate Go code
      const result = generator.generateModel(model);

      // Handle result using proper discriminated union

      
      if (result._tag === "success") {
        const goCode = Array.from(result.data.values())[0];
        
        // Verify basic structure
        expect(goCode).toContain("package api");
        expect(goCode).toContain("type User struct {");
        expect(goCode).toContain('Name string `json:"name"`');
        expect(goCode).toContain('Age *uint8 `json:"age,omitempty"`');
        expect(goCode).toContain("}");
        
        expect(result.data.size).toBe(1);
        expect(Array.from(result.data.keys())[0]).toBe("User.go");
      } else {
        console.error("❌ FAILED:", result.message);
        console.error("❌ RESULT DEBUG:", JSON.stringify(result, null, 2));
        throw new Error(`Go generation failed: ${result.message}`);
      }
    } catch (error) {
      console.error("❌ FAILED:", error);
      console.error("❌ ERROR DETAILS:", error instanceof Error ? error.stack : error);
      throw error;
    }
  });
});