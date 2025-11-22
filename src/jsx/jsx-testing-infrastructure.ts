/**
 * JSX Testing Infrastructure for TypeSpec Go Emitter
 *
 * TESTING FRAMEWORK: Comprehensive JSX component testing
 * TYPE SAFETY: Professional test utilities
 * MIGRATION SUPPORT: Bridge between string and JSX tests
 */

// Type-only imports for now to avoid JSX runtime issues
import type { GoFieldConfig, GoStructConfig, GoFileConfig } from "./go-jsx-type-safety";

/**
 * JSX Test Utilities
 * TESTING INFRASTRUCTURE: Professional test helpers
 */
export class JsxTestUtils {
  /**
   * Create test field configuration
   * TESTING: Standardized field creation
   */
  static createTestField(overrides: Partial<GoFieldConfig> = {}): GoFieldConfig {
    const baseField: GoFieldConfig = {
      name: "testField",
      type: "string",
      optional: false,
      jsonTag: "test_field",
      documentation: "Test field for testing"
    };
    
    return { ...baseField, ...overrides };
  }

  /**
   * Create test struct configuration
   * TESTING: Standardized struct creation
   */
  static createTestStruct(overrides: Partial<GoStructConfig> = {}): GoStructConfig {
    const baseStruct: GoStructConfig = {
      name: "TestStruct",
      fields: [
        this.createTestField({
          name: "id",
          type: "string",
          jsonTag: "id"
        }),
        this.createTestField({
          name: "name",
          type: "string",
          jsonTag: "name"
        })
      ],
      documentation: "Test struct for testing"
    };
    
    return { ...baseStruct, ...overrides };
  }

  /**
   * Create test file configuration
   * TESTING: Standardized file creation
   */
  static createTestFile(overrides: Partial<GoFileConfig> = {}): GoFileConfig {
    const baseFile: GoFileConfig = {
      path: "test.go",
      packageName: "api",
      imports: [],
      structs: [this.createTestStruct()],
      documentation: "Test file for testing"
    };
    
    return { ...baseFile, ...overrides };
  }

  /**
   * Assert valid field configuration
   * TESTING: Field validation assertions
   */
  static assertValidField(field: GoFieldConfig): void {
    if (!field.name?.trim()) {
      throw new Error("Field name is required");
    }
    if (!field.type?.trim()) {
      throw new Error("Field type is required");
    }
    if (!field.jsonTag?.trim()) {
      throw new Error("JSON tag is required");
    }
    if (typeof field.optional !== "boolean") {
      throw new Error("Optional must be boolean");
    }
  }

  /**
   * Assert valid struct configuration
   * TESTING: Struct validation assertions
   */
  static assertValidStruct(struct: GoStructConfig): void {
    if (!struct.name?.trim()) {
      throw new Error("Struct name is required");
    }
    if (!Array.isArray(struct.fields) || struct.fields.length === 0) {
      throw new Error("Struct must have at least one field");
    }
    
    // Assert all fields are valid
    struct.fields.forEach((field: GoFieldConfig) => this.assertValidField(field));
  }

  /**
   * Assert valid file configuration
   * TESTING: File validation assertions
   */
  static assertValidFile(file: GoFileConfig): void {
    if (!file.path?.trim()) {
      throw new Error("File path is required");
    }
    if (!file.packageName?.trim()) {
      throw new Error("Package name is required");
    }
    if (!Array.isArray(file.imports)) {
      throw new Error("Imports must be array");
    }
    if (!Array.isArray(file.structs) || file.structs.length === 0) {
      throw new Error("File must contain at least one struct");
    }
    
    // Assert all structs are valid
    file.structs.forEach((struct: GoStructConfig) => this.assertValidStruct(struct));
  }

  /**
   * Create comprehensive test data
   * TESTING: Multiple test scenarios
   */
  static createComprehensiveTestData() {
    return {
      basicField: this.createTestField(),
      optionalField: this.createTestField({
        name: "optionalField",
        type: "string",
        optional: true,
        jsonTag: "optional_field"
      }),
      intField: this.createTestField({
        name: "count",
        type: "int32",
        optional: false,
        jsonTag: "count"
      }),
      boolField: this.createTestField({
        name: "active",
        type: "bool",
        optional: false,
        jsonTag: "active"
      }),
      pointerField: this.createTestField({
        name: "pointerField",
        type: "string",
        optional: true,
        jsonTag: "pointer_field"
      }),
      basicStruct: this.createTestStruct(),
      complexStruct: this.createTestStruct({
        name: "ComplexStruct",
        fields: [
          this.createTestField({name: "id", type: "string", jsonTag: "id"}),
          this.createTestField({name: "name", type: "string", jsonTag: "name"}),
          this.createTestField({name: "age", type: "int32", optional: true, jsonTag: "age"}),
          this.createTestField({name: "active", type: "bool", jsonTag: "active"}),
          this.createTestField({name: "tags", type: "[]string", optional: true, jsonTag: "tags"})
        ]
      }),
      basicFile: this.createTestFile(),
      complexFile: this.createTestFile({
        path: "complex.go",
        packageName: "models",
        imports: ["context", "time"],
        structs: [
          this.createTestStruct({name: "User"}),
          this.createTestStruct({
            name: "Profile", 
            fields: [
              this.createTestField({name: "bio", type: "string", optional: true, jsonTag: "bio"}),
              this.createTestField({name: "avatar", type: "string", optional: true, jsonTag: "avatar"})
            ]
          })
        ]
      })
    };
  }
}

/**
 * JSX Performance Test Utilities
 * PERFORMANCE: Component generation benchmarking
 */
export class JsxPerformanceTestUtils {
  /**
   * Benchmark component creation
   * PERFORMANCE: Measure component generation speed
   */
  static async benchmarkComponentCreation(
    iterations: number = 1000
  ): Promise<{duration: number; rate: number}> {
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      JsxTestUtils.createTestStruct();
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    const rate = iterations / (duration / 1000);
    
    return { duration, rate };
  }

  /**
   * Benchmark field validation
   * PERFORMANCE: Measure validation speed
   */
  static async benchmarkFieldValidation(
    iterations: number = 1000
  ): Promise<{duration: number; rate: number}> {
    const testFields = Array.from({length: iterations}, (_, i) => 
      JsxTestUtils.createTestField({name: `field${i}`})
    );
    
    const startTime = performance.now();
    
    testFields.forEach(field => {
      JsxTestUtils.assertValidField(field);
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    const rate = iterations / (duration / 1000);
    
    return { duration, rate };
  }

  /**
   * Memory usage test
   * PERFORMANCE: Monitor memory consumption
   */
  static testMemoryUsage(iterations: number = 100): {
    initialMemory: number;
    peakMemory: number;
    finalMemory: number;
  } {
    const initialMemory = process.memoryUsage().heapUsed;
    let peakMemory = initialMemory;
    
    const components: GoStructConfig[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const component = JsxTestUtils.createTestStruct({name: `Struct${i}`});
      components.push(component);
      
      const currentMemory = process.memoryUsage().heapUsed;
      if (currentMemory > peakMemory) {
        peakMemory = currentMemory;
      }
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    
    return { initialMemory, peakMemory, finalMemory };
  }
}

/**
 * JSX Integration Test Utilities
 * INTEGRATION: End-to-end testing support
 */
export class JsxIntegrationTestUtils {
  /**
   * Calculate string similarity
   * INTEGRATION: Output comparison metric
   */
  static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Levenshtein distance calculation
   * INTEGRATION: String similarity algorithm
   */
  static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let i = 1; i <= str1.length; i++) {
      matrix[0] = [i];
      for (let j = 1; j <= str2.length; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + cost // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Generate migration test scenarios
   * INTEGRATION: String to JSX migration tests
   */
  static generateMigrationTestScenarios() {
    return {
      simpleStruct: {
        stringInput: `type User struct {\n  ID string ` + "`json:\"id\"`" + `\n  Name string ` + "`json:\"name\"`" + `\n}`,
        jsxConfig: JsxTestUtils.createTestStruct({
          name: "User",
          fields: [
            JsxTestUtils.createTestField({name: "ID", type: "string", jsonTag: "id"}),
            JsxTestUtils.createTestField({name: "Name", type: "string", jsonTag: "name"})
          ]
        })
      },
      complexStruct: {
        stringInput: `type ComplexModel struct {\n  ID string ` + "`json:\"id\"`" + `\n  Age *int32 ` + "`json:\"age,omitempty\"`" + `\n  Active bool ` + "`json:\"active\"`" + `\n}`,
        jsxConfig: JsxTestUtils.createTestStruct({
          name: "ComplexModel",
          fields: [
            JsxTestUtils.createTestField({name: "ID", type: "string", jsonTag: "id"}),
            JsxTestUtils.createTestField({name: "Age", type: "int32", optional: true, jsonTag: "age"}),
            JsxTestUtils.createTestField({name: "Active", type: "bool", jsonTag: "active"})
          ]
        })
      }
    };
  }
}

/**
 * Export test utilities
 * TESTING: Complete test infrastructure
 */
export const JsxTestInfrastructure = {
  TestUtils: JsxTestUtils,
  PerformanceTest: JsxPerformanceTestUtils,
  IntegrationTest: JsxIntegrationTestUtils
} as const;

export default JsxTestInfrastructure;