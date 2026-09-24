import { Roadmap } from '@/types';
import { reactNativePhases } from './phases/reactnative';

export const reactNativeRoadmap: Roadmap = {
  id: 'reactnative',
  title: 'React Native — From React to Production Mobile',
  subtitle: 'React Native 0.86 · Expo SDK 57 · TypeScript · New Architecture · EAS',
  description: 'A 57-day modern React Native course built from current official guidance. Learn native UI, Expo Router, Redux, offline sync, device capabilities, notifications, widgets, Android/Gradle, iOS/Xcode, native modules, and production delivery before shipping an accessible live-arts festival companion.',
  phases: reactNativePhases,
  totalDays: 57,
  totalHours: 238,
};
