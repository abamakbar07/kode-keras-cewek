'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Difficulty, DIFFICULTY_CONFIGS } from "./types";
import { useGameStore } from "./store";

export default function Home() {
  const router = useRouter();
  const { setDifficulty, resetStep, resetGame } = useGameStore();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const handleStartGame = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    resetStep();
    resetGame();
    router.push('/game');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-purple-950">
      <main className="flex flex-col items-center max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-pink-600 dark:text-pink-400 mb-4">
          Kode Keras Cewek
        </h1>
        
        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
          Game simulasi untuk pahami kode halus cewek. Pilih jawaban yang tepat dan jadilah pemenang di hatinya! 💕
        </p>
        
        <div className="w-64 h-64 relative mb-8 rounded-full overflow-hidden border-4 border-pink-400 shadow-lg bg-pink-200 flex items-center justify-center">
          <span className="text-6xl">👧</span>
        </div>
        
        <button 
          onClick={() => setShowDifficultyModal(true)}
          className="px-8 py-4 text-lg font-medium text-white bg-pink-500 rounded-full hover:bg-pink-600 transition-colors shadow-md"
        >
          Mulai Main
        </button>
        
        <Link 
          href="/history" 
          className="mt-4 px-6 py-3 text-sm font-medium text-pink-600 bg-white border border-pink-300 rounded-full hover:bg-pink-50 transition-colors shadow-sm"
        >
          Lihat History
        </Link>
        
        <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>Game ini sepenuhnya fiksi dan dibuat untuk hiburan.</p>
          <p>Coba pahami kode-kode halus dan jadilah pacar idaman! 😉</p>
        </div>
      </main>

      {/* Difficulty Selection Modal */}
      {showDifficultyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-4">Pilih Level Kesulitan</h2>
            
            <div className="space-y-4 mb-6">
              {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => handleStartGame(level)}
                  className="w-full p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium">{DIFFICULTY_CONFIGS[level].name}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {DIFFICULTY_CONFIGS[level].description}
                  </p>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowDifficultyModal(false)}
              className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
