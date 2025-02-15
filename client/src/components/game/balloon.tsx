import { motion } from "framer-motion";
import { playPopSound } from "@/lib/sounds";

interface BalloonProps {
  id: number;
  x: number;
  color: string;
  onPop: (id: number) => void;
}

// Array of different cat face expressions
const catExpressions = [
  "M45 52 Q50 55 55 52", // happy
  "M45 52 L55 52",       // neutral
  "M45 54 Q50 51 55 54", // playful
];

export default function Balloon({ id, x, color, onPop }: BalloonProps) {
  const handleClick = () => {
    playPopSound();
    onPop(id);
  };

  // Randomly select cat features
  const expression = catExpressions[Math.floor(Math.random() * catExpressions.length)];
  const earTilt = Math.random() * 10 - 5; // Random ear tilt between -5 and 5 degrees
  const tailCurve = Math.random() > 0.5; // Random tail curve direction

  return (
    <motion.div
      initial={{ y: window.innerHeight + 100 }}
      animate={{
        y: -200,
        transition: { duration: 8, ease: "linear" }
      }}
      className="absolute cursor-pointer"
      style={{ left: x }}
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

        {/* Tail */}
        <path
          d={tailCurve ? 
            "M85 90 Q95 85 100 95 Q105 105 95 110" : 
            "M85 90 Q95 95 100 85 Q105 75 95 70"}
          fill={color}
          stroke={color}
          strokeWidth="2"
        />

        {/* Balloon body */}
        <path
          d="M20 60 C20 26.9 38.1 0 60 0 C81.9 0 100 26.9 100 60 C100 93.1 81.9 100 60 100 C38.1 100 20 93.1 20 60"
          fill={color}
        />

        {/* Cat ears with random tilt */}
        <path
          d={`M30 45 L45 20 L60 45 M90 45 L75 20 L60 45`}
          transform={`rotate(${earTilt} 60 45)`}
          fill={color}
          stroke={color}
          strokeWidth="2"
        />

        {/* Paws */}
        <path
          d="M40 80 Q45 85 50 80 M70 80 Q75 85 80 80"
          stroke="#333"
          strokeWidth="2"
        />

        {/* Whiskers */}
        <path
          d="M35 55 L20 50 M35 60 L20 60 M35 65 L20 70"
          stroke="#333"
          strokeWidth="1"
        />
        <path
          d="M85 55 L100 50 M85 60 L100 60 M85 65 L100 70"
          stroke="#333"
          strokeWidth="1"
        />

        {/* Cat face */}
        <ellipse cx="45" cy="50" rx="4" ry="3" fill="#333" /> {/* Left eye */}
        <ellipse cx="75" cy="50" rx="4" ry="3" fill="#333" /> {/* Right eye */}
        <circle cx="60" cy="55" r="2" fill="#FF69B4" /> {/* Pink nose */}
        <path
          d={expression}
          stroke="#333"
          strokeWidth="2"
          fill="none"
        /> {/* Random expression */}
      </svg>
    </motion.div>
  );
}