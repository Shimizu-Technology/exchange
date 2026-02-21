import Link from "next/link";
import { HeartCrack, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <HeartCrack className="w-20 h-20 text-hot-pink/20 mx-auto mb-6" />
      <h1 className="font-display text-4xl font-bold mb-2">404</h1>
      <h2 className="font-display text-xl font-bold mb-3 text-hot-pink">
        This page ghosted you.
      </h2>
      <p className="text-warm-gray mb-8">
        We know the feeling. But hey, there&apos;s plenty more where that came from.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-hot-pink text-white rounded-xl font-display font-bold shadow-lg shadow-hot-pink/25 hover:bg-hot-pink-dark hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" /> Back to browsing
      </Link>
    </div>
  );
}
