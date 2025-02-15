import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DIFFICULTY_LEVELS } from "@/lib/constants";

interface HighScore {
  score: number;
  date: string;
  difficulty: string;
}

export function getHighScores(difficulty: string): HighScore[] {
  const scores = localStorage.getItem(`catBalloonHighScores_${difficulty}`);
  return scores ? JSON.parse(scores) : [];
}

export function saveHighScore(newScore: number, difficulty: string) {
  const scores = getHighScores(difficulty);
  const newEntry: HighScore = {
    score: newScore,
    date: new Date().toLocaleDateString(),
    difficulty
  };

  // Add new score and sort by highest first
  scores.push(newEntry);
  scores.sort((a, b) => b.score - a.score);

  // Keep only top 5 scores per difficulty
  const topScores = scores.slice(0, 5);
  localStorage.setItem(`catBalloonHighScores_${difficulty}`, JSON.stringify(topScores));

  // Return true if this score made it to the top 5
  return topScores.some(score => score.score === newScore);
}

interface HighScoresProps {
  currentScore?: number;
  difficulty: string;
}

export default function HighScores({ currentScore, difficulty }: HighScoresProps) {
  const scores = getHighScores(difficulty);
  const difficultyName = DIFFICULTY_LEVELS[difficulty].name;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {difficultyName} Mode High Scores 🏆
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {scores.map((score, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-2 rounded-md ${
                score.score === currentScore ? 'bg-primary/20 font-bold' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                {index + 1}.{' '}
                {score.score === currentScore && '🌟 '}
                {score.score} balloons
              </span>
              <span className="text-sm text-muted-foreground">{score.date}</span>
            </div>
          ))}
          {scores.length === 0 && (
            <div className="text-center text-muted-foreground">
              No high scores yet for {difficultyName} mode. Be the first!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}