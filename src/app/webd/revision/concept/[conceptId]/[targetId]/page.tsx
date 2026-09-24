import RevisionRunner from '@/components/revision/RevisionRunner';

export const dynamic = 'force-dynamic';

export default async function WebDRevisionRunnerPage({
  params,
}: {
  params: Promise<{ conceptId: string; targetId: string }>;
}) {
  const { conceptId, targetId } = await params;
  return <RevisionRunner roadmapId="webd" conceptId={conceptId} targetId={targetId} />;
}
