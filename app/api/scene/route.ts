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

    const result = await chatSession.sendMessage(`Kamu adalah AI Storyteller yang bertugas membuat adegan interaktif untuk aplikasi simulasi hubungan bernama "Kode Keras Cewek".

Tugasmu adalah menghasilkan skenario obrolan pendek antara seorang cewek dan cowok, dengan gaya bahasa khas Gen-Z Indonesia. Obrolan harus berisi satu "kode halus" dari cewek yang mengandung makna tersembunyi atau ekspektasi tidak langsung, dan 3 pilihan respons dari cowok. Tugas pemain adalah memilih jawaban terbaik untuk menjaga hubungan tetap lancar.

${difficultyContext}

Struktur output:
{
  "background": "Deskripsi singkat latar situasi (max 2 kalimat)",
  "sceneTitle": "Judul Singkat dari Situasi",
  "dialog": [
    { "character": "Cewek", "text": "..." },
    { "character": "Cowok", "text": "..." },
    ...
  ],
  "choices": [
    { "text": "Pilihan A", "isCorrect": false },
    { "text": "Pilihan B", "isCorrect": true },
    { "text": "Pilihan C", "isCorrect": false }
  ],
  "explanation": "Penjelasan kenapa jawaban yang benar itu benar"
}

Ketentuan:
- Dialog cewek harus menyiratkan maksud tersembunyi (kode keras)
- Dialog cowok opsional, boleh muncul untuk ngasih konteks
- Jawaban yang benar harus terasa "bener secara emosi dan sosial", meskipun logikanya aneh
- Penjelasan dibuat singkat, tapi lucu atau menyentil

Gaya penulisan harus ringan, menghibur, dan sesuai dengan budaya digital anak muda Indonesia.

Hasilkan scene dalam format JSON yang valid, tanpa komentar atau teks tambahan.`);
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
    const { difficulty, step = 1, conversationHistory = [], stepHistory = [] } = await request.json();

    // Validate difficulty
    if (!Object.values(Difficulty).includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    // Get difficulty-specific context
    const difficultyContext = getDifficultyContext(difficulty, step);
    
    // Build conversation context from history
    let conversationContext = '';
    if ((difficulty === Difficulty.MEDIUM || difficulty === Difficulty.HARD) && step > 1 && stepHistory.length > 0) {
      conversationContext = `
      Berikut ini adalah riwayat percakapan sebelumnya:
      ${stepHistory.map((history: { choice: string; explanation: string }, index: number) => 
        `Langkah ${index + 1}:
        - Dialog: ${conversationHistory.length > index * 2 ? 
          conversationHistory.slice(index * 2, (index + 1) * 2).map((d: { character: string; text: string }) => `${d.character}: "${d.text}"`).join('\n          ') : 
          'Tidak ada dialog sebelumnya'}
        - Pemain memilih: "${history.choice}"
        - Hasilnya: ${history.explanation}`
      ).join('\n\n')}
      
      Kamu harus melanjutkan percakapan berdasarkan riwayat ini, sehingga percakapan terasa koheren dan memiliki kontinuitas yang baik.
      Sangat penting untuk mereferensikan hal-hal yang telah dibahas pada langkah-langkah sebelumnya.
      `;
    }

    const chatSession = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    }).startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(`Kamu adalah AI Storyteller yang bertugas membuat adegan interaktif untuk aplikasi simulasi hubungan bernama "Kode Keras Cewek".

Tugasmu adalah menghasilkan skenario obrolan pendek antara seorang cewek dan cowok, dengan gaya bahasa khas Gen-Z Indonesia. Obrolan harus berisi satu "kode halus" dari cewek yang mengandung makna tersembunyi atau ekspektasi tidak langsung, dan 3 pilihan respons dari cowok. Tugas pemain adalah memilih jawaban terbaik untuk menjaga hubungan tetap lancar.

${difficultyContext}
${conversationContext}

Struktur output:
{
  "background": "Deskripsi singkat latar situasi (max 2 kalimat)",
  "sceneTitle": "Judul Singkat dari Situasi",
  "dialog": [
    { "character": "Cewek", "text": "..." },
    { "character": "Cowok", "text": "..." },
    ...
  ],
  "choices": [
    { "text": "Pilihan A", "isCorrect": false },
    { "text": "Pilihan B", "isCorrect": true },
    { "text": "Pilihan C", "isCorrect": false }
  ],
  "explanation": "Penjelasan kenapa jawaban yang benar itu benar"
}

Ketentuan:
- Dialog cewek harus menyiratkan maksud tersembunyi (kode keras)
- Dialog cowok opsional, boleh muncul untuk ngasih konteks
- Jawaban yang benar harus terasa "bener secara emosi dan sosial", meskipun logikanya aneh
- Penjelasan dibuat singkat, tapi lucu atau menyentil

Gaya penulisan harus ringan, menghibur, dan sesuai dengan budaya digital anak muda Indonesia.

Hasilkan scene dalam format JSON yang valid, tanpa komentar atau teks tambahan.`);
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
      conversationHistory: conversationHistory,
      stepHistory: stepHistory
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
      return `Untuk level EASY, buat adegan sederhana dengan satu pertanyaan dan tiga pilihan jawaban yang jelas.
      Adegan harus mudah dipahami dengan respons yang jelas benar dan salah.
      Pilihan yang benar harus jelas merupakan opsi terbaik untuk memenangkan hati wanita tersebut.
      Gunakan gaya bahasa Gen-Z Indonesia yang ringan dan menghibur.`;
    
    case Difficulty.MEDIUM:
      return `Untuk level MEDIUM, buat adegan yang merupakan bagian dari percakapan tiga langkah (saat ini pada langkah ${step}).
      ${step === 1 ? 'Mulai percakapan dengan topik atau situasi yang menarik, dengan kode halus yang tidak terlalu sulit dipahami.' :
        step === 2 ? 'Lanjutkan percakapan, bangun dari interaksi sebelumnya. Kode halus harus lebih kompleks dari langkah pertama.' :
        'Akhiri percakapan dengan pilihan yang bermakna dan kode halus yang paling kompleks.'}
      Adegan harus memiliki pilihan yang lebih halus di mana respons yang benar tidak langsung terlihat jelas.
      Setiap pilihan harus memiliki implikasi halus untuk hubungan mereka.
      Gunakan gaya bahasa Gen-Z Indonesia yang ringan dan menghibur.`;
    
    case Difficulty.HARD:
      return `Untuk level HARD, buat adegan yang merupakan bagian dari percakapan lima langkah (saat ini pada langkah ${step}).
      ${step === 1 ? 'Mulai dengan situasi atau topik yang menarik, dengan kode halus yang tidak terlalu sulit dipahami.' :
        step === 2 ? 'Kembangkan percakapan dengan implikasi yang lebih dalam. Kode halus harus lebih kompleks dari langkah pertama.' :
        step === 3 ? 'Tambahkan kompleksitas pada situasi. Kode halus harus lebih kompleks dari langkah kedua.' :
        step === 4 ? 'Bangun ketegangan dalam percakapan. Kode halus harus lebih kompleks dari langkah ketiga.' :
        'Akhiri dengan pilihan kritis yang menentukan hasil. Kode halus harus paling kompleks dari semua langkah.'}
      Adegan harus memiliki pilihan kompleks dengan beberapa lapisan makna.
      Pilihan yang benar harus memerlukan pemahaman tentang isyarat sosial halus dan kecerdasan emosional.
      Setiap pilihan harus memiliki implikasi signifikan untuk hubungan.
      Gunakan gaya bahasa Gen-Z Indonesia yang ringan dan menghibur.`;
    
    default:
      return '';
  }
} 