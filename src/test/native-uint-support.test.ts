import { describe, it, expect } from "vitest";
import { StandaloneGoGenerator } from "../standalone-generator.js";

const generator = new StandaloneGoGenerator();

describe("Native TypeSpec uint Support", () => {
  it("should handle native uint32, uint8, uint16, uint64 types directly", () => {
    // Use NATIVE TypeSpec uint types - NO AI DETECTION NEEDED!
    const userModel = {
      name: "User",
      properties: new Map([
        // Native uint types → Direct 1:1 Go mapping
        [
          "userID",
          { name: "userID", type: { kind: "Uint32" }, optional: false },
        ],
        ["age", { name: "age", type: { kind: "Uint8" }, optional: false }],
        [
          "loginCount",
          { name: "loginCount", type: { kind: "Uint16" }, optional: true },
        ],
        [
          "bigNumber",
          { name: "bigNumber", type: { kind: "Uint64" }, optional: true },
        ],

        // Mixed types for comprehensive testing
        [
          "isActive",
          { name: "isActive", type: { kind: "Boolean" }, optional: false },
        ],
        [
          "username",
          { name: "username", type: { kind: "String" }, optional: false },
        ],
        [
          "balance",
          { name: "balance", type: { kind: "Int64" }, optional: true },
        ], // Signed when negative possible
      ]),
    };

    // Generate Go code using NATIVE TypeSpec types
    const generator = new StandaloneGoGenerator();
    const result = generator.generateModel(userModel);

    // Verify success
    expect(result._tag).toBe("success");
    const goCode = Array.from(result.data.values())[0];

    // Verify NATIVE 1:1 TypeSpec → Go mapping
    expect(goCode).toContain("UserID uint32"); // Uint32 → uint32 (direct)
    expect(goCode).toContain("Age uint8"); // Uint8 → uint8 (direct)
    expect(goCode).toContain("LoginCount *uint16"); // Uint16 optional → *uint16 (direct)
    expect(goCode).toContain("BigNumber *uint64"); // Uint64 optional → *uint64 (direct)
    expect(goCode).toContain("Balance *int64"); // Int64 stays int64 (correct)
    expect(goCode).toContain("Username string"); // String → string (direct)
    expect(goCode).toContain("IsActive bool"); // Boolean → bool (direct)

    console.log("✅ Native TypeSpec uint Support DEMO:");
    console.log(goCode);
  });

  it("should demonstrate performance of native type mapping", () => {
    const iterations = 10000;
    const nativeTypes = [
      { kind: "Uint8" },
      { kind: "Uint16" },
      { kind: "Uint32" },
      { kind: "Uint64" },
      { kind: "String" },
      { kind: "Boolean" },
    ];

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      nativeTypes.forEach((type) => {
        StandaloneGoGenerator.mapTypeSpecType(type);
      });
    }
    const end = performance.now();

    const totalTime = end - start;
    const totalMappings = iterations * nativeTypes.length;
    const avgTime = totalTime / totalMappings;
    const throughput = totalMappings / (totalTime / 1000);

    console.log(`🚀 Native TypeSpec Performance:`);
    console.log(
      `   ${totalMappings} native type mappings in ${totalTime.toFixed(2)}ms`,
    );
    console.log(`   Average: ${avgTime.toFixed(4)}ms per mapping`);
    console.log(`   Throughput: ${throughput.toFixed(0)} mappings/sec`);

    // Verify excellent performance (should be even better without AI detection)
    expect(avgTime).toBeLessThan(0.001); // Sub-0.001ms per mapping
    expect(totalTime).toBeLessThan(50); // Total under 50ms
  });
});
