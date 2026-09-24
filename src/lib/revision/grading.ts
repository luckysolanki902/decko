import { RevisionQuizQuestion } from '@/types';

export function areAnswerSetsEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  const rightSet = new Set(right);
  return left.every(value => rightSet.has(value));
}

// Structural sanity check for a generated multiple-choice question.
export function isSupportedRevisionQuestion(question: RevisionQuizQuestion): boolean {
  if (!question || typeof question !== 'object') {
    return false;
  }

  if (question.type !== 'single_correct' && question.type !== 'multiple_correct') {
    return false;
  }

  if (!Array.isArray(question.options) || question.options.length < 2) {
    return false;
  }

  const optionIds = new Set(question.options.map(option => option.id));

  if (!Array.isArray(question.correctOptionIds) || question.correctOptionIds.length === 0) {
    return false;
  }

  if (question.type === 'multiple_correct' && question.correctOptionIds.length < 2) {
    return false;
  }

  if (question.type === 'single_correct' && question.correctOptionIds.length !== 1) {
    return false;
  }

  return question.correctOptionIds.every(id => optionIds.has(id));
}

function normalizeSelected(selectedOptionIds: string[] = []): string[] {
  return [...new Set(selectedOptionIds)].sort();
}

export interface GradedQuiz {
  perQuestion: { id: string; type: RevisionQuizQuestion['type']; correct: boolean }[];
  score: number;
  total: number;
}

// Grade one MCQ quiz stage. Correctness is an exact match of the selected option
// set to the correct option set (so a partly-right multi-select is wrong).
export function gradeQuiz(questions: RevisionQuizQuestion[], answers: Record<string, string[]>): GradedQuiz {
  let score = 0;
  const perQuestion: GradedQuiz['perQuestion'] = [];

  for (const question of questions) {
    const selected = normalizeSelected(answers[question.id]);
    const correctIds = [...question.correctOptionIds].sort();
    const correct = areAnswerSetsEqual(selected, correctIds);

    if (correct) {
      score += 1;
    }
    perQuestion.push({ id: question.id, type: question.type, correct });
  }

  return { perQuestion, score, total: questions.length };
}

export function toPercent(score: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.round((score / total) * 100);
}
