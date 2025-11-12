/**
 * Go Property Transformation Utilities
 * 
 * Centralized transformation of TypeSpec model properties to Go struct fields
 * Eliminates split brain logic scattered across functions
 * 
 * @fileoverview Property transformation with type safety
 */

import type {
  ModelProperty as TypeSpecModelProperty,
  Type as TypeSpecType,
} from "@typespec/compiler";
import type { MappedGoType } from "./type-mapper.js";
import { GoTypeMapper } from "./type-mapper.js";

/**
 * Transformed Go field information
 */
export interface TransformedGoField {
  /** Go field name (PascalCase) */
  readonly name: string;
  
  /** Go type string */
  readonly type: string;
  
  /** Whether field is exported (public) */
  readonly exported: boolean;
  
  /** JSON struct tag */
  readonly jsonTag: string;
  
  /** Whether field is optional (pointer type) */
  readonly optional: boolean;
  
  /** Whether field requires import */
  readonly requiresImport: boolean;
  
  /** Import path if needed */
  readonly importPath?: string;
}

/**
 * TypeSpec model property to Go struct field transformer
 * 
 * Handles all field transformation logic in one place:
 * - Naming conventions (TypeSpec camelCase → Go PascalCase)
 * - Type mapping with import management
 * - Optional property handling (pointer types)
 * - Struct tag generation
 */
export class PropertyTransformer {
  /**
   * Transform TypeSpec property to Go field
   */
  static transformProperty(prop: TypeSpecModelProperty): TransformedGoField {
    // Validate input
    if (!prop.name || !prop.type) {
      throw new Error(`Invalid property: missing name or type`);
    }

    // Map TypeSpec type to Go type
    const mappedGoType = GoTypeMapper.mapTypeSpecType(prop.type);
    
    // Transform field name (camelCase → PascalCase)
    const fieldName = this.toGoFieldName(prop.name);
    
    // Generate JSON tag (always use original TypeSpec name)
    const jsonTag = this.generateJsonTag(prop);
    
    // Determine if field should be optional (pointer type)
    const isOptional = prop.optional || false;
    
    // Generate Go type (pointer for optional, non-pointer for required)
    const goType = this.generateGoType(mappedGoType, isOptional);
    
    return {
      name: fieldName,
      type: goType,
      exported: true, // JSON fields should always be exported
      jsonTag,
      optional: isOptional,
      requiresImport: mappedGoType.requiresImport,
      importPath: mappedGoType.importPath,
    };
  }

  /**
   * Generate Go type with optional handling
   */
  private static generateGoType(mappedType: MappedGoType, isOptional: boolean): string {
    // Use pointer for optional if type supports it
    if (isOptional && mappedType.usePointerForOptional) {
      return `*${mappedType.name}`;
    }
    
    // Don't use pointer for non-optional or types that don't support pointers
    return mappedType.name;
  }

  /**
   * Transform TypeSpec property name to Go field name
   * 
   * TypeSpec uses camelCase (userName) → Go uses PascalCase (UserName)
   * Also handles common initialisms (ID, URL, API)
   */
  private static toGoFieldName(typeSpecName: string): string {
    // Handle common initialisms that should remain uppercase
    const initialisms = ["id", "url", "api", "http", "https", "json", "xml", "sql", "uuid"];
    
    return typeSpecName
      .split(/[_-]/) // Split on underscores and hyphens
      .map((word, index) => {
        // First word: capitalize first letter
        if (index === 0) {
          return this.capitalizeWord(word, initialisms);
        }
        // Subsequent words: capitalize first letter
        return this.capitalizeWord(word, initialisms);
      })
      .join("");
  }

  /**
   * Capitalize a word, handling initialisms
   */
  private static capitalizeWord(word: string, initialisms: readonly string[]): string {
    const lowerWord = word.toLowerCase();
    
    // Check if word is a common initialism
    if (initialisms.includes(lowerWord)) {
      return word.toUpperCase();
    }
    
    // Normal capitalization
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  /**
   * Generate JSON struct tag for Go field
   * 
   * Handles optional fields and custom naming
   */
  private static generateJsonTag(prop: TypeSpecModelProperty): string {
    const tagName = prop.name; // Use original TypeSpec name
    const options: string[] = [];
    
    // Add omitempty for optional fields
    if (prop.optional) {
      options.push("omitempty");
    }
    
    const optionsStr = options.length > 0 ? `,${options.join(",")}` : "";
    return `json:"${tagName}${optionsStr}"`;
  }

  /**
   * Generate XML struct tag for Go field (if needed)
   */
  static generateXmlTag(prop: TypeSpecModelProperty): string {
    const tagName = prop.name;
    const options: string[] = [];
    
    if (prop.optional) {
      options.push("omitempty");
    }
    
    const optionsStr = options.length > 0 ? `,${options.join(",")}` : "";
    return `xml:"${tagName}${optionsStr}"`;
  }

  /**
   * Generate complete Go struct field line
   */
  static generateGoFieldLine(field: TransformedGoField): string {
    const tags = [field.jsonTag];
    
    // Add XML tag for certain property names
    if (this.shouldHaveXmlTag(field.name)) {
      tags.push(this.generateXmlTag(field as any)); // TODO: Fix type hack
    }
    
    const tagsStr = tags.length > 0 ? ` \`${tags.join(" ")}\`` : "";
    const fieldExport = field.exported ? "" : ""; // Go uses case sensitivity for export
    
    return `\t${fieldExport}${field.name} ${field.type}${tagsStr}`;
  }

  /**
   * Determine if field should have XML tag
   */
  private static shouldHaveXmlTag(fieldName: string): boolean {
    // Common fields that benefit from XML tags
    const xmlFields = ["content", "data", "body", "text"];
    return xmlFields.some(xmlField => fieldName.toLowerCase().includes(xmlField));
  }

  /**
   * Collect all imports needed for a set of transformed fields
   */
  static collectImportsForFields(fields: readonly TransformedGoField[]): ReadonlyMap<string, string> {
    const imports = new Map<string, string>();
    
    for (const field of fields) {
      if (field.requiresImport && field.importPath) {
        if (!imports.has(field.importPath)) {
          imports.set(field.importPath, field.importPath);
        }
      }
    }
    
    return imports;
  }

  /**
   * Validate transformed field
   */
  static validateField(field: TransformedGoField): void {
    if (!field.name || field.name.trim().length === 0) {
      throw new Error(`Invalid Go field: empty name`);
    }
    
    if (!field.type || field.type.trim().length === 0) {
      throw new Error(`Invalid Go field: empty type for field '${field.name}'`);
    }
    
    if (field.name.includes(" ") || field.name.includes("-")) {
      throw new Error(`Invalid Go field name: '${field.name}' contains spaces or hyphens`);
    }
  }

  /**
   * Batch transform multiple properties
   */
  static transformProperties(props: readonly TypeSpecModelProperty[]): readonly TransformedGoField[] {
    const fields = props.map(prop => this.transformProperty(prop));
    
    // Validate all fields
    for (const field of fields) {
      this.validateField(field);
    }
    
    return fields;
  }
}