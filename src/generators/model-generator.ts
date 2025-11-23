/**
 * TypeSpec Model Generator - Coordination Module
 *
 * Main coordination and orchestration for model generation
 * Clean separation of concerns for generator architecture
 */

import type { Program } from "@typespec/compiler";
import { BaseGenerator } from "./base-generator.js";
import type { GoEmitterResult } from "../domain/unified-errors.js";
import { ErrorFactory } from "../domain/error-factory.js";
import { ModelExtractor } from "../emitter/model-extractor-core.js";
import { ModelGeneratorCore } from "./model-generator-core.js";
import { ModelGeneratorValidation } from "./model-generator-validation.js";
import { ModelGeneratorUtility } from "./model-generator-utility.js";
import type { ExtractedModel, ExtractedUnion, ExtractedOperation } from "../emitter/model-extractor-core.js";

/**
 * TypeSpec Model Generator - Main Coordination
 * Domain logic: Orchestrate model generation with clean separation of concerns
 */
export class ModelGenerator extends BaseGenerator {
  readonly name = "model-generator";
  readonly description = "TypeSpec models to Go structs generator";

  async generate(program: Program): Promise<GoEmitterResult> {
    // Phase 1: Input validation
    const inputValidation = ModelGeneratorValidation.validateInput(program);
    if (inputValidation) {
      return inputValidation;
    }

    try {
      // Phase 2: Extract TypeSpec entities using modular extractor
      const models = ModelExtractor.extractModels(program);
      const unions = ModelExtractor.extractUnions(program);
      const operations = ModelExtractor.extractOperations(program);
      const allGeneratedFiles = new Map<string, string>();

      // Phase 3: Generate Go structs for models
      for (const [modelName, extractedModel] of models) {
        // Validate extracted model
        const modelValidation = ModelGeneratorValidation.validateExtractedModel(modelName, extractedModel);
        if (modelValidation) {
          return modelValidation;
        }

        // Generate Go file using core generation logic
        const goFile = ModelGeneratorCore.generateGoFile(modelName, extractedModel);
        const fileName = ModelGeneratorUtility.getFileName(modelName);
        
        // Validate generated file
        const fileValidation = ModelGeneratorValidation.validateFileName(fileName);
        if (fileValidation) {
          return fileValidation;
        }

        // Validate generated Go code
        const codeValidation = ModelGeneratorValidation.validateGoCode(goFile);
        if (codeValidation) {
          return codeValidation;
        }

        allGeneratedFiles.set(fileName, goFile);
      }

      // Phase 4: Generate Go interfaces for unions
      for (const [unionName, extractedUnion] of unions) {
        // Validate extracted union
        const unionValidation = ModelGeneratorValidation.validateExtractedUnion(unionName, extractedUnion);
        if (unionValidation) {
          return unionValidation;
        }

        // Generate Go union file using core generation logic
        const goFile = ModelGeneratorCore.generateGoUnionFile(unionName, extractedUnion);
        const fileName = ModelGeneratorUtility.getFileName(unionName);
        
        // Validate generated file and code
        const fileValidation = ModelGeneratorValidation.validateFileName(fileName);
        if (fileValidation) {
          return fileValidation;
        }

        const codeValidation = ModelGeneratorValidation.validateGoCode(goFile);
        if (codeValidation) {
          return codeValidation;
        }

        allGeneratedFiles.set(fileName, goFile);
      }

      // Phase 5: Generate Go services and handlers for operations
      if (operations.size > 0) {
        // Validate operations
        for (const [operationName, operation] of operations) {
          const operationValidation = ModelGeneratorValidation.validateExtractedOperation(operationName, operation);
          if (operationValidation) {
            return operationValidation;
          }
        }

        // Generate service interface
        const serviceInterface = ModelGeneratorCore.generateGoServiceInterface("Service", operations);
        const serviceValidation = ModelGeneratorValidation.validateGoCode(serviceInterface);
        if (serviceValidation) {
          return serviceValidation;
        }
        allGeneratedFiles.set("service.go", serviceInterface);

        // Generate HTTP handlers
        const httpHandlers = this.generateHttpHandlers(operations);
        const handlersValidation = ModelGeneratorValidation.validateGoCode(httpHandlers);
        if (handlersValidation) {
          return handlersValidation;
        }
        allGeneratedFiles.set("handlers.go", httpHandlers);

        // Generate route registration
        const routeRegistration = this.generateRouteRegistration(operations);
        const routesValidation = ModelGeneratorValidation.validateGoCode(routeRegistration);
        if (routesValidation) {
          return routesValidation;
        }
        allGeneratedFiles.set("routes.go", routeRegistration);
      }

      // Phase 6: Validate complete generation result
      const resultValidation = ModelGeneratorValidation.validateGenerationResult(allGeneratedFiles);
      if (resultValidation) {
        return resultValidation;
      }

      // Phase 7: Return successful result
      return ErrorFactory.createSuccess(allGeneratedFiles, {
        generatedFiles: Array.from(allGeneratedFiles.keys()),
        modelsGenerated: models.size,
        unionsGenerated: unions.size,
        operationsGenerated: operations.size,
      });
    } catch (error) {
      return ErrorFactory.createTypeSpecCompilerError(
        `Model generation failed: ${error instanceof Error ? error.message : String(error)}`,
        {
          resolution: "Check TypeSpec model definitions for syntax errors",
          details: error instanceof Error ? error.stack : String(error),
        },
      );
    }
  }

  /**
   * Generate HTTP handlers for all operations
   */
  private generateHttpHandlers(operations: ReadonlyMap<string, ExtractedOperation>): string {
    const packageDecl = ModelGeneratorUtility.generatePackage();
    const header = ModelGeneratorUtility.generateHeader("HTTP Handlers");
    const imports = ModelGeneratorUtility.generateImports(new Set(["net/http"]));
    
    const handlers: string[] = [];
    for (const [operationName, operationInfo] of operations) {
      const handler = ModelGeneratorCore.generateHttpHandler(operationInfo);
      handlers.push(handler);
    }

    return `${packageDecl}

${header}

${imports}

${handlers.join('\n\n')}
`;
  }

  /**
   * Generate route registration function
   */
  private generateRouteRegistration(operations: ReadonlyMap<string, ExtractedOperation>): string {
    const packageDecl = ModelGeneratorUtility.generatePackage();
    const header = ModelGeneratorUtility.generateHeader("Route Registration");
    const imports = ModelGeneratorUtility.generateImports(new Set(["net/http"]));
    
    const operationList = Array.from(operations.values());
    const routes = ModelGeneratorUtility.generateRouteRegistration(operationList);

    return `${packageDecl}

${header}

${imports}

${routes}
`;
  }
}