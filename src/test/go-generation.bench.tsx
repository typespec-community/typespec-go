/**
 * Generation benchmarks for the core Go declaration components.
 * Run with: npx vitest bench src/test/go-generation.bench.ts
 */

import { bench, describe } from "vitest";
import { renderGoContent } from "../testing/test-utils.js";
import { MockFactory } from "../testing/mock-factory.js";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";
import { GoEnumDeclaration } from "../components/go/GoEnumDeclaration.js";
import { GoUnionDeclaration } from "../components/go/GoUnionDeclaration.js";

function modelWithProps(count: number) {
  return MockFactory.createModelWithProps(
    `Model${count}`,
    Array.from({ length: count }, (_, i) => ({
      name: `field${i}`,
      type: MockFactory.createScalar("string"),
    })),
  );
}

describe("Go generation", () => {
  bench("struct with 5 fields", () => {
    renderGoContent(<GoStructDeclaration model={modelWithProps(5)} />);
  });

  bench("struct with 25 fields", () => {
    renderGoContent(<GoStructDeclaration model={modelWithProps(25)} />);
  });

  bench("string enum with 8 members", () => {
    const enumType = MockFactory.createEnum(
      "Status",
      Array.from({ length: 8 }, (_, i) => ({ name: `member${i}`, value: `value${i}` })),
    );
    renderGoContent(<GoEnumDeclaration enum={enumType} />);
  });

  bench("iota enum with 8 members", () => {
    const enumType = MockFactory.createEnum(
      "Priority",
      Array.from({ length: 8 }, (_, i) => ({ name: `member${i}`, value: i })),
    );
    renderGoContent(<GoEnumDeclaration enum={enumType} useIota />);
  });

  bench("sealed union with 4 variants", () => {
    const unionType = MockFactory.createUnion("PaymentMethod", [
      { name: "card", type: MockFactory.createModel("Card") },
      { name: "bank", type: MockFactory.createModel("Bank") },
      { name: "wallet", type: MockFactory.createModel("Wallet") },
      { name: "cash", type: MockFactory.createModel("Cash") },
    ]);
    renderGoContent(<GoUnionDeclaration union={unionType} />);
  });
});
