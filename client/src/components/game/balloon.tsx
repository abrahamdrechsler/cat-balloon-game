import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import confetti from 'canvas-confetti';

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
  const [isGiant] = useState(() => !isDog && Math.random() < 0.04); // 1/25 chance for giant cats
  const [randomSize] = useState(() => {
    if (isDog) {
      return 1.25; // Dogs are always 25% larger
    }
    // Check if this is a giant cat (700% larger)
    if (isGiant) {
      return 7.0;
    }
    // Otherwise, cats vary by ±20%
    return 0.8 + Math.random() * 0.4;
  });

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isFaster = id % 4 === 0;
  const baseDuration = 8;
  const duration = (isFaster ? baseDuration * 0.65 : baseDuration) / speedMultiplier;

  const handleMouseOver = () => {
    if (isPopping) return;
    setIsPopping(true);

    // Trigger confetti for giant cat balloons
    if (isGiant) {
      const options = {
        particleCount: 150,
        spread: 70,
        origin: { x: x / window.innerWidth, y: 0.6 }
      };
      confetti(options);
    }

    setTimeout(() => onPop(id), 150);
  };

  if (!windowHeight) {
    return null;
  }

  const verticalDistance = windowHeight + 300;

  const CatBalloon = () => (
    <svg
      width={120 * randomSize}
      height={160 * randomSize}
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
      width={120 * randomSize}
      height={160 * randomSize}
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
        fill="#FF0000"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Left Ear */}
      <path
        d="M 25 35 L 35 30 L 35 25 L 28 22 Z"
        fill="#FF0000"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Right Ear */}
      <path
        d="M 75 35 L 65 30 L 65 25 L 72 22 Z"
        fill="#FF0000"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Muzzle - Outline only */}
      <path
        d="M 40 45 L 40 68 L 60 68 L 60 45"
        fill="none"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Mouth lines */}
      <path
        d="M 50 55 L 50 65 M 50 65 L 45 68 M 50 65 L 55 68"
        fill="none"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Nose */}
      <path
        d="M 45 55 L 55 55 L 57 50 L 43 50 Z"
        fill="#FFB6C1"
        stroke="#333"
        strokeWidth="1.5"
      />

      {/* Eyes */}
      <line x1="40" y1="45" x2="35" y2="42" stroke="#333" strokeWidth="1.5" />
      <line x1="60" y1="45" x2="65" y2="42" stroke="#333" strokeWidth="1.5" />

      {/* Left Whiskers */}
      <g stroke="#333" strokeWidth="1">
        <line x1="35" y1="55" x2="30" y2="55" />
        <line x1="35" y1="53" x2="30" y2="52" />
        <line x1="35" y1="57" x2="30" y2="58" />
      </g>

      {/* Right Whiskers */}
      <g stroke="#333" strokeWidth="1">
        <line x1="65" y1="55" x2="70" y2="55" />
        <line x1="65" y1="53" x2="70" y2="52" />
        <line x1="65" y1="57" x2="70" y2="58" />
      </g>
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
        onMouseOver={handleMouseOver}
      >
        {isDog ? <DogBalloon /> : <CatBalloon />}
      </motion.div>
    </AnimatePresence>
  );
}