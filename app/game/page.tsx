'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '../store';
import GameSceneComponent from '../components/GameScene';
import { GameScene } from '../types';

export default function GamePage() {
  const { 
    currentScene,
    selectedChoice,
    showExplanation,
    score,
    loading,
    setCurrentScene,
    selectChoice,
    showSceneExplanation,
    nextScene,
    setLoading
  } = useGameStore();
  
  const [error, setError] = useState<string | null>(null);

  // Function to fetch a new scene
  const fetchNewScene = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/scene');
      
      if (!response.ok) {
        throw new Error('Failed to fetch scene');
      }
      
      const data = await response.json();
      setCurrentScene(data as GameScene);
    } catch (err) {
      console.error('Error fetching scene:', err);
      setError('Gagal memuat scene. Coba lagi nanti atau periksa konfigurasi API.');
    } finally {
      setLoading(false);
    }
  };

  // On initial load, fetch the first scene
  useEffect(() => {
    if (!currentScene) {
      fetchNewScene();
    }
  }, []);

  // Handle next scene button
  const handleNextScene = () => {
    nextScene();
    fetchNewScene();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-purple-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className="text-pink-600 dark:text-pink-400 hover:underline font-medium"
          >
            ← Kembali ke Home
          </Link>
          
          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow">
            <span className="font-medium">Score: {score}</span>
          </div>
        </div>
        
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
            <p className="text-gray-700 dark:text-gray-300">Memuat Scene...</p>
          </div>
        ) : currentScene ? (
          <GameSceneComponent
            scene={currentScene}
            selectedChoice={selectedChoice}
            showExplanation={showExplanation}
            onSelectChoice={selectChoice}
            onShowExplanation={showSceneExplanation}
            onNextScene={handleNextScene}
            loading={loading}
          />
        ) : null}
      </div>
    </div>
  );
} 