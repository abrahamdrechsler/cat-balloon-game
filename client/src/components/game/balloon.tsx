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

// Array of SVG paths for different cat poses
const catPoses = [
  {
    // Walking cat
    path: "M20 70 C20 70 25 70 30 70 L45 70 C48 70 50 68 50 65 L50 60 C50 58 49 57 47 57 L42 57 L42 55 C42 53 43 52 45 52 L65 52 C68 52 70 54 70 57 L70 65 C70 68 68 70 65 70 L60 70 C55 70 50 70 45 75 L40 80 L35 75 C30 70 25 70 20 70 Z M35 50 C38 50 40 52 40 55 C40 58 38 60 35 60 C32 60 30 58 30 55 C30 52 32 50 35 50 Z M60 50 L65 45 L60 47 M30 50 L25 45 L30 47"
  },
  {
    // Sitting cat
    path: "M35 80 L45 80 C60 80 70 75 70 65 L70 55 C70 45 65 40 55 40 L45 40 C35 40 30 45 30 55 L30 65 C30 75 35 80 35 80 Z M40 50 L30 45 L40 48 M60 50 L70 45 L60 48 M45 55 C48 54 52 54 55 55"
  },
  {
    // Standing cat
    path: "M30 75 L40 75 L45 80 L50 75 L60 75 C65 75 70 70 70 65 L70 45 C70 40 65 35 60 35 L40 35 C35 35 30 40 30 45 L30 65 C30 70 30 75 30 75 Z M40 45 L30 40 L40 43 M60 45 L70 40 L60 43 M45 50 C48 49 52 49 55 50"
  }
];

// Dog shape SVG path
const dogPath = "M40 80 C20 80 15 70 15 50 C15 30 25 20 40 20 C55 20 65 30 65 50 C65 70 60 80 40 80 Z M30 35 L20 25 L30 30 M50 35 L60 25 L50 30 M35 45 C40 43 45 43 50 45 M25 60 L15 65 M55 60 L65 65";

export default function Balloon({ id, x, color, onPop, speedMultiplier = 1, isDog = false }: BalloonProps) {
  const [isPopping, setIsPopping] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const poseIndex = id % catPoses.length;
  const pose = catPoses[poseIndex];

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

  const verticalDistance = windowHeight + 300; // Add extra distance to ensure balloons float completely off screen

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
              d={isDog ? dogPath : pose.path}
              fill={isDog ? "#ff6b6b" : color}
            />
            {/* Eyes */}
            <circle cx="40" cy="60" r="1" fill="#333" />
            <circle cx="60" cy="60" r="1" fill="#333" />
            {/* Whiskers */}
            <g stroke="#333" strokeWidth="0.5">
              <path d="M35 62 L25 60 M35 63 L25 63 M35 64 L25 66" />
              <path d="M65 62 L75 60 M65 63 L75 63 M65 64 L75 66" />
            </g>
          </g>
        </svg>
      </motion.div>
    </AnimatePresence>
  );
}