/**
 * Homepage course cards.
 *
 * Lecture counts are the number of authored lecture files actually in
 * `public/data/lectures/<id>/`, not the number of days the roadmap plans for,
 * so the card never promises more than the repo contains. Re-run
 * `npm run stats` after authoring a batch and update these.
 */
export interface CourseCard {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  description: string;
  /** Lucide icon name, resolved on the homepage. */
  icon: 'Code2' | 'TerminalSquare' | 'Smartphone' | 'Brain' | 'Binary' | 'BarChart3';
  accent: { light: string; dark: string };
  phases: number;
  days: number;
  lectures: number;
  prerequisites: string;
  prerequisiteCourseId?: string;
  /** Shown when the written material is still well behind the roadmap. */
  status: 'in-depth' | 'early';
}

export const COURSES: CourseCard[] = [
  {
    id: 'webd',
    href: '/webd',
    title: 'Web Development',
    subtitle: 'HTML to production full-stack',
    description: 'Start with a useful page, then build through JavaScript, TypeScript, React, APIs, databases, identity, Next.js, payments, real-time systems, testing, delivery, AWS, and GCP.',
    icon: 'Code2',
    accent: { light: '#6889A6', dark: '#8AAAC4' },
    phases: 17,
    days: 162,
    lectures: 3,
    prerequisites: 'None. The course begins with the browser, files, and a first published page.',
    status: 'early',
  },
  {
    id: 'daml',
    href: '/daml',
    title: 'Python & Data Analytics',
    subtitle: 'Python to analysis and BI',
    description: 'Investigate real data from Day 1, then master Python, NumPy, Pandas, Excel, SQL, statistics, experiments, Tableau, metrics, and decision-ready analytical communication.',
    icon: 'BarChart3',
    accent: { light: '#B87D6C', dark: '#D4A090' },
    phases: 12,
    days: 144,
    lectures: 3,
    prerequisites: 'None. Python, statistics, and analyst thinking are taught from first principles through real investigations.',
    status: 'early',
  },
  {
    id: 'go',
    href: '/go',
    title: 'Go Engineering',
    subtitle: 'First program to production systems',
    description: 'Compile a useful program on Day 1, then deepen through values, collections, domain design, concurrency, testing, HTTP, PostgreSQL, security, containers, and production operation.',
    icon: 'TerminalSquare',
    accent: { light: '#0096B7', dark: '#5CCFE6' },
    phases: 11,
    days: 55,
    lectures: 3,
    prerequisites: 'Basic programming fluency is recommended. The Python foundations in Python & Data Analytics are a suitable bridge.',
    status: 'early',
  },
  {
    id: 'dsa',
    href: '/dsa',
    title: 'DSA with C++',
    subtitle: 'From scratch to competitive',
    description:
      'C++ from zero through the full data-structures and algorithms surface, including segment trees, advanced graphs and DP, number theory, and contest craft.',
    icon: 'Binary',
    accent: { light: '#6366F1', dark: '#8B8DF7' },
    phases: 25,
    days: 146,
    lectures: 3,
    prerequisites: 'None. C++ and problem-solving habits begin from zero.',
    status: 'early',
  },
  {
    id: 'ml',
    href: '/ml',
    title: 'ML, DL & GenAI',
    subtitle: 'Modern AI engineering',
    description:
      'The maths that matters, neural networks built from scratch, then NLP, transformers, LLMs, RAG, agents, diffusion and the operational side of shipping models.',
    icon: 'Brain',
    accent: { light: '#5D8E72', dark: '#7AAE8E' },
    phases: 10,
    days: 228,
    lectures: 3,
    prerequisites: 'Required: comfortable Python, NumPy, pandas, charts, descriptive statistics, and analytical reasoning. Complete Python & Data Analytics first if any of these are new.',
    prerequisiteCourseId: 'daml',
    status: 'early',
  },
  {
    id: 'reactnative',
    href: '/react-native',
    title: 'React Native',
    subtitle: 'React to shipped mobile apps',
    description: 'Build a real native screen, then deepen through adaptive layout, navigation, offline sync, device capabilities, accessibility, testing, native modules, and store delivery.',
    icon: 'Smartphone',
    accent: { light: '#22A7C8', dark: '#5CCFE6' },
    phases: 10,
    days: 57,
    lectures: 3,
    prerequisites: 'Required: JavaScript and React fundamentals. Complete Web Development through the React phase first if these are new.',
    prerequisiteCourseId: 'webd',
    status: 'early',
  },
];

/** Totals shown in the hero. Derived so they can never drift from the cards. */
export const COURSE_TOTALS = {
  courses: COURSES.length,
  lectures: COURSES.reduce((sum, course) => sum + course.lectures, 0),
  days: COURSES.reduce((sum, course) => sum + course.days, 0),
};
