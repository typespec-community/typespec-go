import { code, stc } from "@alloy-js/core";
import type { Children } from "@alloy-js/core";

export interface GoReturnProps {
  /** The value to return */
  value?: Children;
}

/**
 * GoReturn - A return statement component
 */
export function GoReturn(props: GoReturnProps) {
  if (props.value) {
    return code`return ${props.value}`;
  }

  return code`return`;
}

// STC-wrapped version for JSX compatibility
export const GoReturnSTC = stc(GoReturn);
