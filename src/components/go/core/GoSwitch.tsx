import type { Children } from "@alloy-js/core";

export interface GoSwitchCaseProps {
  /** The value or condition to match */
  when?: string | Children;
  /** Whether this is the default case */
  default?: boolean;
  /** The code to render for this case */
  children: Children;
}

/**
 * GoSwitchCase - Represents a case in a Go switch statement
 */
export function GoSwitchCase(props: GoSwitchCaseProps) {
  return props.children;
}

export interface GoSwitchProps {
  /** The expression to switch on */
  value: string | Children;
  /** The cases - should be GoSwitchCase components */
  children: Children;
}

/**
 * GoSwitch - A Go switch statement component
 */
export function GoSwitch(props: GoSwitchProps) {
  return (
    <>
      {"switch"} {props.value} {"{"}
      {props.children}
      {"}"}
    </>
  );
}

/**
 * GoCase - A case clause in a switch statement
 */
export function GoCase(props: { value: string | Children; children: Children }) {
  return (
    <>
      {"case"} {props.value}
      {":"}
      {props.children}
    </>
  );
}

/**
 * GoDefault - The default clause in a switch statement
 */
export function GoDefault(props: { children: Children }) {
  return (
    <>
      {"default:"}
      {props.children}
    </>
  );
}

/**
 * GoReturn - A return statement
 */
export function GoReturn(props: { value?: string | Children }) {
  return (
    <>
      {"return"}
      {props.value && <> {props.value}</>}
    </>
  );
}
