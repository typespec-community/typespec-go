# TypeSpec Go Emitter - TODO List

**Last Updated:** 2026-04-05  
**Status:** ACTIVE DEVELOPMENT

---

## 🚀 Current Sprint (April 2026)

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

### Low Priority

- [ ] **Go Decorator Support**
  - `@go.name` - custom Go naming
  - `@go.type` - explicit Go type mapping
  - `@go.tag` - custom JSON tags
  - `@go.package` - package organization

---

## 📊 Current Status

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

---

## 📝 Quick Links

- [ROADMAP.md](./ROADMAP.md) - Aspirational items
- [CHANGELOG.md](./CHANGELOG.md) - What's been completed
