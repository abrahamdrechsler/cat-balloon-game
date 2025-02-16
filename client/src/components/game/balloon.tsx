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

// Simple cat face design based on reference image
const catPath = `
  M 50 70 
  A 25 25 0 0 1 25 45 
  A 25 25 0 0 1 50 20
  A 25 25 0 0 1 75 45
  A 25 25 0 0 1 50 70
  L 40 45 L 35 50 L 40 55
  M 60 45 L 65 50 L 60 55
  M 35 35 L 25 30
  M 65 35 L 75 30
  M 48 50 L 52 50
`;

// Simple dog face design based on reference image
const dogPath = `
  M 50 70
  C 30 70 20 60 20 45
  C 20 30 35 20 50 20
  C 65 20 80 30 80 45
  C 80 60 70 70 50 70
  M 30 35 C 25 35 20 40 25 45
  M 70 35 C 75 35 80 40 75 45
  M 45 50 L 55 50
  M 48 45 L 52 45
`;

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
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* String */}
          <path
            d="M50 80 L50 160"
            stroke="#666"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Animal face */}
          <path
            d={isDog ? dogPath : catPath}
            fill={isDog ? "#ff6b6b" : color}
            stroke="#333"
            strokeWidth="1.5"
          />

          {/* Eyes */}
          <circle cx="35" cy="45" r="2" fill="#333" />
          <circle cx="65" cy="45" r="2" fill="#333" />
        </svg>
      </motion.div>
    </AnimatePresence>
  );
}