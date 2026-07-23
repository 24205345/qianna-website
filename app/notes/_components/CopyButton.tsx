"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  /** Light surfaces (prompt cards) vs dark code blocks */
  tone?: "light" | "dark";
}

export default function CopyButton({ text, tone = "dark" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const value = text.replace(/\n$/, "");
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback for older / restricted contexts
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  const toneClass =
    tone === "light"
      ? "border-stone-200 bg-white/90 text-stone-500 hover:border-stone-300 hover:text-stone-800"
      : "border-stone-600/80 bg-stone-800/90 text-stone-300 hover:border-stone-500 hover:text-stone-50";

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`absolute top-2.5 right-2.5 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border opacity-70 shadow-sm backdrop-blur-sm transition-all hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 ${toneClass}`}
      aria-label={copied ? "Copied" : "Copy"}
      title={copied ? "Copied" : "Copy"}
    >
      {copied ? (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
    </button>
  );
}
