/**
 * BDD Test Framework - TypeSpec Go Emitter
 * 
 * BEHAVIOR-DRIVEN DEVELOPMENT: Customer scenario testing
 * ZERO ANY TYPES: Professional test framework
 * SINGLE RESPONSIBILITY: BDD concerns only
 */

import { strictEqual } from "node:assert";

/**
 * BDD Scenario
 * 
 * BEHAVIOR-DRIVEN: Customer scenario definition
 */
export interface BDDScenario {
  readonly name: string;
  readonly given: string;
  readonly when: string;
  readonly then: string;
  readonly test: () => void | Promise<void>;
}

/**
 * BDD Feature
 * 
 * BEHAVIOR-DRIVEN: Customer feature definition
 */
export interface BDDFeature {
  readonly name: string;
  readonly description: string;
  readonly scenarios: BDDScenario[];
}

/**
 * BDD Test Runner
 * 
 * BEHAVIOR-DRIVEN: Customer scenario execution
 */
export class BDDTestRunner {
  private scenarios: BDDScenario[] = [];
  
  /**
   * Add BDD Scenario
   * 
   * BEHAVIOR-DRIVEN: Customer scenario registration
   */
  addScenario(scenario: BDDScenario): void {
    this.scenarios.push(scenario);
  }
  
  /**
   * Add BDD Feature
   * 
   * BEHAVIOR-DRIVEN: Customer feature registration
   */
  addFeature(feature: BDDFeature): void {
    feature.scenarios.forEach(scenario => this.addScenario(scenario));
  }
  
  /**
   * Run BDD Tests
   * 
   * BEHAVIOR-DRIVEN: Customer scenario execution
   */
  async runTests(): Promise<void> {
    console.log("🧪 BDD Test Framework Started");
    console.log(`📊 Running ${this.scenarios.length} scenarios`);
    
    let passed = 0;
    let failed = 0;
    
    for (const scenario of this.scenarios) {
      console.log(`\n📋 Scenario: ${scenario.name}`);
      console.log(`   Given: ${scenario.given}`);
      console.log(`   When: ${scenario.when}`);
      console.log(`   Then: ${scenario.then}`);
      
      try {
        await scenario.test();
        passed++;
        console.log(`   ✅ PASSED`);
      } catch (error) {
        failed++;
        console.log(`   ❌ FAILED: ${error.message}`);
      }
    }
    
    const successRate = (passed / (passed + failed)) * 100;
    console.log(`\n📈 BDD Test Results:`);
    console.log(`   Passed: ${passed}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Success Rate: ${successRate.toFixed(1)}%`);
    
    if (failed > 0) {
      throw new Error(`BDD Tests Failed: ${failed} scenarios failed`);
    }
  }
}

/**
 * BDD Test Builder
 * 
 * BEHAVIOR-DRIVEN: Fluent scenario building
 */
export class BDDTestBuilder {
  private scenario: Partial<BDDScenario> = {};
  
  /**
   * Scenario Name
   * 
   * BEHAVIOR-DRIVEN: Scenario naming
   */
  scenarioName(name: string): BDDTestBuilder {
    this.scenario.name = name;
    return this;
  }
  
  /**
   * Given Condition
   * 
   * BEHAVIOR-DRIVEN: Initial condition
   */
  given(condition: string): BDDTestBuilder {
    this.scenario.given = condition;
    return this;
  }
  
  /**
   * When Action
   * 
   * BEHAVIOR-DRIVEN: User action
   */
  when(action: string): BDDTestBuilder {
    this.scenario.when = action;
    return this;
  }
  
  /**
   * Then Expected Outcome
   * 
   * BEHAVIOR-DRIVEN: Expected result
   */
  then(outcome: string): BDDTestBuilder {
    this.scenario.then = outcome;
    return this;
  }
  
  /**
   * Test Implementation
   * 
   * BEHAVIOR-DRIVEN: Test execution
   */
  test(implementation: () => void | Promise<void>): BDDScenario {
    if (!this.scenario.name || !this.scenario.given || !this.scenario.when || !this.scenario.then) {
      throw new Error("Incomplete BDD scenario");
    }
    
    const scenario: BDDScenario = {
      name: this.scenario.name,
      given: this.scenario.given,
      when: this.scenario.when,
      then: this.scenario.then,
      test: implementation
    };
    
    this.scenario = {}; // Reset for next scenario
    return scenario;
  }
}