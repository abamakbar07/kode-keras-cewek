import React from 'react';
import { GameScene, Choice, Difficulty, DIFFICULTY_CONFIGS } from '../types';

interface GameSceneProps {
  scene: GameScene;
  selectedChoice: string | null;
  showExplanation: boolean;
  onSelectChoice: (label: string) => void;
  onShowExplanation: () => void;
  onNextScene: () => void;
  onContinueConversation: () => void;
  loading: boolean;
  difficulty: Difficulty;
  currentStep: number;
  conversationOutcome: 'pending' | 'win' | 'lose';
}

export default function GameSceneComponent({
  scene,
  selectedChoice,
  showExplanation,
  onSelectChoice,
  onShowExplanation,
  onNextScene,
  onContinueConversation,
  loading,
  difficulty,
  currentStep,
  conversationOutcome
}: GameSceneProps) {
  // Function to determine if the selected choice is correct
  const isChoiceCorrect = (choice: Choice): boolean => {
    return selectedChoice === choice.label && choice.isCorrect;
  };

  // Function to determine if the selected choice is wrong
  const isChoiceWrong = (choice: Choice): boolean => {
    return selectedChoice === choice.label && !choice.isCorrect;
  };

  // Get max steps for current difficulty
  const maxSteps = DIFFICULTY_CONFIGS[difficulty].maxSteps;
  
  // Check if this is the final step for the current difficulty
  const isFinalStep = currentStep === maxSteps - 1;

  if (!scene) {
    return <div className="text-center p-8">Loading scene...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400">{scene.sceneTitle}</h2>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Difficulty:</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium">
            {DIFFICULTY_CONFIGS[difficulty].name}
          </span>
        </div>
      </div>
      
      {difficulty !== 'easy' && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-4">
          <div 
            className="bg-pink-500 h-2 rounded-full"
            style={{ width: `${(currentStep + 1) / maxSteps * 100}%` }}
          ></div>
          <div className="text-xs text-gray-500 mt-1">
            Step {currentStep + 1} of {maxSteps}
          </div>
        </div>
      )}
      
      <p className="text-gray-700 dark:text-gray-300 mb-6 italic">{scene.situation}</p>
      
      <div className="space-y-4 mb-6">
        {scene.dialogue.map((dialog, index) => (
          <div key={index} className={`flex ${dialog.character === 'Cewek' ? 'justify-start' : 'justify-end'}`}>
            <div 
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                dialog.character === 'Cewek' 
                  ? 'bg-pink-100 dark:bg-pink-900 text-gray-800 dark:text-gray-200' 
                  : 'bg-blue-100 dark:bg-blue-900 text-gray-800 dark:text-gray-200'
              }`}
            >
              <p className="font-semibold text-xs">{dialog.character}</p>
              <p>{dialog.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      {conversationOutcome === 'win' && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
          <p className="font-medium">🎉 Kamu Menang!</p>
          <p className="text-sm">Kamu berhasil menyelesaikan conversation dengan baik.</p>
        </div>
      )}
      
      {conversationOutcome === 'lose' && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
          <p className="font-medium">💔 Game Over</p>
          <p className="text-sm">Sayang sekali, jawabanmu kurang tepat.</p>
        </div>
      )}
      
      {conversationOutcome === 'pending' && (
        <>
          <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Pilih Respon:</h3>
          
          <div className="space-y-3 mb-6">
            {scene.choices.map((choice) => (
              <button
                key={choice.label}
                onClick={() => onSelectChoice(choice.label)}
                disabled={selectedChoice !== null}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  isChoiceCorrect(choice)
                    ? 'bg-green-100 dark:bg-green-800 border-green-500'
                    : isChoiceWrong(choice)
                    ? 'bg-red-100 dark:bg-red-800 border-red-500'
                    : selectedChoice
                    ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-50'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <span className="font-semibold mr-2">{choice.label}.</span>
                {choice.text}
              </button>
            ))}
          </div>
        </>
      )}
      
      {selectedChoice && !showExplanation && conversationOutcome === 'pending' && (
        <button
          onClick={onShowExplanation}
          className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Lihat Penjelasan
        </button>
      )}
      
      {showExplanation && (
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Penjelasan:</h3>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">{scene.explanation}</p>
          </div>
        </div>
      )}
      
      {showExplanation && difficulty !== 'easy' && !isFinalStep && conversationOutcome === 'pending' && (
        <button
          onClick={onContinueConversation}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Lanjutkan Conversation
        </button>
      )}
      
      {(showExplanation && isFinalStep) || conversationOutcome !== 'pending' ? (
        <button
          onClick={onNextScene}
          disabled={loading}
          className="w-full py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Memuat Scene Baru...' : 'Scene Berikutnya'}
        </button>
      ) : null}
    </div>
  );
} 