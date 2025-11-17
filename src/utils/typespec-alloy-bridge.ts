/**
 * TypeSpec to Alloy.js Bridge
 * 
 * Transforms TypeSpec models to JSX components for Go generation
 * ZERO 'ANY' TYPES: Complete type safety throughout transformation
 */

import { jsx } from "@alloy-js/core/jsx-runtime";
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";
import type { Component } from "@alloy-js/core";

/**
 * TypeSpec Type Node
 */
export interface TypeSpecTypeNode {
  readonly kind: "String" | "Int8" | "Int16" | "Int32" | "Int64" | 
           "Uint8" | "Uint16" | "Uint32" | "Uint64" | 
           "Float32" | "Float64" | "Boolean" | "Bytes" |
           "Array" | "Model" | "Enum" | "Union";
  readonly element?: TypeSpecTypeNode; // For arrays
  readonly name?: string; // For models
}

/**
 * TypeSpec Property Node
 */
export interface TypeSpecPropertyNode {
  readonly name: string;
  readonly type: TypeSpecTypeNode;
  readonly optional: boolean;
  readonly documentation?: string;
}

/**
 * TypeSpec Model Interface
 */
export interface TypeSpecModel {
  readonly name: string;
  readonly properties: ReadonlyMap<string, TypeSpecPropertyNode>;
}

/**
 * TypeSpec to JSX Bridge Class
 * 
 * Transforms TypeSpec models to Alloy.js JSX components
 * TYPE SAFETY: Comprehensive type mapping with zero 'any' types
 */
export class TypeSpecAlloyBridge {
  /**
   * Convert TypeSpec model to JSX Go struct
   */
  modelToJsxStruct(model: TypeSpecModel) {
    const fileName = `${model.name.toLowerCase()}.go`;
    const structMembers = this.createStructMembers(model.properties);
    
    return jsx(SourceFile, { 
      path: fileName,
      children: jsx(StructTypeDeclaration, { 
        name: model.name,
        children: structMembers
      })
    });
  }

  /**
   * Create JSX struct members from TypeSpec properties
   */
  private createStructMembers(properties: ReadonlyMap<string, TypeSpecPropertyNode>) {
    const members: Component[] = [];
    
    for (const [propertyName, property] of properties) {
      const member = this.createStructMember(propertyName, property);
      if (member) {
        members.push(member);
      }
    }
    
    return members;
  }

  /**
   * Create individual JSX struct member
   */
  private createStructMember(propertyName: string, property: TypeSpecPropertyNode): Component | null {
    try {
      const goFieldName = this.mapFieldName(propertyName);
      const goType = this.mapType(property.type);
      const jsonTag = this.createJsonTag(property);
      const exported = !propertyName.startsWith('_');
      
      return jsx(StructMember, {
        name: goFieldName,
        type: goType,
        tag: jsonTag,
        exported: exported
      });
    } catch (error) {
      console.error('Failed to create struct member for ' + propertyName + ':', error);
      return null;
    }
  }

  /**
   * Map field name from TypeSpec to Go conventions
   */
  private mapFieldName(propertyName: string): string {
    // Convert TypeSpec naming to Go exported naming
    return propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
  }

  /**
   * Map TypeSpec type to Go type string
   */
  private mapType(type: TypeSpecTypeNode): string {
    switch (type.kind) {
      case "String":
        return "string";
      case "Boolean":
        return "bool";
      case "Int8":
        return "int8";
      case "Int16":
        return "int16";
      case "Int32":
        return "int32";
      case "Int64":
        return "int64";
      case "Uint8":
        return "uint8";
      case "Uint16":
        return "uint16";
      case "Uint32":
        return "uint32";
      case "Uint64":
        return "uint64";
      case "Float32":
        return "float32";
      case "Float64":
        return "float64";
      case "Bytes":
        return "[]byte";
      case "Array":
        return "[]" + (type.element ? this.mapType(type.element) : "interface{}");
      case "Model":
        return type.name || "interface{}";
      case "Enum":
        return "string"; // Simplified - enums as strings
      case "Union":
        return "interface{}"; // Simplified - unions as interface{}
      default:
        return "interface{}";
    }
  }

  /**
   * Create JSON tag for struct field
   */
  private createJsonTag(property: TypeSpecPropertyNode): string {
    const jsonName = property.name;
    const omitempty = property.optional ? ",omitempty" : "";
    return 'json:"' + jsonName + omitempty + '"';
  }
}

/**
 * Bridge factory function
 */
export function createTypeSpecAlloyBridge(): TypeSpecAlloyBridge {
  return new TypeSpecAlloyBridge();
}