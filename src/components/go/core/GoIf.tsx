import { code, stc } from "@alloy-js/core";
import type { Children } from "@alloy-js/core";

export interface GoIfProps {
  /** The condition to test */
  condition: string | Children;
  /** The code to render when condition is true */
  children: Children;
  /** Optional else clause */
  else?: Children;
}

/**
 * GoIf - A Go if statement component using Alloy-JS code template literals
 */
export function GoIf(props: GoIfProps) {
  if (props.else) {
    return code`if ${props.condition} {
${props.children}
} else {
${props.else}
}`;
  }

  return code`if ${props.condition} {
${props.children}
}`;
}

export interface GoElseIfProps {
  /** The condition to test */
  condition: string | Children;
  /** The code to render when condition is true */
  children: Children;
}

/**
 * GoElseIf - An else-if clause
 */
export function GoElseIf(props: GoElseIfProps) {
  return code`else if ${props.condition} {
${props.children}
}`;
}

// STC-wrapped versions for JSX compatibility
export const GoIfSTC = stc(GoIf);
export const GoElseIfSTC = stc(GoElseIf);