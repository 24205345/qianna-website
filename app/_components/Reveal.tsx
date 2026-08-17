"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in milliseconds when element enters view */
  delay?: number;
}

function mergeClassNames(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const revealClass = visible ? "reveal-visible" : "reveal-hidden";
  const style: CSSProperties | undefined =
    visible && delay > 0 ? { animationDelay: `${delay}ms` } : undefined;

  return (
    <div
      ref={ref}
      className={mergeClassNames(revealClass, className)}
      style={style}
    >
      {children}
    </div>
  );
}
