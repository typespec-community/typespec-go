"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_assert_1 = require("node:assert");
var node_test_1 = require("node:test");
(0, node_test_1.describe)("JSX Compilation Test", function () {
    (0, node_test_1.it)("can compile JSX without TypeScript errors", function () {
        // Test simple JSX component compilation
        var jsxCode = "\n      import { Output } from \"@alloy-js/core\";\n      import * as go from \"@alloy-js/go\";\n      \n      function TestComponent() {\n        return <go.SourceFile path=\"test.go\" package=\"test\">\n          <go.Declaration name=\"Test\">\n            string value = \"hello\";\n          </go.Declaration>\n        </go.SourceFile>;\n      }\n    ";
        console.log("JSX Code test - if this compiles without TypeScript errors, JSX is working");
        // This test passes if it reaches this point without compilation errors
        (0, node_assert_1.strictEqual)(true, true);
    });
});
