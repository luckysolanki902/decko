import type { Phase, Section } from '@/types';

export interface DaySpec {
  title: string;
  outcome: string;
  concepts: [string, string, string, string];
  build: string;
  evidence: string;
}

export interface PhaseSpec {
  title: string;
  subtitle: string;
  goal: string;
  days: DaySpec[];
  capstone: string;
}

export function buildCoursePhases(specs: PhaseSpec[], hoursPerDay = 4): Phase[] {
  let dayNumber = 1;

  return specs.map((phase, phaseIndex) => {
    const firstDay = dayNumber;
    const sections: Section[] = phase.days.map((day, dayIndex) => {
      const currentDay = dayNumber++;
      const isCapstone = dayIndex === phase.days.length - 1;

      return {
        id: `day${currentDay}`,
        title: `Day ${currentDay}: ${day.title}`,
        duration: `${hoursPerDay} hours`,
        topics: [
          {
            id: `day${currentDay}-problem`,
            title: `The problem: ${day.outcome}`,
            items: [
              `Start from a concrete failure or limitation that makes ${day.title.toLowerCase()} necessary`,
              'Predict an outcome before the mechanism or finished result is revealed',
              'Draw the smallest useful mental model and name each moving part',
              'Connect the new idea to one earlier skill without assuming future tools',
            ],
          },
          {
            id: `day${currentDay}-mechanics`,
            title: 'Mechanics from first principles',
            items: day.concepts,
          },
          {
            id: `day${currentDay}-judgment`,
            title: 'Judgment, failure modes, and transfer',
            items: [
              `Compare the obvious approach with the approach used in ${day.build}`,
              'Break one assumption deliberately and diagnose the visible evidence',
              'Choose between at least two plausible tools or representations',
              `Explain what would count as trustworthy evidence: ${day.evidence}`,
            ],
          },
          {
            id: `day${currentDay}-studio`,
            title: 'Studio: produce a visible win',
            items: [
              `Build: ${day.build}`,
              'Complete a guided version, then reconstruct the critical path without copying',
              'Change one requirement so the second attempt cannot be solved by memory alone',
              `Record evidence of completion: ${day.evidence}`,
            ],
            project: {
              title: day.build,
              description: `${day.outcome}. Include a short decision note, one deliberately tested failure, and evidence that the result works.`,
              type: isCapstone ? 'capstone' : 'mini',
              features: [
                'A usable result by the end of the session',
                'One constraint that forces a real decision',
                'An expected-versus-actual check',
                'A note separating guided work from independent reconstruction',
              ],
            },
          },
        ],
      };
    });

    const lastDay = dayNumber - 1;
    return {
      id: `phase${phaseIndex + 1}`,
      number: phaseIndex + 1,
      title: phase.title,
      subtitle: phase.subtitle,
      duration: `Days ${firstDay}-${lastDay} (~${phase.days.length * hoursPerDay} hours)`,
      days: `${firstDay}-${lastDay}`,
      goal: phase.goal,
      sections,
      checkpoint: {
        skills: phase.days.map(day => day.outcome),
        milestone: phase.capstone,
      },
    };
  });
}
