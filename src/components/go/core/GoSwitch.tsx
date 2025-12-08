import { code, stc } from "@alloy-js/core";

export interface GoSwitchCaseProps {
  /** The value or condition to match */
  when?: string | any;
  /** Whether this is a default case */
  default?: boolean;
  /** The code to render for this case */
  children: any;
}

/**
 * GoSwitchCase - Represents a case in a Go switch statement using Alloy-JS Go components
 */
export function GoSwitchCase(props: GoSwitchCaseProps) {
  return <>{props.children || ""}</>;
}

export interface GoSwitchProps {
  /** The expression to switch on */
  value: string | any;
  /** The cases - should be GoSwitchCase components */
  children: any;
}

/**
 * GoSwitch - A Go switch statement component using Alloy-JS code template literals
 */
export function GoSwitch(props: GoSwitchProps) {
  return code`switch ${props.value} {
${props.children}
}`;
}

/**
 * GoCase - A case clause in a switch statement using Alloy-JS code template literals
 */
export function GoCase(props: { value: string | any; children: any }) {
  return code`case ${props.value}:
${props.children}`;
}

/**
 * GoDefault - The default clause in a switch statement using Alloy-JS code template literals
 */
export function GoDefault(props: { children: any }) {
  return code`default:
${props.children}`;
}

// STC-wrapped versions for JSX compatibility
export const GoSwitchSTC = stc(GoSwitch);
export const GoCaseSTC = stc(GoCase);
export const GoDefaultSTC = stc(GoDefault);
export const GoSwitchCaseSTC = stc(GoSwitchCase);