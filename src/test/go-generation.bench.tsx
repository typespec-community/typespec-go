/**
 * Generation benchmarks for the core Go declaration components.
 * Run with: npx vitest bench src/test/go-generation.bench.ts
 */

import { bench, describe } from "vitest";
import { renderGoContent } from "../testing/test-utils.js";
import {
  createEnum,
  createModel,
  createModelWithProps,
  createScalar,
  createUnion,
} from "../testing/mock-factory.js";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";
import { GoEnumDeclaration } from "../components/go/GoEnumDeclaration.js";
import { GoUnionDeclaration } from "../components/go/GoUnionDeclaration.js";

function modelWithProps(count: number) {
  return createModelWithProps(
    `Model${count}`,
    Array.from({ length: count }, (_, i) => ({
      name: `field${i}`,
      type: createScalar("string"),
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
    const enumType = createEnum(
      "Status",
      Array.from({ length: 8 }, (_, i) => ({ name: `member${i}`, value: `value${i}` })),
    );
    renderGoContent(<GoEnumDeclaration enum={enumType} />);
  });

  bench("iota enum with 8 members", () => {
    const enumType = createEnum(
      "Priority",
      Array.from({ length: 8 }, (_, i) => ({ name: `member${i}`, value: i })),
    );
    renderGoContent(<GoEnumDeclaration enum={enumType} useIota />);
  });

  bench("sealed union with 4 variants", () => {
    const unionType = createUnion("PaymentMethod", [
      { name: "card", type: createModel("Card") },
      { name: "bank", type: createModel("Bank") },
      { name: "wallet", type: createModel("Wallet") },
      { name: "cash", type: createModel("Cash") },
    ]);
    renderGoContent(<GoUnionDeclaration union={unionType} />);
  });
});
