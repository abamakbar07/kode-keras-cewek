export interface DialogLine {
  character: string;
  text: string;
}

export interface Choice {
  text: string;
  label: string;
  isCorrect: boolean;
}

export interface GameScene {
  sceneTitle: string;
  situation: string;
  dialogue: DialogLine[];
  choices: Choice[];
  explanation: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  maxSteps: number;
  name: string;
  description: string;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    maxSteps: 1,
    name: 'Easy',
    description: 'Satu pilihan jawaban per conversation'
  },
  medium: {
    maxSteps: 3,
    name: 'Medium',
    description: 'Tiga pilihan jawaban per conversation'
  },
  hard: {
    maxSteps: 5,
    name: 'Hard',
    description: 'Lima atau lebih pilihan jawaban per conversation'
  }
} 