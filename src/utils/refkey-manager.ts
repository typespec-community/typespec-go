/**
 * Refkey Management Utility
 * Manages Alloy-JS refkeys for symbol tracking across generated files
 * Follows guide's "Symbol Management with Refkeys" pattern
 */

import { refkey, type Refkey } from "@alloy-js/core";
import type { Model, Scalar, Union, Type, Enum } from "@typespec/compiler";

/**
 * Refkey Registry
 * Centralized management of all refkeys for consistent symbol tracking
 */
export class RefkeyRegistry {
  private modelRefkeys = new Map<string, Refkey>();
  private typeRefkeys = new Map<string, Refkey>();
  private serviceRefkeys = new Map<string, Refkey>();
  
  /**
   * Get or create refkey for a model
   * Consistent refkey for same model across multiple generations
   */
  getModelRefkey(model: Model): Refkey {
    const modelName = model.name || "unnamed";
    
    if (!this.modelRefkeys.has(modelName)) {
      this.modelRefkeys.set(modelName, refkey(model));
    }
    
    return this.modelRefkeys.get(modelName)!;
  }
  
  /**
   * Get or create refkey for a type
   * Handles scalar, union, and complex types
   */
  getTypeRefkey(type: Type): Refkey {
    let typeName: string;
    
    switch (type.kind) {
      case "Scalar":
        typeName = `scalar_${(type as Scalar).name}`;
        break;
      case "Model":
        typeName = `model_${(type as Model).name || "unnamed"}`;
        break;
      case "Union":
        typeName = `union_${type.name || "unnamed"}`;
        break;
      case "Enum":
        typeName = `enum_${(type as Enum).name || "unnamed"}`;
        break;
      default:
        typeName = `type_${type.kind}_${type.name || "unknown"}`;
    }
    
    if (!this.typeRefkeys.has(typeName)) {
      this.typeRefkeys.set(typeName, refkey(type));
    }
    
    return this.typeRefkeys.get(typeName)!;
  }
  
  /**
   * Get or create refkey for a service
   * Service operations and client generation
   */
  getServiceRefkey(serviceName: string, operationName?: string): Refkey {
    const key = operationName ? `${serviceName}_${operationName}` : serviceName;
    
    if (!this.serviceRefkeys.has(key)) {
      this.serviceRefkeys.set(key, refkey(serviceName, operationName));
    }
    
    return this.serviceRefkeys.get(key)!;
  }
  
  /**
   * Create multiple related refkeys for the same schema
   * Following guide's "Multiple refkeys for same schema" pattern
   */
  createSchemaRefkeys(schema: unknown, suffixes: string[]): Record<string, Refkey> {
    const refkeys: Record<string, Refkey> = {};
    
    for (const suffix of suffixes) {
      refkeys[suffix] = refkey(schema, suffix);
    }
    
    return refkeys;
  }
  
  /**
   * Clear all refkeys (useful for testing)
   */
  clear(): void {
    this.modelRefkeys.clear();
    this.typeRefkeys.clear();
    this.serviceRefkeys.clear();
  }
  
  /**
   * Get statistics for debugging
   */
  getStats(): { models: number; types: number; services: number } {
    return {
      models: this.modelRefkeys.size,
      types: this.typeRefkeys.size,
      services: this.serviceRefkeys.size
    };
  }
}

/**
 * Global refkey registry instance
 * Singleton pattern for consistent refkey management
 */
export const refkeyRegistry = new RefkeyRegistry();

/**
 * Convenience functions for common refkey operations
 */
export function getModelRefkey(model: Model): Refkey {
  return refkeyRegistry.getModelRefkey(model);
}

export function getTypeRefkey(type: Type): Refkey {
  return refkeyRegistry.getTypeRefkey(type);
}

export function getServiceRefkey(serviceName: string, operationName?: string): Refkey {
  return refkeyRegistry.getServiceRefkey(serviceName, operationName);
}

export function createSchemaRefkeys(schema: unknown, suffixes: string[]): Record<string, Refkey> {
  return refkeyRegistry.createSchemaRefkeys(schema, suffixes);
}