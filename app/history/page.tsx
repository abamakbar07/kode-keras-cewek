'use client';

import React from 'react';
import Link from 'next/link';
import { useGameStore } from '../store';

export default function HistoryPage() {
  const { history, score } = useGameStore();

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
          
          <Link
            href="/game"
            className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            Lanjut Main
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-4">
            History Scene
          </h1>
          
          <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow mb-6 inline-block">
            <span className="font-medium">Total Score: {score}</span>
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Belum ada scene yang dimainkan.</p>
              <Link 
                href="/game" 
                className="mt-4 inline-block px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Mulai Main
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((scene, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <h3 className="text-lg font-medium mb-2">{scene.sceneTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{scene.situation}</p>
                  
                  <div className="space-y-2 mb-3">
                    {scene.dialogue.map((dialog, dialogIndex) => (
                      <div key={dialogIndex} className="text-sm">
                        <span className="font-semibold">{dialog.character}: </span>
                        <span>{dialog.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Jawaban benar:</p>
                    <p className="text-sm">
                      {scene.choices.find(choice => choice.isCorrect)?.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 