"use client";

import { motion, useInView, Variants } from "framer-motion";
import { ReactNode, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Base variants                                                      */
/* ------------------------------------------------------------------ */

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export const slideDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const staggerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

/* ------------------------------------------------------------------ */
/*  Wrapper components                                                 */
/* ------------------------------------------------------------------ */

type MotionProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  once?: boolean;
  amount?: number;
};

export function FadeIn({ children, className = "", delay = 0, once = true, amount = 0.2 }: MotionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, className = "", delay = 0, once = true, amount = 0.2 }: MotionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={slideUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideLeft({ children, className = "", delay = 0, once = true, amount = 0.2 }: MotionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={slideLeft}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideRight({ children, className = "", delay = 0, once = true, amount = 0.2 }: MotionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={slideRight}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className = "", delay = 0, once = true, amount = 0.2 }: MotionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleIn}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = "",
  once = true,
  amount = 0.15,
  fast = false,
}: Omit<MotionProps, "delay"> & { fast?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fast ? staggerFast : staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", variants = slideUp }: Omit<MotionProps, "delay" | "once" | "amount">) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hover micro-interactions                                           */
/* ------------------------------------------------------------------ */

export function HoverScale({ children, className = "", scale = 1.03 }: { children: ReactNode; className?: string; scale?: number }) {
  return (
    <motion.div whileHover={{ scale }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} className={className}>
      {children}
    </motion.div>
  );
}

export function HoverLift({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(6,78,59,0.15)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className={className}>
      {children}
    </motion.div>
  );
}
