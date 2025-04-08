export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface DialogLine {
  character: string;
  text: string;
}

export interface Choice {
  text: string;
  isCorrect: boolean;
}

export interface StepHistory {
  choice: string;
  explanation: string;
}

export interface GameScene {
  background: string;
  dialog: DialogLine[];
  choices: Choice[];
  explanation: string;
  conversationHistory: DialogLine[];
  stepHistory: StepHistory[];
}

export interface GameState {
  currentScene: GameScene | null;
  history: GameScene[];
  selectedChoice: Choice | null;
  showExplanation: boolean;
  score: number;
  loading: boolean;
  difficulty: Difficulty;
  currentStep: number;
  conversationOutcome: 'win' | 'lose' | null;
}

export type DifficultyConfig = {
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