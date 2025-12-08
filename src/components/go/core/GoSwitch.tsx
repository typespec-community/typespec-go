import { code, stc } from "@alloy-js/core";
import type { Children } from "@alloy-js/core";

export interface GoSwitchCaseProps {
  /** The value or condition to match */
  when?: string | Children;
  /** Whether this is a default case */
  default?: boolean;
  /** The code to render for this case */
  children: Children;
}

/**
 * GoSwitchCase - Represents a case in a Go switch statement using Alloy-JS Go components
 */
export function GoSwitchCase(props: GoSwitchCaseProps) {
  return <>{props.children || ""}</>;
}

export interface GoSwitchProps {
  /** The expression to switch on */
  value: string | Children;
  /** The cases - should be GoSwitchCase components */
  children: Children;
}

/**
 * GoSwitch - A Go switch statement component using Alloy-JS code template literals
 */
export function GoSwitch(props: GoSwitchProps) {
  return code`switch ${props.value} {
${props.children}
}`;
}

export interface GoCaseProps {
  /** The value to match */
  value: string | Children;
  /** The code to render for this case */
  children: Children;
}

/**
 * GoCase - A case clause in a switch statement using Alloy-JS code template literals
 */
export function GoCase(props: GoCaseProps) {
  return code`case ${props.value}:
${props.children}`;
}

export interface GoDefaultProps {
  /** The code to render for default case */
  children: Children;
}

/**
 * GoDefault - The default clause in a switch statement using Alloy-JS code template literals
 */
export function GoDefault(props: GoDefaultProps) {
  return code`default:
${props.children}`;
}

// STC-wrapped versions for JSX compatibility
export const GoSwitchSTC = stc(GoSwitch);
export const GoCaseSTC = stc(GoCase);
export const GoDefaultSTC = stc(GoDefault);
export const GoSwitchCaseSTC = stc(GoSwitchCase);