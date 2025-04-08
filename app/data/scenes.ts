import { GameScene } from '../types';

export const scenes: Record<string, GameScene> = {
  start: {
    id: 'start',
    background: 'You find yourself in a mysterious situation...',
    sceneTitle: 'The Beginning',
    dialog: [
      { character: 'Narrator', text: 'Welcome to the game!' },
      { character: 'Narrator', text: 'Your journey begins here...' }
    ],
    choices: [
      {
        text: 'Start the journey',
        isCorrect: true,
        nextSceneId: 'scene1'
      },
      {
        text: 'Wait and observe',
        isCorrect: false,
        nextSceneId: 'scene1'
      }
    ],
    explanation: 'The beginning of your journey. Choose wisely as your decisions will shape your path.',
    conversationHistory: [
      {
        type: 'dialog',
        character: 'Narrator',
        text: 'Welcome to the game!',
        timestamp: Date.now()
      },
      {
        type: 'dialog',
        character: 'Narrator',
        text: 'Your journey begins here...',
        timestamp: Date.now() + 1
      }
    ],
    stepHistory: [],
    outcome: null
  },
  scene1: {
    id: 'scene1',
    background: 'You encounter your first challenge...',
    sceneTitle: 'The First Challenge',
    dialog: [
      { character: 'Guide', text: 'This is your first test.' },
      { character: 'Guide', text: 'Choose wisely!' }
    ],
    choices: [
      {
        text: 'Take the safe path',
        isCorrect: true,
        nextSceneId: 'scene2'
      },
      {
        text: 'Take the risky path',
        isCorrect: false,
        nextSceneId: 'scene2'
      }
    ],
    explanation: 'Your first challenge tests your judgment. The safe path may be longer but more reliable.',
    conversationHistory: [
      {
        type: 'dialog',
        character: 'Guide',
        text: 'This is your first test.',
        timestamp: Date.now()
      },
      {
        type: 'dialog',
        character: 'Guide',
        text: 'Choose wisely!',
        timestamp: Date.now() + 1
      }
    ],
    stepHistory: [],
    outcome: null
  },
  scene2: {
    id: 'scene2',
    background: 'You reach a crucial decision point...',
    sceneTitle: 'The Crossroads',
    dialog: [
      { character: 'Guide', text: 'The path splits ahead.' },
      { character: 'Guide', text: 'Your choice will determine your fate.' }
    ],
    choices: [
      {
        text: 'Go left',
        isCorrect: true,
        nextSceneId: 'end'
      },
      {
        text: 'Go right',
        isCorrect: false,
        nextSceneId: 'end'
      }
    ],
    explanation: 'At the crossroads, your decision will lead you to different outcomes. Choose your path carefully.',
    conversationHistory: [
      {
        type: 'dialog',
        character: 'Guide',
        text: 'The path splits ahead.',
        timestamp: Date.now()
      },
      {
        type: 'dialog',
        character: 'Guide',
        text: 'Your choice will determine your fate.',
        timestamp: Date.now() + 1
      }
    ],
    stepHistory: [],
    outcome: null
  },
  end: {
    id: 'end',
    background: 'Your journey concludes...',
    sceneTitle: 'The End',
    dialog: [
      { character: 'Narrator', text: 'You have reached the end of your journey.' },
      { character: 'Narrator', text: 'Thank you for playing!' }
    ],
    choices: [
      {
        text: 'Play again',
        isCorrect: true,
        nextSceneId: 'start'
      }
    ],
    explanation: 'You have completed your journey. Your choices have led you to this moment.',
    conversationHistory: [
      {
        type: 'dialog',
        character: 'Narrator',
        text: 'You have reached the end of your journey.',
        timestamp: Date.now()
      },
      {
        type: 'dialog',
        character: 'Narrator',
        text: 'Thank you for playing!',
        timestamp: Date.now() + 1
      }
    ],
    stepHistory: [],
    outcome: null
  }
}; 