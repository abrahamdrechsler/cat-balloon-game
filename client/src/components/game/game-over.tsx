import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HighScores, { saveHighScore } from "./high-scores";
import { useEffect, useState } from "react";

const DIFFICULTY_LEVELS = {
  easy: { name: "Easy" },
  normal: { name: "Normal" },
  hard: { name: "Hard" },
  intense: { name: "Intense" },
};

interface GameOverProps {
  score: number;
  onRestart: () => void;
  difficulty: string;
}

export default function GameOver({ score, onRestart, difficulty }: GameOverProps) {
  const [isHighScore, setIsHighScore] = useState(false);

  useEffect(() => {
    const newHighScore = saveHighScore(score, difficulty);
    setIsHighScore(newHighScore);
  }, [score, difficulty]);

  return (
    <div className="flex flex-col items-center gap-4 w-[90%] max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Game Over!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="text-xl text-center">
            <div>
              You popped <span className="font-bold text-primary">{score}</span> cat balloons!
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Difficulty: {DIFFICULTY_LEVELS[difficulty].name}
            </div>
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

      <HighScores currentScore={score} difficulty={difficulty} />
    </div>
  );
}