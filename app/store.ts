import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameScene, Difficulty, DialogLine, Choice, StepHistory } from './types';

type ConversationOutcome = 'win' | 'lose' | null;

interface GameState {
  currentScene: GameScene | null;
  currentSceneId: string | null;
  history: GameScene[];
  selectedChoice: Choice | null;
  showExplanation: boolean;
  score: number;
  loading: boolean;
  difficulty: Difficulty;
  currentStep: number;
  conversationOutcome: ConversationOutcome;
  selectedChoicesHistory: string[];
  
  setCurrentScene: (scene: GameScene) => void;
  selectChoice: (choice: Choice) => void;
  showSceneExplanation: () => void;
  hideSceneExplanation: () => void;
  nextScene: () => void;
  setLoading: (loading: boolean) => void;
  resetGame: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  advanceStep: () => void;
  resetStep: () => void;
  setConversationOutcome: (outcome: ConversationOutcome) => void;
  updateCurrentScene: (updates: Partial<GameScene>) => void;
  fetchNewScene: () => void;
}

interface GameStore extends Omit<GameState, 'conversationOutcome'> {
  conversationOutcome: ConversationOutcome;
  setCurrentScene: (scene: GameScene) => void;
  selectChoice: (choice: Choice) => Promise<void>;
  showSceneExplanation: () => void;
  hideSceneExplanation: () => void;
  nextScene: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  resetGame: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  advanceStep: () => Promise<void>;
  resetStep: () => void;
  setConversationOutcome: (outcome: ConversationOutcome) => void;
  updateCurrentScene: (updates: Partial<GameScene>) => void;
  fetchNewScene: () => Promise<void>;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentScene: null,
      currentSceneId: null,
      history: [],
      selectedChoice: null,
      showExplanation: false,
      score: 0,
      loading: false,
      difficulty: Difficulty.EASY,
      currentStep: 1,
      conversationOutcome: null,
      selectedChoicesHistory: [],
      
      setCurrentScene: (scene: GameScene) => set({ 
        currentScene: scene,
        currentSceneId: scene.id 
      }),
      
      selectChoice: async (choice: Choice) => {
        const { currentScene, difficulty, currentStep } = get();
        if (!currentScene) return;

        set({ 
          selectedChoice: choice, 
          showExplanation: true,
          selectedChoicesHistory: [...get().selectedChoicesHistory, choice.label || '']
        });

        // Update score if choice is correct
        if (choice.isCorrect) {
          set(state => ({ score: state.score + 1 }));
        }

        // For Easy mode, show outcome immediately
        if (difficulty === Difficulty.EASY) {
          set({ conversationOutcome: choice.isCorrect ? 'win' : 'lose' });
          return;
        }

        // For Medium and Hard, only show outcome at final step
        const isFinalStep = (difficulty === Difficulty.MEDIUM && currentStep === 3) ||
                           (difficulty === Difficulty.HARD && currentStep === 5);
        
        if (isFinalStep) {
          set({ conversationOutcome: choice.isCorrect ? 'win' : 'lose' });
        }
      },
      
      showSceneExplanation: () => set({ showExplanation: true }),
      
      hideSceneExplanation: () => set({ showExplanation: false }),
      
      nextScene: async () => {
        const { currentScene, history, difficulty, currentStep, selectedChoice } = get();
        if (!currentScene || !selectedChoice) return;

        // Save completed conversation to history
        set(state => ({
          history: [...state.history, currentScene],
          currentScene: null,
          currentSceneId: null,
          currentStep: 1,
          conversationOutcome: null,
          selectedChoice: null,
          showExplanation: false,
          loading: true,
          selectedChoicesHistory: []
        }));

        // Fetch new scene
        await get().fetchNewScene();
      },
      
      setLoading: (loading: boolean) => set({ loading }),
      
      resetGame: () => set({
        currentScene: null,
        currentSceneId: null,
        history: [],
        selectedChoice: null,
        showExplanation: false,
        score: 0,
        loading: false,
        currentStep: 1,
        conversationOutcome: null,
        selectedChoicesHistory: []
      }),
      
      setDifficulty: (difficulty: Difficulty) => set({ 
        difficulty,
        currentStep: 1,
        conversationOutcome: null,
        selectedChoicesHistory: []
      }),
      
      advanceStep: async () => {
        const { currentScene, currentStep, difficulty, selectedChoice } = get();
        if (!currentScene || !selectedChoice) return;

        // Save the current step's choice and explanation
        const stepHistory: StepHistory = {
          choice: selectedChoice.text,
          explanation: currentScene.explanation,
          nextSceneId: selectedChoice.nextSceneId
        };

        const updatedScene = {
          ...currentScene,
          conversationHistory: [...currentScene.conversationHistory, ...currentScene.dialog],
          stepHistory: [...currentScene.stepHistory, stepHistory]
        };

        // Update current scene with accumulated history
        set({ 
          currentScene: updatedScene,
          currentStep: currentStep + 1,
          selectedChoice: null,
          showExplanation: false,
          currentSceneId: selectedChoice.nextSceneId || null
        });

        // If we have a next scene ID, fetch that specific scene
        if (selectedChoice.nextSceneId) {
          await get().fetchNewScene();
        }
      },
      
      resetStep: () => set({ 
        currentStep: 1,
        conversationOutcome: null,
        selectedChoicesHistory: []
      }),
      
      setConversationOutcome: (outcome: ConversationOutcome) => 
        set({ conversationOutcome: outcome }),
      
      updateCurrentScene: (updates: Partial<GameScene>) => {
        const { currentScene } = get();
        if (!currentScene) return;

        set({
          currentScene: {
            ...currentScene,
            ...updates
          }
        });
      },
      
      fetchNewScene: async () => {
        const { difficulty, currentStep, currentScene, currentSceneId, selectedChoicesHistory } = get();
        set({ loading: true });

        try {
          const response = await fetch('/api/scene', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              difficulty, 
              step: currentStep,
              currentSceneId,
              selectedChoicesHistory,
              conversationHistory: difficulty !== Difficulty.EASY ? (currentScene?.conversationHistory || []) : [],
              stepHistory: difficulty !== Difficulty.EASY ? (currentScene?.stepHistory || []) : []
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch scene');
          }

          const scene = await response.json();
          set({ 
            currentScene: {
              ...scene,
              conversationHistory: difficulty === Difficulty.EASY ? [] : scene.conversationHistory,
              stepHistory: difficulty === Difficulty.EASY ? [] : scene.stepHistory
            },
            currentSceneId: scene.id,
            loading: false 
          });
        } catch (error) {
          console.error('Error fetching scene:', error);
          set({ loading: false });
        }
      }
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