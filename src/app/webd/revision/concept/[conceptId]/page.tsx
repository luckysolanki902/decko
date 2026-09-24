import ConceptDetail from '@/components/revision/ConceptDetail';

export const dynamic = 'force-dynamic';

export default async function WebDConceptPage({ params }: { params: Promise<{ conceptId: string }> }) {
  const { conceptId } = await params;
  return <ConceptDetail roadmapId="webd" conceptId={conceptId} />;
}
