import { use } from 'react';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuizClient from '@/components/QuizClient';
import { QuizData } from '@/lib/quiz';

function loadQuiz(phaseId: string): QuizData | null {
  const filePath = path.join(process.cwd(), 'public', 'data', 'quizzes', 'webd', `${phaseId}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as QuizData;
}

export default function WebDRevisionPage({ params }: { params: Promise<{ phaseId: string }> }) {
  const { phaseId } = use(params);
  const quizData = loadQuiz(phaseId);

  if (!quizData) return notFound();

  const phaseNumber = parseInt(phaseId.replace('phase', ''), 10);

  return (
    <main className="min-h-screen py-10 md:py-14">
      <div className="container-page">
        <Breadcrumbs crumbs={[
          { label: 'Web Dev', href: '/webd' },
          { label: `Phase ${phaseNumber}`, href: `/webd/${phaseId}` },
          { label: 'Revision' },
        ]} />

        <QuizClient
          quizData={quizData}
          section="webd"
          phaseId={phaseId}
          phaseNumber={phaseNumber}
          backPath={`/webd/${phaseId}`}
          variant="blue"
        />
      </div>
    </main>
  );
}
