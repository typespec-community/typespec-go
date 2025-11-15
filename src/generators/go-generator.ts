/**
 * Type-Safe Go Struct Generator
 * 
 * RESPONSIBILITY: Generate Go struct definitions
 * SINGLE RESPONSIBILITY: Only Go struct generation
 * TYPE SAFETY: Zero 'any' types with comprehensive coverage
 */

import { TypeSpecPropertyNode, TypeSpecTypeMapper } from '../mappers/type-mapper.js';

/**
 * Type-Safe Go Struct Generator
 * ZERO 'ANY' TYPES: Comprehensive type safety
 */
export class GoStructGenerator {
  /**
   * Generate Go struct definition
   * TYPE SAFETY: Zero 'any' types with proper field mapping
   */
  generateStruct(
    name: string,
    properties: ReadonlyMap<string, TypeSpecPropertyNode>
  ): string {
    const lines: string[] = [];
    
    // Add package declaration
    lines.push('package models');
    lines.push('');
    
    // Add struct definition
    lines.push(`type ${name} struct {`);
    
    // Add fields
    for (const [fieldName, property] of properties) {
      const goFieldName = TypeSpecTypeMapper.mapFieldName(fieldName);
      const goTypeMapping = TypeSpecTypeMapper.mapOptionalField(property);
      const jsonTag = TypeSpecTypeMapper.generateJsonTag(property);
      
      lines.push(`\t${goFieldName} ${goTypeMapping.goType} ${jsonTag}`);
    }
    
    lines.push('}');
    lines.push('');
    
    return lines.join('\n');
  }
}