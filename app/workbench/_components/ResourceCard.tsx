"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { AttachedResource } from "@/lib/workbench/types";

interface ResourceCardProps {
  resource: AttachedResource;
}

/**
 * Authentic brand/product logos rendered in the website's muted stone dark gray palette.
 */
function getResourceIcon(resource: AttachedResource) {
  const id = resource.id.toLowerCase();
  const tag = (resource.tag || "").toLowerCase();
  const title = resource.title.toLowerCase();

  // 1. Cursor AI-Native IDE (Authentic Cursor isometric cube logo)
  if (id.includes("cursor") || title.includes("cursor")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.523 0 2.2 5.38a.959.959 0 0 0-.477.827v11.586a.959.959 0 0 0 .477.828l9.323 5.38a.965.965 0 0 0 .954 0l9.323-5.38a.959.959 0 0 0 .477-.828V6.207a.959.959 0 0 0-.477-.828L12.477 0a.965.965 0 0 0-.954 0ZM12 2.158l7.854 4.535L12 11.228 4.146 6.693 12 2.158Zm-8.477 5.92L11.377 12.6v9.068L3.523 17.147V8.078Zm16.954 0v9.07l-7.854 4.52V12.6l7.854-4.522Z" />
      </svg>
    );
  }

  // 2. OpenAI Codex (Authentic OpenAI swirl logo)
  if (id.includes("codex") || title.includes("codex") || title.includes("openai")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.937a4.485 4.485 0 0 1 2.366-1.973V12.6a.766.766 0 0 0 .388.677l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 8.937zm16.597 3.855l-5.833-3.387L15.119 8.24a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.674 8.105v-5.659a.79.79 0 0 0-.409-.685zm2.013-3.023l-.14-.085-4.773-2.782a.776.776 0 0 0-.785 0L9.409 10.27V7.934a.08.08 0 0 1 .033-.061l4.84-2.796a4.5 4.5 0 0 1 6.664 4.443zM8.37 13.973l-2.02-1.163a.08.08 0 0 1-.038-.052V7.175a4.5 4.5 0 0 1 7.37-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.392.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.612-1.5z" />
      </svg>
    );
  }

  // 3. VS Code + GitHub Copilot (Authentic VS Code ribbon logo)
  if (id.includes("vscode") || title.includes("vs code") || title.includes("visual studio code")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
      </svg>
    );
  }

  // 4. The Agent Skills Directory (skills.sh authentic terminal registry logo)
  if (id.includes("skills-directory") || title.includes("skills.sh") || tag.includes("skills ecosystem")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18V8h16v10H4zm2-8h4v2H6v-2zm0 3h7v2H6v-2zm9-3l3 2-3 2v-4z" />
      </svg>
    );
  }

  // 5. Context7 MCP Server (Authentic documentation C7 mark)
  if (id.includes("context7") || title.includes("context7")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 2H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM6 5a1 1 0 0 1 1-1h11v13.05a3.004 3.004 0 0 0-2-.05H7a1 1 0 0 1-1-1V5zm9.2 4.2h-4.4v1.6h2.6l-2.4 4.8h1.8l2.4-4.8v-1.6z" />
      </svg>
    );
  }

  // 6. Firecrawl MCP Server (Authentic Firecrawl flame mark)
  if (id.includes("firecrawl") || title.includes("firecrawl")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1.5c-.3 0-.6.1-.8.4C9.5 4 6 9 6 13.5 6 17.6 9.4 21 13.5 21S21 17.6 21 13.5c0-3.6-2.3-7.2-5.4-9.8l-.6-.5c-.3-.2-.7-.2-1 0l-.5.5c-.9.9-1.5 2-1.5 3.3 0 .6-.4 1-1 1s-1-.4-1-1c0-1.6.8-3.1 2-4.1l.3-.3c.2-.3.2-.8-.1-1.1-.3-.3-.6-.4-.9-.4zm1.5 12c1.4 0 2.5 1.1 2.5 2.5 0 1.4-1.1 2.5-2.5 2.5S11 17.4 11 16c0-.9.5-1.7 1.2-2.1.4-.2.9-.1 1.1.3.1.2.2.5.2.8z" />
      </svg>
    );
  }

  // 7. Playwright Browser Automation (Authentic Playwright twin theater masks logo)
  if (id.includes("playwright") || title.includes("playwright")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.5 2C4.91 2 2 4.91 2 8.5c0 3.2 2.32 5.86 5.36 6.37A6.47 6.47 0 0 1 7 13c0-3.87 3.13-7 7-7 .67 0 1.32.1 1.93.28C14.77 3.82 11.88 2 8.5 2zm-2 5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm4 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm-3.5 4a3 3 0 0 1 3 0h-3zm8.5-3c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm-2 5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm4 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm-3.5 4a3 3 0 0 1 3 0h-3z" />
      </svg>
    );
  }

  // 8. Trellis (Task Planning & Structured Scaffold lattice logo)
  if (id.includes("trellis") || title.includes("trellis")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h6v6H3V3zm0 12h6v6H3v-6zm12 0h6v6h-6v-6zm0-12h6v6h-6V3zM5 5v2h2V5H5zm0 12v2h2v-2H5zm12 0v2h2v-2h-2zm0-12v2h2V5h-2zM8 7h8v2H8V7zm0 8h8v2H8v-2zm3-5h2v4h-2v-4z" />
      </svg>
    );
  }

  // 9. Anthropic (frontend-design / Claude - Authentic Anthropic logo)
  if (
    id.includes("frontend-design") ||
    id.includes("anthropic") ||
    title.includes("anthropic") ||
    title.includes("claude")
  ) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.827 3.5h3.69L24 20.5h-3.69l-1.884-4.524H11.08L9.196 20.5H5.506L13.827 3.5zm3.179 9.387L14.73 7.373l-2.276 5.514h4.552zM4.506 3.5h3.69L0 20.5h3.69l1.884-4.524H8.5l.84-2.016H6.18L8.196 3.5z" />
      </svg>
    );
  }

  // 10. UI/UX Pro Max (Authentic Figma design system token logo)
  if (id.includes("ui-ux-pro-max") || title.includes("ui-ux-pro-max")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4V2H8zm8 0h-4v8h4a4 4 0 0 0 0-8zM4 12a4 4 0 0 0 4 4h4v-8H8a4 4 0 0 0-4 4zm8 4h-4a4 4 0 1 0 4 4v-4zm4-8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      </svg>
    );
  }

  // 11. Cloudflare (Cloudflare R2 - Authentic Cloudflare clouds logo)
  if (id.includes("cloudflare") || title.includes("cloudflare") || id.includes("r2")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.785 10.749c-.274-2.827-2.65-5.01-5.548-5.01-2.14 0-4.015 1.206-4.992 2.977A4.673 4.673 0 0 0 7.842 8.5C5.168 8.5 3 10.668 3 13.342c0 2.673 2.168 4.841 4.842 4.841h11.776c2.42 0 4.382-1.962 4.382-4.382 0-2.222-1.654-4.057-3.815-4.338l-.4-.054z" />
      </svg>
    );
  }

  // 12. Supabase (Authentic Supabase lightning mark)
  if (id.includes("supabase") || title.includes("supabase")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.368 13.914a.396.396 0 0 0 .31.642H12v8.958a.396.396 0 0 0 .716.233l10.916-13.751a.396.396 0 0 0-.31-.642z" />
      </svg>
    );
  }

  // 13. Stripe (Authentic Stripe italic S logo)
  if (id.includes("stripe") || title.includes("stripe")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.839 3.771 6.323 6.88 7.429 2.633.948 3.512 1.52 3.512 2.468 0 .988-.89 1.58-2.395 1.58-1.901 0-4.989-.968-7.043-2.272l-.93 5.494c1.94 1.146 5.246 1.873 8.354 1.873 2.673 0 4.87-.672 6.413-1.956 1.602-1.325 2.416-3.264 2.416-5.592 0-4.97-3.674-6.236-7.009-7.112z" />
      </svg>
    );
  }

  // 14. BibiGPT & NoteGPT (Video AI summarizer mark)
  if (id.includes("bibigpt") || title.includes("bibigpt")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 10.5V6.5l5 3-5 3z" />
      </svg>
    );
  }

  // 15. Overpass Turbo / OpenStreetMap (Authentic OSM vector globe mark)
  if (id.includes("overpass") || title.includes("overpass") || tag.includes("gis") || tag.includes("map")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    );
  }

  // 16. Midjourney (Authentic Midjourney sailboat mark)
  if (id.includes("mj") || title.includes("midjourney")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.29 2.37a.75.75 0 0 1 1.05.15l8.5 11.5a.75.75 0 0 1-.6 1.19H14.5v5.04a.75.75 0 0 1-1.28.53l-9.5-9.5a.75.75 0 0 1 .15-1.19l6.42-7.72zm.21 2.38L4.85 11.5h7.65V4.75zm2.5 8.25h4.15L13 7.43v5.57zm-1.5 1.5H5.81l6.19 6.19v-6.19z" />
      </svg>
    );
  }

  // 17. Nonscandinavia (Authentic entourage silhouettes mark)
  if (id.includes("nonscandinavia") || title.includes("nonscandinavia")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    );
  }

  // 18. Computational Logic / Grasshopper
  if (id.includes("solar") || id.includes("gh") || tag.includes("computational")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-1.1a4.99 4.99 0 0 0-4.9-4H12V7a3 3 0 1 0-2 0v2H8.9A4.99 4.99 0 0 0 4 13H2.9a1 1 0 0 0 0 2H4a5 5 0 0 0 4.9 4H10v-2H8.9A3 3 0 0 1 6 14.1a3 3 0 0 1 2.9-2.1H10v2h2v-2h1.1a3 3 0 0 1 2.9 2.1 3 3 0 0 1-2.9 2.9H12v2h1.1a5 5 0 0 0 4.9-4H21a1 1 0 0 0 0-2h-2zM11 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      </svg>
    );
  }

  // 19. Academic / Curation / Design Statement
  if (id.includes("statement") || tag.includes("academic")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    );
  }

  // 20. Prompts / Guardrails
  if (resource.type === "prompt") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18V6h16v12H4zm2-2.5l3.5-3.5L6 8.5 7.4 7.1l4.9 4.9-4.9 4.9L6 15.5zm6.5 0v-2h6v2h-6z" />
      </svg>
    );
  }

  // Default Fallback
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
    </svg>
  );
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Close modal on Escape key and lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is unavailable
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Single unified, quiet stone category tag
  const displayTag =
    resource.tag ||
    (resource.type === "mcp"
      ? "MCP Server"
      : resource.type === "prompt"
      ? "Prompt Guardrail"
      : resource.type === "skill"
      ? "Agent Skill"
      : resource.type === "hook"
      ? "Agent Hook"
      : resource.type === "site"
      ? "External Tool"
      : "Resource");

  // Portal Modal Element (rendered directly to document.body)
  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label={resource.title}
    >
      <div
        className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-stone-200/90 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 bg-stone-50/70">
          <span className="inline-flex items-center gap-2 rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 border border-stone-200/70">
            <span className="text-stone-700">{getResourceIcon(resource)}</span>
            <span>{displayTag}</span>
          </span>
          <div className="flex items-center gap-2">
            {resource.url ? (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600 hover:bg-stone-200/80 hover:text-stone-900 transition-colors"
              >
                <span>Visit</span>
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200/70 hover:text-stone-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-5">
          <div>
            <h3 className="font-serif text-xl md:text-2xl font-medium text-stone-900">
              {resource.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-stone-700">
              {resource.description}
            </p>
          </div>

          {/* Curator's Note */}
          {resource.curatorNote ? (
            <div className="rounded-xl border border-stone-200/70 bg-stone-50/80 p-4 space-y-1">
              <p className="text-[11px] font-medium tracking-wider text-stone-500 uppercase">
                Curator&apos;s Note
              </p>
              <p className="text-xs leading-relaxed text-stone-700">
                {resource.curatorNote}
              </p>
            </div>
          ) : null}

          {/* Code Snippet / Configuration */}
          {resource.content ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium tracking-wider text-stone-500 uppercase">
                  Code / Configuration Snippet
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(resource.content || "")}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    copied
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/30"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900 active:scale-95"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg
                        className="h-3.5 w-3.5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.75"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                        />
                      </svg>
                      <span>Copy snippet</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative max-h-64 overflow-y-auto rounded-xl border border-stone-800 bg-stone-900 p-3.5 text-xs font-mono text-stone-100 selection:bg-stone-700">
                <pre className="whitespace-pre-wrap break-words font-mono text-[11.5px] leading-5">
                  {resource.content}
                </pre>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-stone-100 px-6 py-3 bg-stone-50/60 text-[11px] text-stone-400">
          <span>Press ESC or click backdrop to close</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Compact Tile in the Grid: Real Brand Icon on left, Category & Title on right */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-3.5 rounded-xl border border-stone-200/80 bg-white/80 p-3 md:p-3.5 text-left transition-all duration-200 hover:border-stone-400 hover:bg-white hover:shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-stone-400/50"
      >
        {/* Left: Real Brand Icon in refined stone container */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stone-200/90 bg-stone-100/90 text-stone-700 transition-all duration-200 group-hover:border-stone-300 group-hover:bg-stone-200/80 group-hover:text-stone-950">
          {getResourceIcon(resource)}
        </div>

        {/* Right: Category Tag & Title */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1.5">
            <span className="inline-flex items-center rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-500 border border-stone-200/60 truncate">
              {displayTag}
            </span>
            <span
              className="text-stone-300 opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:text-stone-700 group-hover:translate-x-0.5 shrink-0"
              title="Inspect card details"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </span>
          </div>

          <h4
            className="mt-1 font-serif text-sm font-medium text-stone-900 truncate group-hover:text-stone-950"
            title={resource.title}
          >
            {resource.title}
          </h4>
        </div>
      </button>

      {/* Render modal directly to body to avoid CSS transform stacking context bugs */}
      {isOpen && typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}
