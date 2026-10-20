import type { ComponentPropsWithRef } from "react";

export interface CardProps extends ComponentPropsWithRef<"div"> {
  variant?: "outlined" | "elevated";
}

export function Card({ variant = "outlined", className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={["d2d-card", `d2d-card--${variant}`, className].filter(Boolean).join(" ")}
    />
  );
}
