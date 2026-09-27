import ConceptDetail from '@/components/revision/ConceptDetail';
export const dynamic = 'force-dynamic';
export default async function Page({ params }: { params: Promise<{ conceptId: string }> }) { const { conceptId } = await params; return <ConceptDetail roadmapId="ml" conceptId={conceptId} />; }
