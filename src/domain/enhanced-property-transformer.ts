/**
 * Enhanced Property Transformer with Visibility Support
 *
 * Integrates TypeSpec visibility extraction with Go field transformation
 * Handles @visibility and @invisible decorators professionally
 * Ensures consistent naming and JSON tag generation
 */

import type { 
  ModelProperty as TypeSpecModelProperty,
  Program as TypeSpecProgram
} from "@typespec/compiler";
import type { MappedGoType } from "../domain/type-interfaces.js";
import type { TypeSpecPropertyVisibility } from "../domain/typespec-visibility-domain.js";
import { GoTypeMapper } from "../domain/go-type-mapper.js";
import { 
  extractTypeSpecVisibility,
  batchExtractTypeSpecVisibility
} from "../domain/typespec-visibility-extraction-service.js";
import { 
  TypeSpecVisibilityBasedNaming,
  type VisibilityBasedName
} from "../domain/typespec-visibility-based-naming.js";
import { ErrorFactory } from "../domain/error-factory.js";

// Simple logger fallback for testing
const SimpleLogger = {
  debug: (context: string, message: string, data?: any) => {
    if (process.env.DEBUG === "true") {
      console.debug(`[${context}] ${message}`, data);
    }
  },
  info: (context: string, message: string, data?: any) => {
    console.log(`[${context}] ${message}`, data);
  },
  warn: (context: string, message: string, data?: any) => {
    console.warn(`[${context}] ${message}`, data);
  },
  error: (context: string, message: string, data?: any) => {
    console.error(`[${context}] ${message}`, data);
  }
};

type LogContext = string;

/**
 * Enhanced Go field information with full visibility support
 */
export interface EnhancedGoField {
  /** Go field name (based on visibility) */
  readonly name: string;
  
  /** Go type string */
  readonly type: string;
  
  /** Whether field is exported (based on visibility) */
  readonly exported: boolean;
  
  /** JSON struct tag (undefined for invisible fields) */
  readonly jsonTag: string | undefined;
  
  /** Whether field is optional (pointer type) */
  readonly optional: boolean;
  
  /** Whether field requires import */
  readonly requiresImport: boolean;
  
  /** Import path if needed */
  readonly importPath?: string;
  
  /** Original TypeSpec property name */
  readonly originalName: string;
  
  /** Extracted TypeSpec visibility information */
  readonly visibility: TypeSpecPropertyVisibility;
  
  /** Visibility-based naming analysis */
  readonly naming: VisibilityBasedName;
  
  /** Field generation confidence */
  readonly confidence: number;
}

/**
 * Enhanced Property Transformer with TypeSpec Visibility Support
 * 
 * Core responsibility: Transform TypeSpec properties to Go fields
 * with full awareness of @visibility and @invisible decorators.
 * 
 * Replaces placeholder logic with production-ready visibility extraction.
 * 
 * Features:
 * - Real TypeSpec visibility extraction from compiler APIs
 * - Intelligent Go field naming based on visibility
 * - Proper JSON tag generation (absent for invisible fields)
 * - Comprehensive error handling and validation
 * - Performance optimization for batch processing
 */
export class EnhancedPropertyTransformer {
  private readonly logger = SimpleLogger;
  private readonly logContext: LogContext = "EnhancedPropertyTransformer";

  /**
   * Transform single TypeSpec property with visibility support
   * 
   * @param program TypeSpec compiler program
   * @param property TypeSpec model property
   * @returns Enhanced Go field with visibility information
   * @throws Error when transformation fails
   */
  transformProperty(
    program: TypeSpecProgram,
    property: TypeSpecModelProperty
  ): EnhancedGoField {
    const transformStart = performance.now();

    try {
      this.logger.debug(this.logContext, "Starting enhanced property transformation", {
        propertyName: property.name,
        propertyType: property.type.kind,
        hasDecorators: !!property.decorators
      });

      // Step 1: Extract TypeSpec visibility information
      const visibility = extractTypeSpecVisibility(program, property);

      // Step 2: Generate Go field name based on visibility
      const naming = TypeSpecVisibilityBasedNaming.generateName(
        property.name, 
        visibility
      );

      // Step 3: Map TypeSpec type to Go type
      const mappedGoType = GoTypeMapper.mapTypeSpecTypeDomain(property.type);
      const goType = this.generateGoType(mappedGoType, property.optional);

      // Step 4: Generate JSON tag based on visibility
      const jsonTag = this.generateJsonTagWithVisibility(property, visibility);

      // Step 5: Determine export status from visibility
      const isExported = this.determineExportStatus(visibility);

      // Step 6: Calculate transformation confidence
      const confidence = this.calculateTransformationConfidence(
        property, 
        visibility, 
        naming, 
        mappedGoType
      );

      const enhancedField: EnhancedGoField = {
        name: naming.name,
        type: goType,
        exported: isExported,
        jsonTag,
        optional: property.optional || false,
        requiresImport: mappedGoType.requiresImport ?? false,
        originalName: property.name,
        visibility,
        naming,
        confidence
      };

      const transformTime = performance.now() - transformStart;
      this.logger.debug(this.logContext, "Enhanced property transformation completed", {
        propertyName: property.name,
        goFieldName: enhancedField.name,
        isExported: enhancedField.exported,
        hasJsonTag: !!enhancedField.jsonTag,
        confidence: enhancedField.confidence,
        transformTime: `${transformTime.toFixed(4)}ms`
      });

      return enhancedField;

    } catch (error) {
      this.logger.error(this.logContext, "Enhanced property transformation failed", {
        propertyName: property.name,
        error: error instanceof Error ? error.message : String(error),
        stackTrace: error instanceof Error ? error.stack : undefined
      });

      throw ErrorFactory.propertyTransformationError(
        "Unknown", // Will be set by caller
        property.name,
        error instanceof Error ? error : String(error)
      );
    }
  }

  /**
   * Batch transform multiple TypeSpec properties with visibility
   * 
   * @param program TypeSpec compiler program
   * @param properties Array of TypeSpec properties
   * @returns Array of enhanced Go fields
   */
  batchTransformProperties(
    program: TypeSpecProgram,
    properties: readonly TypeSpecModelProperty[]
  ): readonly EnhancedGoField[] {
    const batchStart = performance.now();

    try {
      this.logger.info(this.logContext, "Starting enhanced batch property transformation", {
        propertyCount: properties.length
      });

      // Step 1: Batch extract visibility information
      const visibilities = batchExtractTypeSpecVisibility(program, properties);

      // Step 2: Transform properties with their visibility
      const enhancedFields = properties.map((property, index) => {
        const visibility = visibilities[index];

        // Generate Go field name based on visibility
        const naming = TypeSpecVisibilityBasedNaming.generateName(
          property.name, 
          visibility
        );

        // Map TypeSpec type to Go type
        const mappedGoType = GoTypeMapper.mapTypeSpecTypeDomain(property.type);
        const goType = this.generateGoType(mappedGoType, property.optional);

        // Generate JSON tag based on visibility
        const jsonTag = this.generateJsonTagWithVisibility(property, visibility);

        // Determine export status
        const isExported = this.determineExportStatus(visibility);

        // Calculate confidence
        const confidence = this.calculateTransformationConfidence(
          property, 
          visibility, 
          naming, 
          mappedGoType
        );

        return {
          name: naming.name,
          type: goType,
          exported: isExported,
          jsonTag,
          optional: property.optional || false,
          requiresImport: mappedGoType.requiresImport ?? false,
          importPath: mappedGoType.importPath,
          originalName: property.name,
          visibility,
          naming,
          confidence
        };
      });

      const batchTime = performance.now() - batchStart;
      const avgTime = batchTime / properties.length;

      this.logger.info(this.logContext, "Enhanced batch property transformation completed", {
        propertyCount: properties.length,
        totalTime: `${batchTime.toFixed(4)}ms`,
        avgTime: `${avgTime.toFixed(4)}ms`,
        throughput: `${(1000 / avgTime).toFixed(0)} properties/sec`,
        avgConfidence: enhancedFields.reduce((sum, f) => sum + f.confidence, 0) / enhancedFields.length
      });

      return enhancedFields;

    } catch (error) {
      this.logger.error(this.logContext, "Enhanced batch property transformation failed", {
        propertyCount: properties.length,
        error: error instanceof Error ? error.message : String(error)
      });

      // Fallback: return basic fields without visibility
      return properties.map(property => this.createFallbackField(property));
    }
  }

  /**
   * Generate Go struct field line with visibility support
   * 
   * @param field Enhanced Go field
   * @returns Complete Go field line
   */
  static generateGoFieldLine(field: EnhancedGoField): string {
    const tags: string[] = [];

    // Add JSON tag only if field has one (visible fields)
    if (field.jsonTag) {
      tags.push(field.jsonTag);
    }

    // Add XML tag for certain property names
    if (EnhancedPropertyTransformer.shouldHaveXmlTag(field.name)) {
      tags.push(EnhancedPropertyTransformer.generateXmlTag(field));
    }

    const tagsStr = tags.length > 0 ? ` \`${tags.join(" ")}\`` : "";
    const fieldExport = field.exported ? "" : ""; // Go uses case sensitivity for export

    return `\t${fieldExport}${field.name} ${field.type}${tagsStr}`;
  }

  /**
   * Generate complete Go struct with visibility-based fields
   * 
   * @param modelName Name of the model
   * @param fields Array of enhanced Go fields
   * @returns Complete Go struct code
   */
  static generateGoStruct(modelName: string, fields: readonly EnhancedGoField[]): string {
    // Sort fields: exported fields first, then by confidence
    const sortedFields = [...fields].sort((a, b) => {
      // Exported fields come first
      if (a.exported !== b.exported) {
        return b.exported ? 1 : -1;
      }
      
      // Then by confidence (higher first)
      return b.confidence - a.confidence;
    });

    const fieldLines = sortedFields.map(field => 
      EnhancedPropertyTransformer.generateGoFieldLine(field)
    );

    const header = EnhancedPropertyTransformer.generateStructHeader(modelName);
    const footer = "}";

    return `${header}\n${fieldLines.join("\n")}\n${footer}`;
  }

  /**
   * Generate visibility analysis report for debugging
   * 
   * @param fields Enhanced Go fields
   * @returns Comprehensive visibility analysis
   */
  static generateVisibilityAnalysisReport(fields: readonly EnhancedGoField[]): string {
    const sections = [
      "TypeSpec Visibility Analysis Report",
      "=" .repeat(50),
      "",
      `Total Fields: ${fields.length}`,
      `Exported Fields: ${fields.filter(f => f.exported).length}`,
      `Private Fields: ${fields.filter(f => !f.exported).length}`,
      `Average Confidence: ${(fields.reduce((sum, f) => sum + f.confidence, 0) / fields.length).toFixed(1)}%`,
      "",
      "Field Details:",
      "-" .repeat(30)
    ];

    for (const field of fields) {
      sections.push(
        `  ${field.originalName} → ${field.name}`,
        `    Visibility: [${field.visibility.lifecycle.join(", ")}]`,
        `    Exported: ${field.exported}`,
        `    JSON Tag: ${field.jsonTag || "none"}`,
        `    Strategy: ${field.naming.strategy}`,
        `    Confidence: ${field.confidence}%`
      );
    }

    return sections.join("\n");
  }

  /**
   * Validate field transformations for consistency
   * 
   * @param fields Enhanced Go fields to validate
   * @returns Validation result with issues and suggestions
   */
  static validateTransformationConsistency(
    fields: readonly EnhancedGoField[]
  ): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for duplicate Go field names
    const goFieldNames = fields.map(field => field.name);
    const duplicates = goFieldNames.filter((name, index) => 
      goFieldNames.indexOf(name) !== index
    );

    if (duplicates.length > 0) {
      issues.push(`Duplicate Go field names: [${duplicates.join(", ")}]`);
      suggestions.push("Use more specific TypeSpec property names");
    }

    // Check for inconsistent visibility handling
    const invisibleFieldsWithJsonTags = fields.filter(f => 
      f.visibility.isInvisible && f.jsonTag
    );

    if (invisibleFieldsWithJsonTags.length > 0) {
      issues.push(`${invisibleFieldsWithJsonTags.length} invisible fields have JSON tags`);
      suggestions.push("Review JSON tag generation logic");
    }

    // Check for low confidence transformations
    const lowConfidenceFields = fields.filter(f => f.confidence < 60);
    if (lowConfidenceFields.length > 0) {
      issues.push(`${lowConfidenceFields.length} fields have low confidence (<60%)`);
      suggestions.push("Add explicit visibility decorators to improve clarity");
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  // Private helper methods

  private static generateGoType(mappedType: MappedGoType, isOptional: boolean): string {
    return GoTypeMapper.generateGoTypeString(mappedType);
  }

  private static generateJsonTagWithVisibility(
    property: TypeSpecModelProperty, 
    visibility: TypeSpecPropertyVisibility
  ): string | undefined {
    // Invisible properties don't get JSON tags
    if (visibility.isInvisible) {
      return undefined;
    }

    // Visible properties get JSON tags with original name
    const tagName = property.name;
    const options: string[] = [];

    if (property.optional) {
      options.push("omitempty");
    }

    const optionsStr = options.length > 0 ? `,${options.join(",")}` : "";
    return `json:"${tagName}${optionsStr}"`;
  }

  private static determineExportStatus(visibility: TypeSpecPropertyVisibility): boolean {
    // Invisible properties become private Go fields
    if (visibility.isInvisible) {
      return false;
    }

    // Visible properties become exported Go fields
    return true;
  }

  private static shouldHaveXmlTag(fieldName: string): boolean {
    const xmlFields = ["content", "data", "body", "text"];
    return xmlFields.some(xmlField =>
      fieldName.toLowerCase().includes(xmlField)
    );
  }

  private static generateXmlTag(field: EnhancedGoField): string {
    const tagName = field.originalName;
    const options = field.optional ? [",omitempty"] : [];
    const optionsStr = options.length > 0 ? options.join("") : "";
    return `xml:"${tagName}${optionsStr}"`;
  }

  private static generateStructHeader(modelName: string): string {
    return [
      `// Auto-generated from TypeSpec model: ${modelName}`,
      `// Generated by Type-safe Professional Go Emitter`,
      `// TypeSpec visibility-aware transformation`,
      `type ${modelName} struct {`
    ].join("\n");
  }

  private static createFallbackField(property: TypeSpecModelProperty): EnhancedGoField {
    // Create basic field without visibility information
    const mappedGoType = GoTypeMapper.mapTypeSpecTypeDomain(property.type);

    return {
      name: property.name,
      type: EnhancedPropertyTransformer.generateGoType(mappedGoType, property.optional),
      exported: true, // Default to exported
      jsonTag: `json:"${property.name}"`,
      optional: property.optional || false,
      requiresImport: mappedGoType.requiresImport ?? false,
      originalName: property.name,
      visibility: {
        visible: true,
        lifecycle: ["Create", "Read", "Update", "Delete", "Query"],
        isInvisible: false,
        source: "default"
      },
      naming: {
        name: property.name,
        isExported: true,
        strategy: "exported-pascal",
        originalName: property.name,
        visibility: {
          visible: true,
          lifecycle: ["Create", "Read", "Update", "Delete", "Query"],
          isInvisible: false,
          source: "default"
        },
        confidence: 50
      },
      confidence: 50 // Low confidence for fallback
    };
  }

  private static calculateTransformationConfidence(
    property: TypeSpecModelProperty,
    visibility: TypeSpecPropertyVisibility,
    naming: VisibilityBasedName,
    mappedGoType: MappedGoType
  ): number {
    let confidence = 33; // Base confidence

    // Higher confidence for explicit visibility
    if (visibility.source === "decorator") {
      confidence += 25;
    }

    // Higher confidence for clear naming
    if (naming.confidence > 80) {
      confidence += 20;
    }

    // Higher confidence for standard types
    if (mappedGoType.requiresImport === false) {
      confidence += 15;
    }

    // Higher confidence for non-optional properties
    if (!property.optional) {
      confidence += 7;
    }

    return Math.max(0, Math.min(100, confidence));
  }
}

/**
 * Singleton instance for enhanced property transformation
 */
export const enhancedPropertyTransformer = new EnhancedPropertyTransformer();

/**
 * Convenience function for single property transformation
 */
export function transformPropertyWithVisibility(
  program: TypeSpecProgram,
  property: TypeSpecModelProperty
): EnhancedGoField {
  return enhancedPropertyTransformer.transformProperty(program, property);
}

/**
 * Convenience function for batch property transformation
 */
export function batchTransformPropertiesWithVisibility(
  program: TypeSpecProgram,
  properties: readonly TypeSpecModelProperty[]
): readonly EnhancedGoField[] {
  return enhancedPropertyTransformer.batchTransformProperties(program, properties);
}