import * as go from "@alloy-js/go";
const { Block } = go;

export interface GoBlockProps {
  /** Content inside of block */
  children: any;
  /** Whether to render inline (no braces) - for single statements */
  inline?: boolean;
}

/**
 * GoBlock - A Go code block with braces using Alloy-JS Go components
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
    return <>{props.children}</>;
  }

  return <Block>{props.children}</Block>;
}