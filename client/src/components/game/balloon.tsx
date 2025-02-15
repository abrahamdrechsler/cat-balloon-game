import { motion } from "framer-motion";
import { playPopSound } from "@/lib/sounds";

interface BalloonProps {
  id: number;
  x: number;
  color: string;
  onPop: (id: number) => void;
}

// Array of SVG paths for different cat poses
const catPoses = [
  // Sitting cat
  {
    body: "M40 80 C40 50 50 30 60 30 C70 30 80 50 80 80 C80 95 70 100 60 100 C50 100 40 95 40 80",
    tail: "M75 80 Q85 75 90 85 Q95 95 85 100",
    ears: "M50 35 L60 25 L70 35 M70 35 L80 25 L90 35",
    head: "M55 40 Q60 35 65 40 Q70 35 75 40 Q80 50 75 60 Q60 70 55 60 Q50 50 55 40"
  },
  // Stretching cat
  {
    body: "M30 80 C30 60 40 50 60 50 C80 50 90 60 90 80 C90 95 80 100 60 100 C40 100 30 95 30 80",
    tail: "M85 75 Q95 70 100 80 Q105 90 95 95",
    ears: "M45 55 L55 45 L65 55 M65 55 L75 45 L85 55",
    head: "M50 60 Q60 55 70 60 Q75 65 70 75 Q60 80 50 75 Q45 70 50 60"
  },
  // Walking cat
  {
    body: "M35 75 C35 45 45 35 60 35 C75 35 85 45 85 75 C85 90 75 95 60 95 C45 95 35 90 35 75",
    tail: "M80 70 Q90 65 95 75 Q100 85 90 90",
    ears: "M45 40 L55 30 L65 40 M65 40 L75 30 L85 40",
    head: "M50 45 Q60 40 70 45 Q75 50 70 60 Q60 65 50 60 Q45 55 50 45"
  }
];

export default function Balloon({ id, x, color, onPop }: BalloonProps) {
  const handleClick = () => {
    playPopSound();
    onPop(id);
  };

  // Select random pose
  const pose = catPoses[Math.floor(Math.random() * catPoses.length)];

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

        {/* Cat shape using selected pose */}
        <g transform="translate(0, -10)">
          {/* Body */}
          <path d={pose.body} fill={color} />

          {/* Tail */}
          <path d={pose.tail} fill={color} />

          {/* Ears */}
          <path d={pose.ears} fill={color} />

          {/* Head */}
          <path d={pose.head} fill={color} />

          {/* Face details */}
          <circle cx="58" cy="52" r="1.5" fill="#333" /> {/* Left eye */}
          <circle cx="68" cy="52" r="1.5" fill="#333" /> {/* Right eye */}
          <circle cx="63" cy="55" r="1" fill="#FF69B4" /> {/* Nose */}
          <path d="M60 57 Q63 59 66 57" stroke="#333" strokeWidth="1" fill="none" /> {/* Mouth */}

          {/* Whiskers */}
          <g stroke="#333" strokeWidth="0.5">
            <path d="M55 54 L45 52 M55 55 L45 55 M55 56 L45 58" />
            <path d="M71 54 L81 52 M71 55 L81 55 M71 56 L81 58" />
          </g>
        </g>
      </svg>
    </motion.div>
  );
}