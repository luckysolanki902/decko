import ConceptDetail from '@/components/revision/ConceptDetail';

export const dynamic = 'force-dynamic';

export default async function DamlConceptPage({ params }: { params: Promise<{ conceptId: string }> }) {
  const { conceptId } = await params;
  return <ConceptDetail roadmapId="daml" conceptId={conceptId} />;
}
