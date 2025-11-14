// Test direct @alloy-js imports
import * as go from "@alloy-js/go";
import { createComponent } from "@alloy-js/core";

console.log("✅ @alloy-js/go import successful");
console.log("✅ @alloy-js/core import successful");

// Test simple JSX creation
const testComponent = createComponent("Test", {});
console.log("✅ Component creation successful");

export {};