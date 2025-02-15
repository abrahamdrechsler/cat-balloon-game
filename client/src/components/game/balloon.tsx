import { motion } from "framer-motion";
import { playPopSound } from "@/lib/sounds";

interface BalloonProps {
  id: number;
  x: number;
  color: string;
  onPop: (id: number) => void;
}

export default function Balloon({ id, x, color, onPop }: BalloonProps) {
  const handleClick = () => {
    playPopSound();
    onPop(id);
  };

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
        width="100"
        height="120"
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* String */}
        <path
          d="M50 80 L50 120"
          stroke="#666"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        
        {/* Balloon body */}
        <path
          d="M15 50 C15 22.4 30.7 0 50 0 C69.3 0 85 22.4 85 50 C85 77.6 69.3 80 50 80 C30.7 80 15 77.6 15 50"
          fill={color}
        />
        
        {/* Cat ears */}
        <path
          d="M30 30 L40 15 L50 30 M70 30 L60 15 L50 30"
          fill={color}
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Cat face */}
        <circle cx="40" cy="40" r="3" fill="#333" /> {/* Left eye */}
        <circle cx="60" cy="40" r="3" fill="#333" /> {/* Right eye */}
        <path
          d="M45 50 Q50 55 55 50"
          stroke="#333"
          strokeWidth="2"
          fill="none"
        /> {/* Smile */}
        <path
          d="M47 35 L53 35"
          stroke="#333"
          strokeWidth="2"
        /> {/* Nose */}
      </svg>
    </motion.div>
  );
}
