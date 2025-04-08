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

    const result = await chatSession.sendMessage(`Kamu adalah penulis kreatif yang membuat adegan untuk game visual novel bernama "Kode Keras Cewek". 
    Game ini tentang seorang pemain yang berusaha memenangkan hati seorang wanita berkepribadian kuat melalui percakapan.
    ${difficultyContext}
    
    Format responsmu sebagai objek JSON dengan struktur berikut:
    {
      "background": "Deskripsi detail tentang setting adegan",
      "sceneTitle": "Judul untuk adegan",
      "dialog": [
        {
          "character": "Nama karakter",
          "text": "Apa yang mereka katakan"
        }
      ],
      "choices": [
        {
          "text": "Opsi respons pemain",
          "isCorrect": true/false
        }
      ],
      "explanation": "Kenapa pilihan ini benar/salah"
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

    const result = await chatSession.sendMessage(`Kamu adalah penulis kreatif yang membuat adegan untuk game visual novel bernama "Kode Keras Cewek". 
    Game ini tentang seorang pemain yang berusaha memenangkan hati seorang wanita berkepribadian kuat melalui percakapan.
    ${difficultyContext}
    
    Format responsmu sebagai objek JSON dengan struktur berikut:
    {
      "background": "Deskripsi detail tentang setting adegan",
      "sceneTitle": "Judul untuk adegan",
      "dialog": [
        {
          "character": "Nama karakter",
          "text": "Apa yang mereka katakan"
        }
      ],
      "choices": [
        {
          "text": "Opsi respons pemain",
          "isCorrect": true/false
        }
      ],
      "explanation": "Kenapa pilihan ini benar/salah"
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
      return `Buat adegan sederhana dengan satu pertanyaan dan tiga pilihan jawaban yang jelas.
      Adegan harus mudah dipahami dengan respons yang jelas benar dan salah.
      Pilihan yang benar harus jelas merupakan opsi terbaik untuk memenangkan hati wanita tersebut.`;
    
    case Difficulty.MEDIUM:
      return `Buat adegan yang merupakan bagian dari percakapan tiga langkah (saat ini pada langkah ${step}).
      ${step === 1 ? 'Mulai percakapan dengan topik atau situasi yang menarik.' :
        step === 2 ? 'Lanjutkan percakapan, bangun dari interaksi sebelumnya.' :
        'Akhiri percakapan dengan pilihan yang bermakna.'}
      Adegan harus memiliki pilihan yang lebih halus di mana respons yang benar tidak langsung terlihat jelas.
      Setiap pilihan harus memiliki implikasi halus untuk hubungan mereka.`;
    
    case Difficulty.HARD:
      return `Buat adegan yang merupakan bagian dari percakapan lima langkah (saat ini pada langkah ${step}).
      ${step === 1 ? 'Mulai dengan situasi atau topik yang menarik.' :
        step === 2 ? 'Kembangkan percakapan dengan implikasi yang lebih dalam.' :
        step === 3 ? 'Tambahkan kompleksitas pada situasi.' :
        step === 4 ? 'Bangun ketegangan dalam percakapan.' :
        'Akhiri dengan pilihan kritis yang menentukan hasil.'}
      Adegan harus memiliki pilihan kompleks dengan beberapa lapisan makna.
      Pilihan yang benar harus memerlukan pemahaman tentang isyarat sosial halus dan kecerdasan emosional.
      Setiap pilihan harus memiliki implikasi signifikan untuk hubungan.`;
    
    default:
      return '';
  }
} 