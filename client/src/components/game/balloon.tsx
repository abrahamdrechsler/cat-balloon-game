import { motion, AnimatePresence } from "framer-motion";
import { playPopSound } from "@/lib/sounds";
import { useState, useEffect } from "react";

interface BalloonProps {
  id: number;
  x: number;
  color: string;
  onPop: (id: number) => void;
  speedMultiplier?: number;
}

// Array of SVG paths for different cat poses
const catPoses = [
  {
    // Sitting cat looking up
    path: "M50 80 C40 80 35 75 35 65 L35 45 C35 35 45 30 50 30 C55 30 65 35 65 45 L65 65 C65 75 60 80 50 80 Z M45 40 L35 30 L45 35 M55 40 L65 30 L55 35 M40 50 C45 48 55 48 60 50"
  },
  {
    // Lounging cat
    path: "M30 70 C30 60 35 55 45 55 L75 55 C85 55 90 60 90 70 C90 80 85 85 75 85 L45 85 C35 85 30 80 30 70 Z M40 60 L30 50 L40 55 M80 60 L90 50 L80 55 M45 65 C55 63 65 63 75 65"
  },
  {
    // Walking cat
    path: "M40 75 C30 75 25 70 25 60 C25 50 30 45 40 45 L60 45 C70 45 75 50 75 60 C75 70 70 75 60 75 L40 75 Z M35 50 L25 40 L35 45 M65 50 L75 40 L65 45 M40 55 C45 53 55 53 60 55"
  }
];

export default function Balloon({ id, x, color, onPop, speedMultiplier = 1 }: BalloonProps) {
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
    playPopSound();
    setTimeout(() => onPop(id), 150);
  };

  if (!windowHeight) {
    return null;
  }

  const verticalDistance = windowHeight + 300; // Add extra distance to ensure cats float completely off screen

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

          {/* Cat silhouette */}
          <g transform="translate(10, 10)">
            <path
              d={pose.path}
              fill={color}
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