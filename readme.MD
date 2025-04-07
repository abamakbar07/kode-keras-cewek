# Kode Keras Cewek

Game simulasi visual novel berbasis Next.js yang mengajak pemain untuk memahami "kode keras" cewek. Game ini terintegrasi dengan Google Gemini API untuk menghasilkan adegan interaktif yang dinamis.

## 🎮 Fitur Utama

- 🏠 **Landing Page**: Tampilan awal dengan tombol "Mulai Main".
- 🎭 **Game Page**: Adegan interaktif berupa percakapan dengan 3 pilihan jawaban.
- 📝 **History**: Riwayat adegan yang telah dimainkan.
- 🤖 **AI Integration**: Terintegrasi dengan Google Gemini API untuk menghasilkan adegan yang berbeda-beda.

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), TailwindCSS, React
- **Backend**: Next.js API Routes
- **State Management**: Zustand
- **AI**: Google Generative AI (Gemini)

## 📋 Cara Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/kode-keras-cewek.git
   cd kode-keras-cewek
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Buat file `.env.local` dari file contoh:
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` dan tambahkan Google AI API key kamu:
   ```
   GOOGLE_AI_API_KEY=your-api-key-here
   ```
   Dapatkan API key dari [Google AI Studio](https://ai.google.dev/).

4. **Run development server**
   ```bash
   npm run dev
   ```
   Akses aplikasi di http://localhost:3000

## 🚀 Deployment

Aplikasi ini bisa di-deploy dengan mudah ke Vercel:

1. Push kode ke repository Git
2. Import project di Vercel
3. Tambahkan environment variable `GOOGLE_AI_API_KEY`
4. Deploy!

## 📚 Struktur Folder

- `/app`: Komponen Next.js App Router
  - `/api`: API routes (termasuk `/api/scene` untuk Gemini)
  - `/components`: React components
  - `/game`: Halaman game
  - `/history`: Halaman riwayat permainan
- `/public`: Asset statis

## 📝 License

MIT