"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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

  const squareData = images.map((src, index) => ({ id: index + 1, src }));

  const generateSquares = () => {
    return shuffle(squareData).map((sq) => (
      <motion.div
        key={sq.id}
        layout
        transition={{ duration: 1.2, type: "spring" }}
        className="w-full h-full rounded-xl overflow-hidden bg-gray-100"
        style={{
          backgroundImage: `url('${sq.src}')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "#f9fafb" // Provide a soft background in case transparency is used
        }}
      />
    ));
  };

  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
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
  }, [images]);

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
    <div className={`grid ${colsClass} gap-3 h-[400px] md:h-[450px] w-full auto-rows-fr`}>
      {squares}
    </div>
  );
};
