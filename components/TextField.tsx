"use client";

import { useId, type ComponentPropsWithRef } from "react";

export interface TextFieldProps extends Omit<ComponentPropsWithRef<"input">, "size"> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({
  label,
  hint,
  error,
  id,
  className,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const description = [describedBy, hint ? hintId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="d2d-field">
      <label className="d2d-field__label" htmlFor={inputId}>
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        {...props}
        id={inputId}
        className={["d2d-field__input", className].filter(Boolean).join(" ")}
        aria-describedby={description || undefined}
        aria-invalid={error ? true : invalid}
      />
      {hint && <p className="d2d-field__hint" id={hintId}>{hint}</p>}
      {error && <p className="d2d-field__error" id={errorId}>{error}</p>}
    </div>
  );
}
