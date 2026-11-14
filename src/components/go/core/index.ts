// Core Go components - local helpers for missing constructs
export * from "./GoSwitch.js";
export * from "./GoIf.js";
export * from "./GoBlock.js";
export * from "./GoStringLiteral.js";
export { GoReturn } from "./GoReturn.js";
export type { GoReturnProps } from "./GoReturn.js";

// STC-wrapped versions for JSX compatibility
export { GoSwitchCaseSTC, GoSwitchSTC, GoCaseSTC, GoDefaultSTC } from "./GoSwitch.js";
export { GoIfSTC, GoElseIfSTC } from "./GoIf.js";
export { GoBlockSTC } from "./GoBlock.js";
export { GoStringLiteralSTC } from "./GoStringLiteral.js";
export { GoReturnSTC } from "./GoReturn.js";
