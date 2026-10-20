"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Card, TextField } from "@/components";

export default function Home() {
  const emailInput = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      setError("Enter a valid email address.");
      setMessage("Please check your email address.");
      emailInput.current?.focus();
      return;
    }
    setError("");
    setMessage(`Demo complete for ${email}. No data was sent.`);
  }

  return (
    <main className="showcase">
      <header className="showcase__header">
        <Link className="brand" href="/" aria-label="D2D UI home">d2d<span> / ui</span></Link>
        <span className="release">v0.1 / React + TypeScript</span>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">A small library, built with intention</p>
        <h1 id="hero-title">Three components.<br /><span>Room to build.</span></h1>
        <p className="hero__description">
          A focused collection of accessible building blocks. Native HTML, clear
          APIs, and stories that double as browser tests.
        </p>
        <a className="text-link" href="#components">Explore the components <span aria-hidden="true">&darr;</span></a>
        <div className="hero__facts">
          <span>01 / Button</span><span>02 / TextField</span><span>03 / Card</span>
        </div>
      </section>

      <section className="component-grid" id="components" aria-label="Component examples">
        <Card className="button-panel">
          <p className="eyebrow">01 / Button</p>
          <h2>A clear next step.</h2>
          <p>Three variants, three sizes. Keyboard interaction and disabled behavior stay native.</p>
          <div className="button-row">
            <Button onClick={() => setMessage("Primary action selected.")}>Primary action</Button>
            <Button variant="secondary" onClick={() => setMessage("Secondary action selected.")}>Secondary</Button>
            <Button variant="ghost" onClick={() => setMessage("Ghost action selected.")}>Ghost</Button>
            <Button disabled>Unavailable</Button>
          </div>
          <code className="code-label">{'<Button variant="primary">Save</Button>'}</code>
        </Card>

        <Card variant="elevated" className="form-panel">
          <p className="eyebrow">02 + 03 / TextField meets Card</p>
          <h2>Better together.</h2>
          <p>A small form composed from all three components. Try an invalid email, then a valid one.</p>
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              ref={emailInput}
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              hint="Local demo only. Nothing is stored or sent."
              required
              value={email}
              error={error}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setMessage("");
              }}
            />
            <Button type="submit">Try the form <span aria-hidden="true">&rarr;</span></Button>
          </form>
          <p className="demo-status" role="status">{message || "Ready when you are."}</p>
        </Card>

        <Card className="principles-panel">
          <p className="eyebrow">The approach</p>
          <h2>Less magic. More clarity.</h2>
          <dl className="principles">
            <div><dt>Accessible foundations</dt><dd>Real labels, linked descriptions, and visible focus.</dd></div>
            <div><dt>Composition over configuration</dt><dd>Small props, native attributes, and flexible children.</dd></div>
            <div><dt>Stories you can trust</dt><dd>Interaction tests run in Chromium with Vitest and Playwright.</dd></div>
          </dl>
        </Card>
      </section>

      <footer className="showcase__footer">
        <span>D2D UI / A component-driven case study</span>
        <span>Explore the stories with <code>npm run storybook</code></span>
      </footer>
    </main>
  );
}
