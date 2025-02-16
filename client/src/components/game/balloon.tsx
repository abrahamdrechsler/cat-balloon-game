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

// Updated cat face design to match p5.js sketch
const catPath = `
  M 50 80 
  A 30 30 0 1 1 50 20 
  A 30 30 0 1 1 50 80
  M 35 50 L 15 45
  M 35 48 L 15 48
  M 35 52 L 15 52
  M 65 50 L 85 45
  M 65 48 L 85 48
  M 65 52 L 85 52
  M 30 35 L 40 45 L 25 25
  M 70 35 L 60 45 L 75 25
  M 45 55 L 50 60 L 55 55
`;

// Updated dog face design with more distinct features
const dogPath = `
  M 50 70
  C 35 70 20 55 20 45
  C 20 30 35 20 50 20
  C 65 20 80 30 80 45
  C 80 55 65 70 50 70
  M 30 40 C 25 40 25 45 30 50
  M 70 40 C 75 40 75 45 70 50
  M 45 55 C 47 58 53 58 55 55
  M 45 40 L 35 35
  M 55 40 L 65 35
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
            fill={color}
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