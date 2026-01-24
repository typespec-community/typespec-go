# Contributing to TypeSpec Go Emitter

**Thank you for your interest in contributing!** This is a professional TypeSpec AssetEmitter project that generates enterprise-grade Go code with zero-compromise type safety.

---

## 🎯 PROJECT IDENTITY - WHAT WE ARE

This is a **100% Alloy-JS Component-Based TypeSpec AssetEmitter** for Go code generation.

### Core Principles (NON-NEGOTIABLE)

- ✅ **100% Alloy-JS Components** - All Go code generation through components only
- 🚫 **ZERO String-Based Generation** - No template literals or concatenation for Go code
- ✅ **Type Safety Excellence** - Zero 'any' types, strict TypeScript
- ✅ **AssetEmitter Pattern** - Proper TypeSpec compiler integration
- ✅ **Component Composition** - Higher-order components for complexity

### What This Project IS ✅

- TypeSpec AssetEmitter (compiler plugin)
- Go code generator using Alloy-JS components
- Enterprise-grade type-safe generation
- Community-driven open source project

### What This Project IS NOT ❌

- CLI tool or standalone application
- Generic code generator
- String-based code generation system
- JavaScript library

---

## 🚀 GETTING STARTED

### Prerequisites

```bash
# 1. Install Bun (package manager)
curl -fsSL https://bun.sh/install | bash

# 2. Clone repository
git clone https://github.com/typespec-community/typespec-go.git
cd typespec-go

# 3. Install dependencies
bun install
```

### Development Workflow

```bash
# Build project (Alloy-JS components)
just build

# Run all tests
just test

# Run linting
just lint

# Type checking
just check

# Full quality check
just qa
```

### Critical Configuration

**🔥 IMPORTANT:** This project requires `jsx: "preserve"` in `tsconfig.json` for Vitest. Do NOT change this!

```json
{
  "compilerOptions": {
    "jsx": "preserve" // REQUIRED for Alloy-JS component rendering
  }
}
```

---

## 🏗️ DEVELOPMENT STANDARDS

### Code Style (STRICT ENFORCEMENT)

#### TypeScript Standards

- **Strict Mode:** Always enabled, no exceptions
- **Zero Any Types:** `(type as any)` casts prohibited
- **Type-Only Imports:** `verbatimModuleSyntax: true` enforced
- **Explicit Types:** All functions must have typed parameters and return values

#### Component Patterns (ALLOY-JS REQUIRED)

**✅ CORRECT - Using Alloy Components**

```typescript
import * as go from "@alloy-js/go";
const { StructDeclaration, StructMember } = go;

export function GoModel({ model }: { model: Model }) {
  const modelRefkey = refkey(model);

  return (
    <StructDeclaration name={model.name} refkey={modelRefkey}>
      <StructMember name={prop.name} type={TypeExpression({ type: prop.type })} />
    </StructDeclaration>
  );
}
```

**🚫 FORBIDDEN - String-Based Generation**

```typescript
// NEVER DO THIS!
const goCode = `type ${model.name} struct {
  ${fields.map((f) => `${f.name} ${f.type}`).join("\n")}
}`;

// NEVER DO THIS!
let code = "package api\n";
code += "type User struct {\n";
```

#### Component Architecture

1. **Import Order:** TypeSpec types → Alloy Core → Alloy Go

```typescript
import type { Model } from "@typespec/compiler"; // 1. TypeSpec types
import { refkey, For } from "@alloy-js/core"; // 2. Alloy Core
import * as go from "@alloy-js/go"; // 3. Alloy Go (destructure)
const { StructDeclaration } = go; // 4. Destructure immediately
```

2. **Component Structure:**

```typescript
// 1. Interface definition (ALWAYS)
interface ComponentProps {
  model: Model;
  options?: GenerationOptions;
}

// 2. Component function (ALWAYS exported)
export function Component({ model, options }: ComponentProps) {
  const modelRefkey = refkey(model);  // 3. REFK for main object

  return (
    <StructDeclaration name={model.name} refkey={modelRefkey}>
      {/* 4. JSX with component composition */}
    </StructDeclaration>
  );
}
```

3. **Iteration Pattern:**

```typescript
// ✅ CORRECT - Use <For> component
<For each={items} to={(item) => <Component item={item} />} />

// 🚫 FORBIDDEN - Array.map
{items.map(item => <Component item={item} />)}
```

### Testing Requirements

#### Test Structure

```typescript
import { describe, test, expect } from "vitest";
import { render } from "@alloy-js/core";
import { GoModel } from "../go/GoModel.js";

describe("🔥 GoModel Component", () => {
  test("renders struct correctly", async () => {
    const mockModel = createMockModel();

    const output = render(<GoModel model={mockModel} />);

    expect(output).toContain("type User struct");
    expect(output).toContain('ID string `json:"id"`');
  });
});
```

#### Test Categories

1. **Component Tests** - Direct component rendering
2. **Integration Tests** - End-to-end TypeSpec workflows
3. **Type Mapping Tests** - TypeSpec → Go type conversion
4. **Performance Tests** - Sub-millisecond generation validation

#### Test Standards

- **Build Before Test:** `just build` must pass first
- **100% Pass Rate:** All tests must pass before committing
- **Component Integration:** Test component rendering, not just logic
- **Mock Factories:** Use provided mock factories (see `src/test/mocks/`)

---

## 📋 COMMIT STANDARDS

### Commit Message Format

```bash
git commit -m "type(scope): brief description

- Detailed explanation of what was changed
- Why it was changed (business/technical reason)
- Any side effects or considerations
- Link to issues/tickets if applicable
"
```

### Commit Workflow

1. **Check Status:** `git status`
2. **Review Changes:** `git diff HEAD`
3. **Stage Files:** `git add <specific-files>` (NEVER `git add .`)
4. **Commit:** Detailed message with description
5. **Push Immediately:** `git push`

### Commit Best Practices

- **Small, Atomic:** One logical change per commit
- **Test First:** Ensure all tests pass before committing
- **Descriptive Messages:** Explain what and why
- **No Build Breaks:** Build must pass after each commit

---

## 🧪 TESTING PROCESS

### Before Submitting PR

1. **Build:** `just build` → Must pass
2. **Test:** `just test` → Must have 100% pass rate
3. **Lint:** `just lint` → Must be clean
4. **Type Check:** `just check` → Zero errors

### Test Coverage Requirements

- **New Components:** Must have component rendering tests
- **New Features:** Must have integration tests
- **Bug Fixes:** Must have regression tests
- **Refactoring:** Must preserve existing tests

---

## 🚫 PROHIBITED PATTERNS

### ABSOLUTELY FORBIDDEN (ZERO TOLERANCE)

1. **String-Based Code Generation**

   ```typescript
   // 🚫 NEVER
   const goCode = `type ${name} struct { ... }`;
   ```

2. **Any Type Casts**

   ```typescript
   // 🚫 NEVER
   const model = unknownModel as any;
   ```

3. **Manual JSX Building**

   ```typescript
   // 🚫 NEVER
   const jsx = <div>{code}</div>;
   ```

4. **Template Literals for Code**

   ```typescript
   // 🚫 NEVER
   return `${structName} struct { ${fields.join("\n")} }`;
   ```

5. **CLI Development**
   - This is NOT a CLI tool
   - Do NOT add CLI features

6. **Non-Alloy Patterns**
   - Do NOT create custom rendering logic
   - Use Alloy components only

---

## 📁 PROJECT STRUCTURE

```
src/
├── components/          # 🔥 100% ALLOY-JS COMPONENTS
│   ├── go/             # Go generation components
│   │   ├── GoModel.tsx
│   │   ├── GoEnumDeclaration.tsx
│   │   └── ...
│   └── TypeExpression.tsx
├── domain/             # Business logic (type-safe)
│   ├── clean-type-mapper.ts
│   └── error-entities.ts
├── services/           # Service layer
│   └── type-mapping.service.ts
├── emitter/            # Main AssetEmitter
│   └── typespec-go-emitter.tsx
└── test/              # Test suite
    ├── mocks/          # Mock factories
    └── *.test.tsx     # Test files
```

---

## 🤝 PULL REQUEST PROCESS

### PR Requirements

1. **All Tests Pass:** 100% success rate required
2. **Build Passes:** `just build` must succeed
3. **Lint Clean:** Zero ESLint warnings
4. **Type Safe:** Zero TypeScript errors
5. **Component-Based:** All Go code through Alloy components
6. **Zero Any Types:** No `(type as any)` casts
7. **Documentation:** Updated README/AGENTS.md if needed

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing

- [ ] All tests pass (160/160)
- [ ] New tests added for changes
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] No 'any' types introduced
- [ ] All components use Alloy-JS
- [ ] Self-review completed
- [ ] Documentation updated
```

---

## 📚 RESOURCES

### Essential Documentation

- **[AGENTS.md](AGENTS.md)** - Complete AI/agent development guide (READ THIS FIRST)
- **[README.md](README.md)** - Project overview and usage
- **[docs/SETUP.md](docs/SETUP.md)** - Development setup guide

### TypeSpec Resources

- **[TypeSpec Documentation](https://typespec.io/docs)**
- **[Alloy-JS Documentation](https://alloyjs.dev/)**
- **[Alloy Go Documentation](https://github.com/alloy-js/go)**

### Community

- **GitHub Issues:** Bug reports and feature requests
- **Discussions:** Questions and ideas
- **TypeSpec Discord:** Get help from TypeSpec community

---

## 🎯 CONTRIBUTION PRIORITIES

### High Priority 🔴

1. **Fix Remaining Issues** - Bug fixes and test failures
2. **Type Safety** - Eliminate any 'any' types
3. **Documentation** - Improve user guides and API docs

### Medium Priority 🟡

1. **New Features** - TypeSpec language features
2. **Performance** - Optimize generation speed
3. **Components** - New Alloy components

### Low Priority 🟢

1. **Examples** - More usage examples
2. **Tooling** - Developer tool improvements
3. **Website** - Project website improvements

---

## 💡 NEED HELP?

### Getting Started

1. Read **[AGENTS.md](AGENTS.md)** thoroughly
2. Check **[docs/SETUP.md](docs/SETUP.md)** for setup
3. Review existing components for patterns
4. Start with small contributions

### Questions?

- Check existing GitHub issues
- Start a GitHub discussion
- Ask in TypeSpec Discord
- Review existing code for patterns

---

**Thank you for contributing!** 🚀

Every contribution helps make TypeSpec Go Emitter better. Follow these guidelines, write great tests, and help us build the premier TypeSpec to Go code generator.

**REMEMBER:** 100% Alloy-JS Components, Zero String Generation, Type Safety Excellence! 💪
