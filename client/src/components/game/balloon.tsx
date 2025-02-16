import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface BalloonProps {
  id: number;
  x: number;
  color: string;
  onPop: (id: number) => void;
  speedMultiplier?: number;
  isDog?: boolean;
}

// Simplified cat head design
const catPath = "M40 75 C25 75 15 65 15 50 C15 35 25 25 40 25 C55 25 65 35 65 50 C65 65 55 75 40 75 Z M25 35 L15 25 M55 35 L65 25 M35 55 L45 55";

// Simple dog head design based on reference image
const dogPath = "M50 80 C30 80 20 70 20 50 C20 30 30 20 50 20 C70 20 80 30 80 50 C80 70 70 80 50 80 Z M35 40 C35 35 30 35 30 40 L30 45 C30 50 35 50 35 45 L35 40 Z M65 40 C65 35 70 35 70 40 L70 45 C70 50 65 50 65 45 L65 40 Z M50 50 L50 60 C40 65 35 60 30 55 M50 60 C60 65 65 60 70 55";

export default function Balloon({ id, x, color, onPop, speedMultiplier = 1, isDog = false }: BalloonProps) {
  const [isPopping, setIsPopping] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isFaster = id % 4 === 0;
  const baseDuration = 8;
  const duration = (isFaster ? baseDuration * 0.65 : baseDuration) / speedMultiplier;

  const handleClick = () => {
    if (isPopping) return;
    setIsPopping(true);
    setTimeout(() => onPop(id), 150);
  };

  if (!windowHeight) {
    return null;
  }

  const verticalDistance = windowHeight + 300;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: windowHeight, x }}
        animate={{
          y: -verticalDistance,
          x: [
            x - 30,
            x + 30,
            x - 30,
            x + 30,
            x - 30
          ],
          scale: isPopping ? [1, 1.2, 0] : 1,
          opacity: isPopping ? [1, 1, 0] : 1
        }}
        transition={{
          y: {
            duration: duration,
            ease: "linear"
          },
          x: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: isPopping ? { duration: 0.15, times: [0, 0.5, 1] } : undefined,
          opacity: isPopping ? { duration: 0.15, times: [0, 0.5, 1] } : undefined
        }}
        style={{
          position: "absolute",
          willChange: "transform"
        }}
        className="cursor-pointer"
        onClick={handleClick}
      >
        <svg
          width="120"
          height="160"
          viewBox="0 0 120 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* String */}
          <path
            d="M60 100 L60 160"
            stroke="#666"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Animal silhouette */}
          <g transform="translate(10, 10)">
            <path
              d={isDog ? dogPath : catPath}
              fill={isDog ? "#ff6b6b" : color}
            />
            {/* Eyes for both cat and dog */}
            <circle cx="35" cy="45" r="2" fill="#333" />
            <circle cx="65" cy="45" r="2" fill="#333" />
            {/* Nose */}
            <circle cx="50" cy={isDog ? "55" : "50"} r="2" fill="#333" />
          </g>
        </svg>
      </motion.div>
    </AnimatePresence>
  );
}