import { StringExpression } from "@alloy-js/go";

export interface GoStringLiteralProps {
  /** The string value (will be properly quoted) */
  value?: string;
  /** Whether to use backticks (raw string) instead of double quotes */
  raw?: boolean;
  /** Children content as alternative to value */
  children?: any;
}

/**
 * GoStringLiteral - A Go string literal component using Alloy-JS Go components
 *
 * Properly escapes and quotes strings for Go
 *
 * Example:
 * ```tsx
 * <GoStringLiteral value="Hello, World!" />
 * // Renders as: "Hello, World!"
 *
 * <GoStringLiteral value="C:\path\to\file" raw />
 * // Renders as: `C:\path\to\file`
 * ```
 */
export function GoStringLiteral(props: GoStringLiteralProps) {
  const { value, raw, children } = props;

  // Use children if provided, otherwise use value
  const content = children !== undefined ? String(children) : value || "";

  if (raw) {
    const finalContent = content.startsWith("`") && content.endsWith("`") 
      ? content 
      : `\`${content}\``;
    return <StringExpression value={finalContent} />;
  }

  // Escape double quotes in string
  const escaped = content.replace(/"/g, '\\"');
  const finalContent = escaped.startsWith('"') && escaped.endsWith('"') 
    ? escaped 
    : `"${escaped}"`;
  return <StringExpression value={finalContent} />;
}