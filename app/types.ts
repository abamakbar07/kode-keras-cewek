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
  nextSceneId?: string;
}

export interface StepHistory {
  choice: string;
  explanation: string;
  nextSceneId?: string;
}

export interface GameScene {
  id: string;
  background: string;
  sceneTitle: string;
  dialog: DialogLine[];
  choices: Choice[];
  explanation: string;
  conversationHistory: ConversationEntry[];
  stepHistory: StepHistory[];
  outcome: 'win' | 'lose' | null;
}

export interface ConversationEntry {
  type: 'dialog' | 'choice' | 'explanation';
  character?: string;
  text: string;
  timestamp: number;
  isCorrect?: boolean;
  nextSceneId?: string;
}

export interface GameState {
  currentScene: GameScene | null;
  currentSceneId: string | null;
  history: GameScene[];
  selectedChoice: Choice | null;
  showExplanation: boolean;
  score: number;
  loading: boolean;
  difficulty: Difficulty;
  currentStep: number;
  conversationOutcome: 'win' | 'lose' | null;
  selectedChoicesHistory: string[];
}

export type DifficultyConfig = {
  maxSteps: number;
  name: string;
  description: string;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    maxSteps: 1,
    name: 'easy',
    description: 'Satu pilihan jawaban per percakapan'
  },
  medium: {
    maxSteps: 3,
    name: 'medium',
    description: 'Tiga pilihan jawaban berturut-turut dalam satu percakapan'
  },
  hard: {
    maxSteps: 5,
    name: 'hard',
    description: 'Lima pilihan jawaban berturut-turut dalam satu percakapan'
  }
} 