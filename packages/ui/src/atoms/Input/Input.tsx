import type { ChangeEventHandler, InputHTMLAttributes } from "react";
import { tokens } from "../../theme/tokens";

export type InputProps = {
  id: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
};

export function Input({ id, value, onChange, placeholder, type = "text" }: InputProps) {
  const style = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${tokens.color.input.border}`,
    background: tokens.color.input.bg,
    color: tokens.color.text.primary,
    outline: "none"
  } as const;

  return (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      style={style}
      aria-label={placeholder ?? id}
    />
  );
}
