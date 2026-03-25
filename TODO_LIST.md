# TypeSpec Go Emitter - TODO List

**Last Updated:** 2026-03-25  
**Status:** ACTIVE DEVELOPMENT

---

## 🚀 Current Sprint (March 2026)

### High Priority

- [ ] **Complete AssetEmitter Integration**
  - Full `createAssetEmitter` with Alloy components
  - Namespace to package mapping
  - File consolidation by namespace

### Medium Priority

- [ ] **HTTP Operations & Handlers**
  - GoHandlerStub generation with proper return types
  - GoRouteRegistration component
  - HTTP decorator support (@get, @post, etc.)

- [ ] **Advanced Type Features**
  - Template models with Go generics
  - Discriminated union error handling
  - Model inheritance/composition

### Low Priority

- [ ] **Go Decorator Support**
  - `@go.name` - custom Go naming
  - `@go.type` - explicit Go type mapping
  - `@go.tag` - custom JSON tags
  - `@go.package` - package organization

---

## 🔧 Technical Debt

- [ ] **Phantom Type Warnings** (5 warnings in generated code)
  - Consider using branded types for: Email, Age, Total, Active

---

## 📊 Status Summary

| Category          | Tests   | Status             |
| ----------------- | ------- | ------------------ |
| Type Mapping      | 18      | ✅ Passing         |
| Model Generation  | 11      | ✅ Passing         |
| Enum Generation   | 6       | ✅ Passing         |
| Union Generation  | 6       | ✅ Passing         |
| Integration Tests | 4       | ✅ Passing         |
| Component Tests   | 120     | ✅ Passing         |
| **Total**         | **165** | **✅ All Passing** |

---

## 🐛 Known Issues

- None (all TypeScript errors resolved)

## 📝 Documentation

- [x] README.md - Current
- [x] AGENTS.md - Current
- [ ] TODO_LIST.md - This file (needs regular updates)
- [ ] FEATURES.md - Needs review (last updated Jan 24)

---

## 🎯 Goals

### Phase 1: Core Completeness ✅ DONE

- [x] Basic type mapping (string, boolean, int, float)
- [x] Model generation with JSON tags
- [x] Package structure
- [x] Alloy-JS component architecture
- [x] 100% test pass rate
- [x] Zero TypeScript errors

### Phase 2: Production Readiness 🔄 IN PROGRESS

- [x] AssetEmitter integration (basic)
- [ ] Complete AssetEmitter (full namespace support)
- [ ] HTTP operations
- [ ] Handler generation
- [ ] Route registration

### Phase 3: Advanced Features 📋 PLANNED

- [ ] Go generics from TypeSpec templates
- [ ] Discriminated unions for error handling
- [ ] Custom Go decorators
- [ ] Model inheritance/composition

---

_Last sync: 2026-03-25_
