import type * as React from "react";
import { useEffect, useRef, useState } from "react";

const easeOutExpo = (t: number) =>
  t === 1 ? 1 : 1 - 2 ** (-10 * t);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useAnimatedValue(
  target: number,
  { duration = 1400, delay = 0 }: { duration?: number; delay?: number } = {},
): number {
  const [value, setValue] = useState(prefersReducedMotion() ? target : 0);
  const fromRef = useRef(prefersReducedMotion() ? target : 0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    let raf = 0;
    let start = 0;
    const timer = window.setTimeout(() => {
      const tick = (now: number) => {
        start ||= now;
        const progress = Math.min(1, (now - start) / duration);
        const next = from + (target - from) * easeOutExpo(progress);
        fromRef.current = next;
        setValue(next);
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);

  return value;
}

const formatNumber = (value: number, decimals: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  delay,
  duration,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  duration?: number;
  className?: string;
}): React.ReactElement {
  const animated = useAnimatedValue(value, { delay, duration });
  const full = `${prefix}${formatNumber(value, decimals)}${suffix}`;
  return (
    <span className={className}>
      <span aria-hidden="true">
        {prefix}
        {formatNumber(animated, decimals)}
        {suffix}
      </span>
      <span className="sr-only">{full}</span>
    </span>
  );
}
