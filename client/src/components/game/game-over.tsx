import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DIFFICULTY_LEVELS } from "@/lib/constants";

type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

interface GameOverProps {
  score: number;
  onRestart: () => void;
  difficulty: DifficultyLevel;
}

export default function GameOver({ score, onRestart, difficulty }: GameOverProps) {
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
    </div>
  );
}