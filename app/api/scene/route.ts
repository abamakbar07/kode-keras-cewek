import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameScene, Difficulty } from '@/app/types';

const apiKey = process.env.GOOGLE_AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const difficulty = url.searchParams.get('difficulty') as Difficulty;
    const step = parseInt(url.searchParams.get('step') || '1', 10);

    // Validate difficulty
    if (!Object.values(Difficulty).includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    // Get difficulty-specific context
    const difficultyContext = getDifficultyContext(difficulty, step);

    const chatSession = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    }).startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(`You are a creative writer creating scenes for a visual novel game called "Kode Keras Cewek". 
    The game is about a player trying to win the heart of a strong-willed woman through conversations.
    ${difficultyContext}
    
    Format your response as a JSON object with the following structure:
    {
      "background": "A detailed description of the scene setting",
      "sceneTitle": "Title for the scene",
      "dialog": [
        {
          "character": "Character name",
          "text": "What they say"
        }
      ],
      "choices": [
        {
          "text": "Player's response option",
          "isCorrect": true/false
        }
      ],
      "explanation": "Why this choice is correct/incorrect"
    }`);
    const candidates = result.response.candidates || [];
    if (candidates.length === 0) {
      throw new Error('No response from Google Generative AI');
    }

    // Get the text content from the response
    const textContent = candidates[0].content.parts[0].text || '{}';
    
    // Clean up the response by removing markdown code blocks if present
    const cleanedContent = textContent
      .replace(/^```json\s*/, '') // Remove leading ```json
      .replace(/```\s*$/, '');    // Remove trailing ```
    
    // Try to parse the text as JSON
    let responseData: Partial<GameScene> = {};
    try {
      responseData = JSON.parse(cleanedContent);
    } catch (err) {
      console.error('Failed to parse response as JSON:', err);
      console.log('Raw response:', textContent);
    }
    
    // Parse the response and ensure it matches our GameScene type
    const scene: GameScene = {
      background: responseData.background || "A cozy cafe with soft music playing in the background.",
      sceneTitle: responseData.sceneTitle || "Scene",
      dialog: responseData.dialog || [],
      // Add labels (A, B, C) to choices
      choices: (responseData.choices || []).map((choice: any, index: number) => ({
        ...choice,
        label: String.fromCharCode(65 + index) // A, B, C, etc.
      })),
      explanation: responseData.explanation || "",
      conversationHistory: [],
      stepHistory: []
    };

    return NextResponse.json(scene);
  } catch (error) {
    console.error('Error generating scene:', error);
    return NextResponse.json(
      { error: 'Failed to generate scene' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { difficulty, step = 1 } = await request.json();

    // Validate difficulty
    if (!Object.values(Difficulty).includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    // Get difficulty-specific context
    const difficultyContext = getDifficultyContext(difficulty, step);

    const chatSession = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    }).startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(`You are a creative writer creating scenes for a visual novel game called "Kode Keras Cewek". 
    The game is about a player trying to win the heart of a strong-willed woman through conversations.
    ${difficultyContext}
    
    Format your response as a JSON object with the following structure:
    {
      "background": "A detailed description of the scene setting",
      "sceneTitle": "Title for the scene",
      "dialog": [
        {
          "character": "Character name",
          "text": "What they say"
        }
      ],
      "choices": [
        {
          "text": "Player's response option",
          "isCorrect": true/false
        }
      ],
      "explanation": "Why this choice is correct/incorrect"
    }`);
    const candidates = result.response.candidates || [];
    if (candidates.length === 0) {
      throw new Error('No response from Google Generative AI');
    }

    // Get the text content from the response
    const textContent = candidates[0].content.parts[0].text || '{}';
    
    // Clean up the response by removing markdown code blocks if present
    const cleanedContent = textContent
      .replace(/^```json\s*/, '') // Remove leading ```json
      .replace(/```\s*$/, '');    // Remove trailing ```
    
    // Try to parse the text as JSON
    let responseData: Partial<GameScene> = {};
    try {
      responseData = JSON.parse(cleanedContent);
    } catch (err) {
      console.error('Failed to parse response as JSON:', err);
      console.log('Raw response:', textContent);
    }
    
    // Parse the response and ensure it matches our GameScene type
    const scene: GameScene = {
      background: responseData.background || "A cozy cafe with soft music playing in the background.",
      sceneTitle: responseData.sceneTitle || "Scene",
      dialog: responseData.dialog || [],
      // Add labels (A, B, C) to choices
      choices: (responseData.choices || []).map((choice: any, index: number) => ({
        ...choice,
        label: String.fromCharCode(65 + index) // A, B, C, etc.
      })),
      explanation: responseData.explanation || "",
      conversationHistory: [],
      stepHistory: []
    };

    return NextResponse.json(scene);
  } catch (error) {
    console.error('Error generating scene:', error);
    return NextResponse.json(
      { error: 'Failed to generate scene' },
      { status: 500 }
    );
  }
}

function getDifficultyContext(difficulty: Difficulty, step: number): string {
  switch (difficulty) {
    case Difficulty.EASY:
      return `Create a simple scene with one question and three clear answer choices.
      The scene should be straightforward with obvious correct and incorrect responses.
      The correct choice should be clearly the best option for winning the woman's heart.`;
    
    case Difficulty.MEDIUM:
      return `Create a scene that is part of a three-step conversation (currently on step ${step}).
      ${step === 1 ? 'Start the conversation with an interesting topic or situation.' :
        step === 2 ? 'Continue the conversation, building on the previous interaction.' :
        'Conclude the conversation with a meaningful choice.'}
      The scene should have more nuanced choices where the correct response isn't immediately obvious.
      Each choice should have subtle implications for the relationship.`;
    
    case Difficulty.HARD:
      return `Create a scene that is part of a five-step conversation (currently on step ${step}).
      ${step === 1 ? 'Begin with an intriguing situation or topic.' :
        step === 2 ? 'Develop the conversation with deeper implications.' :
        step === 3 ? 'Add complexity to the situation.' :
        step === 4 ? 'Build tension in the conversation.' :
        'Conclude with a critical choice that determines the outcome.'}
      The scene should have complex choices with multiple layers of meaning.
      The correct choice should require understanding of subtle social cues and emotional intelligence.
      Each choice should have significant implications for the relationship.`;
    
    default:
      return '';
  }
} 