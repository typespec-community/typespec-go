/**
 * Real-World Uint Detection Demonstration
 *
 * Shows the system working with practical field names from real applications
 * Demonstrates the business value of automatic uint detection
 */

import { describe, it, expect } from "bun:test";
import { GoTypeMapper } from "../domain/go-type-mapper.js";

describe("Real-World Uint Detection Demonstration", () => {
  it("should handle e-commerce user model perfectly", () => {
    const userModel = {
      userID: { type: { kind: "scalar", name: "int64" } }, // Should become uint64
      orderCount: { type: { kind: "scalar", name: "int32" } }, // Should become uint32
      age: { type: { kind: "scalar", name: "int8" } }, // Should become uint8
      accountBalance: { type: { kind: "scalar", name: "int64" } }, // Should stay int64 (can be negative)
      rating: { type: { kind: "scalar", name: "int32" } }, // Should stay int32 (can be negative)
    };

    const results = Object.entries(userModel).map(([fieldName, config]: [string, any]) => {
      const mappedType = GoTypeMapper.mapTypeSpecType(config.type, fieldName);
      return { field: fieldName, original: config.type.name, mapped: mappedType.name };
    });

    expect(results).toEqual([
      { field: "userID", original: "int64", mapped: "uint64" }, // ✅ Detected: never-negative
      { field: "orderCount", original: "int32", mapped: "uint32" }, // ✅ Detected: never-negative
      { field: "age", original: "int8", mapped: "uint8" }, // ✅ Detected: never-negative
      { field: "accountBalance", original: "int64", mapped: "int64" }, // ✅ Correct: can be negative
      { field: "rating", original: "int32", mapped: "int32" }, // ✅ Correct: can be negative
    ]);
  });

  it("should handle social media analytics model", () => {
    const analyticsModel = {
      postID: { type: { kind: "scalar", name: "int64" } }, // Should become uint64
      likeCount: { type: { kind: "scalar", name: "int32" } }, // Should become uint32
      shareCount: { type: { kind: "scalar", name: "int32" } }, // Should become uint32
      viewCount: { type: { kind: "scalar", name: "int64" } }, // Should become uint64
      engagementScore: { type: { kind: "scalar", name: "float64" } }, // Should stay float64
      position: { type: { kind: "scalar", name: "int32" } }, // Should become uint32
      trendingScore: { type: { kind: "scalar", name: "int32" } }, // Should stay int32 (can be negative)
    };

    const results = Object.entries(analyticsModel).map(([fieldName, config]: [string, any]) => {
      const mappedType = GoTypeMapper.mapTypeSpecType(config.type, fieldName);
      return { field: fieldName, original: config.type.name, mapped: mappedType.name };
    });

    expect(results).toEqual([
      { field: "postID", original: "int64", mapped: "uint64" }, // ✅ Detected: never-negative
      { field: "likeCount", original: "int32", mapped: "uint32" }, // ✅ Detected: never-negative
      { field: "shareCount", original: "int32", mapped: "uint32" }, // ✅ Detected: never-negative
      { field: "viewCount", original: "int64", mapped: "uint64" }, // ✅ Detected: never-negative
      { field: "engagementScore", original: "float64", mapped: "float64" }, // ✅ Correct: not integer
      { field: "position", original: "int32", mapped: "uint32" }, // ✅ Detected: never-negative
      { field: "trendingScore", original: "int32", mapped: "int32" }, // ✅ Correct: can be negative
    ]);
  });

  it("should demonstrate performance with sub-5ms guarantee", () => {
    const fields = [
      "userID", "orderCount", "itemQuantity", "age", "statusCode",
      "pageCount", "fileSize", "arrayIndex", "phoneNumber", "zipCode"
    ];

    const start = performance.now();
    
    // Process 100 models with 10 fields each = 1,000 field mappings
    for (let i = 0; i < 100; i++) {
      fields.forEach(field => {
        const mockType = { kind: "scalar", name: "int32" } as any;
        GoTypeMapper.mapTypeSpecType(mockType, field);
      });
    }
    
    const end = performance.now();
    const totalTime = end - start;
    const avgTimePerField = totalTime / 1000; // 1,000 field mappings

    console.log(`🚀 Uint Detection Performance:`);
    console.log(`   Total time: ${totalTime.toFixed(2)}ms for 1,000 field mappings`);
    console.log(`   Average time: ${avgTimePerField.toFixed(4)}ms per field`);

    expect(avgTimePerField).toBeLessThan(0.005); // Sub-0.005ms per field = sub-5ms per model
    expect(totalTime).toBeLessThan(5); // Total should be well under 5ms
  });

  it("should show business value in generated Go code", () => {
    const modelType = {
      userID: { type: { kind: "scalar", name: "int64" }, optional: false },
      orderCount: { type: { kind: "scalar", name: "int32" }, optional: true },
      age: { type: { kind: "scalar", name: "int8" }, optional: false },
      accountBalance: { type: { kind: "scalar", name: "int64" }, optional: true },
    };

    // Generate Go struct fields
    const goFields = Object.entries(modelType).map(([fieldName, config]: [string, any]) => {
      const mappedType = GoTypeMapper.mapTypeSpecType(config.type, fieldName);
      const goTypeString = GoTypeMapper.generateGoTypeString(mappedType);
      const isOptional = config.optional && mappedType.usePointerForOptional;
      const finalType = isOptional ? `*${goTypeString}` : goTypeString;
      
      const goName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      const jsonTag = isOptional ? `json:"${fieldName},omitempty"` : `json:"${fieldName}"`;
      
      return `  ${goName} ${finalType} \`${jsonTag}\``;
    });

    const goStruct = `type User struct {\n${goFields.join('\n')}\n}`;

    expect(goStruct).toContain(`UserID uint64 \`json:"userID"\``); // ✅ Automatically uint64
    expect(goStruct).toContain(`OrderCount *uint32 \`json:"orderCount,omitempty\"\``); // ✅ Automatically uint32 pointer
    expect(goStruct).toContain(`Age uint8 \`json:"age"\``); // ✅ Automatically uint8
    expect(goStruct).toContain(`AccountBalance *int64 \`json:"accountBalance,omitempty\"\``); // ✅ Correctly stays int64

    console.log(`🎯 Generated Go struct with uint domain intelligence:`);
    console.log(goStruct);
  });
});