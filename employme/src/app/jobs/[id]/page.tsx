import AppShell from "@/components/layout/AppShell"

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const param = await params
  return (
    <AppShell>
      <h1 className="text-2xl font-bold">Job Detail</h1>
      <p className="text-muted-foreground">
        Job ID: {param.id}
      </p>
    </AppShell>
  )
}
