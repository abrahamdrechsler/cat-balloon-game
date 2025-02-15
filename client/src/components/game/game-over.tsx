import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HighScores, { saveHighScore } from "./high-scores";
import { useEffect, useState } from "react";

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export default function GameOver({ score, onRestart }: GameOverProps) {
  const [isHighScore, setIsHighScore] = useState(false);

  useEffect(() => {
    const newHighScore = saveHighScore(score);
    setIsHighScore(newHighScore);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-4 w-[90%] max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Game Over!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="text-xl text-center">
            You popped <span className="font-bold text-primary">{score}</span> cat balloons!
            {isHighScore && (
              <div className="text-lg mt-2 text-primary animate-bounce">
                🎉 New High Score! 🎉
              </div>
            )}
          </div>
          <Button
            size="lg"
            className="text-xl px-8 py-6 bg-primary hover:bg-primary/90"
            onClick={onRestart}
          >
            Play Again
          </Button>
        </CardContent>
      </Card>

      <HighScores currentScore={score} />
    </div>
  );
}