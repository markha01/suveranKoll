import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <Head>
        <title>SuveranKoll – How Exposed Is Your Organization?</title>
      </Head>
      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Nav */}
        <nav className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold text-lg">SuveranKoll</span>
            <span className="text-zinc-600 text-sm">by IT-Bladet</span>
          </div>
          <Link href="/assessment">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
              Start assessment
            </Button>
          </Link>
        </nav>

        <main className="max-w-3xl mx-auto px-6 pt-20 pb-32">
          {/* Byline */}
          <p className="text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-6">
            Annika Dahl · IT-Bladet · Investigative IT Journalism
          </p>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-6">
            Most CIOs don&apos;t know how
            <br />
            exposed they really are.
            <br />
            <span className="text-emerald-400">It&apos;s time to find out.</span>
          </h1>

          {/* Lead */}
          <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-2xl">
            After Schrems II, the Cloud Act, and the geopolitical turbulence of the past few years,
            organizations are operating in a legal grey zone. Many CIOs believe they are
            protected — but have never actually audited their exposure.
          </p>
          <p className="text-zinc-500 leading-relaxed mb-10">
            SuveranKoll is a tool I built to give you an honest picture in 10 minutes.
            13 questions. A concrete score. A report you can take to the board — without
            hiding uncomfortable truths behind consultant jargon.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/assessment">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 text-base font-semibold"
              >
                Start the self-assessment →
              </Button>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800 mt-16 pt-12">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-6">
              What do we measure?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: 'Cloud Infrastructure',
                  desc: 'Which providers run your critical systems — and in which country?',
                  points: '30 pts',
                },
                {
                  label: 'GDPR & Data Residency',
                  desc: 'Do you have actual contractual guarantees about where your data is stored?',
                  points: '25 pts',
                },
                {
                  label: 'Cloud Act / Legal Exposure',
                  desc: 'Has your legal team actually reviewed your FISA 702 and Cloud Act exposure?',
                  points: '25 pts',
                },
                {
                  label: 'AI & Shadow IT',
                  desc: 'Do you know which AI tools your employees are actually using?',
                  points: '20 pts',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-lg border border-zinc-800 bg-zinc-900"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <span className="text-xs text-emerald-500 font-mono shrink-0 ml-2">
                      {item.points}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <p className="text-xs text-zinc-500 leading-relaxed">
              <strong className="text-zinc-400">Note:</strong> SuveranKoll is a
              self-assessment tool — not a legal audit. Results are based on your answers
              and should be treated as a starting point for deeper analysis, not as legal advice.
            </p>
          </div>
        </main>

        <footer className="border-t border-zinc-900 py-6 px-6 text-center">
          <p className="text-xs text-zinc-600">
            SuveranKoll · IT-Bladet · An investigative IT journalism tool
          </p>
        </footer>
      </div>
    </>
  );
}
