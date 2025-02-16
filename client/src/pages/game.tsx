import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Balloon from "@/components/game/balloon";
import GameOver from "@/components/game/game-over";
import DifficultySelect from "@/components/game/difficulty-select";
import { DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY } from "@/lib/constants";

export default function Game() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [difficulty, setDifficulty] = useState<string>(DEFAULT_DIFFICULTY);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_LEVELS[DEFAULT_DIFFICULTY].duration);
  const [balloons, setBalloons] = useState<Array<{ id: number; x: number; color: string }>>([]);
  const [nextBalloonId, setNextBalloonId] = useState(1);
  const [windowWidth, setWindowWidth] = useState(0);

  const settings = DIFFICULTY_LEVELS[difficulty];

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    let spawnTimer: NodeJS.Timeout;
    if (isPlaying && windowWidth > 0) {
      spawnTimer = setInterval(() => {
        const x = Math.random() * (windowWidth - 100);
        const colors = ["#FF69B4", "#87CEEB", "#98FB98", "#DDA0DD", "#F0E68C"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        setBalloons((prev) => [...prev, { id: nextBalloonId, x, color }]);
        setNextBalloonId((prev) => prev + 1);
      }, settings.spawnInterval);
    }
    return () => clearInterval(spawnTimer);
  }, [isPlaying, nextBalloonId, settings.spawnInterval, windowWidth]);

  const handleDifficultySelect = (selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty);
    setScore(0);
    setTimeLeft(DIFFICULTY_LEVELS[selectedDifficulty].duration);
    setBalloons([]);
    setNextBalloonId(1);
    setShowDifficulty(false);
    setIsPlaying(true);
  };

  const handlePop = (id: number) => {
    setBalloons((prev) => prev.filter((balloon) => balloon.id !== id));
    setScore((prev) => prev + settings.scoreMultiplier);
  };

  const handleRestart = () => {
    setShowDifficulty(true);
    setIsPlaying(false);
  };

  if (!windowWidth) {
    return (
      <div className="game-container">
        <div className="game-content">
          <div className="text-center">Loading game...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-content">
        <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-50">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 font-bold text-lg">
            Score: {score}
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 font-bold text-lg">
            Time: {timeLeft}s
          </div>
        </div>

        <div className="game-canvas relative">
          {balloons.map((balloon) => (
            <Balloon
              key={balloon.id}
              id={balloon.id}
              x={balloon.x}
              color={balloon.color}
              onPop={handlePop}
              speedMultiplier={settings.speedMultiplier}
            />
          ))}
        </div>

        {!isPlaying && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            {showDifficulty ? (
              <DifficultySelect onSelect={handleDifficultySelect} />
            ) : (
              <GameOver 
                score={score} 
                onRestart={handleRestart}
                difficulty={difficulty}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}