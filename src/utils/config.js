"use strict";
/**
 * TypeSpec-Go Emitter Configuration
 *
 * Centralized configuration with type safety
 * No more hardcoded values, no magic strings
 *
 * @fileoverview Emitter configuration with validation
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmitterConfigFactory = exports.DEFAULT_EMITTER_CONFIG = exports.TypeNamingStrategy = exports.FieldNamingStrategy = void 0;
/**
 * Field naming strategy options
 */
var FieldNamingStrategy;
(function (FieldNamingStrategy) {
    /** PascalCase: userName → UserName */
    FieldNamingStrategy["Pascal"] = "pascal";
    /** camelCase: userName → userName */
    FieldNamingStrategy["Camel"] = "camel";
    /** snake_case: userName → user_name */
    FieldNamingStrategy["Snake"] = "snake";
})(FieldNamingStrategy || (exports.FieldNamingStrategy = FieldNamingStrategy = {}));
/**
 * Type naming strategy options
 */
var TypeNamingStrategy;
(function (TypeNamingStrategy) {
    /** PascalCase: User → User */
    TypeNamingStrategy["Pascal"] = "pascal";
    /** camelCase: User → user */
    TypeNamingStrategy["Camel"] = "camel";
    /** snake_case: User → user */
    TypeNamingStrategy["Snake"] = "snake";
})(TypeNamingStrategy || (exports.TypeNamingStrategy = TypeNamingStrategy = {}));
/**
 * Default emitter configuration
 */
exports.DEFAULT_EMITTER_CONFIG = {
    packageName: "api",
    modulePath: "example.com/api",
    goVersion: "1.21",
    outputDir: "./gen",
    generateJsonMethods: true,
    generateXmlMethods: false,
    generateValidation: false,
    fieldNaming: FieldNamingStrategy.Pascal,
    typeNaming: TypeNamingStrategy.Pascal,
    buildTags: [],
    includeGeneratedWarning: true,
    customTypeMappings: new Map(),
    importPrefixes: new Map(),
};
/**
 * Emitter configuration factory
 */
var EmitterConfigFactory = /** @class */ (function () {
    function EmitterConfigFactory() {
    }
    /**
     * Create configuration from TypeSpec compiler options
     */
    EmitterConfigFactory.fromTypeSpecOptions = function (typeSpecOptions) {
        // Start with defaults
        var config = __assign({}, exports.DEFAULT_EMITTER_CONFIG);
        // Override with TypeSpec options
        if (typeSpecOptions["go-package"]) {
            config.packageName = typeSpecOptions["go-package"];
        }
        if (typeSpecOptions["go-module"]) {
            config.modulePath = typeSpecOptions["go-module"];
        }
        if (typeSpecOptions["go-version"]) {
            config.goVersion = typeSpecOptions["go-version"];
        }
        if (typeSpecOptions["go-output-dir"]) {
            config.outputDir = typeSpecOptions["go-output-dir"];
        }
        if (typeSpecOptions["go-generate-json"] !== undefined) {
            config.generateJsonMethods = Boolean(typeSpecOptions["go-generate-json"]);
        }
        if (typeSpecOptions["go-generate-xml"] !== undefined) {
            config.generateXmlMethods = Boolean(typeSpecOptions["go-generate-xml"]);
        }
        if (typeSpecOptions["go-generate-validation"] !== undefined) {
            config.generateValidation = Boolean(typeSpecOptions["go-generate-validation"]);
        }
        // Handle naming strategies
        if (typeSpecOptions["go-field-naming"]) {
            var strategy = FieldNamingStrategy[typeSpecOptions["go-field-naming"]];
            if (strategy !== undefined) {
                config.fieldNaming = strategy;
            }
        }
        if (typeSpecOptions["go-type-naming"]) {
            var strategy = TypeNamingStrategy[typeSpecOptions["go-type-naming"]];
            if (strategy !== undefined) {
                config.typeNaming = strategy;
            }
        }
        // Handle build tags
        if (typeSpecOptions["go-build-tags"]) {
            config.buildTags = String(typeSpecOptions["go-build-tags"]).split(",").map(function (tag) { return tag.trim(); });
        }
        // Handle custom type mappings
        if (typeSpecOptions["go-type-mappings"]) {
            config.customTypeMappings = this.parseCustomTypeMappings(typeSpecOptions["go-type-mappings"]);
        }
        return this.validateConfig(config);
    };
    /**
     * Create configuration from environment variables
     */
    EmitterConfigFactory.fromEnvironment = function () {
        var config = __assign({}, exports.DEFAULT_EMITTER_CONFIG);
        if (process.env.GO_PACKAGE) {
            config.packageName = process.env.GO_PACKAGE;
        }
        if (process.env.GO_MODULE) {
            config.modulePath = process.env.GO_MODULE;
        }
        if (process.env.GO_VERSION) {
            config.goVersion = process.env.GO_VERSION;
        }
        if (process.env.GO_OUTPUT_DIR) {
            config.outputDir = process.env.GO_OUTPUT_DIR;
        }
        return this.validateConfig(config);
    };
    /**
     * Parse custom type mappings from configuration
     */
    EmitterConfigFactory.parseCustomTypeMappings = function (mappings) {
        var result = new Map();
        try {
            var parsed = JSON.parse(mappings);
            for (var _i = 0, _a = Object.entries(parsed); _i < _a.length; _i++) {
                var _b = _a[_i], typeSpecType = _b[0], mapping = _b[1];
                result.set(typeSpecType, {
                    goType: mapping.goType,
                    importPath: mapping.importPath,
                    usePointerForOptional: mapping.usePointerForOptional !== false,
                    validation: mapping.validation,
                });
            }
        }
        catch (error) {
            console.warn("Failed to parse custom type mappings: ".concat(error));
        }
        return result;
    };
    /**
     * Validate configuration and throw errors for invalid settings
     */
    EmitterConfigFactory.validateConfig = function (config) {
        // Validate package name
        if (!config.packageName || config.packageName.trim().length === 0) {
            throw new Error("Invalid package name: '".concat(config.packageName, "'"));
        }
        if (!/^[a-z][a-z0-9_]*$/.test(config.packageName)) {
            throw new Error("Invalid Go package name: '".concat(config.packageName, "'. Must be lowercase, start with letter."));
        }
        // Validate module path
        if (!config.modulePath || config.modulePath.trim().length === 0) {
            throw new Error("Invalid module path: '".concat(config.modulePath, "'"));
        }
        if (!config.goVersion || !/^\d+\.\d+(\.\d+)?$/.test(config.goVersion)) {
            throw new Error("Invalid Go version: '".concat(config.goVersion, "'. Expected format: 1.21 or 1.21.3"));
        }
        // Validate output directory
        if (!config.outputDir || config.outputDir.trim().length === 0) {
            throw new Error("Invalid output directory: '".concat(config.outputDir, "'"));
        }
        // Validate build tags
        for (var _i = 0, _a = config.buildTags; _i < _a.length; _i++) {
            var tag = _a[_i];
            if (!/^[a-z][a-z0-9_]*$/i.test(tag)) {
                throw new Error("Invalid build tag: '".concat(tag, "'. Must be valid Go identifier."));
            }
        }
        return config;
    };
    /**
     * Create configuration with custom overrides
     */
    EmitterConfigFactory.create = function (overrides) {
        var config = __assign(__assign({}, exports.DEFAULT_EMITTER_CONFIG), overrides);
        return this.validateConfig(config);
    };
    /**
     * Get effective configuration from multiple sources
     * Priority: TypeSpec options > Environment > Defaults
     */
    EmitterConfigFactory.createEffective = function (typeSpecOptions) {
        // Start with environment
        var config = this.fromEnvironment();
        // Override with TypeSpec options
        var typeSpecConfig = this.fromTypeSpecOptions(typeSpecOptions);
        return __assign(__assign({}, config), typeSpecConfig);
    };
    return EmitterConfigFactory;
}());
exports.EmitterConfigFactory = EmitterConfigFactory;
