import { getCollectionMetadata } from '@/lib/seo';

export const metadata = getCollectionMetadata('daml', 'projects');
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
