"use client";

import { useEffect, useRef } from "react";
import {
  recordPageViewEnd,
  recordPageViewStart,
} from "@/app/analytics/actions";
import type { AnalyticsContentType } from "@/lib/analytics/types";
import {
  VISITOR_COOKIE_MAX_AGE_SECONDS,
  VISITOR_COOKIE_NAME,
} from "@/lib/analytics/visitor";

function createVisitorId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeVisitorCookie(visitorId: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${VISITOR_COOKIE_NAME}=${encodeURIComponent(visitorId)}; Path=/; Max-Age=${VISITOR_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

function getOrCreateVisitorId(): string {
  const existing = readCookie(VISITOR_COOKIE_NAME);
  if (existing) return existing;
  const visitorId = createVisitorId();
  writeVisitorCookie(visitorId);
  return visitorId;
}

interface PageViewTrackerProps {
  contentType: AnalyticsContentType;
  contentSlug: string;
  /** When true, start/end tracking only while the element is visible (for gallery sections). */
  trackWhenVisible?: boolean;
}

export default function PageViewTracker({
  contentType,
  contentSlug,
  trackWhenVisible = false,
}: PageViewTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewIdRef = useRef<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = `${window.location.pathname}${window.location.search}`;
    const visitorId = getOrCreateVisitorId();

    const startTracking = async () => {
      if (activeRef.current) return;
      activeRef.current = true;
      startedAtRef.current = Date.now();

      const result = await recordPageViewStart({
        visitorId,
        contentType,
        contentSlug,
        path,
      });

      if (result?.viewId) {
        viewIdRef.current = result.viewId;
      }
    };

    const stopTracking = () => {
      if (!activeRef.current || startedAtRef.current === null) return;

      const viewId = viewIdRef.current;
      const startedAt = startedAtRef.current;
      activeRef.current = false;
      startedAtRef.current = null;
      viewIdRef.current = null;

      if (!viewId) return;

      const durationSeconds = Math.max(
        1,
        Math.round((Date.now() - startedAt) / 1000)
      );

      void recordPageViewEnd({
        viewId,
        visitorId,
        durationSeconds,
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopTracking();
      } else if (!trackWhenVisible) {
        void startTracking();
      }
    };

    if (!trackWhenVisible) {
      void startTracking();
      document.addEventListener("visibilitychange", onVisibilityChange);
      window.addEventListener("pagehide", stopTracking);

      return () => {
        stopTracking();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("pagehide", stopTracking);
      };
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        if (isVisible) {
          void startTracking();
        } else {
          stopTracking();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", stopTracking);

    return () => {
      stopTracking();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", stopTracking);
    };
  }, [contentSlug, contentType, trackWhenVisible]);

  if (trackWhenVisible) {
    return (
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
    );
  }

  return null;
}
