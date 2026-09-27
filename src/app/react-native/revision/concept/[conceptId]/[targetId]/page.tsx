import RevisionRunner from '@/components/revision/RevisionRunner';
export const dynamic = 'force-dynamic';
export default async function Page({ params }: { params: Promise<{ conceptId: string; targetId: string }> }) { const { conceptId, targetId } = await params; return <RevisionRunner roadmapId="reactnative" conceptId={conceptId} targetId={targetId} />; }
