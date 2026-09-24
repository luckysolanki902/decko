import { use } from 'react';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuizClient from '@/components/QuizClient';
import { parseDamlPhaseId } from '@/lib/damlPhaseId';
import { QuizData } from '@/lib/quiz';

function loadQuiz(phaseId: string): QuizData | null {
  const filePath = path.join(process.cwd(), 'public', 'data', 'quizzes', 'daml', `${phaseId}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as QuizData;
}

export default function DAMLRevisionPage({ params }: { params: Promise<{ phaseId: string }> }) {
  const { phaseId } = use(params);
  const quizData = loadQuiz(phaseId);

  if (!quizData) return notFound();

  const parsedPhase = parseDamlPhaseId(phaseId);
  if (!parsedPhase) return notFound();

  const { phaseLabel, phaseNumber } = parsedPhase;

  return (
    <main className="min-h-screen py-10 md:py-14">
      <div className="container-page">
        <Breadcrumbs crumbs={[
          { label: 'Python & Data Analytics', href: '/daml' },
          { label: `Phase ${phaseLabel}`, href: `/daml/${phaseId}` },
          { label: 'Revision' },
        ]} />

        <QuizClient
          quizData={quizData}
          section="daml"
          phaseId={phaseId}
          phaseNumber={phaseNumber}
          backPath={`/daml/${phaseId}`}
          variant="rose"
        />
      </div>
    </main>
  );
}
