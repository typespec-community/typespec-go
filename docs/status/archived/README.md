# Archived Status Reports — Manifest

Bulk archive of 2026-11-13 (docs-health AUDIT sweep, HEAD `8205ea3`).
Every report below was ANNOTATED inline first (every open item struck with
evidence or routed to the living docs) and passed `check-rows --strict`,
`bare-rows`, and `prose-items` BEFORE `git mv`. Each file carries a
`> **Live remainder:**` banner pointing at TODO_LIST / ROADMAP / CHANGELOG /
FEATURES. Classification per docs-health ANNOTATE: **ARCHIVE** (every item
resolved; superseded snapshot).

| File | Classification | Deciding reason |
| ---- | -------------- | --------------- |
| 2025-12-04_09-36_COMPREHENSIVE-ARCHITECTURAL-STATUS-REPORT.md | ARCHIVE | 57 items resolved (27 done, 7 routed, rest wont/superseded); architecture crisis arc closed |
| 2025-12-04_17-32_PRODUCTION-EXCELLENCE-ACHIEVED.md | ARCHIVE | 42 items resolved; "production excellence" claims superseded/corrected in place |
| 2025-12-04_18-30_FINAL-COMPREHENSIVE-STATUS.md | ARCHIVE | 49 items resolved; stale metrics corrected to 165/165 baseline |
| 2025-12-04_18-35_FINAL-COMPREHENSIVE-UPDATE.md | ARCHIVE | 64 items resolved (25 done, 11 routed); duplicate of same-day status pair |
| 2025-12-04_18-36_COMPREHENSIVE-STATUS-REPORT.md | ARCHIVE | 61 items resolved (40 done, 8 routed) |
| 2025-12-04_18-36_PRODUCTION-EXCELLENCE-ARCHITECTURAL-CRISIS-RESOLVED.md | ARCHIVE | 53 items resolved (27 done, 16 superseded) |
| 2025-12-04_18-47_INTERFACE-DECLARATION-PROGRESS.md | ARCHIVE | 32 items resolved; interface conversion landed `dc7f251` |
| 2025-12-04_20-28_CRITICAL-ALLOY-JS-ARCHITECTURE-EMERGENCY.md | ARCHIVE | 45 items resolved; component availability uncertainty disproven by passing suites at HEAD |
| 2025-12-06_04-47_ALLOY_MIGRATION_CRITICAL_FAILURE.md | ARCHIVE | 33 items resolved (22 done, 4 NOT-DO, 3 routed); migration completed `87e2eb4` |
| 2025-12-06_05-00_COMPREHENSIVE_STATUS_UPDATE.md | ARCHIVE | 77 items resolved (50 done, 24 superseded) |
| 2025-12-06_05-15_PROGRESS_REPORT.md | ARCHIVE | 57 items resolved (40 done, 15 superseded) |
| 2025-12-06_05-30_MAJOR_BREAKTHROUGH.md | ARCHIVE | 49 items resolved (20 done, 25 superseded) |
| 2025-12-07_02-19_TypeSpec-Go-Emitter-Status-Report.md | ARCHIVE | 15 items resolved (11 done); key metrics corrected to 165/165 |
| 2025-12-08_02-50_MAJOR-PROGRESS-64-IMPACT-RESOLVED.md | ARCHIVE | 22 items resolved (9 done, 1 routed) |
| 2025-12-08_06-44_TYPEPEC-GO-COMPONENT-ARCHITECTURE-BLOCKER.md | ARCHIVE | 34 items resolved (26 done, 3 routed); blocker thesis inverted by `87e2eb4` |
| 2025-12-08_10-11_CRITICAL-JSX-COMPONENT-ARCHITECTURE-BLOCKER.md | ARCHIVE | 60 items resolved (44 done, 7 routed); all 28 checkboxes annotated |
| 2025-12-09_11-58_TYPESPEC-GO-STATUS-EXCELLENT.md | ARCHIVE | 35 items resolved (23 done, 7 routed) |
| 2025-12-11_11-10_PROJECT-USABILITY-COMPREHENSIVE-ASSESSMENT.md | ARCHIVE | 42 items resolved (24 done, 6 wont — string-based path decision reversed) |
| 2025-12-11_11-36_ALLOY-JS-COMPONENTS-COMPLETE-BREAKDOWN.md | ARCHIVE | 33 items resolved; "100% broken" thesis inverted by rendering fix `87e2eb4` |
| 2025-12-11_11-37_ALLOY-JS-FIX-IMPLEMENTATION-PLAN.md | ARCHIVE | 32 items resolved (9 done, 2 wont, 18 superseded); all 15 checkboxes annotated |
| 2025-12-16_20-39_COMPREHENSIVE-CRITICAL-ASSESSMENT.md | ARCHIVE | 56 items resolved (31 done, 25 superseded) |
| 2025-12-17_02-32_BUILD-SYSTEM-CRISIS-REPORT.md | ARCHIVE | 32 items resolved; build fixed `87e2eb4`, current CI regression recorded |
| 2025-12-30_12-43_COMPREHENSIVE-STATUS-REPORT.md | ARCHIVE | 144 items resolved (68 done, 25 wont, 38 superseded, 13 routed) |
| 2026-01-01_11-09_milestone-critical-rendering-fix-100-percent-tests.md | ARCHIVE | 46 items resolved (25 done, 20 superseded); rendering milestone landed |
| 2026-01-01_14-57_comprehensive-project-status-report.md | ARCHIVE | 125 items resolved (57 done, 47 superseded, 21 routed) |
| 2026-01-02_06-32_critical-integration-crisis-status-report.md | ARCHIVE | 44 items resolved (17 done, 19 superseded, 6 routed); API crisis solved same day `631185b` |
| 2026-01-02_09-00_production-ready-milestone-report.md | ARCHIVE | 47 items resolved (36 done, 9 superseded) |
| 2026-01-02_09-55_TYPESPEC-INTEGRATION-PROGRESS.md | ARCHIVE | 121 items resolved (54 done, 14 superseded, 52 routed); Top-25 next-steps judged item-by-item |

## 2026-11-14 root-layer archival (Pareto T16)

Eleven more historical snapshots archived from the repo root and `docs/` root.
None were annotated item-by-item: all belong to the same 2025 architecture-crisis
arc whose open work was already harvested into TODO_LIST/ROADMAP during the
2026-11-14 corpus sweep, and each carries an archive banner pointing at the
living docs. The CALL_GRAPH pair is superseded by `docs/ARCHITECTURE.md`
(written 2026-11-14), resolving the two-truths split brain.

| File | Origin | Deciding reason |
| ---- | ------ | --------------- |
| CALL_GRAPH.md | repo root | stale hand-written call graph; superseded by docs/ARCHITECTURE.md |
| CALL_GRAPH_ACTUAL.md | repo root | companion "actual" graph; same supersession, split-brain pair consolidated |
| DEDUPLICATION_STATUS.md | repo root | 2025 dedup snapshot; type-mapper dedup completed 2026-11-14 (`go-primitive-types.ts`) |
| EXECUTION_PLAN.md | repo root | superseded execution plan (see also docs/planning/) |
| IMPROVEMENT_PLAN.md | repo root | superseded improvement plan |
| INTEGRATION_REALITY_CHECK.md | repo root | integration reality now proven by test:e2e-cli + gofmt conformance |
| PARTS.md | repo root | architecture-parts snapshot; superseded by docs/ARCHITECTURE.md |
| PROJECT-COMPLETION-REPORT.md | repo root | completion claim superseded by verified FEATURES inventory |
| PROJECT_SPLIT_EXECUTIVE_REPORT.md | repo root | split proposal never executed; historical only |
| 2025-11_status-milestone.md | docs/status.md | filename collided with docs/status/ directory convention |
| 2025-09_github-issues-plan.md | docs/github-issues-plan.md | 2025 issue triage; actions completed or folded into TODO_LIST/ROADMAP |
