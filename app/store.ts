import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameScene } from './types';

interface GameState {
  currentScene: GameScene | null;
  history: GameScene[];
  selectedChoice: string | null;
  showExplanation: boolean;
  score: number;
  loading: boolean;
  
  setCurrentScene: (scene: GameScene) => void;
  selectChoice: (label: string) => void;
  showSceneExplanation: () => void;
  hideSceneExplanation: () => void;
  nextScene: () => void;
  setLoading: (loading: boolean) => void;
  resetGame: () => void;
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
      
      setCurrentScene: (scene) => set({ currentScene: scene, selectedChoice: null, showExplanation: false }),
      
      selectChoice: (label) => set((state) => {
        // Check if the choice is correct and increment score if it is
        const isCorrect = state.currentScene?.choices.find(choice => choice.label === label)?.isCorrect || false;
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
      })),
      
      setLoading: (loading) => set({ loading }),
      
      resetGame: () => set({ 
        currentScene: null, 
        history: [], 
        selectedChoice: null, 
        showExplanation: false, 
        score: 0 
      })
    }),
    {
      name: 'kode-keras-game-storage',
      partialize: (state) => ({ 
        history: state.history, 
        score: state.score
      }),
    }
  )
); 