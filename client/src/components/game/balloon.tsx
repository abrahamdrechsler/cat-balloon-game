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

  const CatBalloon = () => (
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

      {/* Head */}
      <circle 
        cx="50" 
        cy="50" 
        r="30" 
        fill={color}
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Left Ear */}
      <path
        d="M 30 35 L 42.5 26.25 L 27.5 20 Z"
        fill={color}
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Right Ear */}
      <path
        d="M 70 35 L 57.5 26.25 L 72.5 20 Z"
        fill={color}
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Left Whiskers */}
      <g stroke="#333" strokeWidth="1">
        <line x1="35" y1="50" x2="15" y2="50" />
        <line x1="35" y1="45" x2="15" y2="42" />
        <line x1="35" y1="55" x2="15" y2="58" />
      </g>

      {/* Right Whiskers */}
      <g stroke="#333" strokeWidth="1">
        <line x1="65" y1="50" x2="85" y2="50" />
        <line x1="65" y1="45" x2="85" y2="42" />
        <line x1="65" y1="55" x2="85" y2="58" />
      </g>

      {/* Nose */}
      <path
        d="M 45 55 L 50 60 L 55 55 Z"
        fill="#FFB6C1"
        stroke="#333"
        strokeWidth="1"
      />

      {/* Eyes */}
      <circle cx="40" cy="45" r="2" fill="#333" />
      <circle cx="60" cy="45" r="2" fill="#333" />
    </svg>
  );

  const DogBalloon = () => (
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

      {/* Head - Always red for dogs */}
      <circle 
        cx="50" 
        cy="50" 
        r="30" 
        fill="#FF0000"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Left Ear - Floppy triangle */}
      <path
        d="M 25 35 L 35 30 L 30 45 Z"
        fill="#FF0000"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Right Ear - Floppy triangle */}
      <path
        d="M 75 35 L 65 30 L 70 45 Z"
        fill="#FF0000"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Snout */}
      <path
        d="M 40 55 L 50 65 L 60 55"
        fill="none"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Tongue */}
      <path
        d="M 48 65 Q 50 70 52 65"
        fill="#FFA0A0"
        stroke="#FF6B6B"
        strokeWidth="1"
      />

      {/* Eyes */}
      <circle cx="40" cy="45" r="2" fill="#333" />
      <circle cx="60" cy="45" r="2" fill="#333" />
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
        {isDog ? <DogBalloon /> : <CatBalloon />}
      </motion.div>
    </AnimatePresence>
  );
}