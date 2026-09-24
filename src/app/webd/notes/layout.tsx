import { getCollectionMetadata } from '@/lib/seo';

export const metadata = getCollectionMetadata('webd', 'notes');
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
