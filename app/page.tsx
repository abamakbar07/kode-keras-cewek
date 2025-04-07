import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-purple-950">
      <main className="flex flex-col items-center max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-pink-600 dark:text-pink-400 mb-4">
          Kode Keras Cewek
        </h1>
        
        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
          Game simulasi untuk pahami kode halus cewek. Pilih jawaban yang tepat dan jadilah pemenang di hatinya! 💕
        </p>
        
        <div className="w-64 h-64 relative mb-8 rounded-full overflow-hidden border-4 border-pink-400 shadow-lg">
          <Image
            src="/placeholder-girl.png"
            alt="Karakter Cewek"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <Link 
          href="/game" 
          className="px-8 py-4 text-lg font-medium text-white bg-pink-500 rounded-full hover:bg-pink-600 transition-colors shadow-md"
        >
          Mulai Main
        </Link>
        
        <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>Game ini sepenuhnya fiksi dan dibuat untuk hiburan.</p>
          <p>Coba pahami kode-kode halus dan jadilah pacar idaman! 😉</p>
        </div>
      </main>
    </div>
  );
}
