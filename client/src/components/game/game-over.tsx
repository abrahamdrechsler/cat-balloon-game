import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export default function GameOver({ score, onRestart }: GameOverProps) {
  return (
    <Card className="w-[90%] max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Game Over!</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="text-xl">
          You popped <span className="font-bold text-primary">{score}</span> cat balloons!
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
  );
}
