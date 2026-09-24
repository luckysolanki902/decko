import { getCollectionMetadata } from '@/lib/seo';

export const metadata = getCollectionMetadata('webd', 'projects');
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
