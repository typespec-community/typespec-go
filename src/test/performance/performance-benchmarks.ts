/**
 * Performance Benchmarks - TypeSpec Go Emitter
 *
 * Benchmark definitions and model factories for performance testing
 */

export interface PerformanceBenchmark {
  id: string;
  name: string;
  category: "basic" | "complex" | "large" | "stress";
  expectedMaxTimeMs: number;
  expectedMaxMemoryMB: number;
  expectedMinThroughput: number;
  modelFactory: () => any;
}

export interface PerformanceTestResult {
  benchmark: PerformanceBenchmark;
  actualTimeMs: number;
  actualMemoryMB: number;
  actualThroughput: number;
  passed: boolean;
  failureReason?: string;
  timestamp: string;
}

/**
 * Performance benchmark definitions
 */
export const PERFORMANCE_BENCHMARKS: PerformanceBenchmark[] = [
  // Basic performance benchmarks
  {
    id: "basic-simple-user",
    name: "Simple User Model",
    category: "basic",
    expectedMaxTimeMs: 5,
    expectedMaxMemoryMB: 2,
    expectedMinThroughput: 10,
    modelFactory: () => ({
      name: "SimpleUser",
      properties: {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        email: { type: "string", required: false },
      },
    }),
  },
  {
    id: "basic-address-model",
    name: "Address Model",
    category: "basic", 
    expectedMaxTimeMs: 5,
    expectedMaxMemoryMB: 2,
    expectedMinThroughput: 8,
    modelFactory: () => ({
      name: "Address",
      properties: {
        street: { type: "string", required: true },
        city: { type: "string", required: true },
        state: { type: "string", required: true },
        zipCode: { type: "string", required: true },
        country: { type: "string", required: false },
      },
    }),
  },

  // Complex performance benchmarks
  {
    id: "complex-user-profile",
    name: "Complex User Profile",
    category: "complex",
    expectedMaxTimeMs: 15,
    expectedMaxMemoryMB: 8,
    expectedMinThroughput: 20,
    modelFactory: () => ({
      name: "UserProfile",
      properties: {
        id: { type: "string", required: true },
        username: { type: "string", required: true },
        email: { type: "string", required: true },
        age: { type: "uint8", required: false },
        profile: {
          type: "object",
          required: false,
          properties: {
            bio: { type: "string", required: false },
            avatar: { type: "string", required: false },
            preferences: {
              type: "object",
              required: false,
              properties: {
                theme: { type: "string", required: false },
                language: { type: "string", required: false },
                notifications: { type: "boolean", required: false },
              },
            },
          },
        },
        roles: {
          type: "array",
          required: false,
          elementType: { type: "string", required: true },
        },
        metadata: {
          type: "object",
          required: false,
          properties: {
            createdAt: { type: "string", required: true },
            updatedAt: { type: "string", required: false },
            version: { type: "uint32", required: false },
          },
        },
      },
    }),
  },

  // Large model benchmarks
  {
    id: "large-ecommerce-product",
    name: "Large E-commerce Product",
    category: "large",
    expectedMaxTimeMs: 50,
    expectedMaxMemoryMB: 15,
    expectedMinThroughput: 15,
    modelFactory: () => ({
      name: "Product",
      properties: {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        description: { type: "string", required: false },
        price: { type: "float64", required: true },
        currency: { type: "string", required: true },
        sku: { type: "string", required: true },
        categories: {
          type: "array",
          required: false,
          elementType: { type: "string", required: true },
        },
        images: {
          type: "array",
          required: false,
          elementType: {
            type: "object",
            required: false,
            properties: {
              url: { type: "string", required: true },
              alt: { type: "string", required: false },
              width: { type: "uint32", required: false },
              height: { type: "uint32", required: false },
            },
          },
        },
        specifications: {
          type: "object",
          required: false,
          properties: {
            weight: { type: "float64", required: false },
            dimensions: {
              type: "object",
              required: false,
              properties: {
                length: { type: "float64", required: false },
                width: { type: "float64", required: false },
                height: { type: "float64", required: false },
                unit: { type: "string", required: false },
              },
            },
            material: { type: "string", required: false },
            color: { type: "string", required: false },
            size: { type: "string", required: false },
          },
        },
        inventory: {
          type: "object",
          required: false,
          properties: {
            quantity: { type: "uint32", required: true },
            reserved: { type: "uint32", required: false },
            available: { type: "uint32", required: false },
            reorderLevel: { type: "uint32", required: false },
            lastUpdated: { type: "string", required: true },
          },
        },
        pricing: {
          type: "object",
          required: false,
          properties: {
            basePrice: { type: "float64", required: true },
            salePrice: { type: "float64", required: false },
            cost: { type: "float64", required: false },
            margin: { type: "float64", required: false },
            currency: { type: "string", required: true },
          },
        },
        seo: {
          type: "object",
          required: false,
          properties: {
            title: { type: "string", required: false },
            description: { type: "string", required: false },
            keywords: {
              type: "array",
              required: false,
              elementType: { type: "string", required: true },
            },
            slug: { type: "string", required: false },
          },
        },
        metadata: {
          type: "object",
          required: false,
          properties: {
            createdAt: { type: "string", required: true },
            updatedAt: { type: "string", required: false },
            createdBy: { type: "string", required: false },
            updatedBy: { type: "string", required: false },
            version: { type: "uint32", required: false },
            status: { type: "string", required: false },
            tags: {
              type: "array",
              required: false,
              elementType: { type: "string", required: true },
            },
          },
        },
      },
    }),
  },

  // Stress test benchmarks
  {
    id: "stress-massive-model",
    name: "Massive Model Stress Test",
    category: "stress",
    expectedMaxTimeMs: 100,
    expectedMaxMemoryMB: 25,
    expectedMinThroughput: 5,
    modelFactory: () => {
      const properties: Record<string, any> = {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        description: { type: "string", required: false },
      };

      // Add 50 string fields
      for (let i = 0; i < 50; i++) {
        properties[`stringField${i}`] = { type: "string", required: i % 2 === 0 };
      }

      // Add 20 numeric fields
      for (let i = 0; i < 20; i++) {
        properties[`numericField${i}`] = { type: i % 2 === 0 ? "int32" : "float64", required: i % 3 === 0 };
      }

      // Add 10 boolean fields
      for (let i = 0; i < 10; i++) {
        properties[`booleanField${i}`] = { type: "boolean", required: i % 2 === 0 };
      }

      // Add 5 array fields
      for (let i = 0; i < 5; i++) {
        properties[`arrayField${i}`] = {
          type: "array",
          required: false,
          elementType: { type: "string", required: true },
        };
      }

      return {
        name: "MassiveModel",
        properties,
      };
    },
  },
];