export const GAME_DURATION = 60; // Game duration in seconds

export interface DifficultySettings {
  name: string;
  spawnInterval: number; // milliseconds
  speedMultiplier: number;
  scoreMultiplier: number;
  duration: number;
}

export const DIFFICULTY_LEVELS: Record<string, DifficultySettings> = {
  easy: {
    name: "Easy",
    spawnInterval: 1200,
    speedMultiplier: 1,
    scoreMultiplier: 1,
    duration: 60,
  },
  normal: {
    name: "Normal",
    spawnInterval: 1000,
    speedMultiplier: 1.2,
    scoreMultiplier: 2,
    duration: 45,
  },
  hard: {
    name: "Hard",
    spawnInterval: 800,
    speedMultiplier: 1.5,
    scoreMultiplier: 3,
    duration: 30,
  },
};

export const DEFAULT_DIFFICULTY = "normal";