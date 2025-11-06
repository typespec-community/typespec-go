# TypeSpec-Go Emitter - Project Structure and Architecture Discussion

## 🎯 Executive Summary

This issue defines the **comprehensive project architecture** for the TypeSpec-Go emitter, based on the complete emitter specification in `doc/emitter.md`. We need to establish a **modern, scalable foundation** using **Mise task runner** and **TypeSpec emitter patterns**.

## 📋 Current State

- ✅ **Complete specification** exists (`doc/emitter.md`)
- ✅ **Basic project structure** (README, LICENSE, .gitignore)
- ❌ **Zero implementation** - greenfield project
- ❌ **No development environment** setup
- ❌ **No build system** or testing framework

## 🏗️ Proposed Architecture

### **Option 1: Standard TypeSpec Emitter + Mise (RECOMMENDED)**

```
typespec-go/
├── src/
│   ├── index.ts              # Main exports
│   ├── emitter.ts            # Core $onEmit function  
│   ├── options.ts            # Configuration interface
│   ├── lib.ts               # Utility functions
│   ├── generators/
│   │   ├── models.ts        # Model/struct generation
│   │   ├── enums.ts         # Enum generation
│   │   ├── unions.ts        # Union/sealed interface
│   │   ├── operations.ts    # Service interface generation
│   │   └── utils.ts         # Helper functions
│   ├── decorators/
│   │   └── go-decorators.ts # Go-specific decorators
│   └── types/
│       └── go-types.ts      # Type definitions
├── test/
│   ├── basic.test.ts
│   ├── models.test.ts
│   ├── enums.test.ts
│   └── examples/
│       └── *.tsp
├── examples/
│   ├── petstore/
│   │   └── main.tsp
│   └── generated/            # Test output
├── mise-tasks/              # Executable task scripts
│   ├── build
│   ├── test
│   ├── lint
│   └── dev
├── mise.toml               # Mise configuration
├── package.json            # npm dependencies only
├── tsconfig.json
└── README.md
```

### **Why This Architecture Wins:**

1. **TypeSpec Compliance** - Follows official emitter patterns exactly
2. **Mise-Driven** - Modern task management, no npm scripts
3. **Scalable** - Clear separation of concerns
4. **Maintainable** - Easy to extend and test
5. **Professional** - Uses industry best practices

## 🔧 Key Technology Decisions

### **Mise Task Runner**
- ✅ **Replaces package.json scripts** entirely
- ✅ **Task dependencies** and conditional execution
- ✅ **Environment management** and tool versioning
- ✅ **Source-based builds** (only rebuild when needed)
- ✅ **Monorepo-ready** for future scaling

### **TypeScript/Node.js Emitter**
- ✅ **Official TypeSpec emitter patterns**
- ✅ **AssetEmitter architecture**
- ✅ **ESM modules** and modern toolchain
- ✅ **Comprehensive testing** with Vitest

### **Package Structure**
```toml
# mise.toml
min_version = "2024.9.5"

[env]
NODE_ENV = "{{ env.NODE_ENV | default(value='development') }}"
PROJECT_NAME = "{{ config_root | basename }}"

[tools]
node = "lts"
typescript = "latest"
"npm:@typespec/compiler" = "latest"
"npm:@typespec/emitter-framework" = "latest"
"npm:vitest" = "latest"
"npm:eslint" = "latest"
"npm:prettier" = "latest"

[tasks.build]
description = "Build TypeScript to dist/"
sources = ["src/**/*.ts"]
outputs = ["dist/**"]
run = "tsc"

[tasks.test]
description = "Run test suite"
depends = ["build"]
run = "vitest run"

[tasks.lint]
description = "Run ESLint"
run = "eslint src/ test/ --max-warnings=0"

[tasks.dev]
description = "Development with watch mode"
run = "tsc --watch"
```

## 📊 Implementation Phases

### **Phase 1: Foundation (Critical Path)**
1. **Initialize project** with Mise and TypeScript
2. **Create basic emitter skeleton** extending AssetEmitter
3. **Set up testing framework** with TypeSpec integration
4. **Implement namespace-to-package mapping**
5. **Basic model generation** (struct generation)

### **Phase 2: Core Features (High Impact)**
1. **Enum generation** (string + iota strategies)
2. **Union generation** (sealed interface pattern)
3. **Operation/service generation**
4. **Go-specific decorators** (@go.name, @go.package)
5. **Comprehensive testing** with real examples

### **Phase 3: Advanced Features (Professional Polish)**
1. **HTTP handler generation**
2. **Validation logic** (@minLength, @maxLength, etc.)
3. **Advanced TypeSpec features** (template models, composition)
4. **Performance optimization** and benchmarks
5. **Documentation and examples**

## 🎯 Immediate Action Items

### **Priority 1: Project Setup**
- [ ] Create `mise.toml` with tasks and tool configuration
- [ ] Initialize `package.json` with TypeSpec dependencies
- [ ] Set up TypeScript configuration
- [ ] Create basic emitter skeleton
- [ ] Set up testing framework

### **Priority 2: Core Implementation**
- [ ] Implement namespace-to-package mapping
- [ ] Create model struct generation
- [ ] Add enum generation logic
- [ ] Create union/sealed interface generation
- [ ] Add basic operation support

### **Priority 3: Advanced Features**
- [ ] Implement Go-specific decorators
- [ ] Add HTTP handler generation
- [ ] Create comprehensive test suite
- [ ] Add performance benchmarks
- [ ] Create documentation and examples

## 🤔 Open Questions

### **Critical Blocker:**
> **What is the exact TypeSpec emitter development pattern?** 
> 
> We need to understand:
> - How to extend `@typespec/compiler` with emitter classes
> - Standard project structure for TypeSpec emitters
> - Integration with TypeSpec CLI (`tsp compile`)
> - Core TypeScript dependencies and development patterns

### **Architecture Questions:**
1. **Monorepo vs single package?** - Start single, scale to monorepo later?
2. **Testing strategy?** - How to integrate TypeSpec compilation in tests?
3. **Performance considerations?** - Large TypeSpec files, memory usage?
4. **Error handling?** - Diagnostic reporting, user experience?

## 🚀 Success Criteria

### **MVP Success:**
- ✅ Compiles basic TypeSpec to Go models/enums
- ✅ Integrates with TypeSpec CLI
- ✅ Has comprehensive test coverage
- ✅ Follows emitter specification exactly

### **Production Success:**
- ✅ Handles complex TypeSpec features (unions, operations, decorators)
- ✅ Generates production-ready Go code
- ✅ Has real-world examples and documentation
- ✅ Performance suitable for large projects

## 📚 References

- **Complete Specification:** `doc/emitter.md`
- **TypeSpec Documentation:** https://typespec.io
- **Mise Documentation:** https://mise.jdx.dev
- **Discord Discussion:** Archive of TypeSpec-Go emitter planning

## 🏷️ Labels

- `architecture`
- `project-structure`
- `mise`
- `typescript`
- `typespec`
- `foundation`
- `good-first-issue`

---

## 🎯 Call to Action

**This issue is ready for immediate implementation.** We have:
- ✅ **Complete specification** to follow
- ✅ **Clear architecture** defined
- ✅ **Modern tooling** selected
- ✅ **Implementation phases** outlined

**Next Steps:**
1. **Approve this architecture** 👍/👎
2. **Resolve the TypeSpec emitter pattern question**
3. **Begin Phase 1 implementation**

**Ready to build the best TypeSpec-Go emitter in the ecosystem!** 🚀