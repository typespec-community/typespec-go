import { stc } from "@alloy-js/core";
import type { Children } from "@alloy-js/core";

export interface GoReturnProps {
  /** The value to return */
  value?: string | Children;
}

/**
 * GoReturn - A return statement component
 */
export function GoReturn(props: GoReturnProps) {
  return (
    <>
      {"return"}
      {props.value && <>{props.value}</>}
    </>
  );
}

// STC-wrapped version for JSX compatibility
export const GoReturnSTC = stc(GoReturn);
