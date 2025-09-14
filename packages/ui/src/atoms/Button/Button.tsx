import type { MouseEventHandler } from "react";
import { tokens } from "../../theme/tokens";

export type ButtonProps = {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export function Button({ label, onClick, disabled, type = "button" }: ButtonProps) {
  const style = {
    padding: "10px 18px",
    borderRadius: tokens.radius.xl,
    border: "1px solid transparent",
    background: disabled ? "#333843" : tokens.color.brand.primary,
    color: tokens.color.text.primary,
    cursor: disabled ? "not-allowed" : "pointer"
  } as const;
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={style} aria-disabled={disabled}>
      {label}
    </button>
  );
}
