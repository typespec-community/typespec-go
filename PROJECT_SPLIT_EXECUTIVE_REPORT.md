# Project Split Executive Report: TypeSpec Go Emitter

## Objective

This report outlines a proposed strategy to split the existing `typespec-go` project into multiple, highly focused sub-projects (packages) within a monorepo structure. The goal is to enhance maintainability, reduce coupling, improve independent testability, and clarify responsibilities, all while strictly adhering to the project's core commitment to the Alloy-JS framework for Go code generation.

## Rationale for Splitting

The current monolithic structure, while functional, encompasses a broad range of concerns: core code generation logic, TypeSpec integration, Alloy-JS components, comprehensive testing infrastructure, extensive documentation, examples, and development tooling. Splitting these into distinct packages offers several advantages:

*   **Clearer Boundaries & Responsibilities:** Each package will have a singular, well-defined purpose, making it easier for developers to understand and contribute.
*   **Reduced Coupling:** Changes in one area (e.g., testing utilities) will have minimal impact on other areas (e.g., core emitter logic).
*   **Independent Versioning & Release Cycles:** While initially managed within a monorepo, distinct packages lay the groundwork for independent versioning if required in the future.
*   **Improved Testability:** Unit and integration tests can be more precisely targeted to specific packages.
*   **Enhanced Reusability:** Core components and utilities become more easily discoverable and reusable by other potential projects.
*   **Leaner Deployments:** Consumers of the core emitter wouldn't need to depend on testing or documentation assets.

## Proposed Project Structure

The existing `typespec-go` project will be refactored into a monorepo containing the following distinct and focused packages:

### 1. `@typespec-go/emitter` (Core Library)

This is the heart of the TypeSpec Go Emitter. It will contain all the fundamental logic for integrating with TypeSpec's `AssetEmitter` and generating Go code using Alloy-JS components.

*   **Responsibilities:** TypeSpec compilation integration, definition of all Alloy-JS Go components (e.g., StructTypeDeclaration, GoModel, GoPackage), core type mapping logic (TypeSpec types to Go types), and essential utilities directly used in code generation.
*   **Key Directories/Files:**
    *   `src/emitter/typespec-go-emitter.tsx` (main emitter entry point)
    *   `src/components/go/` (all Go-specific Alloy-JS components)
    *   `src/components/TypeExpression.tsx` (generic TypeSpec type to Go type expression mapping)
    *   `src/domain/clean-type-mapper.ts` (core type mapping algorithms)
    *   `src/services/type-mapping.service.ts` (service layer for type mapping)
    *   `src/types/emitter.types.ts` (core TypeSpec Go emitter types)
    *   `src/utils/typespec-utils.ts` (TypeSpec related helper functions)
    *   `src/utils/strings.ts` (generic string utilities, if not extracted to a separate `@alloy-js/utils` package)
*   **Dependencies:** `@typespec/compiler`, `@alloy-js/core`, `@alloy-js/go`

### 2. `@typespec-go/test-utils` (Testing Utilities)

This package will centralize all testing infrastructure, mock factories, and reusable test utilities specifically designed for testing TypeSpec Go emitters built with Alloy-JS.

*   **Responsibilities:** Provide standardized and reusable components, mock TypeSpec models, and helper functions to facilitate writing robust tests for the `@typespec-go/emitter` package and any future related components.
*   **Key Directories/Files:**
    *   `src/testing/` (e.g., `go-component-test-utils.tsx`, `mock-factory.ts`, `test-utils.tsx`)
    *   All files currently under `src/test/` would be moved here and organized appropriately (e.g., into `components`, `integration`, `mocks` subdirectories).
*   **Dependencies:** `@typespec/compiler`, `@alloy-js/core`, `@typespec-go/emitter` (for integration testing), `vitest`

### 3. `@typespec-go/docs` (Documentation)

A standalone documentation project that will host all user guides, API references, architectural decisions, planning documents, and status reports.

*   **Responsibilities:** Provide comprehensive and easily navigable documentation for users, contributors, and maintainers. This separation allows for dedicated documentation tooling (e.g., Docusaurus, Next.js for docs) if needed.
*   **Key Directories/Files (moved from root and `docs/`):**
    *   `docs/` (all subdirectories: `architecture`, `status`, `user-guide`, `research`, `planning`, `reports`, `patterns`, `migration`, `learnings`, `components`)
    *   `README.md`
    *   `CONTRIBUTING.md`
    *   `LICENSE`
    *   `API-REFERENCE.md`, `SETUP.md`, `TYPE-MAPPING-GUIDE.md`, etc.
*   **Dependencies:** None (internal documentation tools can be added within this package)

### 4. `@typespec-go/samples` (Examples & End-to-End Tests)

This package will contain a collection of TypeSpec definitions and their corresponding generated Go code, serving as clear examples for users and as comprehensive end-to-end test cases for the emitter.

*   **Responsibilities:** Demonstrate various usage patterns of the TypeSpec Go Emitter, provide concrete, runnable examples, and serve as integration points for validating the emitter's output against expected Go code.
*   **Key Directories/Files (moved from root, `examples/`, `dev/`):**
    *   `examples/` (e.g., `basic-usage.ts`, `error-handling-examples.ts`, `working-jsx-example.tsx`)
    *   `examples/basic/` (TypeSpec definitions and `tspconfig.yaml`)
    *   `dev/typespec/` (all TypeSpec test files, e.g., `main.tsp`, `test-basic.tsp`)
    *   `dev/debug/` (various debug-focused TypeSpec files or associated scripts)
*   **Dependencies:** `@typespec-go/emitter`, `tsp` (TypeSpec compiler CLI)

### 5. `@typespec-go/dev-tools` (Development & Build Tooling)

This package will consolidate all development environment setup, build scripts, linting configurations, formatting rules, and CI/CD configurations.

*   **Responsibilities:** Ensure a consistent, high-quality, and efficient development experience across all packages within the monorepo. This centralizes tool configuration and simplifies onboarding.
*   **Key Directories/Files (moved from root):**
    *   `justfile` (monorepo-level task runner)
    *   `package.json`, `bun.lock` (root-level for monorepo management, individual packages will have their own `package.json`)
    *   `eslint.config.js`, `.prettierrc.yaml` (shared linting/formatting)
    *   `tsconfig.json`, `tsconfig.recommended.json` (shared TypeScript configuration)
    *   `vitest.config.js` (shared test configuration for the monorepo)
    *   `.golangci.yml`, `.jscpd.json` (Go linting and code duplication analysis)
    *   `scripts/` (e.g., `find-duplicates.sh`, `scan-violations.ts`)
    *   `.github/` (CI/CD workflows like `ci.yml`)
    *   `mise.toml`
*   **Dependencies:** `bun`, `vitest`, `typescript`, `eslint`, `prettier`, `golangci-lint`, etc.

## Monorepo Structure Overview

```
/Users/larsartmann/projects/typespec-go (monorepo root)
├── packages/
│   ├── emitter/                  # @typespec-go/emitter
│   │   ├── src/                  # Core emitter logic
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── test-utils/               # @typespec-go/test-utils
│   │   ├── src/                  # Testing utilities and mocks
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── docs/                     # @typespec-go/docs
│   │   ├── ... (all documentation files)
│   │   └── package.json
│   ├── samples/                  # @typespec-go/samples
│   │   ├── ... (examples and TypeSpec test files)
│   │   └── package.json
│   └── dev-tools/                # @typespec-go/dev-tools
│       ├── scripts/              # Development scripts
│       ├── .github/              # CI/CD configurations
│       └── package.json          # Tooling dependencies
├── justfile                      # Root-level task runner for monorepo
├── package.json                  # Root-level package.json for workspace definition
├── bun.lock                      # Root-level bun lockfile
├── tsconfig.json                 # Root-level tsconfig for monorepo-wide settings
├── .gitignore
├── .golangci.yml
├── .jscpd.json
├── eslint.config.js
├── prettierrc.yaml
├── vitest.config.js
└── mise.toml
```

## Conclusion

This proposed project split into five focused packages within a monorepo structure will significantly improve the organization, maintainability, and future scalability of the TypeSpec Go Emitter. It enforces strict separation of concerns, aligns with modern software engineering practices, and reinforces the core architectural commitment to Alloy-JS for Go code generation. This refactoring will set the project up for long-term success and easier contribution.
