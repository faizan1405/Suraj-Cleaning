"use client";

import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

/* ---------- Shared viewport defaults ---------- */
const baseViewport = { once: true, margin: "-60px" } as const;

/* ---------- Typed easing curves ---------- */
const cubicEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const maskEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

/* ---------- Reveal variants ---------- */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0 },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1 },
};

export const slideUp = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0 },
};

/* ---------- Reusable Reveal wrapper ----------
   Wraps a section / block with fadeUp reveal when in view.
*/
export function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  y = 24,
  className,
  once = true,
  amount = 0.2,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  as?: "div" | "section" | "article" | "span";
}) {
  const variants = { ...fadeUp, hidden: { opacity: 0, y } };
  const MotionTag = motion[As] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ duration, delay, ease: cubicEase }}
    >
      {children}
    </MotionTag>
  );
}

/* ---------- Text reveal (word-by-word) ----------
   Use this on headings / paragraphs to create the "stagger in" text reveal.
*/
export function TextReveal({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  staggerChildren = 0.04,
  duration = 0.6,
  as: As = "h2",
  startFrom = "hidden",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  staggerChildren?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  startFrom?: "hidden" | "show";
}) {
  const words = text.split(" ");
  const container = {
    hidden: {},
    show: {
      transition: {
        delayChildren: delay,
        staggerChildren,
      },
    },
  };
  const child = {
    hidden: { y: "110%", opacity: 0 },
    show: {
      y: "0%",
      opacity: 1,
      transition: { duration, ease: cubicEase },
    },
  };
  const MotionTag = motion[As] as typeof motion.h2;
  return (
    <MotionTag
      className={className}
      variants={container}
      initial={startFrom}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={i}
          className={`inline-block overflow-hidden align-bottom ${wordClassName}`}
          style={{ marginRight: "0.25em" }}
        >
          <motion.span variants={child} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* ---------- Character reveal (per character) ----------
   Tighter, faster reveal for big hero headings.
*/
export function CharReveal({
  text,
  className = "",
  delay = 0,
  staggerChildren = 0.025,
  duration = 0.5,
}: {
  text: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  duration?: number;
}) {
  const chars = Array.from(text);
  const container = {
    hidden: {},
    show: {
      transition: { delayChildren: delay, staggerChildren },
    },
  };
  const child = {
    hidden: { y: "100%", opacity: 0 },
    show: {
      y: "0%",
      opacity: 1,
      transition: { duration, ease: cubicEase },
    },
  };
  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      aria-label={text}
    >
      {chars.map((c, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: c === " " ? "0.25em" : 0 }}
        >
          <motion.span variants={child} className="inline-block">
            {c === " " ? " " : c}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ---------- Mask Reveal ----------
   Reveals content with a clipped mask sliding up from bottom.
   Good for images / cards.
*/
export function MaskReveal({
  children,
  className = "",
  delay = 0,
  duration = 1,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "101%" }}
        whileInView={{ y: "0%" }}
        viewport={baseViewport}
        transition={{ duration, delay, ease: maskEase }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ---------- ImageReveal ----------
   Wraps an image/element with a zoom-out + mask reveal.
   Hover gives subtle scale + parallax.
*/
export function ImageReveal({
  children,
  className = "",
  delay = 0,
  hover = true,
  scale = 1.05,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  scale?: number;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 1.08 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={baseViewport}
      transition={{ duration: 0.9, delay, ease: cubicEase }}
      whileHover={hover ? { scale } : undefined}
    >
      {children}
    </motion.div>
  );
}

/* ---------- ParallaxImage ----------
   Image that parallaxes on scroll.
*/
export function ParallaxImage({
  children,
  className = "",
  offset = 60,
}: {
  children: ReactNode;
  className?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale: 1.15 }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

/* ---------- Magnetic wrapper ----------
   Adds a subtle magnetic follow effect on hover.
*/
export function Magnetic({
  children,
  className = "",
  strength = 0.25,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const y = useRef(0);
  const setX = useRef<(v: number) => void>(() => {});
  const setY = useRef<(v: number) => void>(() => {});

  // simple inline magnetic without pulling framer-motion api to keep this file lean
  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={(e) => {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        x.current = dx * strength;
        y.current = dy * strength;
        // mutate inline styles for perf
        node.style.transform = `translate(${x.current}px, ${y.current}px)`;
      }}
      onMouseLeave={() => {
        const node = ref.current;
        if (!node) return;
        node.style.transform = "translate(0px, 0px)";
        node.style.transition = "transform 0.4s cubic-bezier(0.22,1,0.36,1)";
      }}
      onMouseEnter={() => {
        const node = ref.current;
        if (!node) return;
        node.style.transition = "transform 0.1s linear";
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Stagger container ---------- */
export function StaggerContainer({
  children,
  className = "",
  delay = 0,
  staggerChildren = 0.08,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { delayChildren: delay, staggerChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Stagger item ---------- */
export function StaggerItem({
  children,
  className = "",
  y = 24,
  duration = 0.5,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: cubicEase },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ---------- InView util ---------- */
export function useRevealOnce(amount = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

/* ---------- Hover Button wrapper ----------
   Pre-styled button with arrow shift, glow, lift.
   Can wrap a plain <a> or <button>.
*/
export function HoverButton({
  children,
  className = "",
  variant = "primary",
}: {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost" | "dark";
}) {
  const variants: Record<string, string> = {
    primary:
      "bg-[#2563eb] text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:bg-[#1d4ed8]",
    outline:
      "bg-white text-[#2563eb] border-2 border-[#2563eb] hover:bg-blue-50 hover:border-[#1d4ed8]",
    ghost:
      "bg-white/10 backdrop-blur text-white border border-white/20 hover:bg-white/20",
    dark:
      "bg-[#0f172a] text-white hover:bg-[#1e293b]",
  };
  return (
    <motion.span
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`relative inline-flex overflow-hidden rounded-full ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2 px-7 py-3.5 font-semibold text-[15px]">
        {children}
      </span>
      {/* shine sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-700"
      />
    </motion.span>
  );
}