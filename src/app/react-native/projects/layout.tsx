import { getCollectionMetadata } from '@/lib/seo';

export const metadata = getCollectionMetadata('reactnative', 'projects');
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
