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

export default function Balloon({ id, x, color, onPop, speedMultiplier = 1, isDog = false }: BalloonProps) {
  const [isPopping, setIsPopping] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    if (isPopping) return;
    setIsPopping(true);
    setTimeout(() => onPop(id), 150);
  };

  if (!windowHeight) {
    return null;
  }

  const verticalDistance = windowHeight + 300;

  const CatBalloon = () => (
    <svg
      width="120"
      height="160"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* String */}
      <path
        d="M200 300 L200 380"
        stroke="#666"
        strokeWidth="2"
        strokeDasharray="4 4"
      />

      {/* Head */}
      <circle 
        cx="200" 
        cy="200" 
        r="100" 
        fill="white"
        stroke="#333"
        strokeWidth="4"
      />

      {/* Left Whiskers */}
      <g stroke="#333" strokeWidth="4">
        <line x1="150" y1="200" x2="30" y2="200" />
        <line x1="150" y1="195" x2="30" y2="177" />
        <line x1="150" y1="205" x2="30" y2="223" />
      </g>

      {/* Right Whiskers */}
      <g stroke="#333" strokeWidth="4">
        <line x1="250" y1="200" x2="370" y2="200" />
        <line x1="250" y1="195" x2="370" y2="177" />
        <line x1="250" y1="205" x2="370" y2="223" />
      </g>

      {/* Left Ear */}
      <path
        d="M120 140 L170 105 L110 80 Z"
        fill="white"
        stroke="#333"
        strokeWidth="4"
      />

      {/* Right Ear */}
      <path
        d="M280 140 L230 105 L290 80 Z"
        fill="white"
        stroke="#333"
        strokeWidth="4"
      />

      {/* Muzzle Rectangle */}
      <rect
        x="160"
        y="180"
        width="80"
        height="60"
        fill="white"
        stroke="#333"
        strokeWidth="4"
      />

      {/* Nose and Mouth */}
      <path
        d="M200 190 L200 220 M190 220 L200 220 L210 220"
        fill="none"
        stroke="#333"
        strokeWidth="4"
      />

      {/* Eyes */}
      <circle cx="160" cy="160" r="8" fill="#333" />
      <circle cx="240" cy="160" r="8" fill="#333" />
    </svg>
  );

  const DogBalloon = () => (
    <svg
      width="120"
      height="160"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* String */}
      <path
        d="M200 300 L200 380"
        stroke="#666"
        strokeWidth="2"
        strokeDasharray="4 4"
      />

      {/* Head - Always red for dogs */}
      <circle 
        cx="200" 
        cy="200" 
        r="100" 
        fill="#FF0000"
        stroke="#333"
        strokeWidth="4"
      />

      {/* Left Ear */}
      <path
        d="M120 140 L170 105 L110 80 Z"
        fill="#FF0000"
        stroke="#333"
        strokeWidth="4"
      />

      {/* Right Ear */}
      <path
        d="M280 140 L230 105 L290 80 Z"
        fill="#FF0000"
        stroke="#333"
        strokeWidth="4"
      />

      {/* Muzzle Rectangle */}
      <rect
        x="160"
        y="180"
        width="80"
        height="60"
        fill="#FF0000"
        stroke="#333"
        strokeWidth="4"
      />

      {/* Nose and Mouth */}
      <path
        d="M200 190 L200 220 M190 220 L200 220 L210 220"
        fill="none"
        stroke="#333"
        strokeWidth="4"
      />

      {/* Eyes */}
      <circle cx="160" cy="160" r="8" fill="#333" />
      <circle cx="240" cy="160" r="8" fill="#333" />
    </svg>
  );

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
            duration: 8 / speedMultiplier,
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
        {isDog ? <DogBalloon /> : <CatBalloon />}
      </motion.div>
    </AnimatePresence>
  );
}