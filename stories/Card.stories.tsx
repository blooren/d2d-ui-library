import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { Button, Card, TextField } from "../components";

const meta = {
  title: "Library/Card",
  component: Card,
  decorators: [(Story) => <div style={{ width: "min(380px, 85vw)" }}><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: "A presentational container. Compose headings, text, and actions using children; Card does not impose a heading level or add an interactive role.",
      },
    },
  },
  args: {
    children: (
      <>
        <h2 style={{ marginTop: 0 }}>Small API. Useful building blocks.</h2>
        <p style={{ marginBottom: 0 }}>Compose content without a fixed layout or hidden behavior.</p>
      </>
    ),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Small API. Useful building blocks.",
    );
  },
};

export const Elevated: Story = { args: { variant: "elevated" } };

export const SignupForm: Story = {
  parameters: {
    docs: {
      description: {
        story: "An integration test using only the three library components. The default button must not submit, and Enter in the input must submit exactly once. State belongs to the consumer, not the Card.",
      },
    },
  },
  render: function SignupExample(args) {
    const [submissions, setSubmissions] = useState(0);
    return (
      <Card {...args}>
        <h2 style={{ marginTop: 0 }}>Join the list</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmissions((count) => count + 1);
          }}
          style={{ display: "grid", gap: "20px" }}
        >
          <TextField label="Email address" type="email" required />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Button type="submit">Subscribe</Button>
            <Button variant="secondary">Preview</Button>
          </div>
          <p role="status" style={{ margin: 0 }}>
            {submissions ? `Subscriptions submitted: ${submissions}` : "No subscriptions yet."}
          </p>
        </form>
      </Card>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Email address" });
    await userEvent.type(input, "alex@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Preview" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("No subscriptions yet.");
    await userEvent.click(input);
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent("Subscriptions submitted: 1");
  },
};
