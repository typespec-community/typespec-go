// Core Go components - local helpers for missing constructs
export * from "./GoSwitch";
export * from "./GoIf";
export * from "./GoBlock";
export * from "./GoStringLiteral";
export { GoReturn } from "./GoReturn";
export type { GoReturnProps } from "./GoReturn";

// STC-wrapped versions for JSX compatibility
export { GoSwitchCaseSTC, GoSwitchSTC, GoCaseSTC, GoDefaultSTC } from "./GoSwitch";
export { GoIfSTC, GoElseIfSTC } from "./GoIf";
export { GoBlockSTC } from "./GoBlock";
export { GoStringLiteralSTC } from "./GoStringLiteral";
export { GoReturnSTC } from "./GoReturn";
