import Head from 'next/head';
import Link from 'next/link';
import { AssessmentForm } from '@/components/questionnaire/AssessmentForm';

export default function AssessmentPage() {
  return (
    <>
      <Head>
        <title>Självskattning – SuveranKoll</title>
      </Head>
      <div className="min-h-screen bg-zinc-950 text-white">
        <nav className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
          <Link href="/" className="text-emerald-500 font-bold text-lg hover:text-emerald-400 transition-colors">
            SuveranKoll
          </Link>
          <span className="text-zinc-600 text-xs">av IT-Bladet</span>
        </nav>
        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Digital suveränitetsanalys</h1>
            <p className="text-zinc-500 text-sm">
              13 frågor · ca 10 minuter · Rapporten genereras automatiskt när du är klar
            </p>
          </div>
          <AssessmentForm />
        </main>
      </div>
    </>
  );
}
