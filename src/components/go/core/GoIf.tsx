import type { Children } from "@alloy-js/core";
import { Show } from "@alloy-js/core";

export interface GoIfProps {
  /** The condition to test */
  condition: string | Children;
  /** The code to render when condition is true */
  children: Children;
  /** Optional else clause */
  else?: Children;
}

/**
 * GoIf - A Go if statement component
 */
export function GoIf(props: GoIfProps) {
  return (
    <>
      {"if"} {props.condition} {"{"}
      {props.children}
      {"}"}
      <Show when={!!props.else}>
        {" else {"}
        {props.else}
        {"}"}
      </Show>
    </>
  );
}

/**
 * GoElseIf - An else-if clause
 */
export function GoElseIf(props: { condition: string | Children; children: Children }) {
  return (
    <>
      {"else if"} {props.condition} {"{"}
      {props.children}
      {"}"}
    </>
  );
}
