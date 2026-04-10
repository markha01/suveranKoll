import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { ReportView } from '@/components/report/ReportView';
import { query } from '@/lib/db';
import { cacheGet } from '@/lib/valkey';
import type { Assessment, SovereigntyReport } from '@/types';

interface Props {
  report: SovereigntyReport;
  assessment: Assessment;
  assessmentId: string;
}

export default function ReportPage({ report, assessment, assessmentId }: Props) {
  return (
    <>
      <Head>
        <title>
          Sovereignty Report – {assessment.org_name ?? 'Your organization'} | SuveranKoll
        </title>
      </Head>
      <div className="min-h-screen bg-zinc-950 text-white">
        <nav className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
          <Link
            href="/"
            className="text-emerald-500 font-bold text-lg hover:text-emerald-400 transition-colors"
          >
            SuveranKoll
          </Link>
          <Link href="/assessment">
            <span className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
              New assessment
            </span>
          </Link>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-10">
          <ReportView report={report} assessment={assessment} assessmentId={assessmentId} />
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const id = params?.id as string;

  try {
    // Try Valkey cache first
    const cacheKey = `report:${id}`;
    let report: SovereigntyReport | null = null;

    const cached = await cacheGet(cacheKey);
    if (cached) {
      report = JSON.parse(cached);
    } else {
      const result = await query<{ report_json: SovereigntyReport }>(
        `SELECT report_json FROM reports WHERE assessment_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [id]
      );
      if (result.rows.length > 0) {
        report = result.rows[0].report_json;
      }
    }

    if (!report) {
      return { notFound: true };
    }

    const assessmentResult = await query<Assessment>(
      `SELECT * FROM assessments WHERE id = $1`,
      [id]
    );
    if (assessmentResult.rows.length === 0) {
      return { notFound: true };
    }

    const assessment = assessmentResult.rows[0];
    return {
      props: {
        report,
        assessment,
        assessmentId: id,
      },
    };
  } catch (err) {
    console.error('getServerSideProps report error:', err);
    return { notFound: true };
  }
};
