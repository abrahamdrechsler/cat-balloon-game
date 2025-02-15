import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DIFFICULTY_LEVELS } from "@/lib/constants";

interface DifficultySelectProps {
  onSelect: (difficulty: string) => void;
}

export default function DifficultySelect({ onSelect }: DifficultySelectProps) {
  return (
    <Card className="w-[90%] max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Select Difficulty</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Object.entries(DIFFICULTY_LEVELS).map(([key, settings]) => (
          <Button
            key={key}
            size="lg"
            variant={key === "normal" ? "default" : "outline"}
            className="w-full text-xl py-6 relative group"
            onClick={() => onSelect(key)}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">{settings.name}</span>
              <span className="text-sm opacity-70">
                {settings.duration}s • {settings.scoreMultiplier}x Score
              </span>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
