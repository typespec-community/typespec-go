import { Children, Show } from "@alloy-js/core";
import * as go from "@alloy-js/go";
const { Block } = go;

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
 * 
 * Example:
 * ```tsx
 * <GoIf condition="x > 0">
 *   <fmt.Printf>positive</fmt.Printf>
 * </GoIf>
 * 
 * <GoIf condition="x > 0">
 *   <fmt.Printf>positive</fmt.Printf>
 *   else={<fmt.Printf>negative</fmt.Printf>}
 * </GoIf>
 * ```
 */
export function GoIf(props: GoIfProps) {
  return (
    <>
      {"if"} {props.condition} {"{"}
      <Block>{props.children}</Block>
      {"}"}
      <Show when={!!props.else}>
        {" else {"}
        <Block>{props.else}</Block>
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
      <Block>{props.children}</Block>
      {"}"}
    </>
  );
}