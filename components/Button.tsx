"use client";

import type { ComponentPropsWithRef } from "react";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "medium" | "large";
}

export function Button({
  variant = "primary",
  size = "medium",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={["d2d-button", `d2d-button--${variant}`, `d2d-button--${size}`, className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
