import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HighScore {
  score: number;
  date: string;
}

export function getHighScores(): HighScore[] {
  const scores = localStorage.getItem('catBalloonHighScores');
  return scores ? JSON.parse(scores) : [];
}

export function saveHighScore(newScore: number) {
  const scores = getHighScores();
  const newEntry: HighScore = {
    score: newScore,
    date: new Date().toLocaleDateString()
  };
  
  // Add new score and sort by highest first
  scores.push(newEntry);
  scores.sort((a, b) => b.score - a.score);
  
  // Keep only top 5 scores
  const topScores = scores.slice(0, 5);
  localStorage.setItem('catBalloonHighScores', JSON.stringify(topScores));
  
  // Return true if this score made it to the top 5
  return topScores.some(score => score.score === newScore);
}

interface HighScoresProps {
  currentScore?: number;
}

export default function HighScores({ currentScore }: HighScoresProps) {
  const scores = getHighScores();
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">High Scores 🏆</CardTitle>
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
              No high scores yet. Be the first!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
