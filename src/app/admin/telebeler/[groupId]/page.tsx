import GroupDetailAdmin from "./GroupDetailAdmin";

export const dynamic = "force-dynamic";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  return <GroupDetailAdmin groupId={groupId} />;
}
