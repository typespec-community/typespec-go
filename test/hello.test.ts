import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { emit } from "./test-host.js";

describe("TypeSpec Go Emitter - Model Generation", () => {
  it("generates Go struct from TypeSpec model", async () => {
    const results = await emit(`model Test { name: string; }`);
    const content = results["@typespec-community/typespec-go/api/models.go"];
    
    console.log("Generated content:\n", content);
    
    strictEqual(content?.includes("package api"), true);
    strictEqual(content?.includes("type Test struct"), true);
    strictEqual(content?.includes('Name string `json:"name"`'), true);
  });

  it("handles multiple properties with different types", async () => {
    const results = await emit(`
      model User {
        id: int32;
        name: string;
        active: boolean;
        score: float64;
      }
    `);
    const content = results["@typespec-community/typespec-go/api/models.go"];
    
    console.log("Generated User model:\n", content);
    
    strictEqual(content?.includes("type User struct"), true);
    strictEqual(content?.includes('ID int32 `json:"id"`'), true);
    strictEqual(content?.includes('Name string `json:"name"`'), true);
    strictEqual(content?.includes('Active bool `json:"active"`'), true);
    strictEqual(content?.includes('Score float64 `json:"score"`'), true);
  });

  it("generates multiple models", async () => {
    const results = await emit(`
      model User { name: string; }
      model Post { title: string; }
    `);
    const content = results["@typespec-community/typespec-go/api/models.go"];
    
    console.log("Generated multiple models:\n", content);
    
    strictEqual(content?.includes("type User struct"), true);
    strictEqual(content?.includes("type Post struct"), true);
    strictEqual(content?.includes('Name string `json:"name"`'), true);
    strictEqual(content?.includes('Title string `json:"title"`'), true);
  });
});
