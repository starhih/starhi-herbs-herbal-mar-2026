"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "@/components/ui/image";
import { useIsVisible } from "@/hooks/use-is-visible";

const shuffle = (array: any[]) => {
  const arr = [...array];
  let currentIndex = arr.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
};

interface ShuffleGridProps {
  images: string[];
}

export const ShuffleGrid = ({ images }: ShuffleGridProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Each shuffle runs a layout animation that measures every square, so only shuffle
  // while the grid is on screen (product pages have two of these far below the fold).
  const isVisible = useIsVisible(gridRef);

  const squareData = images.map((src, index) => ({ id: index + 1, src }));

  const generateSquares = (shuffled = true) => {
    return (shuffled ? shuffle(squareData) : squareData).map((sq) => (
      <motion.div
        key={sq.id}
        layout
        transition={{ duration: 1.2, type: "spring" }}
        className="relative w-full h-full rounded-xl overflow-hidden bg-[#f9fafb]"
      >
        {/* next/image instead of a CSS background: resized, modern format and lazy-loaded
            (CSS backgrounds downloaded every photo at full size, ~1MB each) */}
        <Image
          src={sq.src}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain"
        />
      </motion.div>
    ));
  };

  // First render keeps the original order so server and client HTML match;
  // shuffling starts in the effect after hydration.
  const [squares, setSquares] = useState(() => generateSquares(false));

  useEffect(() => {
    if (!isVisible) return;

    if (images.length < 2) {
        setSquares(generateSquares());
        return;
    }

    const shuffleSquares = () => {
      setSquares(generateSquares());
      timeoutRef.current = setTimeout(shuffleSquares, 3000);
    };

    shuffleSquares();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, isVisible]);

  if (images.length === 0) {
      return null;
  }

  // Adjust grid columns and rows based on length
  let colsClass = "grid-cols-2 md:grid-cols-4";
  if (images.length <= 4) {
      colsClass = "grid-cols-2";
  } else if (images.length <= 9) {
      colsClass = "grid-cols-3";
  }

  return (
    <div ref={gridRef} className={`grid ${colsClass} gap-3 h-[400px] md:h-[450px] w-full auto-rows-fr`}>
      {squares}
    </div>
  );
};
