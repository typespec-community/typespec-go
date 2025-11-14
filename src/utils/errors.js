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
export var ErrorSeverity;
(function (ErrorSeverity) {
    /** Warning: continue processing but notify user */
    ErrorSeverity["Warning"] = "warning";
    /** Error: stop current model, continue others */
    ErrorSeverity["Error"] = "error";
    /** Critical: stop all processing */
    ErrorSeverity["Critical"] = "critical";
})(ErrorSeverity || (ErrorSeverity = {}));
/**
 * Error categories for proper handling
 */
export var ErrorCategory;
(function (ErrorCategory) {
    /** Type mapping and conversion errors */
    ErrorCategory["TypeMapping"] = "type-mapping";
    /** Property transformation errors */
    ErrorCategory["PropertyTransformation"] = "property-transformation";
    /** Model generation errors */
    ErrorCategory["ModelGeneration"] = "model-generation";
    /** File I/O and path errors */
    ErrorCategory["FileSystem"] = "file-system";
    /** Configuration errors */
    ErrorCategory["Configuration"] = "configuration";
    /** TypeSpec compiler errors */
    ErrorCategory["TypeSpecCompiler"] = "typespec-compiler";
    /** Go code generation errors */
    ErrorCategory["GoGeneration"] = "go-generation";
})(ErrorCategory || (ErrorCategory = {}));
/**
 * Emitter error factory
 */
export class EmitterErrorFactory {
    /**
     * Create type mapping error
     */
    static createTypeMappingError(config) {
        var _a, _b, _c, _d;
        return {
            category: ErrorCategory.TypeMapping,
            severity: ErrorSeverity.Error,
            message: config.message,
            code: "TS_GO_TYPE_MAPPING_001",
            sourceLocation: {
                file: ((_a = config.sourceLocation) === null || _a === void 0 ? void 0 : _a.file) || "unknown",
                line: ((_b = config.sourceLocation) === null || _b === void 0 ? void 0 : _b.line) || 0,
                column: ((_c = config.sourceLocation) === null || _c === void 0 ? void 0 : _c.column) || 0,
                function: (_d = config.sourceLocation) === null || _d === void 0 ? void 0 : _d.function,
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
    static createPropertyTransformationError(config) {
        var _a, _b, _c, _d;
        return {
            category: ErrorCategory.PropertyTransformation,
            severity: ErrorSeverity.Error,
            message: config.message,
            code: "TS_GO_PROPERTY_002",
            sourceLocation: {
                file: ((_a = config.sourceLocation) === null || _a === void 0 ? void 0 : _a.file) || "unknown",
                line: ((_b = config.sourceLocation) === null || _b === void 0 ? void 0 : _b.line) || 0,
                column: ((_c = config.sourceLocation) === null || _c === void 0 ? void 0 : _c.column) || 0,
                function: (_d = config.sourceLocation) === null || _d === void 0 ? void 0 : _d.function,
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
    static createModelGenerationError(config) {
        var _a, _b, _c, _d;
        return {
            category: ErrorCategory.ModelGeneration,
            severity: ErrorSeverity.Error,
            message: config.message,
            code: "TS_GO_MODEL_003",
            sourceLocation: {
                file: ((_a = config.sourceLocation) === null || _a === void 0 ? void 0 : _a.file) || "unknown",
                line: ((_b = config.sourceLocation) === null || _b === void 0 ? void 0 : _b.line) || 0,
                column: ((_c = config.sourceLocation) === null || _c === void 0 ? void 0 : _c.column) || 0,
                function: (_d = config.sourceLocation) === null || _d === void 0 ? void 0 : _d.function,
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
    static createFileSystemError(config) {
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
    static createConfigurationError(config) {
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
    static createUnexpectedError(config) {
        var _a, _b, _c, _d;
        return {
            category: ErrorCategory.GoGeneration,
            severity: ErrorSeverity.Critical,
            message: `Unexpected error: ${config.message}`,
            code: "TS_GO_UNEXPECTED_999",
            sourceLocation: {
                file: ((_a = config.sourceLocation) === null || _a === void 0 ? void 0 : _a.file) || "unknown",
                line: ((_b = config.sourceLocation) === null || _b === void 0 ? void 0 : _b.line) || 0,
                column: ((_c = config.sourceLocation) === null || _c === void 0 ? void 0 : _c.column) || 0,
                function: (_d = config.sourceLocation) === null || _d === void 0 ? void 0 : _d.function,
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
export class DefaultErrorHandler {
    /**
     * Handle error by logging and returning continue/stop decision
     */
    handleError(error) {
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
    logError(error) {
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
export class InMemoryErrorCollector {
    constructor() {
        this.errors = [];
    }
    /**
     * Add error to collection
     */
    addError(error) {
        this.errors.push(error);
    }
    /**
     * Get all collected errors
     */
    getErrors() {
        return [...this.errors];
    }
    /**
     * Get errors by category
     */
    getErrorsByCategory(category) {
        return this.errors.filter(error => error.category === category);
    }
    /**
     * Get errors by severity
     */
    getErrorsBySeverity(severity) {
        return this.errors.filter(error => error.severity === severity);
    }
    /**
     * Check if any errors of given severity exist
     */
    hasErrorsOfSeverity(severity) {
        return this.errors.some(error => error.severity === severity);
    }
    /**
     * Clear all errors
     */
    clearErrors() {
        this.errors = [];
    }
    /**
     * Get summary statistics
     */
    getErrorSummary() {
        const summary = {};
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
    /**
     * Set global error handler
     */
    static setHandler(handler) {
        ErrorManager.handler = handler;
    }
    /**
     * Set global error collector
     */
    static setCollector(collector) {
        ErrorManager.collector = collector;
    }
    /**
     * Handle error through global system
     */
    static handleError(error) {
        ErrorManager.collector.addError(error);
        return ErrorManager.handler.handleError(error);
    }
    /**
     * Create and handle type mapping error
     */
    static handleTypeMappingError(config) {
        const error = EmitterErrorFactory.createTypeMappingError(config);
        return ErrorManager.handleError(error);
    }
    /**
     * Create and handle property transformation error
     */
    static handlePropertyTransformationError(config) {
        const error = EmitterErrorFactory.createPropertyTransformationError(config);
        return ErrorManager.handleError(error);
    }
    /**
     * Create and handle model generation error
     */
    static handleModelGenerationError(config) {
        const error = EmitterErrorFactory.createModelGenerationError(config);
        return ErrorManager.handleError(error);
    }
    /**
     * Create and handle file system error
     */
    static handleFileSystemError(config) {
        const error = EmitterErrorFactory.createFileSystemError(config);
        return ErrorManager.handleError(error);
    }
    /**
     * Create and handle configuration error
     */
    static handleConfigurationError(config) {
        const error = EmitterErrorFactory.createConfigurationError(config);
        return ErrorManager.handleError(error);
    }
    /**
     * Create and handle unexpected error
     */
    static handleUnexpectedError(config) {
        const error = EmitterErrorFactory.createUnexpectedError(config);
        return ErrorManager.handleError(error);
    }
    /**
     * Get all collected errors
     */
    static getErrors() {
        return ErrorManager.collector.getErrors();
    }
    /**
     * Get error summary
     */
    static getErrorSummary() {
        var _a, _b;
        return ((_b = (_a = ErrorManager.collector).getErrorSummary) === null || _b === void 0 ? void 0 : _b.call(_a)) || {};
    }
    /**
     * Clear all errors
     */
    static clearErrors() {
        ErrorManager.collector.clearErrors();
    }
    /**
     * Check if processing should stop
     */
    static shouldStopProcessing() {
        return ErrorManager.collector.hasErrorsOfSeverity(ErrorSeverity.Critical);
    }
}
ErrorManager.handler = new DefaultErrorHandler();
ErrorManager.collector = new InMemoryErrorCollector();
