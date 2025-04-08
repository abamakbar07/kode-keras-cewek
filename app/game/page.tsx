'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '../store';
import GameSceneComponent from '../components/GameScene';
import { GameScene, Difficulty, DIFFICULTY_CONFIGS, Choice } from '../types';

export default function GamePage() {
  const { 
    currentScene,
    selectedChoice,
    showExplanation,
    score,
    loading,
    difficulty,
    currentStep,
    conversationOutcome,
    setCurrentScene,
    selectChoice,
    showSceneExplanation,
    nextScene,
    setLoading,
    setDifficulty,
    advanceStep,
    resetStep,
    fetchNewScene: fetchNewSceneFromStore
  } = useGameStore();
  
  const [error, setError] = useState<string | null>(null);
  const [showDifficultyModal, setShowDifficultyModal] = useState(!currentScene);

  // Function to fetch a new scene
  const fetchNewScene = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the store's fetchNewScene function which handles all the context
      await fetchNewSceneFromStore();
    } catch (err) {
      console.error('Error fetching scene:', err);
      setError('Gagal memuat adegan. Coba lagi nanti atau periksa konfigurasi API.');
    } finally {
      setLoading(false);
    }
  };

  // On initial load, check difficulty settings
  useEffect(() => {
    if (!showDifficultyModal && !currentScene) {
      fetchNewScene();
    }
  }, [showDifficultyModal]);

  // Handle difficulty selection
  const handleSelectDifficulty = (selected: Difficulty) => {
    setDifficulty(selected);
    resetStep();
    setShowDifficultyModal(false);
  };

  // Handle next scene button
  const handleNextScene = () => {
    nextScene();
  };

  // Handle continue conversation button (for medium and hard difficulties)
  const handleContinueConversation = () => {
    advanceStep();
  };

  // Handle selecting a choice by label
  const handleSelectChoice = (label: string) => {
    if (!currentScene) return;
    
    // Find the choice with the matching label
    const choice = currentScene.choices.find(c => c.label === label);
    if (choice) {
      selectChoice(choice);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-purple-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className="text-pink-600 dark:text-pink-400 hover:underline font-medium"
          >
            ← Kembali ke Beranda
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDifficultyModal(true)}
              className="px-3 py-1 text-sm bg-white dark:bg-gray-700 rounded-full border border-pink-300 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-gray-600"
            >
              Level: {DIFFICULTY_CONFIGS[difficulty].name}
            </button>
            
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow">
              <span className="font-medium">Skor: {score}</span>
            </div>
          </div>
        </div>
        
        {/* Difficulty Selection Modal */}
        {showDifficultyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-4">Pilih Level Kesulitan</h2>
              
              <div className="space-y-4 mb-6">
                {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleSelectDifficulty(level)}
                    className="w-full p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{DIFFICULTY_CONFIGS[level].name}</span>
                      {level === difficulty && (
                        <span className="text-pink-500">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {DIFFICULTY_CONFIGS[level].description}
                    </p>
                  </button>
                ))}
              </div>
              
              {currentScene && (
                <button
                  onClick={() => setShowDifficultyModal(false)}
                  className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Batal
                </button>
              )}
            </div>
          </div>
        )}
        
        {error ? (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-4">
            <p>{error}</p>
            <button 
              onClick={fetchNewScene}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : loading && !currentScene ? (
          <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300">Memuat Adegan...</p>
          </div>
        ) : currentScene ? (
          <GameSceneComponent
            scene={currentScene}
            selectedChoice={selectedChoice?.label || null}
            showExplanation={showExplanation}
            onSelectChoice={handleSelectChoice}
            onShowExplanation={showSceneExplanation}
            onNextScene={handleNextScene}
            onContinueConversation={handleContinueConversation}
            loading={loading}
            difficulty={difficulty}
            currentStep={currentStep}
            conversationOutcome={conversationOutcome || "pending"} // Default to "pending" if null
          />
        ) : null}
      </div>
    </div>
  );
} 