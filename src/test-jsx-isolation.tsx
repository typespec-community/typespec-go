import { render } from "@alloy-js/core";
import * as go from "@alloy-js/go";
const { ImportStatements } = go;

// Test case 1: Simple JSX fragment
export function test1() {
	return (
		<>
			{`package api
`}
		</>
	);
}

// Test case 2: ImportStatements component
export function test2() {
	return (
		<>
			<ImportStatements records={[
				{ package: "context", wildcard: false },
				{ package: "encoding/json", wildcard: false },
			]}/>
		</>
	);
}

// Test case 3: Template literal with complex content
export function test3() {
	return (
		<>
			{`// Service provides HTTP handlers for API operations
type Service struct {
	// Add service dependencies here (database, repositories, etc.)
}

`}
		</>
	);
}

// Test case 4: For component (simplified)
import { For } from "@alloy-js/core";

export function test4() {
	const handlers = [{ name: "test1" }, { name: "test2" }];
	
	return (
		<>
			<For each={handlers}>
				{(handler) => (
					{`func (s *Service) ${handler.name}() {
	// TODO: Implement handler
}
`}
				)}
			</For>
		</>
	);
}

// Test case 5: Combined patterns
export function test5() {
	const handlers = [{ name: "test1" }];
	
	return (
		<>
			{`package api

`}
			<ImportStatements records={[
				{ package: "context", wildcard: false },
			]}/>
			{`// Service struct
type Service struct {
}

`}
			<For each={handlers}>
				{(handler) => (
					{`// Handler ${handler.name}`}
				)}
			</For>
		</>
	);
}