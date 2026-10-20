import type { Metadata } from "next";
import "../components/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "D2D UI | Three components, built with intention",
  description: "A focused React UI library with Button, TextField, and Card. Documented and tested in Storybook.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
