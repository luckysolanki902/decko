import { getCollectionMetadata } from '@/lib/seo';

export const metadata = getCollectionMetadata('reactnative', 'notes');
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
