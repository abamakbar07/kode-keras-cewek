import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function GET() {
  try {
    // Get the generative model (Gemini)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Prompt template for generating scenes
    const prompt = `Kamu adalah AI Storyteller yang bertugas membuat adegan interaktif untuk aplikasi simulasi hubungan bernama "Kode Keras Cewek".

Tugasmu adalah menghasilkan skenario obrolan pendek antara seorang cewek dan cowok, dengan gaya bahasa khas Gen-Z Indonesia. Obrolan harus berisi satu "kode halus" dari cewek yang mengandung makna tersembunyi atau ekspektasi tidak langsung, dan 3 pilihan respons dari cowok. Tugas pemain adalah memilih jawaban terbaik untuk menjaga hubungan tetap lancar.

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