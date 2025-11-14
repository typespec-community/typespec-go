"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$lib = void 0;
exports.$onEmit = $onEmit;
var jsx_runtime_1 = require("react/jsx-runtime");
var compiler_1 = require("@typespec/compiler");
var core_1 = require("@alloy-js/core");
var go = __importStar(require("@alloy-js/go"));
var compiler_2 = require("@typespec/compiler");
var type_mapper_js_1 = require("./utils/type-mapper.js");
var config_js_1 = require("./utils/config.js");
var errors_js_1 = require("./utils/errors.js");
// Create TypeSpec library declaration
exports.$lib = (0, compiler_1.createTypeSpecLibrary)({
    name: "@typespec-go/emitter",
    diagnostics: {
        "unsupported-type": {
            severity: "error",
            messages: {
                default: "Type '{typeName}' ({kind}) is not yet supported for Go generation.",
            },
        },
    },
});
// Main emission function using proper Alloy Go components
function $onEmit(context) {
    return __awaiter(this, void 0, void 0, function () {
        var config;
        return __generator(this, function (_a) {
            try {
                config = config_js_1.EmitterConfigFactory.createEffective(context.options);
                return [2 /*return*/, ((0, jsx_runtime_1.jsx)(core_1.Output, { children: (0, jsx_runtime_1.jsx)(GoModule, { context: context, config: config }) }))];
            }
            catch (error) {
                // Handle any unexpected errors with our error system
                errors_js_1.ErrorManager.handleUnexpectedError({
                    message: "Emission failed: ".concat(error instanceof Error ? error.message : String(error)),
                    cause: error instanceof Error ? error : undefined,
                    sourceLocation: {
                        file: "emitter.tsx",
                        function: "$onEmit",
                        line: 0,
                        column: 0,
                    },
                });
                // Re-throw to halt compilation
                throw error;
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Main Go module component using proper Alloy Go components
 */
function GoModule(_a) {
    var context = _a.context, config = _a.config;
    // Get global namespace
    var globalNamespace = context.program.getGlobalNamespaceType();
    // Collect all types and their imports
    var allModels = Array.from(globalNamespace.models.values());
    var requiredImports = collectRequiredImports(allModels, context);
    return ((0, jsx_runtime_1.jsx)(go.ModuleDirectory, { name: "example.com/output", children: (0, jsx_runtime_1.jsx)(go.SourceDirectory, { path: "api", children: (0, jsx_runtime_1.jsxs)(go.SourceFile, { path: "models.go", package: config.packageName, children: [config.includeGeneratedWarning && ((0, jsx_runtime_1.jsx)(go.LineComment, { children: "Code generated by TypeSpec Go Emitter" })), config.includeGeneratedWarning && ((0, jsx_runtime_1.jsx)(go.LineComment, { children: "DO NOT EDIT - Generated code" })), config.includeGeneratedWarning && ((0, jsx_runtime_1.jsx)(go.LineComment, { children: "See: https://github.com/typespec-community/typespec-go" })), requiredImports.length > 0 && ((0, jsx_runtime_1.jsx)(go.LineComment, { children: "TODO: Add imports: ".concat(requiredImports.join(", ")) })), (0, jsx_runtime_1.jsx)(go.TypeDeclarationGroup, { children: allModels.map(function (model) {
                            var modelName = String(model.name);
                            if (!modelName || model.properties.size === 0) {
                                return null;
                            }
                            return (0, jsx_runtime_1.jsx)(GoStructDeclaration, { model: model, context: context });
                        }) })] }) }) }));
}
/**
 * Collect required imports for all models
 */
function collectRequiredImports(models, context) {
    var imports = new Set();
    for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
        var model = models_1[_i];
        for (var _a = 0, _b = model.properties.values(); _a < _b.length; _a++) {
            var property = _b[_a];
            var goType = type_mapper_js_1.GoTypeMapper.mapTypeSpecType(property.type, context.program);
            collectTypeImports(goType, imports);
        }
    }
    return Array.from(imports).sort();
}
/**
 * Recursively collect imports from mapped types
 */
function collectTypeImports(mappedType, imports) {
    if (mappedType.importPath) {
        imports.add(mappedType.importPath);
    }
    if (mappedType.baseType) {
        collectTypeImports(mappedType.baseType, imports);
    }
    if (mappedType.elementType) {
        collectTypeImports(mappedType.elementType, imports);
    }
}
/**
 * Individual type declaration component
 */
function GoTypeDeclaration(_a) {
    var type = _a.type, context = _a.context;
    switch (type.kind) {
        case "Model":
            // Check if it's an array model
            if ((0, compiler_2.isArrayModelType)(context.program, type)) {
                return (0, jsx_runtime_1.jsx)(GoArrayDeclaration, { arrayType: type });
            }
            return (0, jsx_runtime_1.jsx)(GoStructDeclaration, { model: type, context: context });
        case "Enum":
            return (0, jsx_runtime_1.jsx)(GoEnumDeclaration, { enumType: type });
        default:
            // Log unsupported types
            var typeName = "name" in type ? String(type.name) : "unknown";
            errors_js_1.ErrorManager.handleModelGenerationError({
                message: "Unsupported type kind '".concat(type.kind, "' for type '").concat(typeName, "'"),
                modelName: typeName,
                sourceLocation: {
                    file: "emitter.tsx",
                    line: 0,
                    column: 0,
                    function: "GoTypeDeclaration",
                },
                resolution: "Currently only Model, Enum, and Array types are supported",
            });
            return null;
    }
}
/**
 * Go array declaration component using proper Alloy Go components
 */
function GoArrayDeclaration(_a) {
    var arrayType = _a.arrayType;
    var elementType = type_mapper_js_1.GoTypeMapper.mapTypeSpecType(arrayType.indexer.value);
    var elementTypeName = type_mapper_js_1.GoTypeMapper.generateGoTypeString(elementType);
    var arrayName = String(arrayType.name);
    return ((0, jsx_runtime_1.jsxs)(go.TypeDeclaration, { name: arrayName, children: ["[]", elementTypeName] }));
}
/**
 * Go enum declaration component using proper Alloy Go components
 */
function GoEnumDeclaration(_a) {
    var enumType = _a.enumType;
    var enumName = String(enumType.name);
    var members = Array.from(enumType.members.values());
    return ((0, jsx_runtime_1.jsx)(go.TypeDeclarationGroup, { children: [
            (0, jsx_runtime_1.jsx)(go.TypeDeclaration, { name: enumName, children: "string" }),
            (0, jsx_runtime_1.jsx)(go.VariableDeclarationGroup, { const: true, children: members.map(function (member) { return ((0, jsx_runtime_1.jsx)(go.VariableDeclaration, { name: "".concat(enumName).concat(String(member.name)), type: enumName, children: "\"".concat(String(member.name), "\"") })); }) })
        ] }));
}
/**
 * Go struct declaration component using proper Alloy Go components
 */
function GoStructDeclaration(_a) {
    var model = _a.model, context = _a.context;
    var properties = Array.from(model.properties.values());
    var modelName = String(model.name);
    return ((0, jsx_runtime_1.jsx)(go.StructTypeDeclaration, { name: modelName, children: properties.map(function (property) { return ((0, jsx_runtime_1.jsx)(GoStructMember, { property: property, context: context })); }) }));
}
/**
 * Individual struct field component using proper Alloy Go components
 */
function GoStructMember(_a) {
    var _b;
    var property = _a.property, context = _a.context;
    var goType = type_mapper_js_1.GoTypeMapper.mapTypeSpecType(property.type, context.program);
    var propertyName = String(property.name);
    // Generate field name (PascalCase for Go)
    var fieldName = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
    // Generate JSON tag
    var jsonTag = "json:\"".concat(propertyName).concat(property.optional ? ',omitempty' : '', "\"");
    // Handle optional types as pointers
    var fieldType = property.optional && ((_b = goType.usePointerForOptional) !== null && _b !== void 0 ? _b : false)
        ? (0, jsx_runtime_1.jsx)(go.Pointer, { children: goType.name })
        : goType.name;
    return ((0, jsx_runtime_1.jsx)(go.StructMember, { name: fieldName, type: fieldType, tag: jsonTag }));
}
