import { motion } from "framer-motion";
import { ReactNode } from "react";

interface WordByWordTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  staggerDelay?: number;
  children?: ReactNode;
}

export function WordByWordText({
  text,
  as: Component = "span",
  className = "",
  staggerDelay = 0.05,
  children,
}: WordByWordTextProps) {
  const words = text.split(" ");

  return (
    <Component className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            delay: 0.3 + i * staggerDelay,
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
      {children}
    </Component>
  );
}
