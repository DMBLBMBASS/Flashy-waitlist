"use client";

import { useState } from "react";
import styles from "./WaitlistForm.module.css";

type Status = "idle" | "loading" | "success" | "error" | "duplicate";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setStatus("duplicate");
        setMessage("You're already on the list.");
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
        return;
      }

      setStatus("success");
      setMessage("You're on the list — we'll email you when Flashy opens up.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.successCard}>
        <span className={styles.successMark}>✓</span>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputRow}>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          aria-label="Email address"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className={styles.submit}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      {message && (
        <p
          className={
            status === "error" ? styles.errorText : styles.infoText
          }
        >
          {message}
        </p>
      )}
      <p className={styles.fineprint}>
        No spam. Just one email when Flashy is ready.
      </p>
    </form>
  );
}
