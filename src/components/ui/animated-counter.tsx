"use client"

import * as React from "react"
import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CounterProps {
  start?: number;
  end: number;
  duration?: number;
  className?: string;
  fontSize?: number;
  suffix?: string;
}

export const Counter = ({
  start = 0,
  end,
  duration = 2,
  className,
  fontSize = 36,
  suffix,
}: CounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(start);
  const rounded = useSpring(count, {
    stiffness: 50,
    damping: 15,
    duration
  });

  // Format the number with commas for thousands
  const formattedValue = useTransform(rounded, (value) => {
    return Math.round(value).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      count.set(end);
    }
  }, [count, end, isInView]);

  return (
    <div
      ref={ref}
      className={cn("font-bold text-[#214842]", className)}
      style={{ fontSize }}
    >
      <motion.span>
        {formattedValue}
      </motion.span>
      {suffix && <span>{suffix}</span>}
    </div>
  );
};
