import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { Difficulty } from '@/app/types';

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function GET(request: Request) {
  try {
    // Get the URL parameters
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty') as Difficulty || 'easy';
    const step = parseInt(searchParams.get('step') || '0');
    
    // Get the generative model (Gemini)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Construct the prompt based on difficulty and step
    let difficultyContext = '';
    
    if (difficulty === 'easy') {
      difficultyContext = 'Adegan harus sederhana dengan pilihan jawaban yang jelas. Buat 1 pertanyaan dan 3 pilihan jawaban.';
    } else if (difficulty === 'medium') {
      difficultyContext = `Untuk level medium, adegan akan terdiri dari 3 tahap interaksi. Saat ini adalah tahap ke-${step + 1} dari 3.
      
${step === 0 ? 'Ini adalah awal percakapan. Mulai dengan percakapan ringan.' : ''}
${step === 1 ? 'Ini adalah pertengahan percakapan. Lanjutkan dari percakapan sebelumnya dengan menambahkan kerumitan.' : ''}
${step === 2 ? 'Ini adalah akhir percakapan. Buat pertanyaan yang menentukan hasil akhir percakapan.' : ''}

Buat percakapan yang lebih rumit dengan kode halus yang tidak terlalu mudah dipahami.`;
    } else if (difficulty === 'hard') {
      difficultyContext = `Untuk level hard, adegan akan terdiri dari 5 tahap interaksi. Saat ini adalah tahap ke-${step + 1} dari 5.
      
${step === 0 ? 'Ini adalah awal percakapan. Mulai dengan percakapan ringan.' : ''}
${step === 1 ? 'Ini adalah tahap kedua percakapan. Lanjutkan dari percakapan awal.' : ''}
${step === 2 ? 'Ini adalah tahap ketiga percakapan. Tambahkan sedikit ketegangan atau drama.' : ''}
${step === 3 ? 'Ini adalah tahap keempat percakapan. Tingkatkan kompleksitas.' : ''}
${step === 4 ? 'Ini adalah akhir percakapan. Buat pertanyaan yang menentukan hasil akhir hubungan.' : ''}

Buat percakapan yang kompleks dengan kode halus yang sulit dipahami.`;
    }

    // Prompt template for generating scenes
    const prompt = `Kamu adalah AI Storyteller yang bertugas membuat adegan interaktif untuk aplikasi simulasi hubungan bernama "Kode Keras Cewek".

Tugasmu adalah menghasilkan skenario obrolan pendek antara seorang cewek dan cowok, dengan gaya bahasa khas Gen-Z Indonesia. Obrolan harus berisi satu "kode halus" dari cewek yang mengandung makna tersembunyi atau ekspektasi tidak langsung, dan 3 pilihan respons dari cowok. Tugas pemain adalah memilih jawaban terbaik untuk menjaga hubungan tetap lancar.

${difficultyContext}

Struktur output:
{
  "sceneTitle": "Judul Singkat dari Situasi",
  "situation": "Deskripsi singkat latar situasi (max 2 kalimat)",
  "dialogue": [
    { "character": "Cewek", "text": "..." },
    { "character": "Cowok", "text": "..." },
    ...
  ],
  "choices": [
    { "text": "Pilihan A", "label": "A", "isCorrect": false },
    { "text": "Pilihan B", "label": "B", "isCorrect": true },
    { "text": "Pilihan C", "label": "C", "isCorrect": false }
  ],
  "explanation": "Penjelasan kenapa jawaban yang benar itu benar"
}

Ketentuan:
- Dialog cewek harus menyiratkan maksud tersembunyi (kode keras)
- Dialog cowok opsional, boleh muncul untuk ngasih konteks
- Jawaban yang benar harus terasa "bener secara emosi dan sosial", meskipun logikanya aneh
- Penjelasan dibuat singkat, tapi lucu atau menyentil

Contoh situasi:
- Cewek tiba-tiba bilang "Serah kamu aja…"
- Cewek bilang "Kamu kayaknya lupa deh sesuatu hari ini…"

Gaya penulisan harus ringan, menghibur, dan sesuai dengan budaya digital anak muda Indonesia.

Hasilkan scene dalam format JSON yang valid, tanpa komentar atau teks tambahan.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the response as JSON
    try {
      // Find the JSON part of the response (in case there are additional text/comments)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      const jsonData = JSON.parse(jsonStr);
      
      return NextResponse.json(jsonData);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      return NextResponse.json(
        { error: "Failed to generate a valid scene. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating scene:", error);
    return NextResponse.json(
      { error: "Failed to generate scene. Please check your API configuration." },
      { status: 500 }
    );
  }
} 