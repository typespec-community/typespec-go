/**
 * JSX Migration Utilities for TypeSpec Go Emitter
 *
 * MIGRATION SUPPORT: String to JSX conversion utilities
 * TYPE SAFETY: Professional migration helpers
 * BRIDGE PATTERNS: Seamless transition from string generation
 */

import type { GoFieldConfig, GoStructConfig, GoFileConfig } from "./go-jsx-type-safety.js";
import { GoJsxComponents } from "./go-jsx-type-safety.js";
import type { MappedGoType } from "../domain/type-interfaces.js";

/**
 * String to JSX Conversion Utilities
 * MIGRATION: Bridge between current and target approaches
 */
export class StringToJsxConverter {
  /**
   * Convert Go string type to JSX type configuration
   * MIGRATION: Type string parsing and conversion
   */
  static parseGoTypeString(goTypeString: string): {
    baseType: string;
    isPointer: boolean;
    isSlice: boolean;
    elementType?: string;
  } {
    let typeString = goTypeString.trim();
    const isPointer = typeString.startsWith("*");
    const isSlice = typeString.startsWith("[]");
    
    // Remove pointer/slice prefixes
    if (isPointer) {
      typeString = typeString.slice(1);
    }
    if (isSlice) {
      typeString = typeString.slice(2);
    }
    
    // Handle slice element types
    let elementType: string | undefined;
    if (isSlice) {
      elementType = typeString;
    }
    
    return {
      baseType: typeString,
      isPointer,
      isSlice,
      elementType
    };
  }

  /**
   * Convert string-based Go field to JSX field configuration
   * MIGRATION: Field format parsing and conversion
   */
  static convertStringFieldToJsxField(
    fieldName: string,
    fieldTypeString: string,
    jsonTagString: string,
    isOptional: boolean = false
  ): GoFieldConfig {
    const typeInfo = this.parseGoTypeString(fieldTypeString);
    const jsonTag = this.extractJsonTag(jsonTagString);
    
    return GoJsxComponents.ComponentFactory.createField({
      name: fieldName,
      type: typeInfo.baseType,
      optional: isOptional || typeInfo.isPointer,
      jsonTag,
      documentation: `Converted from string generation`
    });
  }

  /**
   * Extract JSON tag from Go struct tag string
   * MIGRATION: Tag parsing and normalization
   */
  static extractJsonTag(tagString: string): string {
    // Extract JSON tag from backtick string
    const jsonMatch = tagString.match(/json:"([^"]+)"/);
    if (jsonMatch) {
      let jsonTag = jsonMatch[1];
      // Remove omitempty if present
      jsonTag = jsonTag.replace(/,omitempty$/, "");
      return jsonTag;
    }
    
    // Fallback: assume field name
    return "unknown_field";
  }

  /**
   * Convert string-based Go struct to JSX struct configuration
   * MIGRATION: Struct parsing and conversion
   */
  static convertStringStructToJsx(
    structName: string,
    goStructString: string
  ): GoStructConfig {
    const fields = this.parseGoStructFields(goStructString);
    
    return GoJsxComponents.ComponentFactory.createStruct({
      name: structName,
      fields: fields.map(field => this.convertStringFieldToJsxField(
        field.name,
        field.type,
        field.tag,
        field.optional
      )),
      documentation: `Converted from string generation`
    });
  }

  /**
   * Parse Go struct fields from string representation
   * MIGRATION: Struct field extraction
   */
  private static parseGoStructFields(goStructString: string): Array<{
    name: string;
    type: string;
    tag: string;
    optional: boolean;
  }> {
    const fields: Array<{name: string; type: string; tag: string; optional: boolean}> = [];
    
    // Extract struct body
    const structMatch = goStructString.match(/type\s+\w+\s+struct\s*\{([^}]+)\}/s);
    if (!structMatch) {
      return fields;
    }
    
    const structBody = structMatch[1];
    const fieldLines = structBody.split('\n').filter(line => line.trim());
    
    for (const line of fieldLines) {
      const fieldMatch = line.trim().match(/^(\w+)\s+([^\s]+)\s+`([^`]+)`/);
      if (fieldMatch) {
        const [, name, type, tag] = fieldMatch;
        const isOptional = type.startsWith("*") || tag.includes("omitempty");
        
        fields.push({ name, type, tag, optional: isOptional });
      }
    }
    
    return fields;
  }
}

/**
 * JSX to String Conversion Utilities
 * MIGRATION: JSX component to string output conversion
 */
export class JsxToStringConverter {
  /**
   * Convert JSX field configuration to Go struct field string
   * MIGRATION: JSX to Go field format conversion
   */
  static jsxFieldToGoString(field: GoFieldConfig): string {
    const goType = field.optional ? `*${field.type}` : field.type;
    const jsonTag = field.optional ? `${field.jsonTag},omitempty` : field.jsonTag;
    const fieldName = this.capitalizeFieldName(field.name);
    
    return `  ${fieldName} ${goType} \`${`json:"${jsonTag}"`}\``;
  }

  /**
   * Convert JSX struct configuration to Go struct string
   * MIGRATION: JSX to Go struct format conversion
   */
  static jsxStructToGoString(struct: GoStructConfig): string {
    const fields = struct.fields.map(field => this.jsxFieldToGoString(field));
    const fieldString = fields.join('\n');
    
    return `type ${struct.name} struct {\n${fieldString}\n}`;
  }

  /**
   * Convert JSX file configuration to Go file string
   * MIGRATION: JSX to Go file format conversion
   */
  static jsxFileToGoString(file: GoFileConfig): string {
    const imports = file.imports.length > 0 
      ? `import (\n${file.imports.map(imp => `  "${imp}"`).join('\n')}\n)\n`
      : '';
    
    const structs = file.structs.map(struct => this.jsxStructToGoString(struct)).join('\n\n');
    
    return `// ${file.documentation || 'Generated file'}
package ${file.packageName}

${imports}
${structs}
`;
  }

  /**
   * Capitalize field name for Go export
   * MIGRATION: Go naming convention handling
   */
  private static capitalizeFieldName(fieldName: string): string {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }
}

/**
 * Migration Comparison Utilities
 * MIGRATION: Compare string vs JSX outputs
 */
export class MigrationComparisonUtils {
  /**
   * Compare string and JSX struct outputs
   * MIGRATION: Output comparison for validation
   */
  static compareStructOutputs(
    stringStruct: string,
    jsxStruct: GoStructConfig
  ): {
    identical: boolean;
    differences: string[];
    similarity: number;
  } {
    const jsxStructString = JsxToStringConverter.jsxStructToGoString(jsxStruct);
    
    const differences: string[] = [];
    
    // Normalize both strings for comparison
    const normalizeString = (str: string) => 
      str.trim().replace(/\s+/g, ' ').replace(/\n+/g, '\n');
    
    const normalizedString = normalizeString(stringStruct);
    const normalizedJsx = normalizeString(jsxStructString);
    
    const identical = normalizedString === normalizedJsx;
    
    if (!identical) {
      const stringLines = normalizedString.split('\n');
      const jsxLines = normalizedJsx.split('\n');
      
      for (let i = 0; i < Math.max(stringLines.length, jsxLines.length); i++) {
        const stringLine = stringLines[i] || '';
        const jsxLine = jsxLines[i] || '';
        
        if (stringLine !== jsxLine) {
          differences.push(`Line ${i + 1}: "${stringLine}" vs "${jsxLine}"`);
        }
      }
    }
    
    // Calculate simple similarity
    const similarity = this.calculateStringSimilarity(normalizedString, normalizedJsx);
    
    return { identical, differences, similarity };
  }

  /**
   * Calculate string similarity
   * MIGRATION: Similarity metric for comparison
   */
  private static calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    let matches = 0;
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
      if (str1[i] === str2[i]) matches++;
    }
    
    return matches / longer.length;
  }

  /**
   * Validate migration completeness
   * MIGRATION: Check if all features migrated
   */
  static validateMigrationCompleteness(
    stringOutputs: Record<string, string>,
    jsxOutputs: Record<string, GoFileConfig>
  ): {
    complete: boolean;
    missingFiles: string[];
    validationErrors: string[];
  } {
    const missingFiles: string[] = [];
    const validationErrors: string[] = [];
    
    // Check if all string outputs have JSX equivalents
    for (const fileName of Object.keys(stringOutputs)) {
      if (!jsxOutputs[fileName]) {
        missingFiles.push(fileName);
      }
    }
    
    // Validate JSX outputs
    for (const [fileName, jsxConfig] of Object.entries(jsxOutputs)) {
      try {
        if (!jsxConfig.path) {
          validationErrors.push(`${fileName}: Missing file path`);
        }
        if (!jsxConfig.packageName) {
          validationErrors.push(`${fileName}: Missing package name`);
        }
        if (!Array.isArray(jsxConfig.structs) || jsxConfig.structs.length === 0) {
          validationErrors.push(`${fileName}: Missing or empty structs`);
        }
      } catch (error) {
        validationErrors.push(`${fileName}: Validation error - ${error}`);
      }
    }
    
    const complete = missingFiles.length === 0 && validationErrors.length === 0;
    
    return { complete, missingFiles, validationErrors };
  }
}

/**
 * TypeSpec to JSX Migration Utilities
 * MIGRATION: TypeSpec integration with JSX generation
 */
export class TypeSpecJsxMigrationUtils {
  /**
   * Convert MappedGoType to JSX type string
   * MIGRATION: Bridge TypeSpec type mapping with JSX generation
   */
  static mappedGoTypeToJsxType(mappedType: MappedGoType): string {
    switch (mappedType.kind) {
      case "basic":
        return mappedType.name || "interface{}";
      
      case "pointer":
        if (!mappedType.baseType) {
          return "interface{}";
        }
        return `*${this.mappedGoTypeToJsxType(mappedType.baseType)}`;
      
      case "slice":
        if (!mappedType.elementType) {
          return "[]interface{}";
        }
        return `[]${this.mappedGoTypeToJsxType(mappedType.elementType)}`;
      
      case "array":
        if (!mappedType.elementType) {
          return "[0]interface{}";
        }
        return `[0]${this.mappedGoTypeToJsxType(mappedType.elementType)}`;
      
      case "union":
        return mappedType.name || "interface{}";
      
      case "template":
        return mappedType.name || "T";
      
      case "spread":
        return mappedType.name || "interface{}";
      
      default:
        return "interface{}";
    }
  }

  /**
   * Convert TypeSpec model property to JSX field configuration
   * MIGRATION: TypeSpec to JSX field conversion
   */
  static typeSpecPropertyToJsxField(
    propertyName: string,
    property: any,
    mappedType: MappedGoType
  ): GoFieldConfig {
    const jsxType = this.mappedGoTypeToJsxType(mappedType);
    const jsonTag = GoJsxComponents.Utils.generateJsonTag(propertyName);
    
    return GoJsxComponents.ComponentFactory.createField({
      name: propertyName,
      type: jsxType,
      optional: Boolean(property.optional) || Boolean(mappedType.usePointerForOptional),
      jsonTag,
      documentation: property.documentation
    });
  }

  /**
   * Convert TypeSpec model to JSX struct configuration
   * MIGRATION: TypeSpec to JSX struct conversion
   */
  static typeSpecModelToJsxStruct(
    modelName: string,
    model: any
  ): GoStructConfig {
    const fields: GoFieldConfig[] = [];
    
    // Process model properties
    for (const [propertyName, property] of model.properties || []) {
      const mappedType = property.mappedGoType; // Assuming pre-mapped
      if (mappedType) {
        const jsxField = this.typeSpecPropertyToJsxField(
          propertyName,
          property,
          mappedType
        );
        fields.push(jsxField);
      }
    }
    
    return GoJsxComponents.ComponentFactory.createStruct({
      name: modelName,
      fields,
      documentation: model.documentation || `TypeSpec model: ${modelName}`
    });
  }
}

/**
 * Migration Progress Tracking
 * MIGRATION: Track and report migration progress
 */
export class MigrationProgressTracker {
  private static progress: Map<string, {
    completed: boolean;
    startTime: number;
    endTime?: number;
    errors?: string[];
  }> = new Map();

  /**
   * Start migration task tracking
   * MIGRATION: Begin tracking a migration task
   */
  static startTask(taskName: string): void {
    this.progress.set(taskName, {
      completed: false,
      startTime: Date.now(),
      errors: []
    });
  }

  /**
   * Complete migration task tracking
   * MIGRATION: Mark a migration task as completed
   */
  static completeTask(taskName: string, errors?: string[]): void {
    const task = this.progress.get(taskName);
    if (task) {
      task.completed = true;
      task.endTime = Date.now();
      task.errors = errors;
    }
  }

  /**
   * Get migration progress report
   * MIGRATION: Generate progress summary
   */
  static getProgressReport(): {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    tasksWithErrors: number;
    taskDetails: Record<string, any>;
  } {
    const tasks = Array.from(this.progress.entries());
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(([_, task]) => task.completed).length;
    const inProgressTasks = totalTasks - completedTasks;
    const tasksWithErrors = tasks.filter(([_, task]) => task.errors && task.errors.length > 0).length;
    
    const taskDetails: Record<string, any> = {};
    for (const [taskName, task] of tasks) {
      const duration = task.endTime 
        ? task.endTime - task.startTime 
        : Date.now() - task.startTime;
      
      taskDetails[taskName] = {
        completed: task.completed,
        duration: `${duration}ms`,
        errors: task.errors || []
      };
    }
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      tasksWithErrors,
      taskDetails
    };
  }
}

/**
 * Export migration utilities
 * MIGRATION: Complete migration support package
 */
export const JsxMigrationUtils = {
  StringToJsxConverter,
  JsxToStringConverter,
  MigrationComparisonUtils,
  TypeSpecJsxMigrationUtils,
  MigrationProgressTracker
} as const;

export default JsxMigrationUtils;