# Justfile for TypeSpec Go Emitter
# Professional build automation with comprehensive commands

# Default command - show help
default:
	@echo "TypeSpec Go Emitter - Professional Build System"
	@echo ""
	@echo "Core Commands:"
	@echo "  just build          - Build TypeScript"
	@echo "  just test           - Run all tests"
	@echo "  just lint           - Run ESLint"
	@echo "  just clean          - Clean build artifacts"
	@echo ""
	@echo "Development Commands:"
	@echo "  just dev            - Build + test + lint"
	@echo "  just watch          - Watch mode for development"
	@echo "  just check          - TypeScript check only"
	@echo ""
	@echo "Quality Commands:"
	@echo "  just find-duplicates - Find duplicate code"
	@echo "  just size-check     - Check file sizes"
	@echo "  just type-check     - Strict type check"
	@echo "  just test-cov       - Test coverage"

# Build TypeScript compilation
build:
	@echo "🔨 Building TypeScript..."
	bun run build
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
	@echo "🔍 Finding duplicate code..."
	@if command -v similarity-go >/dev/null 2>&1; then \
		echo "=== USING SIMILARITY-GO FOR ADVANCED ANALYSIS ==="; \
		similarity-go --threshold 0.8 --format json --output reports/duplicates.json src/ && \
		echo "📊 Similarity analysis saved to reports/duplicates.json" && \
		if [ -f reports/duplicates.json ]; then \
			echo "=== TOP DUPLICATIONS FOUND ===" && \
			cat reports/duplicates.json | head -20; \
		fi; \
	else \
		echo "⚠️ similarity-go not found, using basic analysis"; \
		echo "Install similarity-go for better analysis: go install github.com/paveg/similarity-go/cmd/similarity-go@latest"; \
		echo "=== DUPLICATE GENERATORS ==="; \
		find src/ -name "*.ts" -exec grep -l "class.*Generator\|export.*Generator" {} \; | sort; \
		echo "=== DUPLICATE TYPE MAPPERS ==="; \
		find src/ -name "*.ts" -exec grep -l "TypeMapper\|type.*Mapper" {} \; | sort; \
		echo "=== LARGE FILES (>300 LINES) ==="; \
		find src/ -name "*.ts" -exec wc -l {} \; | awk '$1 > 300' | sort -nr; \
	fi
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