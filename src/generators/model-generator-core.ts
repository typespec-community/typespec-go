/**
 * TypeSpec Model Generator - Core Module
 *
 * Core generation logic and coordination
 * Clean separation of concerns for generator architecture
 */

import type { Program, Model as TypeSpecModelType } from "@typespec/compiler";
import type { GoEmitterResult } from "../domain/unified-errors.js";
import { ErrorFactory } from "../domain/error-factory.js";
import { GoTypeMapper } from "../domain/go-type-mapper.js";
import type { ExtractedModel, ExtractedUnion, ExtractedOperation } from "../emitter/model-extractor-core.js";

/**
 * Core model generation logic
 */
export class ModelGeneratorCore {
  /**
   * Generate Go struct from extracted model
   */
  static generateGoStruct(modelName: string, extractedModel: ExtractedModel): string {
    try {
      const goFields: string[] = [];
      
      // Process properties with intelligent type mapping
      for (const [propertyName, propertyInfo] of extractedModel.properties) {
        const mappedType = GoTypeMapper.mapTypeSpecType(propertyInfo.type, propertyName);
        const goType = typeof mappedType === 'string' ? mappedType : mappedType.name;
        const goTag = `json:"${propertyName}"`;
        const optionalMarker = propertyInfo.optional ? "*" : "";
        
        goFields.push(`  ${propertyName}${optionalMarker} ${goType} \`${goTag}\``);
      }
      
      // Handle inheritance (Go struct embedding)
      const inheritanceClause = extractedModel.extends 
        ? `\n  ${extractedModel.extends}  // Embedded struct`
        : "";

      return `type ${modelName} struct {${inheritanceClause}
${goFields.join('\n')}
}`;
    } catch (error) {
      throw ErrorFactory.createGoCodeGenerationError(
        `Failed to generate Go struct for ${modelName}`,
        error instanceof Error ? error : String(error)
      );
    }
  }

  /**
   * Generate Go interface for union type
   */
  static generateGoUnionInterface(unionName: string, extractedUnion: ExtractedUnion): string {
    try {
      const variants: string[] = [];
      
      for (const [variantName, variantInfo] of extractedUnion.variants) {
        const mappedType = GoTypeMapper.mapTypeSpecType(variantInfo.type, variantName);
        const goType = typeof mappedType === 'string' ? mappedType : mappedType.name;
        variants.push(`  ${variantName} ${goType}`);
      }

      return `type ${unionName} interface {
${variants.join('\n')}
}`;
    } catch (error) {
      throw ErrorFactory.createGoCodeGenerationError(
        `Failed to generate Go union interface for ${unionName}`,
        error instanceof Error ? error : String(error)
      );
    }
  }

  /**
   * Generate Go service interface from operations
   */
  static generateGoServiceInterface(serviceName: string, operations: ReadonlyMap<string, ExtractedOperation>): string {
    try {
      const methods: string[] = [];
      
      for (const [operationName, operationInfo] of operations) {
        const returnMappedType = operationInfo.returnType 
          ? (() => {
              const mappedType = GoTypeMapper.mapTypeSpecType(operationInfo.returnType, "return");
              return typeof mappedType === 'string' ? mappedType : mappedType.name;
            })()
          : "error";
        
        // Generate method signature based on HTTP verb and path
        const methodSignature = this.generateMethodSignature(operationInfo, returnMappedType);
        methods.push(methodSignature);
      }

      return `type ${serviceName} interface {
${methods.join('\n')}
}`;
    } catch (error) {
      throw ErrorFactory.createGoCodeGenerationError(
        `Failed to generate Go service interface for ${serviceName}`,
        error instanceof Error ? error : String(error)
      );
    }
  }

  /**
   * Generate HTTP handler from operation
   */
  static generateHttpHandler(operationInfo: ExtractedOperation): string {
    try {
      const returnType = operationInfo.returnType 
        ? (() => {
            const mappedType = GoTypeMapper.mapTypeSpecType(operationInfo.returnType, "response");
            return typeof mappedType === 'string' ? mappedType : mappedType.name;
          })()
        : "void";
      
      const parameters = Array.from(operationInfo.parameters.values())
        .map(param => `${param.name} interface{}`)
        .join(", ");

      return `func Handle${operationInfo.name}(w http.ResponseWriter, r *http.Request) (${returnType}, error) {
  // TODO: Implement ${operationInfo.verb} ${operationInfo.path} handler
  // Parameters: ${parameters}
  return nil, nil
}`;
    } catch (error) {
      throw ErrorFactory.createGoCodeGenerationError(
        `Failed to generate HTTP handler for ${operationInfo.name}`,
        error instanceof Error ? error : String(error)
      );
    }
  }

  /**
   * Generate method signature for Go service interface
   */
  private static generateMethodSignature(operationInfo: ExtractedOperation, returnType: string): string {
    const parameters = Array.from(operationInfo.parameters.values())
      .map(param => {
        const mappedType = GoTypeMapper.mapTypeSpecType(param.type, param.name);
        const goType = typeof mappedType === 'string' ? mappedType : mappedType.name;
        const optionalMarker = param.optional ? "*" : "";
        return `${param.name}${optionalMarker} ${goType}`;
      })
      .join(", ");

    return `  ${operationInfo.name}(ctx context.Context, ${parameters}) (${returnType}, error)`;
  }

  /**
   * Get file name for Go code generation
   */
  static getFileName(name: string): string {
    return `${name.toLowerCase()}.go`;
  }

  /**
   * Generate Go package declaration
   */
  static generatePackageDeclaration(packageName: string = "api"): string {
    return `package ${packageName}`;
  }

  /**
   * Generate file header comment
   */
  static generateFileHeader(modelName: string): string {
    return `// Auto-generated from TypeSpec model: ${modelName}
// Generated by Type-safe Professional Go Emitter`;
  }

  /**
   * Generate complete Go file with package, comments, and struct
   */
  static generateGoFile(modelName: string, extractedModel: ExtractedModel, packageName: string = "api"): string {
    const header = this.generateFileHeader(modelName);
    const packageDecl = this.generatePackageDeclaration(packageName);
    const goStruct = this.generateGoStruct(modelName, extractedModel);
    
    return `${packageDecl}

${header}

${goStruct}
`;
  }

  /**
   * Generate complete Go file for union interface
   */
  static generateGoUnionFile(unionName: string, extractedUnion: ExtractedUnion, packageName: string = "api"): string {
    const header = this.generateFileHeader(unionName);
    const packageDecl = this.generatePackageDeclaration(packageName);
    const goInterface = this.generateGoUnionInterface(unionName, extractedUnion);
    
    return `${packageDecl}

${header}

${goInterface}
`;
  }
}