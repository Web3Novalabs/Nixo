"use client";

import React, { useEffect, useState } from "react";

interface StarProps {
  top: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
  opacity: number;
}

export default function StarBackground() {
  const [stars, setStars] = useState<StarProps[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: StarProps[] = [];
      const starCount = 50; // Number of stars

      for (let i = 0; i < starCount; i++) {
        newStars.push({
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          size: `${Math.random() * 3 + 1}px`, // 1px to 4px
          duration: `${Math.random() * 3 + 2}s`, // 2s to 5s
          delay: `${Math.random() * 2}s`,
          opacity: Math.random() * 0.7 + 0.3,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-white/80 animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}
