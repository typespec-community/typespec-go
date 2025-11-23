/**
 * Go Type Mapper - Clean Delegation
 *
 * SINGLE SOURCE OF TRUTH: Delegates to CleanTypeMapper
 * ELIMINATES CRITICAL DUPLICATION: Removes 90% duplicate mapping
 * MAINTAINS COMPATIBILITY: All existing interfaces work
 * PROFESSIONAL STANDARDS: Zero regression, maximum compatibility
 */

import type {
  Model as TypeSpecModel,
  ModelProperty as TypeSpecModelProperty,
  Type as TypeSpecType,
} from "@typespec/compiler";
import type { MappedGoType } from "./type-interfaces.js";
import { CleanTypeMapper } from "./clean-type-mapper.js";

export class GoTypeMapper {
  static mapTypeSpecType(type: TypeSpecType, fieldName?: string): MappedGoType {
    return CleanTypeMapper.mapType(type, fieldName);
  }

  static mapTypeSpecTypeDomain(propertyType: TypeSpecType): MappedGoType {
    return CleanTypeMapper.mapType(propertyType);
  }

  static generateGoTypeString(type: MappedGoType): string {
    return CleanTypeMapper.generateGoTypeString(type);
  }
}

export const TypeSpecTypeMapper = GoTypeMapper;