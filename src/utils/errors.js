"use strict";
/**
 * TypeSpec-Go Emitter Error System
 *
 * Centralized, type-safe error handling
 * No more generic exceptions, proper error codes and recovery
 *
 * @fileoverview Comprehensive error management system
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorManager = exports.InMemoryErrorCollector = exports.DefaultErrorHandler = exports.EmitterErrorFactory = exports.ErrorCategory = exports.ErrorSeverity = void 0;
/**
 * Error severity levels
 */
var ErrorSeverity;
(function (ErrorSeverity) {
    /** Warning: continue processing but notify user */
    ErrorSeverity["Warning"] = "warning";
    /** Error: stop current model, continue others */
    ErrorSeverity["Error"] = "error";
    /** Critical: stop all processing */
    ErrorSeverity["Critical"] = "critical";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
/**
 * Error categories for proper handling
 */
var ErrorCategory;
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
})(ErrorCategory || (exports.ErrorCategory = ErrorCategory = {}));
/**
 * Emitter error factory
 */
var EmitterErrorFactory = /** @class */ (function () {
    function EmitterErrorFactory() {
    }
    /**
     * Create type mapping error
     */
    EmitterErrorFactory.createTypeMappingError = function (config) {
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
    };
    /**
     * Create property transformation error
     */
    EmitterErrorFactory.createPropertyTransformationError = function (config) {
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
    };
    /**
     * Create model generation error
     */
    EmitterErrorFactory.createModelGenerationError = function (config) {
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
    };
    /**
     * Create file system error
     */
    EmitterErrorFactory.createFileSystemError = function (config) {
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
    };
    /**
     * Create configuration error
     */
    EmitterErrorFactory.createConfigurationError = function (config) {
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
    };
    /**
     * Create generic error for unexpected cases
     */
    EmitterErrorFactory.createUnexpectedError = function (config) {
        var _a, _b, _c, _d;
        return {
            category: ErrorCategory.GoGeneration,
            severity: ErrorSeverity.Critical,
            message: "Unexpected error: ".concat(config.message),
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
    };
    return EmitterErrorFactory;
}());
exports.EmitterErrorFactory = EmitterErrorFactory;
/**
 * Default error handler implementation
 */
var DefaultErrorHandler = /** @class */ (function () {
    function DefaultErrorHandler() {
    }
    /**
     * Handle error by logging and returning continue/stop decision
     */
    DefaultErrorHandler.prototype.handleError = function (error) {
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
    };
    /**
     * Log error with appropriate formatting
     */
    DefaultErrorHandler.prototype.logError = function (error) {
        var severity = error.severity.toUpperCase();
        var category = error.category.replace(/-/g, " ").toUpperCase();
        console.error("\n[".concat(severity, "] ").concat(category, ": ").concat(error.message));
        console.error("Code: ".concat(error.code));
        if (error.sourceLocation.file !== "unknown") {
            console.error("Location: ".concat(error.sourceLocation.file, ":").concat(error.sourceLocation.line, ":").concat(error.sourceLocation.column));
        }
        if (error.resolution) {
            console.error("Resolution: ".concat(error.resolution));
        }
        if (process.env.NODE_ENV === "development" && error.cause) {
            console.error("Cause: ".concat(error.cause.message));
        }
    };
    return DefaultErrorHandler;
}());
exports.DefaultErrorHandler = DefaultErrorHandler;
/**
 * In-memory error collector implementation
 */
var InMemoryErrorCollector = /** @class */ (function () {
    function InMemoryErrorCollector() {
        this.errors = [];
    }
    /**
     * Add error to collection
     */
    InMemoryErrorCollector.prototype.addError = function (error) {
        this.errors.push(error);
    };
    /**
     * Get all collected errors
     */
    InMemoryErrorCollector.prototype.getErrors = function () {
        return __spreadArray([], this.errors, true);
    };
    /**
     * Get errors by category
     */
    InMemoryErrorCollector.prototype.getErrorsByCategory = function (category) {
        return this.errors.filter(function (error) { return error.category === category; });
    };
    /**
     * Get errors by severity
     */
    InMemoryErrorCollector.prototype.getErrorsBySeverity = function (severity) {
        return this.errors.filter(function (error) { return error.severity === severity; });
    };
    /**
     * Check if any errors of given severity exist
     */
    InMemoryErrorCollector.prototype.hasErrorsOfSeverity = function (severity) {
        return this.errors.some(function (error) { return error.severity === severity; });
    };
    /**
     * Clear all errors
     */
    InMemoryErrorCollector.prototype.clearErrors = function () {
        this.errors = [];
    };
    /**
     * Get summary statistics
     */
    InMemoryErrorCollector.prototype.getErrorSummary = function () {
        var summary = {};
        for (var _i = 0, _a = this.errors; _i < _a.length; _i++) {
            var error = _a[_i];
            var key = "".concat(error.category, ":").concat(error.severity);
            summary[key] = (summary[key] || 0) + 1;
        }
        return summary;
    };
    return InMemoryErrorCollector;
}());
exports.InMemoryErrorCollector = InMemoryErrorCollector;
/**
 * Global error management
 */
var ErrorManager = /** @class */ (function () {
    function ErrorManager() {
    }
    /**
     * Set global error handler
     */
    ErrorManager.setHandler = function (handler) {
        ErrorManager.handler = handler;
    };
    /**
     * Set global error collector
     */
    ErrorManager.setCollector = function (collector) {
        ErrorManager.collector = collector;
    };
    /**
     * Handle error through global system
     */
    ErrorManager.handleError = function (error) {
        ErrorManager.collector.addError(error);
        return ErrorManager.handler.handleError(error);
    };
    /**
     * Create and handle type mapping error
     */
    ErrorManager.handleTypeMappingError = function (config) {
        var error = EmitterErrorFactory.createTypeMappingError(config);
        return ErrorManager.handleError(error);
    };
    /**
     * Create and handle property transformation error
     */
    ErrorManager.handlePropertyTransformationError = function (config) {
        var error = EmitterErrorFactory.createPropertyTransformationError(config);
        return ErrorManager.handleError(error);
    };
    /**
     * Create and handle model generation error
     */
    ErrorManager.handleModelGenerationError = function (config) {
        var error = EmitterErrorFactory.createModelGenerationError(config);
        return ErrorManager.handleError(error);
    };
    /**
     * Create and handle file system error
     */
    ErrorManager.handleFileSystemError = function (config) {
        var error = EmitterErrorFactory.createFileSystemError(config);
        return ErrorManager.handleError(error);
    };
    /**
     * Create and handle configuration error
     */
    ErrorManager.handleConfigurationError = function (config) {
        var error = EmitterErrorFactory.createConfigurationError(config);
        return ErrorManager.handleError(error);
    };
    /**
     * Create and handle unexpected error
     */
    ErrorManager.handleUnexpectedError = function (config) {
        var error = EmitterErrorFactory.createUnexpectedError(config);
        return ErrorManager.handleError(error);
    };
    /**
     * Get all collected errors
     */
    ErrorManager.getErrors = function () {
        return ErrorManager.collector.getErrors();
    };
    /**
     * Get error summary
     */
    ErrorManager.getErrorSummary = function () {
        var _a, _b;
        return ((_b = (_a = ErrorManager.collector).getErrorSummary) === null || _b === void 0 ? void 0 : _b.call(_a)) || {};
    };
    /**
     * Clear all errors
     */
    ErrorManager.clearErrors = function () {
        ErrorManager.collector.clearErrors();
    };
    /**
     * Check if processing should stop
     */
    ErrorManager.shouldStopProcessing = function () {
        return ErrorManager.collector.hasErrorsOfSeverity(ErrorSeverity.Critical);
    };
    ErrorManager.handler = new DefaultErrorHandler();
    ErrorManager.collector = new InMemoryErrorCollector();
    return ErrorManager;
}());
exports.ErrorManager = ErrorManager;
