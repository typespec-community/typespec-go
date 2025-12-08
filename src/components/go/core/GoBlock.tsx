import { code, stc } from "@alloy-js/core";
import type { Children } from "@alloy-js/core";

export interface GoBlockProps {
  /** Content inside of block */
  children: Children;
  /** Whether to render inline (no braces) - for single statements */
  inline?: boolean;
}

/**
 * GoBlock - A Go code block with braces using Alloy-JS code template literals
 *
 * Example:
 * ```tsx
 * <GoBlock>
 *   <GoStringLiteral>Hello</GoStringLiteral>
 *   <GoReturn value="42" />
 * </GoBlock>
 *
 * // Renders as:
 * // {
 * //     "Hello"
 * //     return 42
 * // }
 * ```
 */
export function GoBlock(props: GoBlockProps) {
  if (props.inline) {
    return code`${props.children}`;
  }

  return code`{
${props.children}
}`;
}

// STC-wrapped version for JSX compatibility
export const GoBlockSTC = stc(GoBlock);