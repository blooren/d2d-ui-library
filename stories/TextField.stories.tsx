import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";
import { TextField } from "../components";

const meta = {
  title: "Library/TextField",
  component: TextField,
  parameters: {
    docs: {
      description: {
        component: "A labeled native input. Hint and error text are linked with aria-describedby; errors also set aria-invalid. Supports controlled/uncontrolled inputs, native input attributes, and React 19 refs.",
      },
    },
  },
  args: {
    label: "Email address",
    type: "email",
    placeholder: "you@example.com",
    hint: "Use the address you check most often.",
    onChange: fn(),
  },
  decorators: [(Story) => <div style={{ width: "min(320px, 80vw)" }}><Story /></div>],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole("textbox", { name: "Email address" });
    await expect(input).toHaveAccessibleDescription("Use the address you check most often.");
    await userEvent.type(input, "alex@example.com");
    await expect(input).toHaveValue("alex@example.com");
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Invalid: Story = {
  args: { error: "Enter a valid email address.", defaultValue: "not-an-email" },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Email address");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription(
      "Use the address you check most often. Enter a valid email address.",
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "alex@example.com" },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText("Email address");
    await expect(input).toBeDisabled();
    await userEvent.type(input, "ignored");
    await expect(input).toHaveValue("alex@example.com");
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const Required: Story = {
  args: { required: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Email address" })).toBeRequired();
  },
};

export const Controlled: Story = {
  render: function ControlledField(args) {
    const [value, setValue] = useState("");
    return (
      <TextField
        {...args}
        value={value}
        onChange={(event) => {
          args.onChange?.(event);
          setValue(event.target.value);
        }}
      />
    );
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Email address");
    await userEvent.type(input, "alex@example.com");
    await expect(input).toHaveValue("alex@example.com");
    await userEvent.clear(input);
    await expect(input).toHaveValue("");
  },
};

export const MultipleFields: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "24px" }}>
      <TextField {...args} label="Work email" />
      <TextField {...args} label="Personal email" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const work = canvas.getByLabelText("Work email");
    const personal = canvas.getByLabelText("Personal email");
    await expect(work.id).not.toBe(personal.id);
    await userEvent.click(canvas.getByText("Personal email", { selector: "label" }));
    await expect(personal).toHaveFocus();
  },
};

export const ExternalDescription: Story = {
  args: { id: "contact-email", "aria-describedby": "privacy-note" },
  render: (args) => (
    <div>
      <TextField {...args} />
      <p id="privacy-note">We never share your address.</p>
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Email address");
    await expect(input).toHaveAttribute("id", "contact-email");
    await expect(input).toHaveAccessibleDescription(
      "We never share your address. Use the address you check most often.",
    );
  },
};
