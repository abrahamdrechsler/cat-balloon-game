import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Balloon from "@/components/game/balloon";
import GameOver from "@/components/game/game-over";
import { GAME_DURATION } from "@/lib/constants";
import { initializeAudio } from "@/lib/sounds";

export default function Game() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [balloons, setBalloons] = useState<Array<{ id: number; x: number; color: string }>>([]);
  const [nextBalloonId, setNextBalloonId] = useState(1);

  useEffect(() => {
    initializeAudio();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
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
    if (isPlaying) {
      spawnTimer = setInterval(() => {
        const x = Math.random() * (window.innerWidth - 100);
        const colors = ["#FF69B4", "#87CEEB", "#98FB98", "#DDA0DD", "#F0E68C"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        setBalloons((prev) => [...prev, { id: nextBalloonId, x, color }]);
        setNextBalloonId((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(spawnTimer);
  }, [isPlaying, nextBalloonId]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setBalloons([]);
    setNextBalloonId(1);
  };

  const handlePop = (id: number) => {
    setBalloons((prev) => prev.filter((balloon) => balloon.id !== id));
    setScore((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 relative overflow-hidden">
      {/* HUD */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-50">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 font-bold text-lg">
          Score: {score}
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 font-bold text-lg">
          Time: {timeLeft}s
        </div>
      </div>

      {/* Game Area */}
      <div className="w-full h-screen">
        {balloons.map((balloon) => (
          <Balloon
            key={balloon.id}
            id={balloon.id}
            x={balloon.x}
            color={balloon.color}
            onPop={handlePop}
          />
        ))}
      </div>

      {/* Start/Game Over */}
      {!isPlaying && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          {timeLeft === GAME_DURATION ? (
            <Button
              size="lg"
              className="text-2xl px-8 py-6 bg-primary hover:bg-primary/90"
              onClick={startGame}
            >
              Start Game
            </Button>
          ) : (
            <GameOver score={score} onRestart={startGame} />
          )}
        </div>
      )}
    </div>
  );
}
