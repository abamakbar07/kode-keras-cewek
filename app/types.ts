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
  label?: string;
}

export interface StepHistory {
  choice: string;
  explanation: string;
}

export interface GameScene {
  background: string;
  sceneTitle?: string;
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
    name: 'Mudah',
    description: 'Satu pilihan jawaban per percakapan'
  },
  medium: {
    maxSteps: 3,
    name: 'Sedang',
    description: 'Tiga pilihan jawaban berturut-turut dalam satu percakapan'
  },
  hard: {
    maxSteps: 5,
    name: 'Sulit',
    description: 'Lima pilihan jawaban berturut-turut dalam satu percakapan'
  }
} 