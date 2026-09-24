import { getCollectionMetadata } from '@/lib/seo';

export const metadata = getCollectionMetadata('daml', 'notes');
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
