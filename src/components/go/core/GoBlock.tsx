import type { Children } from "@alloy-js/core";
import { Indent } from "@alloy-js/core";

export interface GoBlockProps {
  /** Content inside the block */
  children: Children;
  /** Whether to render inline (no braces) - for single statements */
  inline?: boolean;
}

/**
 * GoBlock - A Go code block with braces
 * 
 * Example:
 * ```tsx
 * <GoBlock>
 *   <fmt.Printf>Hello</fmt.Printf>
 *   <return>42</return>
 * </GoBlock>
 * 
 * // Renders as:
 * // {
 * //     fmt.Printf("Hello")
 * //     return 42
 * // }
 * ```
 */
export function GoBlock(props: GoBlockProps) {
  if (props.inline) {
    return <>{props.children}</>;
  }

  return (
    <>
      {"{"}
      <Indent>
        {props.children}
      </Indent>
      {"}"}
    </>
  );
}