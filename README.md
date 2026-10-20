# D2D UI

A deliberately small React + TypeScript UI library: **Button, TextField, and Card**.
Built as a technical-interview case study in component APIs, accessibility,
composition, and browser-based Storybook tests.

This is a reusable **source library**, not a published npm package. Next.js is the
demo host; the components do not import Next.js, Tailwind, or Storybook.

## Run locally

Use Node.js 22.12+ (Node 22 LTS recommended) and npm.

```bash
npm ci
npx playwright install chromium
npm run storybook
```

Open http://localhost:6006. The sidebar contains exactly three component groups
under **Library**. Each has interactive examples, generated Docs, prop controls,
and an accessibility panel. Select a story with a `play` function to see its
steps in the Interactions panel.

In another terminal, run `npm run dev` and open http://localhost:3000 for the
responsive composition demo. The email form validates locally; it does not store
or send data. Storybook does not need the Next.js server running.

On Linux/CI, if Chromium reports missing system libraries:

```bash
npx playwright install --with-deps chromium
```

## How it works

```text
components/
  Button.tsx           Native button, variants, and sizes
  TextField.tsx        Labeled input with hint/error associations
  Card.tsx             Presentational container with flexible children
  index.ts             Public component and prop-type exports
  styles.css           Shared tokens and namespaced component styles
stories/
  Button.stories.tsx    Visual states, click, keyboard, disabled tests
  TextField.stories.tsx Input, error, controlled, ID, and description tests
  Card.stories.tsx      Surface variants and a composed signup-form test
.storybook/
  main.ts              Framework, story discovery, and addons
  preview.ts           Shared stylesheet, autodocs, and accessibility policy
app/                   Next.js demo consuming the public exports
vitest.config.mts      Storybook-to-Vitest integration using real Chromium
```

### Component API

All components accept their native element attributes, `className`, `style`, and
React 19 `ref` props. Native attributes keep the API familiar and compatible with
forms, event handlers, and ARIA without inventing equivalent custom props.

| Component | Custom props | Defaults / responsibility |
| --- | --- | --- |
| Button | `variant`: `primary`, `secondary`, `ghost`; `size`: `small`, `medium`, `large` | Primary, medium, `type="button"`. Explicitly pass `type="submit"` for a form action. |
| TextField | `label` (required), `hint`, `error` | Native input type defaults to text. Supports controlled `value`/`onChange` or uncontrolled `defaultValue`. Native `size` is intentionally omitted because width is responsive. |
| Card | `variant`: `outlined`, `elevated` | Outlined. Renders a `div`; consumers own content, heading levels, and behavior. |

TextField uses React `useId` unless an explicit `id` is supplied. Its visible
label is associated with the input; hint/error IDs are merged with any caller
`aria-describedby`. An error sets `aria-invalid` without removing the hint.
Validation rules and error timing belong to the consumer, not the input.
Use the field for text-like inputs (text, email, password, etc.), not hidden
inputs, checkboxes, or radio buttons. Caller-supplied IDs must be unique.

Button and TextField declare client boundaries for interactive Next.js use.
Card is purely presentational and can render on the server. Import interactive
components into a client consumer when passing callbacks.

### Use the components

Import styles once in the application root (already done in the demo layout):

```tsx
import "@/components/styles.css";
```

Then compose the public exports inside a client component:

```tsx
"use client";

import { Button, Card, TextField } from "@/components";

export default function ContactForm() {
  return (
    <Card>
      <h2>Contact details</h2>
      <form onSubmit={(event) => event.preventDefault()}>
        <TextField
          label="Email address"
          name="email"
          type="email"
          hint="We only use this to reply."
          required
        />
        <Button type="submit">Save</Button>
      </form>
    </Card>
  );
}
```

To reuse this in another React 19 application, copy the `components` directory,
adjust import paths, and import its stylesheet once. Your host must support
TypeScript/TSX and CSS imports. Publishing would be a separate step: add a library
build, type declarations, package exports, and React peer dependencies.

### Styling

Plain CSS uses `d2d-` namespaced classes to avoid generic selector collisions.
Shared `--d2d-*` custom properties define colors, radius, and font. Override tokens
after importing the stylesheet to theme the library:

```css
:root {
  --d2d-radius: 1rem;
  --d2d-font: system-ui, sans-serif;
}
```

There is no runtime styling dependency. Focus indicators, disabled states,
responsive widths, and reduced-motion preferences are covered by the CSS.
The demo uses system fonts, so builds do not need to download fonts.

## How to write a Storybook test

A story is both a reproducible UI state (`args`) and, optionally, an interaction
test (`play`). This project uses Component Story Format with type-checked metadata
and Storybook's Vitest addon, **not** the separate legacy test runner.

1. Add a named story to an existing `*.stories.tsx` file.
2. Define the state in `args`. Mock callbacks with `fn()` from `storybook/test`.
3. Query the story's scoped `canvas` by accessible role/name or label.
4. Await user interactions and assertions inside `play`.
5. Verify observable behavior, not implementation details such as CSS classes.

For example, this pattern is already in the Button stories:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";
import { Button } from "../components";

const meta = {
  title: "Library/Button",
  component: Button,
  args: { children: "Save changes", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Save changes" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(button).toHaveAttribute("type", "button");
  },
};
```

`canvas` scopes queries to this story rather than the surrounding Storybook UI.
`userEvent` simulates user interaction. `fn()` is a spy: it records calls for the
assertions and Actions panel. `expect` provides DOM matchers and call assertions.
The addon resets mock histories between stories. Avoid fixed sleeps; use
`findByRole` for content that appears asynchronously.

### Run tests

```bash
npm test                                        # All stories, headless Chromium
npm run test:watch                              # Rerun on edits
npm test -- stories/Button.stories.tsx          # One component
npm test -- stories/Button.stories.tsx -t Disabled  # One state
```

Vitest loads the Storybook configuration and preview automatically. Every story
gets a render test; stories with `play` also execute those interaction steps.
The accessibility addon runs axe checks with `a11y.test: "error"`, so detected
violations fail the test run rather than only producing warnings.

Coverage includes mouse/keyboard activation, disabled controls, input editing,
controlled values, required state, label/description associations, unique IDs,
and composition. `Card / Signup Form` checks that a default Button does **not**
submit a form and pressing Enter in the field submits exactly once.

To inspect a failure, open that story in Storybook and inspect the failing step
in Interactions or the issue in Accessibility, then rerun the focused command.
Interaction tests are not screenshot regression tests. Automated axe checks also
do not replace manual keyboard, screen-reader, zoom, and contrast review.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build-storybook
npm run build
```

The static Storybook output is `storybook-static/`; the production demo uses
`npm run build` followed by `npm start`. Generated output is ignored by Git.
GitHub Actions runs these same checks on pushes and pull requests.

## Presenting this in a technical interview

A short demo flow:

1. **State the scope:** three reusable primitives, not a full design system.
2. **Show Button Docs:** explain typed native props, variants, and why a safe
   default button type avoids accidental submissions.
3. **Show TextField / Invalid:** inspect the label, description IDs, and
   `aria-invalid`; explain why validation rules stay with the consumer.
4. **Run Button / Keyboard and Card / Signup Form:** show the interaction steps,
   then run `npm test` to demonstrate the same stories in a real browser.
5. **Open the Next.js demo:** submit an invalid and then valid email; resize the
   page and tab through it.
6. **Discuss trade-offs:** source distribution instead of npm packaging, plain
   CSS instead of a styling runtime, children instead of a large Card prop API,
   and browser interaction tests instead of brittle implementation snapshots.

Honest next steps: package distribution, consumer integration tests, visual
regression checks, more browser engines, and manual accessibility testing.
Keep those separate from this intentionally small implementation.
