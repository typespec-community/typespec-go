/**
 * TypeSpec-Go Emitter Error System
 * 
 * Centralized, type-safe error handling
 * No more generic exceptions, proper error codes and recovery
 * 
 * @fileoverview Comprehensive error management system
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  /** Warning: continue processing but notify user */
  Warning = "warning",
  
  /** Error: stop current model, continue others */
  Error = "error",
  
  /** Critical: stop all processing */
  Critical = "critical",
}

/**
 * Error categories for proper handling
 */
export enum ErrorCategory {
  /** Type mapping and conversion errors */
  TypeMapping = "type-mapping",
  
  /** Property transformation errors */
  PropertyTransformation = "property-transformation",
  
  /** Model generation errors */
  ModelGeneration = "model-generation",
  
  /** File I/O and path errors */
  FileSystem = "file-system",
  
  /** Configuration errors */
  Configuration = "configuration",
  
  /** TypeSpec compiler errors */
  TypeSpecCompiler = "typespec-compiler",
  
  /** Go code generation errors */
  GoGeneration = "go-generation",
}

/**
 * Structured emitter error
 */
export interface EmitterError {
  /** Error category for handling */
  readonly category: ErrorCategory;
  
  /** Error severity */
  readonly severity: ErrorSeverity;
  
  /** Human-readable error message */
  readonly message: string;
  
  /** Error code for programmatic handling */
  readonly code: string;
  
  /** Source location (file, line, column) */
  readonly sourceLocation: SourceLocation;
  
  /** Error context for debugging */
  readonly context: ErrorContext;
  
  /** Underlying error that caused this error */
  readonly cause?: Error;
  
  /** Suggested resolution for user */
  readonly resolution?: string;
  
  /** Timestamp when error occurred */
  readonly timestamp: Date;
}

/**
 * Error source location
 */
export interface SourceLocation {
  /** File path (absolute or relative) */
  readonly file: string;
  
  /** Line number (1-based) */
  readonly line: number;
  
  /** Column number (1-based) */
  readonly column: number;
  
  /** Function or method name where error occurred */
  readonly function?: string;
}

/**
 * Error context for debugging
 */
export interface ErrorContext {
  /** TypeSpec construct being processed */
  readonly construct: string;
  
  /** Current phase of processing */
  readonly phase: string;
  
  /** Additional contextual data */
  readonly data?: Record<string, any>;
  
  /** Stack trace for debugging */
  readonly stack?: string;
}

/**
 * Error handler interface
 */
export interface ErrorHandler {
  /** Handle error and decide whether to continue */
  handleError(error: EmitterError): boolean;
}

/**
 * Error collector for batching errors
 */
export interface ErrorCollector {
  /** Add error to collection */
  addError(error: EmitterError): void;
  
  /** Get all collected errors */
  getErrors(): readonly EmitterError[];
  
  /** Get errors by category */
  getErrorsByCategory(category: ErrorCategory): readonly EmitterError[];
  
  /** Get errors by severity */
  getErrorsBySeverity(severity: ErrorSeverity): readonly EmitterError[];
  
  /** Check if any errors of given severity exist */
  hasErrorsOfSeverity(severity: ErrorSeverity): boolean;
  
  /** Clear all errors */
  clearErrors(): void;
}

/**
 * Emitter error factory
 */
export class EmitterErrorFactory {
  /**
   * Create type mapping error
   */
  static createTypeMappingError(config: {
    message: string;
    typeSpecType?: string;
    goType?: string;
    cause?: Error;
    resolution?: string;
    sourceLocation?: Partial<SourceLocation>;
  }): EmitterError {
    return {
      category: ErrorCategory.TypeMapping,
      severity: ErrorSeverity.Error,
      message: config.message,
      code: "TS_GO_TYPE_MAPPING_001",
      sourceLocation: {
        file: config.sourceLocation?.file || "unknown",
        line: config.sourceLocation?.line || 0,
        column: config.sourceLocation?.column || 0,
        function: config.sourceLocation?.function,
      },
      context: {
        construct: "type-mapping",
        phase: "conversion",
        data: {
          typeSpecType: config.typeSpecType,
          goType: config.goType,
        },
      },
      cause: config.cause,
      resolution: config.resolution || "Check custom type mappings or update type conversion logic",
      timestamp: new Date(),
    };
  }

  /**
   * Create property transformation error
   */
  static createPropertyTransformationError(config: {
    message: string;
    propertyName?: string;
    propertyType?: string;
    cause?: Error;
    resolution?: string;
    sourceLocation?: Partial<SourceLocation>;
  }): EmitterError {
    return {
      category: ErrorCategory.PropertyTransformation,
      severity: ErrorSeverity.Error,
      message: config.message,
      code: "TS_GO_PROPERTY_002",
      sourceLocation: {
        file: config.sourceLocation?.file || "unknown",
        line: config.sourceLocation?.line || 0,
        column: config.sourceLocation?.column || 0,
        function: config.sourceLocation?.function,
      },
      context: {
        construct: "property-transformation",
        phase: "transformation",
        data: {
          propertyName: config.propertyName,
          propertyType: config.propertyType,
        },
      },
      cause: config.cause,
      resolution: config.resolution || "Check property naming and type mapping rules",
      timestamp: new Date(),
    };
  }

  /**
   * Create model generation error
   */
  static createModelGenerationError(config: {
    message: string;
    modelName?: string;
    cause?: Error;
    resolution?: string;
    sourceLocation?: Partial<SourceLocation>;
  }): EmitterError {
    return {
      category: ErrorCategory.ModelGeneration,
      severity: ErrorSeverity.Error,
      message: config.message,
      code: "TS_GO_MODEL_003",
      sourceLocation: {
        file: config.sourceLocation?.file || "unknown",
        line: config.sourceLocation?.line || 0,
        column: config.sourceLocation?.column || 0,
        function: config.sourceLocation?.function,
      },
      context: {
        construct: "model-generation",
        phase: "code-generation",
        data: {
          modelName: config.modelName,
        },
      },
      cause: config.cause,
      resolution: config.resolution || "Check model structure and naming conventions",
      timestamp: new Date(),
    };
  }

  /**
   * Create file system error
   */
  static createFileSystemError(config: {
    message: string;
    filePath?: string;
    operation?: string;
    cause?: Error;
    resolution?: string;
  }): EmitterError {
    return {
      category: ErrorCategory.FileSystem,
      severity: ErrorSeverity.Critical,
      message: config.message,
      code: "TS_GO_FS_004",
      sourceLocation: {
        file: config.filePath || "unknown",
        line: 0,
        column: 0,
        function: config.operation,
      },
      context: {
        construct: "file-system",
        phase: config.operation || "unknown",
        data: {
          filePath: config.filePath,
        },
      },
      cause: config.cause,
      resolution: config.resolution || "Check file permissions and disk space",
      timestamp: new Date(),
    };
  }

  /**
   * Create configuration error
   */
  static createConfigurationError(config: {
    message: string;
    configKey?: string;
    configValue?: any;
    cause?: Error;
    resolution?: string;
  }): EmitterError {
    return {
      category: ErrorCategory.Configuration,
      severity: ErrorSeverity.Critical,
      message: config.message,
      code: "TS_GO_CONFIG_005",
      sourceLocation: {
        file: "config",
        line: 0,
        column: 0,
        function: "validation",
      },
      context: {
        construct: "configuration",
        phase: "validation",
        data: {
          configKey: config.configKey,
          configValue: config.configValue,
        },
      },
      cause: config.cause,
      resolution: config.resolution || "Check emitter configuration documentation",
      timestamp: new Date(),
    };
  }

  /**
   * Create generic error for unexpected cases
   */
  static createUnexpectedError(config: {
    message: string;
    cause?: Error;
    sourceLocation?: Partial<SourceLocation>;
  }): EmitterError {
    return {
      category: ErrorCategory.GoGeneration,
      severity: ErrorSeverity.Critical,
      message: `Unexpected error: ${config.message}`,
      code: "TS_GO_UNEXPECTED_999",
      sourceLocation: {
        file: config.sourceLocation?.file || "unknown",
        line: config.sourceLocation?.line || 0,
        column: config.sourceLocation?.column || 0,
        function: config.sourceLocation?.function,
      },
      context: {
        construct: "unexpected",
        phase: "runtime",
        data: {},
      },
      cause: config.cause,
      resolution: config.resolution || "Report this as a bug with full context",
      timestamp: new Date(),
    };
  }
}

/**
 * Default error handler implementation
 */
export class DefaultErrorHandler implements ErrorHandler {
  /**
   * Handle error by logging and returning continue/stop decision
   */
  handleError(error: EmitterError): boolean {
    // Log error to console
    this.logError(error);
    
    // Critical errors stop processing
    if (error.severity === ErrorSeverity.Critical) {
      return false; // Stop processing
    }
    
    // Model generation errors stop current model but continue others
    if (error.category === ErrorCategory.ModelGeneration) {
      return false; // Stop current model
    }
    
    // Other errors continue processing
    return true; // Continue processing
  }

  /**
   * Log error with appropriate formatting
   */
  private logError(error: EmitterError): void {
    const severity = error.severity.toUpperCase();
    const category = error.category.replace(/-/g, " ").toUpperCase();
    
    console.error(`\n[${severity}] ${category}: ${error.message}`);
    console.error(`Code: ${error.code}`);
    
    if (error.sourceLocation.file !== "unknown") {
      console.error(`Location: ${error.sourceLocation.file}:${error.sourceLocation.line}:${error.sourceLocation.column}`);
    }
    
    if (error.resolution) {
      console.error(`Resolution: ${error.resolution}`);
    }
    
    if (process.env.NODE_ENV === "development" && error.cause) {
      console.error(`Cause: ${error.cause.message}`);
    }
  }
}

/**
 * In-memory error collector implementation
 */
export class InMemoryErrorCollector implements ErrorCollector {
  private errors: EmitterError[] = [];

  /**
   * Add error to collection
   */
  addError(error: EmitterError): void {
    this.errors.push(error);
  }

  /**
   * Get all collected errors
   */
  getErrors(): readonly EmitterError[] {
    return [...this.errors];
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): readonly EmitterError[] {
    return this.errors.filter(error => error.category === category);
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): readonly EmitterError[] {
    return this.errors.filter(error => error.severity === severity);
  }

  /**
   * Check if any errors of given severity exist
   */
  hasErrorsOfSeverity(severity: ErrorSeverity): boolean {
    return this.errors.some(error => error.severity === severity);
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Get summary statistics
   */
  getErrorSummary(): Record<string, number> {
    const summary: Record<string, number> = {};
    
    for (const error of this.errors) {
      const key = `${error.category}:${error.severity}`;
      summary[key] = (summary[key] || 0) + 1;
    }
    
    return summary;
  }
}

/**
 * Global error management
 */
export class ErrorManager {
  private static handler: ErrorHandler = new DefaultErrorHandler();
  private static collector: ErrorCollector = new InMemoryErrorCollector();

  /**
   * Set global error handler
   */
  static setHandler(handler: ErrorHandler): void {
    ErrorManager.handler = handler;
  }

  /**
   * Set global error collector
   */
  static setCollector(collector: ErrorCollector): void {
    ErrorManager.collector = collector;
  }

  /**
   * Handle error through global system
   */
  static handleError(error: EmitterError): boolean {
    ErrorManager.collector.addError(error);
    return ErrorManager.handler.handleError(error);
  }

  /**
   * Create and handle type mapping error
   */
  static handleTypeMappingError(config: Parameters<typeof EmitterErrorFactory.createTypeMappingError>[0]): boolean {
    const error = EmitterErrorFactory.createTypeMappingError(config);
    return ErrorManager.handleError(error);
  }

  /**
   * Create and handle property transformation error
   */
  static handlePropertyTransformationError(config: Parameters<typeof EmitterErrorFactory.createPropertyTransformationError>[0]): boolean {
    const error = EmitterErrorFactory.createPropertyTransformationError(config);
    return ErrorManager.handleError(error);
  }

  /**
   * Create and handle model generation error
   */
  static handleModelGenerationError(config: Parameters<typeof EmitterErrorFactory.createModelGenerationError>[0]): boolean {
    const error = EmitterErrorFactory.createModelGenerationError(config);
    return ErrorManager.handleError(error);
  }

  /**
   * Create and handle file system error
   */
  static handleFileSystemError(config: Parameters<typeof EmitterErrorFactory.createFileSystemError>[0]): boolean {
    const error = EmitterErrorFactory.createFileSystemError(config);
    return ErrorManager.handleError(error);
  }

  /**
   * Create and handle configuration error
   */
  static handleConfigurationError(config: Parameters<typeof EmitterErrorFactory.createConfigurationError>[0]): boolean {
    const error = EmitterErrorFactory.createConfigurationError(config);
    return ErrorManager.handleError(error);
  }

  /**
   * Create and handle unexpected error
   */
  static handleUnexpectedError(config: Parameters<typeof EmitterErrorFactory.createUnexpectedError>[0]): boolean {
    const error = EmitterErrorFactory.createUnexpectedError(config);
    return ErrorManager.handleError(error);
  }

  /**
   * Get all collected errors
   */
  static getErrors(): readonly EmitterError[] {
    return ErrorManager.collector.getErrors();
  }

  /**
   * Get error summary
   */
  static getErrorSummary(): Record<string, number> {
    return ErrorManager.collector.getErrorSummary();
  }

  /**
   * Clear all errors
   */
  static clearErrors(): void {
    ErrorManager.collector.clearErrors();
  }

  /**
   * Check if processing should stop
   */
  static shouldStopProcessing(): boolean {
    return ErrorManager.collector.hasErrorsOfSeverity(ErrorSeverity.Critical);
  }
}