import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameScene, Difficulty } from './types';

interface GameState {
  currentScene: GameScene | null;
  history: GameScene[];
  selectedChoice: string | null;
  showExplanation: boolean;
  score: number;
  loading: boolean;
  difficulty: Difficulty;
  currentStep: number;
  conversationOutcome: 'pending' | 'win' | 'lose';
  
  setCurrentScene: (scene: GameScene) => void;
  selectChoice: (label: string) => void;
  showSceneExplanation: () => void;
  hideSceneExplanation: () => void;
  nextScene: () => void;
  setLoading: (loading: boolean) => void;
  resetGame: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  advanceStep: () => void;
  resetStep: () => void;
  setConversationOutcome: (outcome: 'pending' | 'win' | 'lose') => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentScene: null,
      history: [],
      selectedChoice: null,
      showExplanation: false,
      score: 0,
      loading: false,
      difficulty: 'easy',
      currentStep: 0,
      conversationOutcome: 'pending',
      
      setCurrentScene: (scene) => set({ 
        currentScene: scene, 
        selectedChoice: null, 
        showExplanation: false 
      }),
      
      selectChoice: (label) => set((state) => {
        // Check if the choice is correct and increment score if it is
        const isCorrect = state.currentScene?.choices.find(choice => choice.label === label)?.isCorrect || false;
        
        // For easy mode or final step in medium/hard, immediately set outcome
        if (state.difficulty === 'easy' || 
            (state.difficulty === 'medium' && state.currentStep === 2) ||
            (state.difficulty === 'hard' && state.currentStep === 4)) {
          return { 
            selectedChoice: label,
            score: isCorrect ? state.score + 1 : state.score,
            conversationOutcome: isCorrect ? 'win' : 'lose'
          };
        }
        
        // For intermediate steps in medium/hard, just track if correct
        return { 
          selectedChoice: label,
          score: isCorrect ? state.score + 1 : state.score
        };
      }),
      
      showSceneExplanation: () => set({ showExplanation: true }),
      
      hideSceneExplanation: () => set({ showExplanation: false }),
      
      nextScene: () => set((state) => ({
        history: [...state.history, state.currentScene!],
        selectedChoice: null,
        showExplanation: false,
        currentStep: 0,
        conversationOutcome: 'pending',
      })),
      
      setLoading: (loading) => set({ loading }),
      
      resetGame: () => set({ 
        currentScene: null, 
        history: [], 
        selectedChoice: null, 
        showExplanation: false, 
        score: 0,
        currentStep: 0,
        conversationOutcome: 'pending',
      }),
      
      setDifficulty: (difficulty) => set({ difficulty }),
      
      advanceStep: () => set((state) => ({ 
        currentStep: state.currentStep + 1,
        selectedChoice: null,
        showExplanation: false,
      })),
      
      resetStep: () => set({ 
        currentStep: 0,
        conversationOutcome: 'pending',
      }),
      
      setConversationOutcome: (outcome) => set({ conversationOutcome: outcome }),
    }),
    {
      name: 'kode-keras-game-storage',
      partialize: (state) => ({ 
        history: state.history, 
        score: state.score,
        difficulty: state.difficulty
      }),
    }
  )
); 