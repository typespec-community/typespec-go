# Justfile for TypeSpec Go Emitter
# Professional build automation with comprehensive commands

# Build TypeScript compilation
build:
	@echo "🔨 Building TypeScript..."
	bunx alloy build
	@echo "✅ Build complete"

# Run test suite
test:
	@echo "🧪 Running test suite..."
	bunx vitest --run --testTimeout 30000
	@echo "✅ Tests complete"

# Run ESLint
lint:
	@echo "🔍 Running ESLint..."
	bun run lint || echo "⚠️ ESLint issues found"
	@echo "✅ Linting complete"

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist/
	rm -f src/**/*.js src/**/*.d.ts
	@echo "✅ Clean complete"

# Development workflow - build + test + lint
dev: build test lint
	@echo "🚀 Development workflow complete"

# Watch mode for development
watch:
	@echo "👀 Starting watch mode..."
	bun run build --watch

# TypeScript type checking without emitting
check:
	@echo "🔍 TypeScript type checking..."
	bun run build:check
	@echo "✅ Type checking complete"

# Find duplicate code patterns
find-duplicates:
	@echo "🔍 Finding duplicate code with jscpd..."
	@mkdir -p reports/jscpd
	@bunx jscpd src
	@echo "✅ Duplicate analysis complete"

# Alias for find-duplicates
fd: find-duplicates

# Check file sizes for refactoring
size-check:
	@echo "📊 File size analysis..."
	@echo "=== LARGEST FILES ==="
	find src/ -name "*.ts" -exec wc -l {} \; | sort -nr | head -20
	@echo "=== FILES OVER 300 LINES ==="
	find src/ -name "*.ts" -exec wc -l {} \; | awk '$1 > 300 {print FILENAME ": " $1 " lines"}' | sort -nr

# Strict TypeScript checking
type-check:
	@echo "🔍 Strict TypeScript checking..."
	bunx tsc --noEmit --strict --noImplicitAny --noImplicitReturns
	@echo "✅ Strict type checking complete"

# Test with coverage (when available)
test-cov:
	@echo "🧪 Running tests with coverage..."
	bunx vitest --run --coverage
	@echo "✅ Coverage complete"

# Quality assurance - full check
qa: build test lint size-check find-duplicates
	@echo "✅ Quality assurance complete"

# Install dependencies
deps:
	@echo "📦 Installing dependencies..."
	bun install
	@echo "✅ Dependencies installed"

# Format code with Prettier
format:
	@echo "💅 Formatting code..."
	bun run format
	@echo "✅ Code formatted"

# Fix ESLint issues automatically
fix:
	@echo "🔧 Fixing ESLint issues..."
	bun run lint:fix
	@echo "✅ ESLint issues fixed"

# Scan for template literal violations
verify-arch:
	@echo "🔍 Scanning for Alloy-JS violations..."
	@bunx tsx scripts/scan-violations.ts
	@echo "✅ Architecture verification complete"

# Show project status
status:
	@echo "📊 Project Status:"
	@echo "=================="
	@echo "Git Status:"
	@git status --porcelain
	@echo ""
	@echo "TypeScript Build Status:"
	@bun run build:check && echo "✅ TypeScript OK" || echo "❌ TypeScript Errors"
	@echo ""
	@echo "Test Status:"
	@bunx vitest --run --testTimeout 5000 2>/dev/null && echo "✅ Tests OK" || echo "❌ Test Issues"