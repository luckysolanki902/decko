import { getCollectionMetadata } from '@/lib/seo';

export const metadata = getCollectionMetadata('ml', 'projects');
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
