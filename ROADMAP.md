# TypeSpec Go Emitter - Roadmap

**Last Updated:** 2026-04-05  
**Status:** ASPIRATIONAL - NO TIMELINE

---

## 🎯 Future Goals

### Phase 3: Advanced Features (Planned)

These are aspirational goals with no committed timeline.

#### Go Generics from TypeSpec Templates

- Template models with Go generics support
- Type parameter mapping
- Generic constraint generation

#### Discriminated Unions for Error Handling

- Discriminated union error types
- Pattern matching support
- Error chain generation

#### Custom Go Decorators

- `@go.name` - custom Go naming
- `@go.type` - explicit Go type mapping
- `@go.tag` - custom JSON tags
- `@go.package` - package organization

#### Model Inheritance/Composition

- Go struct embedding
- Interface composition
- Type hierarchy translation

---

## 🔧 Technical Debt (Future)

- **Phantom Type Warnings** (5 warnings in generated code)
  - Consider using branded types for: Email, Age, Total, Active

---

## 📝 Documentation (Future)

- [ ] FEATURES.md - Needs review (last updated Jan 24)

---

## 🚀 Exploratory Ideas

### Performance Optimization

- Parallel package generation
- Incremental compilation support
- Build caching strategies

### Developer Experience

- Interactive CLI with project scaffolding
- Hot-reload during TypeSpec development
- Visual type graph visualization

### Enterprise Features

- Multi-module project support
- Custom code generation templates
- Plugin system for extensions

---

## 📚 Quick Links

- [TODO_LIST.md](./TODO_LIST.md) - Current actionable items
- [CHANGELOG.md](./CHANGELOG.md) - What's been completed
