import { getCollectionMetadata } from '@/lib/seo';

export const metadata = getCollectionMetadata('go', 'projects');
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
