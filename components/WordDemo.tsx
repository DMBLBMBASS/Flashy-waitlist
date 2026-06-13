"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WordDemo.module.css";

type Step =
  | { kind: "source" }
  | { kind: "ask"; word: string; sentence: string }
  | { kind: "known"; word: string }
  | { kind: "explain"; word: string; meaning: string; sentence: string };

const SCRIPT: Step[] = [
  { kind: "source" },
  {
    kind: "ask",
    word: "ubiquitous",
    sentence:
      "Cheap sensors have made real-time monitoring nearly ubiquitous across modern factories.",
  },
  {
    kind: "explain",
    word: "ubiquitous",
    meaning: "present or found everywhere — \"повсюду, на каждом шагу\"",
    sentence:
      "Cheap sensors have made real-time monitoring nearly ubiquitous across modern factories.",
  },
  {
    kind: "ask",
    word: "redundancy",
    sentence:
      "Engineers built redundancy into the system so a single failure wouldn't halt production.",
  },
  { kind: "known", word: "redundancy" },
];

const STEP_DURATION = 3600;

export default function WordDemo() {
  const [index, setIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SCRIPT.length);
    }, STEP_DURATION);
    return () => clearInterval(timer);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const step = SCRIPT[index];

  return (
    <div className={styles.stage}>
      <div
        ref={cardRef}
        className={styles.card}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div className={styles.cardHeader}>
          <div className={styles.dots}>
            <span />
            <span />
            <span />
          </div>
          <span className={styles.cardTitle}>flashy — session</span>
          <span className={styles.cardTag}>live</span>
        </div>

        <div className={styles.cardBody}>
          {step.kind === "source" && (
            <div className={styles.sourceBlock}>
              <p className={styles.sourceLabel}>You dropped in:</p>
              <p className={styles.sourceText}>
                &ldquo;...real-time monitoring nearly{" "}
                <span className={styles.highlight}>ubiquitous</span> across
                modern factories, engineers built{" "}
                <span className={styles.highlight}>redundancy</span> into the
                system...&rdquo;
              </p>
              <p className={styles.sourceFooter}>
                an article on industrial automation
              </p>
            </div>
          )}

          {step.kind === "ask" && (
            <div className={styles.bubbleColumn}>
              <div className={styles.bubble}>
                <p>
                  Do you know <strong>&ldquo;{step.word}&rdquo;</strong>?
                </p>
                <p className={styles.context}>&ldquo;{step.sentence}&rdquo;</p>
              </div>
              <div className={styles.choices}>
                <span className={styles.choiceYes}>Yes — translate it</span>
                <span className={styles.choiceNo}>No — explain it</span>
              </div>
            </div>
          )}

          {step.kind === "explain" && (
            <div className={styles.bubbleColumn}>
              <div className={styles.bubble}>
                <p>
                  Do you know <strong>&ldquo;{step.word}&rdquo;</strong>?
                </p>
              </div>
              <div className={styles.bubbleReply}>
                <p className={styles.replyTag}>no</p>
              </div>
              <div className={styles.bubble}>
                <p className={styles.meaning}>{step.meaning}</p>
                <p className={styles.context}>&ldquo;{step.sentence}&rdquo;</p>
              </div>
            </div>
          )}

          {step.kind === "known" && (
            <div className={styles.bubbleColumn}>
              <div className={styles.bubble}>
                <p>
                  Do you know <strong>&ldquo;{step.word}&rdquo;</strong>?
                </p>
              </div>
              <div className={styles.bubbleReply}>
                <p className={styles.replyTag}>yes</p>
                <p>&ldquo;дублирование, резервирование&rdquo;</p>
              </div>
              <div className={styles.confirm}>noted — you know this one ✓</div>
            </div>
          )}
        </div>

        <div className={styles.progress}>
          {SCRIPT.map((_, i) => (
            <span
              key={i}
              className={i === index ? styles.progressDotActive : styles.progressDot}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
