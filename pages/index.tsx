import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <Head>
        <title>SuveranKoll – Hur exponerad är din organisation?</title>
      </Head>
      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Nav */}
        <nav className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold text-lg">SuveranKoll</span>
            <span className="text-zinc-600 text-sm">av IT-Bladet</span>
          </div>
          <Link href="/assessment">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
              Starta analys
            </Button>
          </Link>
        </nav>

        <main className="max-w-3xl mx-auto px-6 pt-20 pb-32">
          {/* Byline */}
          <p className="text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-6">
            Annika Dahl · IT-Bladet · Undersökande IT-journalistik
          </p>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-6">
            De flesta CIO:er vet inte hur
            <br />
            exponerade de är.
            <br />
            <span className="text-emerald-400">Det är dags att ta reda på det.</span>
          </h1>

          {/* Lead */}
          <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-2xl">
            Efter Schrems II, Cloud Act och det senaste årets geopolitiska turbulens befinner sig
            svenska organisationer i ett rättsligt vakuum. Många CIO:er tror att de är
            skyddade – men har aldrig faktiskt granskat exponeringen.
          </p>
          <p className="text-zinc-500 leading-relaxed mb-10">
            SuveranKoll är ett verktyg jag byggt för att ge er en ärlig bild på 10 minuter.
            13 frågor. En konkret poäng. En rapport ni kan ta med till styrelsen – utan att
            dölja obehagliga sanningar med konsultjargong.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/assessment">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 text-base font-semibold"
              >
                Starta självskattningen →
              </Button>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800 mt-16 pt-12">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-6">
              Vad mäter vi?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: 'Molninfrastruktur',
                  desc: 'Vilka leverantörer kör era kritiska system – och i vilket land?',
                  points: '30 poäng',
                },
                {
                  label: 'GDPR & dataresidency',
                  desc: 'Har ni faktiska avtalsenliga garantier om var er data lagras?',
                  points: '25 poäng',
                },
                {
                  label: 'Cloud Act / juridisk exponering',
                  desc: 'Har era jurister verkligen granskat FISA 702 och Cloud Act-exponeringen?',
                  points: '25 poäng',
                },
                {
                  label: 'AI & Skugg-IT',
                  desc: 'Vet ni vilka AI-verktyg era medarbetare faktiskt använder?',
                  points: '20 poäng',
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
              <strong className="text-zinc-400">Notera:</strong> SuveranKoll är ett
              självskattningsverktyg – inte en juridisk revision. Resultaten baseras på era svar
              och bör betraktas som en startpunkt för djupare analys, inte som ett juridiskt
              utlåtande. Rapporten genereras av AI och granskas inte av en människa.
            </p>
          </div>
        </main>

        <footer className="border-t border-zinc-900 py-6 px-6 text-center">
          <p className="text-xs text-zinc-600">
            SuveranKoll · IT-Bladet · Ett verktyg för undersökande IT-journalistik
          </p>
        </footer>
      </div>
    </>
  );
}
