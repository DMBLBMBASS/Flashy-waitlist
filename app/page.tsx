import WaitlistForm from "@/components/WaitlistForm";
import WordDemo from "@/components/WordDemo";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      {/* ───────────────────────── NAV ───────────────────────── */}
      <header className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>◆</span>
          <span>Flashy</span>
        </div>
        <a href="#waitlist" className={styles.navCta}>
          Join the waitlist
        </a>
      </header>

      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Vocabulary, extracted from what you already read</p>
        <h1 className={styles.title}>
          Every word you
          <br />
          <span className={styles.titleItalic}>almost</span> know.
        </h1>
        <p className={styles.subtitle}>
          Drop in an article, a screenshot, a page of a book — anything in English.
          Flashy reads it, finds the words worth learning, and asks you about them
          one at a time. Say you know it, and prove it. Say you don&apos;t, and it
          explains it on the spot.
        </p>

        <div className={styles.heroActions}>
          <a href="#waitlist" className={styles.primaryCta}>
            Join the waitlist
          </a>
          <a href="#how" className={styles.secondaryCta}>
            See how it works ↓
          </a>
        </div>
      </section>

      {/* ───────────────────── INTERACTIVE DEMO ───────────────────── */}
      <section className={styles.demoSection} id="how">
        <WordDemo />
      </section>

      {/* ───────────────────────── HOW IT WORKS ───────────────────────── */}
      <section className={styles.steps}>
        <h2 className={styles.sectionTitle}>How a session feels</h2>
        <div className={styles.stepGrid}>
          <div className={styles.stepCard}>
            <span className={styles.stepLabel}>Drop in</span>
            <p>
              Paste an article, forward a newsletter, or upload a photo of a page.
              Anything with English text on a topic you actually care about.
            </p>
          </div>
          <div className={styles.stepCard}>
            <span className={styles.stepLabel}>Flashy reads</span>
            <p>
              It scans the text and quietly picks out the words that are likely to
              trip you up — not random flashcards, words from your text.
            </p>
          </div>
          <div className={styles.stepCard}>
            <span className={styles.stepLabel}>It asks, you answer</span>
            <p>
              One message at a time: &ldquo;Do you know <em>ubiquitous</em>?&rdquo;
              Say yes and translate it, or say no and get a clear explanation in
              context — right where the word appeared.
            </p>
          </div>
          <div className={styles.stepCard}>
            <span className={styles.stepLabel}>It sticks</span>
            <p>
              Every word you struggled with comes from something you chose to read.
              That context is what makes it stay with you.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── WAITLIST ───────────────────────── */}
      <section className={styles.waitlist} id="waitlist">
        <h2 className={styles.sectionTitle}>Get in early</h2>
        <p className={styles.waitlistSub}>
          We&apos;re putting the first version together. Leave your email and
          you&apos;ll be the first to know when Flashy opens up.
        </p>
        <WaitlistForm />
      </section>

      <footer className={styles.footer}>
        <span>Flashy</span>
        <span>Built for people who read in a language they&apos;re still learning.</span>
      </footer>
    </main>
  );
}
